import * as vscode from 'vscode';
import { findHeaderAbove } from './documentUtils';
import { getSectionRange } from './documentUtils';

/** Command: folds all sections except the one under the cursor */
export async function onFocusSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    // Fold all — then unfold the current section
    await vscode.commands.executeCommand('editor.foldAll');
    const pos = new vscode.Position(headerLine, 0);
    editor.selection = new vscode.Selection(pos, pos);
    await vscode.commands.executeCommand('editor.unfold');

    // Move cursor back to original content area
    const [, end] = getSectionRange(doc, headerLine);
    const targetLine = Math.min(headerLine + 1, end);
    const targetPos  = new vscode.Position(targetLine, 0);
    editor.selection = new vscode.Selection(targetPos, targetPos);
    editor.revealRange(new vscode.Range(new vscode.Position(headerLine, 0), targetPos), vscode.TextEditorRevealType.InCenter);
}

/** Command: restores all folded sections */
export async function onUnfocusSection(): Promise<void> {
    await vscode.commands.executeCommand('editor.unfoldAll');
}
