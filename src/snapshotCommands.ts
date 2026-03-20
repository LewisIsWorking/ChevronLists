import * as vscode from 'vscode';
import { findHeaderAbove } from './documentUtils';
import { getSectionRange } from './documentUtils';

const SNAPSHOT_KEY = 'chevron-lists.snapshots';

interface Snapshot { name: string; fileUri: string; content: string; savedAt: string; }

function getSnapshots(context: vscode.ExtensionContext): Snapshot[] {
    return context.workspaceState.get<Snapshot[]>(SNAPSHOT_KEY, []);
}
async function saveSnapshots(context: vscode.ExtensionContext, snaps: Snapshot[]): Promise<void> {
    await context.workspaceState.update(SNAPSHOT_KEY, snaps);
}

/** Command: saves the current section as a named snapshot */
export async function onSnapshotSection(context: vscode.ExtensionContext): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const defaultName = doc.lineAt(headerLine).text.replace(/^> /, '');
    const name = await vscode.window.showInputBox({ prompt: 'Snapshot name', value: defaultName });
    if (!name?.trim()) { return; }
    const [, end]   = getSectionRange(doc, headerLine);
    const lines     = Array.from({ length: end - headerLine + 1 }, (_, k) => doc.lineAt(headerLine + k).text);
    const snaps     = getSnapshots(context);
    snaps.push({ name: name.trim(), fileUri: doc.uri.toString(), content: lines.join('\n'), savedAt: new Date().toISOString() });
    await saveSnapshots(context, snaps);
    vscode.window.showInformationMessage(`CL: Snapshot "${name.trim()}" saved`);
}

/** Command: replaces the current section with a saved snapshot */
export async function onRestoreSnapshot(context: vscode.ExtensionContext): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const snaps = getSnapshots(context).filter(s => s.fileUri === editor.document.uri.toString());
    if (snaps.length === 0) { vscode.window.showInformationMessage('CL: No snapshots for this file'); return; }
    const pick = await vscode.window.showQuickPick(
        snaps.map(s => ({ label: s.name, description: new Date(s.savedAt).toLocaleString(), snap: s })),
        { placeHolder: 'Select a snapshot to restore...' }
    );
    if (!pick) { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]    = getSectionRange(doc, headerLine);
    const deleteRange = new vscode.Range(headerLine, 0, end + 1, 0);
    await editor.edit(eb => eb.replace(deleteRange, pick.snap.content + '\n'));
    vscode.window.showInformationMessage(`CL: Snapshot "${pick.snap.name}" restored`);
}

/** Command: lists all saved snapshots for the current file */
export async function onListSnapshots(context: vscode.ExtensionContext): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const snaps = getSnapshots(context).filter(s => s.fileUri === editor.document.uri.toString());
    if (snaps.length === 0) { vscode.window.showInformationMessage('CL: No snapshots for this file'); return; }
    await vscode.window.showQuickPick(
        snaps.map(s => ({ label: s.name, description: new Date(s.savedAt).toLocaleString() })),
        { placeHolder: `${snaps.length} snapshot${snaps.length === 1 ? '' : 's'} for this file (read-only view)` }
    );
}
