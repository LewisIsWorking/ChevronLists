import * as vscode from 'vscode';
type EditBuilder = vscode.TextEditorEdit;

// Matches a >> - bullet line at any depth, capturing chevrons and content
const BULLET_ITEM_RE = /^(>{2,}) - (.*)$/;
// Matches a >> 1. numbered line at any depth, capturing chevrons, number and content
const NUMBERED_ITEM_RE = /^(>{2,}) (\d+)\. (.*)$/;
// Matches a > header line (single >, not >>)
const HEADER_RE = /^> [^>]/;

function isCursorAtLineEnd(editor: vscode.TextEditor): boolean {
    const cursor = editor.selection.active;
    return cursor.character === editor.document.lineAt(cursor.line).text.length;
}

/** Scan backwards from lineIndex to find the previous numbered item at the same
 *  chevron depth, so we can auto-increment correctly even after blank lines. */
function prevNumberAtDepth(
    document: vscode.TextDocument,
    lineIndex: number,
    chevrons: string
): number {
    for (let i = lineIndex - 1; i >= 0; i--) {
        const text  = document.lineAt(i).text;
        const match = text.match(NUMBERED_ITEM_RE);
        if (match && match[1] === chevrons) { return parseInt(match[2], 10); }
        // Stop searching if we hit a header or a blank line above a header
        if (HEADER_RE.test(text)) { break; }
    }
    return 0; // no previous item found — start at 1
}

export function activate(context: vscode.ExtensionContext): void {

    // ── Enter ────────────────────────────────────────────────────────────────
    const enterCmd = vscode.commands.registerCommand('chevron-lists.onEnter', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            await vscode.commands.executeCommand('default:type', { text: '\n' });
            return;
        }

        if (!isCursorAtLineEnd(editor)) {
            await vscode.commands.executeCommand('default:type', { text: '\n' });
            return;
        }

        const { document, selection } = editor;
        const cursor   = selection.active;
        const lineText = document.lineAt(cursor.line).text;

        // ── Numbered item: >> 1. ──────────────────────────────────────────
        const numberedMatch = lineText.match(NUMBERED_ITEM_RE);
        if (numberedMatch) {
            const chevrons = numberedMatch[1];
            const num      = parseInt(numberedMatch[2], 10);
            const content  = numberedMatch[3];

            if (content === '') {
                // Empty numbered item — stop the list
                await editor.edit((eb: EditBuilder) =>
                    eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor))
                );
            } else {
                const nextPrefix = `${chevrons} ${num + 1}. `;
                await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${nextPrefix}`));
                const newPos = new vscode.Position(cursor.line + 1, nextPrefix.length);
                editor.selection = new vscode.Selection(newPos, newPos);
                editor.revealRange(new vscode.Range(newPos, newPos));
            }
            return;
        }

        // ── Bullet item: >> - ─────────────────────────────────────────────
        const bulletMatch = lineText.match(BULLET_ITEM_RE);
        if (bulletMatch) {
            const chevrons = bulletMatch[1];
            const content  = bulletMatch[2];
            const prefix   = `${chevrons} - `;

            if (content === '') {
                await editor.edit((eb: EditBuilder) =>
                    eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor))
                );
            } else {
                await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${prefix}`));
                const newPos = new vscode.Position(cursor.line + 1, prefix.length);
                editor.selection = new vscode.Selection(newPos, newPos);
                editor.revealRange(new vscode.Range(newPos, newPos));
            }
            return;
        }

        // ── Header: > ────────────────────────────────────────────────────
        if (HEADER_RE.test(lineText)) {
            await vscode.commands.executeCommand('default:type', { text: '\n>> - ' });
            return;
        }

        await vscode.commands.executeCommand('default:type', { text: '\n' });
    });


    // ── Tab (indent / promote) ───────────────────────────────────────────────
    const tabCmd = vscode.commands.registerCommand('chevron-lists.onTab', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const { document, selection } = editor;
        const cursor   = selection.active;
        const lineText = document.lineAt(cursor.line).text;
        const lineRange = document.lineAt(cursor.line).range;

        const numberedMatch = lineText.match(NUMBERED_ITEM_RE);
        if (numberedMatch) {
            const newChevrons = `>${numberedMatch[1]}`;
            const prevNum     = prevNumberAtDepth(document, cursor.line, newChevrons);
            const newLine     = `${newChevrons} ${prevNum + 1}. ${numberedMatch[3]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const newPos = cursor.with(undefined, cursor.character + 1);
            editor.selection = new vscode.Selection(newPos, newPos);
            return;
        }

        const bulletMatch = lineText.match(BULLET_ITEM_RE);
        if (bulletMatch) {
            const newLine = `>${bulletMatch[1]} - ${bulletMatch[2]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const newPos = cursor.with(undefined, cursor.character + 1);
            editor.selection = new vscode.Selection(newPos, newPos);
            return;
        }

        await vscode.commands.executeCommand('tab');
    });

    // ── Shift+Tab (dedent / demote) ──────────────────────────────────────────
    const shiftTabCmd = vscode.commands.registerCommand('chevron-lists.onShiftTab', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const { document, selection } = editor;
        const cursor    = selection.active;
        const lineText  = document.lineAt(cursor.line).text;
        const lineRange = document.lineAt(cursor.line).range;

        const numberedMatch = lineText.match(NUMBERED_ITEM_RE);
        if (numberedMatch) {
            const chevrons = numberedMatch[1];
            if (chevrons.length <= 2) { return; }
            const newChevrons = chevrons.slice(1);
            const prevNum     = prevNumberAtDepth(document, cursor.line, newChevrons);
            const newLine     = `${newChevrons} ${prevNum + 1}. ${numberedMatch[3]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const newPos = cursor.with(undefined, Math.max(0, cursor.character - 1));
            editor.selection = new vscode.Selection(newPos, newPos);
            return;
        }

        const bulletMatch = lineText.match(BULLET_ITEM_RE);
        if (bulletMatch) {
            const chevrons = bulletMatch[1];
            if (chevrons.length <= 2) { return; }
            const newLine = `${chevrons.slice(1)} - ${bulletMatch[2]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const newPos = cursor.with(undefined, Math.max(0, cursor.character - 1));
            editor.selection = new vscode.Selection(newPos, newPos);
            return;
        }

        await vscode.commands.executeCommand('outdent');
    });

    context.subscriptions.push(enterCmd, tabCmd, shiftTabCmd);
}

export function deactivate(): void {}
