import * as vscode from 'vscode';
import { isHeader } from './patterns';

const STATE_KEY = 'chevron-lists.collapsedSections';

/** Returns the storage key for a document's collapsed sections */
function docKey(uri: vscode.Uri): string {
    return `${STATE_KEY}:${uri.fsPath}`;
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
        }),
        // When a file is deleted, drop its fold-state entry so workspaceState
        // doesn't grow indefinitely with stale keys for files that no longer exist.
        vscode.workspace.onDidDeleteFiles(async event => {
            for (const uri of event.files) {
                await context.workspaceState.update(docKey(uri), undefined);
            }
        }),
        // When a file is renamed/moved, migrate the fold state to the new path
        // and drop the old entry. Without this, renames would orphan the state.
        vscode.workspace.onDidRenameFiles(async event => {
            for (const f of event.files) {
                const existing = context.workspaceState.get<string[] | undefined>(docKey(f.oldUri), undefined);
                await context.workspaceState.update(docKey(f.oldUri), undefined);
                if (existing !== undefined && existing.length > 0) {
                    await context.workspaceState.update(docKey(f.newUri), existing);
                }
            }
        })
    );
}
