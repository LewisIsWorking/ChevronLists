import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: moves the item at the cursor to the first position in the section */
export async function onMoveItemToTop(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    if (!parseBullet(text, prefix) && !parseNumbered(text)) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item'); return;
    }
    const headerLine = findHeaderAbove(doc, lineIndex);
    if (headerLine < 0 || lineIndex === headerLine + 1) { return; }
    const itemText = text;
    await editor.edit(eb => {
        eb.delete(doc.lineAt(lineIndex).rangeIncludingLineBreak);
        eb.insert(new vscode.Position(headerLine + 1, 0), itemText + '\n');
    });
    const pos = new vscode.Position(headerLine + 1, editor.selection.active.character);
    editor.selection = new vscode.Selection(pos, pos);
}

/** Command: moves the item at the cursor to the last position in the section */
export async function onMoveItemToBottom(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    if (!parseBullet(text, prefix) && !parseNumbered(text)) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item'); return;
    }
    const headerLine = findHeaderAbove(doc, lineIndex);
    if (headerLine < 0) { return; }
    const [, end] = getSectionRange(doc, headerLine);
    if (lineIndex === end) { return; }
    const itemText = text;
    await editor.edit(eb => {
        eb.delete(doc.lineAt(lineIndex).rangeIncludingLineBreak);
        eb.insert(new vscode.Position(end + 1, 0), itemText + '\n');
    });
    const pos = new vscode.Position(end, editor.selection.active.character);
    editor.selection = new vscode.Selection(pos, pos);
}
