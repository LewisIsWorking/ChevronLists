import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { toggleStar, collectStarredItems } from './starParser';

interface StarPickItem extends vscode.QuickPickItem { lineIndex: number; }

/** Command: toggles the star marker on the item at the cursor */
export async function onToggleStar(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);

    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to star it');
        return;
    }

    const chevrons = bullet?.chevrons ?? numbered!.chevrons;
    const content  = bullet?.content  ?? numbered!.content;
    const num      = numbered?.num ?? null;
    const newContent = toggleStar(content);
    const newLine    = num !== null
        ? `${chevrons} ${num}. ${newContent}`
        : `${chevrons} ${prefix} ${newContent}`;

    await editor.edit(eb => eb.replace(doc.lineAt(lineIndex).range, newLine));
}

/** Command: quick pick of all starred items in the file */
export async function onFilterStarredItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const items      = collectStarredItems(editor.document, prefix);

    if (items.length === 0) {
        vscode.window.showInformationMessage('CL: No starred items found (use CL: Toggle Star or prefix content with * )');
        return;
    }

    const pick = vscode.window.createQuickPick<StarPickItem>();
    pick.items = items.map(i => ({ label: `$(star) ${i.content}`, description: i.section, lineIndex: i.line }));
    pick.placeholder = `${items.length} starred item${items.length === 1 ? '' : 's'}`;

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
