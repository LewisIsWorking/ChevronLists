import * as vscode from 'vscode';
type EditBuilder = vscode.TextEditorEdit;

// Matches a >> - line at any depth (>>, >>>, >>>>...), capturing the chevrons and content
const NESTED_ITEM_RE = /^(>{2,}) - (.*)$/;
// Matches a > header line (single >, not >>)
const HEADER_RE = /^> [^>]/;

function isCursorAtLineEnd(editor: vscode.TextEditor): boolean {
    const cursor = editor.selection.active;
    return cursor.character === editor.document.lineAt(cursor.line).text.length;
}

export function activate(context: vscode.ExtensionContext): void {

    // ── Enter ────────────────────────────────────────────────────────────────
    const enterCmd = vscode.commands.registerCommand('chevron-lists.onEnter', async () => {
        const editor = vscode.window.activeTextEditor;

        if (!editor) {
            await vscode.commands.executeCommand('default:type', { text: '\n' });
            return;
        }

        // If cursor is mid-line, use default Enter
        if (!isCursorAtLineEnd(editor)) {
            await vscode.commands.executeCommand('default:type', { text: '\n' });
            return;
        }

        const { document, selection } = editor;
        const cursor = selection.active;
        const lineText = document.lineAt(cursor.line).text;

        const nestedMatch = lineText.match(NESTED_ITEM_RE);
        if (nestedMatch) {
            const chevrons = nestedMatch[1]; // e.g. ">>" or ">>>"
            const content  = nestedMatch[2];
            const prefix   = `${chevrons} - `;

            if (content === '') {
                // Empty item: remove the prefix, stop the list
                await editor.edit((eb: EditBuilder) =>
                    eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor))
                );
            } else {
                // Continue the list at the same depth
                await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${prefix}`));
                const newPos = new vscode.Position(cursor.line + 1, prefix.length);
                editor.selection = new vscode.Selection(newPos, newPos);
                editor.revealRange(new vscode.Range(newPos, newPos));
            }
            return;
        }

        if (HEADER_RE.test(lineText)) {
            // > Header line: start a nested list on the next line
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
        const cursor    = selection.active;
        const lineText  = document.lineAt(cursor.line).text;
        const match     = lineText.match(NESTED_ITEM_RE);

        if (!match) {
            // Not a chevron list line — default Tab
            await vscode.commands.executeCommand('tab');
            return;
        }

        const chevrons  = match[1];       // e.g. ">>"
        const content   = match[2];
        const newLine   = `>${chevrons} - ${content}`;
        const lineRange = document.lineAt(cursor.line).range;

        await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));

        // Move cursor to end of line (content stays the same, one extra > added)
        const newCol = cursor.character + 1;
        const newPos = cursor.with(undefined, newCol);
        editor.selection = new vscode.Selection(newPos, newPos);
    });

    // ── Shift+Tab (dedent / demote) ──────────────────────────────────────────
    const shiftTabCmd = vscode.commands.registerCommand('chevron-lists.onShiftTab', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const { document, selection } = editor;
        const cursor    = selection.active;
        const lineText  = document.lineAt(cursor.line).text;
        const match     = lineText.match(NESTED_ITEM_RE);

        if (!match) {
            // Not a chevron list line — default Shift+Tab
            await vscode.commands.executeCommand('outdent');
            return;
        }

        const chevrons = match[1];  // e.g. ">>>"
        if (chevrons.length <= 2) {
            // Already at minimum depth (>> -), do nothing
            return;
        }

        const content   = match[2];
        const newLine   = `${chevrons.slice(1)} - ${content}`;
        const lineRange = document.lineAt(cursor.line).range;

        await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));

        const newCol = Math.max(0, cursor.character - 1);
        const newPos = cursor.with(undefined, newCol);
        editor.selection = new vscode.Selection(newPos, newPos);
    });

    context.subscriptions.push(enterCmd, tabCmd, shiftTabCmd);
}

export function deactivate(): void {}
