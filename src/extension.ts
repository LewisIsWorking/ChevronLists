import * as vscode from 'vscode';
type EditBuilder = vscode.TextEditorEdit;

const NUMBERED_ITEM_RE = /^(>{2,}) (\d+)\. (.*)$/;
const HEADER_RE        = /^> [^>]/;

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getConfig(): { prefix: string; blankLine: boolean } {
    const cfg = vscode.workspace.getConfiguration('chevron-lists');
    return {
        prefix:    cfg.get<string>('listPrefix', '-'),
        blankLine: cfg.get<boolean>('blankLineAfterHeader', false),
    };
}

function bulletRE(prefix: string): RegExp {
    return new RegExp(`^(>{2,}) ${escapeRegex(prefix)} (.*)$`);
}

function isCursorAtLineEnd(editor: vscode.TextEditor): boolean {
    const cursor = editor.selection.active;
    return cursor.character === editor.document.lineAt(cursor.line).text.length;
}

function prevNumberAtDepth(
    document: vscode.TextDocument,
    lineIndex: number,
    chevrons: string
): number {
    for (let i = lineIndex - 1; i >= 0; i--) {
        const text  = document.lineAt(i).text;
        const match = text.match(NUMBERED_ITEM_RE);
        if (match && match[1] === chevrons) { return parseInt(match[2], 10); }
        if (HEADER_RE.test(text)) { break; }
    }
    return 0;
}

// ── Folding range provider (v0.4.0) ─────────────────────────────────────────
class ChevronFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        let sectionStart = -1;

        for (let i = 0; i < document.lineCount; i++) {
            if (HEADER_RE.test(document.lineAt(i).text)) {
                if (sectionStart >= 0 && i - 1 > sectionStart) {
                    ranges.push(new vscode.FoldingRange(sectionStart, i - 1));
                }
                sectionStart = i;
            }
        }
        if (sectionStart >= 0 && document.lineCount - 1 > sectionStart) {
            ranges.push(new vscode.FoldingRange(sectionStart, document.lineCount - 1));
        }
        return ranges;
    }
}

// ── Minimap / overview ruler decorations (v0.6.0) ────────────────────────────
const headerDecorationType = vscode.window.createTextEditorDecorationType({
    overviewRulerColor: new vscode.ThemeColor('editorOverviewRuler.infoForeground'),
    overviewRulerLane: vscode.OverviewRulerLane.Left,
    isWholeLine: false,
});

function updateDecorations(editor: vscode.TextEditor): void {
    if (editor.document.languageId !== 'markdown') {
        editor.setDecorations(headerDecorationType, []);
        return;
    }
    const decorations: vscode.DecorationOptions[] = [];
    for (let i = 0; i < editor.document.lineCount; i++) {
        if (HEADER_RE.test(editor.document.lineAt(i).text)) {
            decorations.push({ range: editor.document.lineAt(i).range });
        }
    }
    editor.setDecorations(headerDecorationType, decorations);
}

