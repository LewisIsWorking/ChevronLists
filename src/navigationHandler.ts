import * as vscode from 'vscode';
import { findHeaderAbove, findHeaderBelow } from './documentUtils';
import { pushJumpHistory } from './jumpHistory';

function revealLine(editor: vscode.TextEditor, line: number): void {
    const pos = new vscode.Position(line, 0);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(
        new vscode.Range(pos, pos),
        vscode.TextEditorRevealType.InCenterIfOutsideViewport
    );
}

/** Moves the cursor to the next chevron header below the current line */
export function onNextHeader(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const next = findHeaderBelow(editor.document, editor.selection.active.line);
    if (next >= 0) {
        pushJumpHistory(editor);
        revealLine(editor, next);
    } else {
        vscode.window.showInformationMessage('Chevron Lists: no next header found');
    }
}

/** Moves the cursor to the nearest chevron header above the current line */
export function onPrevHeader(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const cursor = editor.selection.active.line;
    const prev = findHeaderAbove(editor.document, cursor - 1);
    if (prev >= 0) {
        pushJumpHistory(editor);
        revealLine(editor, prev);
    } else {
        vscode.window.showInformationMessage('Chevron Lists: no previous header found');
    }
}
