import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';

/** Command: duplicates the item at the cursor directly below itself */
export async function onDuplicateItem(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);

    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to duplicate it');
        return;
    }

    await editor.edit(eb =>
        eb.insert(new vscode.Position(lineIndex + 1, 0), text + '\n')
    );

    // Move cursor to the duplicate
    const pos = new vscode.Position(lineIndex + 1, editor.selection.active.character);
    editor.selection = new vscode.Selection(pos, pos);
}
