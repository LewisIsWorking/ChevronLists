import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Swaps two adjacent lines in the document */
async function swapLines(editor: vscode.TextEditor, lineA: number, lineB: number): Promise<void> {
    const doc  = editor.document;
    const textA = doc.lineAt(lineA).text;
    const textB = doc.lineAt(lineB).text;
    await editor.edit(eb => {
        eb.replace(doc.lineAt(lineA).range, textB);
        eb.replace(doc.lineAt(lineB).range, textA);
    });
    const pos = new vscode.Position(lineB + (lineA < lineB ? 0 : 0), editor.selection.active.character);
    editor.selection = new vscode.Selection(pos, pos);
}

/** Command: moves the item at the cursor one position up within the section */
export async function onMoveItemUp(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    if (!parseBullet(text, prefix) && !parseNumbered(text)) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to move it'); return;
    }
    const headerLine = findHeaderAbove(doc, lineIndex);
    if (headerLine < 0 || lineIndex <= headerLine + 1) { return; }
    // Find previous item line (skip non-item lines)
    let prev = lineIndex - 1;
    while (prev > headerLine && !parseBullet(doc.lineAt(prev).text, prefix) && !parseNumbered(doc.lineAt(prev).text)) { prev--; }
    if (prev <= headerLine) { return; }
    await swapLines(editor, prev, lineIndex);
    const pos = new vscode.Position(prev, editor.selection.active.character);
    editor.selection = new vscode.Selection(pos, pos);
}

/** Command: moves the item at the cursor one position down within the section */
export async function onMoveItemDown(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    if (!parseBullet(text, prefix) && !parseNumbered(text)) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to move it'); return;
    }
    const headerLine = findHeaderAbove(doc, lineIndex);
    if (headerLine < 0) { return; }
    const [, end] = getSectionRange(doc, headerLine);
    if (lineIndex >= end) { return; }
    // Find next item line
    let next = lineIndex + 1;
    while (next <= end && !parseBullet(doc.lineAt(next).text, prefix) && !parseNumbered(doc.lineAt(next).text)) { next++; }
    if (next > end) { return; }
    await swapLines(editor, lineIndex, next);
    const pos = new vscode.Position(next, editor.selection.active.character);
    editor.selection = new vscode.Selection(pos, pos);
}
