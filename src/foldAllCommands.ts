import * as vscode from 'vscode';

/** Command: folds every chevron section header in the active document */
export async function onFoldAllSections(): Promise<void> {
    await vscode.commands.executeCommand('editor.foldAll');
}

/** Command: unfolds every section in the active document */
export async function onUnfoldAllSections(): Promise<void> {
    await vscode.commands.executeCommand('editor.unfoldAll');
}