export function activate(context: vscode.ExtensionContext): void {

    // ── Enter ────────────────────────────────────────────────────────────────
    const enterCmd = vscode.commands.registerCommand('chevron-lists.onEnter', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { await vscode.commands.executeCommand('default:type', { text: '\n' }); return; }
        if (!isCursorAtLineEnd(editor)) { await vscode.commands.executeCommand('default:type', { text: '\n' }); return; }

        const { document, selection } = editor;
        const cursor   = selection.active;
        const lineText = document.lineAt(cursor.line).text;
        const { prefix, blankLine } = getConfig();
        const bRE = bulletRE(prefix);

        // Numbered item
        const numberedMatch = lineText.match(NUMBERED_ITEM_RE);
        if (numberedMatch) {
            const chevrons = numberedMatch[1];
            const num      = parseInt(numberedMatch[2], 10);
            const content  = numberedMatch[3];
            if (content === '') {
                await editor.edit((eb: EditBuilder) =>
                    eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor)));
            } else {
                const nextPrefix = `${chevrons} ${num + 1}. `;
                await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${nextPrefix}`));
                const newPos = new vscode.Position(cursor.line + 1, nextPrefix.length);
                editor.selection = new vscode.Selection(newPos, newPos);
                editor.revealRange(new vscode.Range(newPos, newPos));
            }
            return;
        }

        // Bullet item
        const bulletMatch = lineText.match(bRE);
        if (bulletMatch) {
            const chevrons = bulletMatch[1];
            const content  = bulletMatch[2];
            const pfx      = `${chevrons} ${prefix} `;
            if (content === '') {
                await editor.edit((eb: EditBuilder) =>
                    eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor)));
            } else {
                await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${pfx}`));
                const newPos = new vscode.Position(cursor.line + 1, pfx.length);
                editor.selection = new vscode.Selection(newPos, newPos);
                editor.revealRange(new vscode.Range(newPos, newPos));
            }
            return;
        }

        // Header — use default:type to bypass VS Code's blockquote formatter
        if (HEADER_RE.test(lineText)) {
            const newItem = blankLine ? `\n\n>> ${prefix} ` : `\n>> ${prefix} `;
            await vscode.commands.executeCommand('default:type', { text: newItem });
            return;
        }

        await vscode.commands.executeCommand('default:type', { text: '\n' });
    });

    // ── Tab ──────────────────────────────────────────────────────────────────
    const tabCmd = vscode.commands.registerCommand('chevron-lists.onTab', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const { document, selection } = editor;
        const cursor    = selection.active;
        const lineText  = document.lineAt(cursor.line).text;
        const lineRange = document.lineAt(cursor.line).range;
        const { prefix } = getConfig();
        const bRE = bulletRE(prefix);

        const numberedMatch = lineText.match(NUMBERED_ITEM_RE);
        if (numberedMatch) {
            const newChevrons = `>${numberedMatch[1]}`;
            const prevNum     = prevNumberAtDepth(document, cursor.line, newChevrons);
            const newLine     = `${newChevrons} ${prevNum + 1}. ${numberedMatch[3]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const c = cursor.with(undefined, cursor.character + 1);
            editor.selection = new vscode.Selection(c, c);
            return;
        }
        const bulletMatch = lineText.match(bRE);
        if (bulletMatch) {
            const newLine = `>${bulletMatch[1]} ${prefix} ${bulletMatch[2]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const c = cursor.with(undefined, cursor.character + 1);
            editor.selection = new vscode.Selection(c, c);
            return;
        }
        await vscode.commands.executeCommand('tab');
    });

    // ── Shift+Tab ────────────────────────────────────────────────────────────
    const shiftTabCmd = vscode.commands.registerCommand('chevron-lists.onShiftTab', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const { document, selection } = editor;
        const cursor    = selection.active;
        const lineText  = document.lineAt(cursor.line).text;
        const lineRange = document.lineAt(cursor.line).range;
        const { prefix } = getConfig();
        const bRE = bulletRE(prefix);

        const numberedMatch = lineText.match(NUMBERED_ITEM_RE);
        if (numberedMatch) {
            const chevrons = numberedMatch[1];
            if (chevrons.length <= 2) { return; }
            const newChevrons = chevrons.slice(1);
            const prevNum     = prevNumberAtDepth(document, cursor.line, newChevrons);
            const newLine     = `${newChevrons} ${prevNum + 1}. ${numberedMatch[3]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const c = cursor.with(undefined, Math.max(0, cursor.character - 1));
            editor.selection = new vscode.Selection(c, c);
            return;
        }
        const bulletMatch = lineText.match(bRE);
        if (bulletMatch) {
            const chevrons = bulletMatch[1];
            if (chevrons.length <= 2) { return; }
            const newLine = `${chevrons.slice(1)} ${prefix} ${bulletMatch[2]}`;
            await editor.edit((eb: EditBuilder) => eb.replace(lineRange, newLine));
            const c = cursor.with(undefined, Math.max(0, cursor.character - 1));
            editor.selection = new vscode.Selection(c, c);
            return;
        }
        await vscode.commands.executeCommand('outdent');
    });

    // ── Select all section items (v0.4.0) ────────────────────────────────────
    const selectCmd = vscode.commands.registerCommand('chevron-lists.selectSectionItems', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const { document } = editor;
        const cursor = editor.selection.active;
        const { prefix } = getConfig();
        const bRE = bulletRE(prefix);

        // Find nearest header at or above cursor
        let headerLine = -1;
        for (let i = cursor.line; i >= 0; i--) {
            if (HEADER_RE.test(document.lineAt(i).text)) { headerLine = i; break; }
        }
        if (headerLine < 0) { return; }

        // Collect all chevron item lines until next header
        const selections: vscode.Selection[] = [];
        for (let i = headerLine + 1; i < document.lineCount; i++) {
            const text = document.lineAt(i).text;
            if (HEADER_RE.test(text)) { break; }
            if (bRE.test(text) || NUMBERED_ITEM_RE.test(text)) {
                const line = document.lineAt(i);
                selections.push(new vscode.Selection(line.range.start, line.range.end));
            }
        }
        if (selections.length > 0) { editor.selections = selections; }
    });

    // ── Wire up minimap decorations + folding provider ────────────────────────
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    context.subscriptions.push(
        enterCmd, tabCmd, shiftTabCmd, selectCmd,
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) { updateDecorations(editor); }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        }),
        vscode.languages.registerFoldingRangeProvider(
            { language: 'markdown' },
            new ChevronFoldingProvider()
        )
    );
}

export function deactivate(): void {}
