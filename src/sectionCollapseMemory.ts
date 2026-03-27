import * as vscode from 'vscode';
import { isHeader } from './patterns';

const STATE_KEY = 'chevron-lists.collapsedSections';

/** Returns the storage key for a document's collapsed sections */
function docKey(uri: vscode.Uri): string {
    return `${STATE_KEY}:${uri.fsPath}`;
}

/** Saves which sections are currently folded for the active document */
export async function saveFoldState(
    context: vscode.ExtensionContext,
    editor: vscode.TextEditor
): Promise<void> {
    if (editor.document.languageId !== 'markdown') { return; }
    // VS Code doesn't expose fold state directly — we store which headers the
    // user has explicitly folded via our own fold commands as a string set.
    // This is called by onFoldSection / onUnfoldSection to persist state.
    const existing = context.workspaceState.get<string[]>(docKey(editor.document.uri), []);
    await context.workspaceState.update(docKey(editor.document.uri), existing);
}

/** Registers listeners that restore fold state when a document is opened */
export function registerCollapseMemory(context: vscode.ExtensionContext): void {
    // Track fold/unfold via our commands by storing header names
    context.subscriptions.push(
        vscode.commands.registerCommand('chevron-lists.rememberFold', async (headerName: string, uri: vscode.Uri) => {
            const key      = docKey(uri);
            const existing = context.workspaceState.get<string[]>(key, []);
            if (!existing.includes(headerName)) {
                await context.workspaceState.update(key, [...existing, headerName]);
            }
        }),
        vscode.commands.registerCommand('chevron-lists.forgetFold', async (headerName: string, uri: vscode.Uri) => {
            const key      = docKey(uri);
            const existing = context.workspaceState.get<string[]>(key, []);
            await context.workspaceState.update(key, existing.filter(h => h !== headerName));
        }),
        // Restore folds when a markdown document opens
        vscode.workspace.onDidOpenTextDocument(async doc => {
            if (doc.languageId !== 'markdown') { return; }
            const folded = context.workspaceState.get<string[]>(docKey(doc.uri), []);
            if (folded.length === 0) { return; }
            // Give the editor a moment to fully load before folding
            await new Promise(r => setTimeout(r, 400));
            const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.fsPath === doc.uri.fsPath);
            if (!editor) { return; }
            const linesToFold: number[] = [];
            for (let i = 0; i < doc.lineCount; i++) {
                const text = doc.lineAt(i).text;
                if (isHeader(text)) {
                    const name = text.replace(/^> /, '').trim();
                    if (folded.includes(name)) { linesToFold.push(i); }
                }
            }
            for (const line of linesToFold) {
                await vscode.commands.executeCommand('editor.fold', { selectionLines: [line] });
            }
        })
    );
}
