import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { toggleFlag, collectFlaggedItems } from './flagParser';

interface FlagPickItem extends vscode.QuickPickItem { lineIndex: number; }

/** Command: toggles ? flag on the item at the cursor */
export async function onToggleFlag(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to flag it');
        return;
    }
    const chevrons   = bullet?.chevrons ?? numbered!.chevrons;
    const content    = bullet?.content  ?? numbered!.content;
    const num        = numbered?.num ?? null;
    const newContent = toggleFlag(content);
    const newLine    = num !== null
        ? `${chevrons} ${num}. ${newContent}`
        : `${chevrons} ${prefix} ${newContent}`;
    await editor.edit(eb => eb.replace(doc.lineAt(lineIndex).range, newLine));
}

/** Command: shows all flagged items in the file */
export async function onFilterFlaggedItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const items      = collectFlaggedItems(editor.document, prefix);
    if (items.length === 0) {
        vscode.window.showInformationMessage('CL: No flagged items found (use CL: Toggle Flag or prefix content with ? )');
        return;
    }
    const pick = vscode.window.createQuickPick<FlagPickItem>();
    pick.items = items.map(i => ({ label: `$(question) ${i.content}`, description: i.section, lineIndex: i.line }));
    pick.placeholder = `${items.length} flagged item${items.length === 1 ? '' : 's'}`;
    const originalPos = editor.selection.active;
    pick.onDidChangeActive(active => {
        if (!active[0]) { return; }
        const pos = new vscode.Position(active[0].lineIndex, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    });
    pick.onDidAccept(() => { pick.hide(); });
    pick.onDidHide(() => {
        if (!pick.activeItems[0]) {
            const pos = new vscode.Position(originalPos.line, originalPos.character);
            editor.selection = new vscode.Selection(pos, pos);
        }
        pick.dispose();
    });
    pick.show();
}
