import * as vscode from 'vscode';

const MAX_HISTORY = 10;

/** Per-file jump history stack — stores positions before each navigation */
const history = new Map<string, vscode.Position[]>();

/** Pushes the current cursor position onto the history stack for this file */
export function pushJumpHistory(editor: vscode.TextEditor): void {
    const key  = editor.document.uri.toString();
    const stack = history.get(key) ?? [];
    stack.push(editor.selection.active);
    if (stack.length > MAX_HISTORY) { stack.shift(); }
    history.set(key, stack);
}

/** Command: jumps back to the previous position in this file */
export async function onJumpBack(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const key   = editor.document.uri.toString();
    const stack = history.get(key);

    if (!stack || stack.length === 0) {
        vscode.window.showInformationMessage('CL: No jump history for this file');
        return;
    }

    const pos = stack.pop()!;
    history.set(key, stack);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

/** Clears jump history when a file is closed */
export function clearJumpHistory(uri: vscode.Uri): void {
    history.delete(uri.toString());
}
