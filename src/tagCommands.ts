import * as vscode from 'vscode';
import { getConfig } from './config';
import { collectTags, uniqueTags } from './tagParser';

interface TagPickItem extends vscode.QuickPickItem {
    tag: string;
}

interface ItemPickItem extends vscode.QuickPickItem {
    lineIndex: number;
}

function revealLine(editor: vscode.TextEditor, lineIndex: number): void {
    const pos = new vscode.Position(lineIndex, 0);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

/** Command: shows all tags in the file, then filters items by the selected tag */
export async function onFilterByTag(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const tags = uniqueTags(editor.document, prefix);

    if (tags.length === 0) {
        vscode.window.showInformationMessage('CL: No #tags found in this file');
        return;
    }

    const tagItems: TagPickItem[] = tags.map(tag => ({
        label:       `$(tag) #${tag}`,
        description: `${collectTags(editor.document, prefix).filter(o => o.tag === tag).length} items`,
        tag,
    }));

    const tagPick = await vscode.window.showQuickPick(tagItems, {
        placeHolder: 'Select a tag to filter items...',
    });
    if (!tagPick) { return; }

    const matches = collectTags(editor.document, prefix).filter(o => o.tag === tagPick.tag);
    const itemPick = vscode.window.createQuickPick<ItemPickItem>();
    itemPick.items = matches.map(m => ({
        label:       m.itemText,
        description: m.section,
        lineIndex:   m.line,
    }));
    itemPick.placeholder = `Items tagged #${tagPick.tag}`;

    const originalPos = editor.selection.active;
    itemPick.onDidChangeActive(active => {
        if (active[0]) { revealLine(editor, active[0].lineIndex); }
    });
    itemPick.onDidAccept(() => {
        if (itemPick.activeItems[0]) { revealLine(editor, itemPick.activeItems[0].lineIndex); }
        itemPick.hide();
    });
    itemPick.onDidHide(() => {
        if (!itemPick.activeItems[0]) {
            const pos = new vscode.Position(originalPos.line, originalPos.character);
            editor.selection = new vscode.Selection(pos, pos);
        }
        itemPick.dispose();
    });
    itemPick.show();
}
