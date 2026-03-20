import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';

/** A single item or header result across all workspace files */
interface WorkspaceEntry extends vscode.QuickPickItem {
    uri:       vscode.Uri;
    lineIndex: number;
}

/** Reveals a line in a given file, opening it if not already open */
async function revealEntry(entry: WorkspaceEntry): Promise<void> {
    const doc    = await vscode.workspace.openTextDocument(entry.uri);
    const editor = await vscode.window.showTextDocument(doc, { preserveFocus: true });
    const pos    = new vscode.Position(entry.lineIndex, 0);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

/** Collects all chevron items from every markdown file in the workspace */
async function collectWorkspaceItems(prefix: string): Promise<WorkspaceEntry[]> {
    const files   = await vscode.workspace.findFiles('**/*.md', '**/node_modules/**');
    const entries: WorkspaceEntry[] = [];

    for (const uri of files) {
        const doc      = await vscode.workspace.openTextDocument(uri);
        const fileName = uri.fsPath.split(/[\\/]/).pop() ?? uri.fsPath;
        let header     = '';

        for (let i = 0; i < doc.lineCount; i++) {
            const text = doc.lineAt(i).text;
            if (isHeader(text)) { header = text.replace(/^> /, ''); continue; }
            const bullet  = parseBullet(text, prefix);
            const numbered = parseNumbered(text);
            if (bullet) {
                entries.push({ label: bullet.content, description: `${fileName} › ${header}`, uri, lineIndex: i });
            } else if (numbered) {
                entries.push({ label: `${numbered.num}. ${numbered.content}`, description: `${fileName} › ${header}`, uri, lineIndex: i });
            }
        }
    }
    return entries;
}

/** Collects all chevron section headers from every markdown file */
async function collectWorkspaceHeaders(): Promise<WorkspaceEntry[]> {
    const files   = await vscode.workspace.findFiles('**/*.md', '**/node_modules/**');
    const entries: WorkspaceEntry[] = [];

    for (const uri of files) {
        const doc      = await vscode.workspace.openTextDocument(uri);
        const fileName = uri.fsPath.split(/[\\/]/).pop() ?? uri.fsPath;

        for (let i = 0; i < doc.lineCount; i++) {
            const text = doc.lineAt(i).text;
            if (isHeader(text)) {
                entries.push({ label: text.replace(/^> /, ''), description: fileName, uri, lineIndex: i });
            }
        }
    }
    return entries;
}

/** Command: live quick pick across all items in every markdown file in the workspace */
export async function onSearchItemsWorkspace(): Promise<void> {
    const { prefix } = getConfig();

    await vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, title: 'CL: Scanning workspace...', cancellable: false },
        async () => { /* show spinner while scanning */ }
    );

    const items = await collectWorkspaceItems(prefix);

    if (items.length === 0) {
        vscode.window.showInformationMessage('CL: No chevron items found in workspace');
        return;
    }

    const pick = vscode.window.createQuickPick<WorkspaceEntry>();
    pick.items       = items;
    pick.placeholder = 'Search all chevron items across the workspace...';
    pick.matchOnDescription = true;

    pick.onDidAccept(async () => {
        const selected = pick.activeItems[0];
        if (selected) { await revealEntry(selected); }
        pick.hide();
    });

    pick.onDidHide(() => pick.dispose());
    pick.show();
}

/** Command: live quick pick across all section headers in every markdown file */
export async function onFilterSectionsWorkspace(): Promise<void> {
    const headers = await collectWorkspaceHeaders();

    if (headers.length === 0) {
        vscode.window.showInformationMessage('CL: No chevron sections found in workspace');
        return;
    }

    const pick = vscode.window.createQuickPick<WorkspaceEntry>();
    pick.items       = headers;
    pick.placeholder = 'Filter sections across the workspace...';
    pick.matchOnDescription = true;

    pick.onDidAccept(async () => {
        const selected = pick.activeItems[0];
        if (selected) { await revealEntry(selected); }
        pick.hide();
    });

    pick.onDidHide(() => pick.dispose());
    pick.show();
}
