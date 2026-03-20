import * as vscode from 'vscode';
import { getConfig } from './config';

/** Command: pastes clipboard text as a new chevron section */
export async function onPasteAsSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const clipText   = await vscode.env.clipboard.readText();
    const lines      = clipText.split('\n').map(l => l.trim()).filter(Boolean);

    if (lines.length === 0) {
        vscode.window.showInformationMessage('CL: Clipboard is empty');
        return;
    }

    // First line → header, remaining → bullet items
    const header    = `> ${lines[0]}`;
    const items     = lines.slice(1).map(l => `>> ${prefix} ${l}`);
    const newSection = [header, ...items, ''].join('\n');

    const insertPos = new vscode.Position(editor.selection.active.line, 0);
    await editor.edit(eb => eb.insert(insertPos, newSection + '\n'));

    vscode.window.showInformationMessage(
        `CL: Pasted as section "${lines[0]}" with ${items.length} item${items.length === 1 ? '' : 's'}`
    );
}
