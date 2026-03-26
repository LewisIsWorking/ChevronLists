import * as vscode from 'vscode';
import { getConfig } from './config';
import { smartPasteLines } from './patterns';
import { prevNumberAtDepth } from './documentUtils';

/** Command: pastes clipboard content as chevron items, detecting list format */
export async function onSmartPaste(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const clipText    = await vscode.env.clipboard.readText();
    if (!clipText.trim()) {
        vscode.window.showInformationMessage('CL: Clipboard is empty');
        return;
    }

    const cursor     = editor.selection.active;
    const lineIndex  = cursor.line;
    const doc        = editor.document;
    const chevrons   = '>>'; // default depth
    const startNum   = prevNumberAtDepth(doc, lineIndex, chevrons) + 1;
    const lines      = smartPasteLines(clipText, prefix, chevrons, startNum);
    const insertPos  = new vscode.Position(lineIndex + 1, 0);

    await editor.edit(eb => eb.insert(insertPos, lines.join('\n') + '\n'));
    vscode.window.showInformationMessage(`CL: Pasted ${lines.length} item${lines.length === 1 ? '' : 's'}`);
}
