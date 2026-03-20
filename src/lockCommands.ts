import * as vscode from 'vscode';
import { findHeaderAbove } from './documentUtils';

const LOCK_MARKER = '>> [locked]';

/** Returns true if the section at headerLine is locked */
export function isSectionLocked(document: vscode.TextDocument, headerLine: number): boolean {
    if (headerLine + 1 >= document.lineCount) { return false; }
    return document.lineAt(headerLine + 1).text === LOCK_MARKER;
}

/** Command: locks the current section */
export async function onLockSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    if (isSectionLocked(doc, headerLine)) {
        vscode.window.showInformationMessage('CL: Section is already locked');
        return;
    }
    await editor.edit(eb =>
        eb.insert(new vscode.Position(headerLine + 1, 0), `${LOCK_MARKER}\n`)
    );
    vscode.window.showInformationMessage('CL: Section locked — bulk operations will skip this section');
}

/** Command: unlocks the current section */
export async function onUnlockSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    if (!isSectionLocked(doc, headerLine)) {
        vscode.window.showInformationMessage('CL: Section is not locked');
        return;
    }
    await editor.edit(eb =>
        eb.delete(doc.lineAt(headerLine + 1).rangeIncludingLineBreak)
    );
    vscode.window.showInformationMessage('CL: Section unlocked');
}
