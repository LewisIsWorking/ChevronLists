import * as vscode from 'vscode';
import * as path from 'path';
import { isHeader } from './patterns';

interface SectionPickItem extends vscode.QuickPickItem { headerName: string; }

/** Command: prompts for a file and section, inserts [[file:name.md#SectionName]] */
export async function onInsertFileSectionLink(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    // Step 1: pick a markdown file
    const files = await vscode.workspace.findFiles('**/*.md', '**/node_modules/**');
    if (files.length === 0) {
        vscode.window.showInformationMessage('CL: No markdown files found in workspace');
        return;
    }
    const currentUri = editor.document.uri.toString();
    const filePick   = await vscode.window.showQuickPick(
        files.map(f => ({ label: path.basename(f.fsPath), description: f.fsPath, uri: f }))
            .filter(f => f.uri.toString() !== currentUri),
        { placeHolder: 'Select a file…' }
    );
    if (!filePick) { return; }

    // Step 2: pick a section from that file
    const doc      = await vscode.workspace.openTextDocument(filePick.uri);
    const sections: SectionPickItem[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const t = doc.lineAt(i).text;
        if (isHeader(t)) { sections.push({ label: t.replace(/^> /, ''), headerName: t.replace(/^> /, '').trim() }); }
    }

    if (sections.length === 0) {
        vscode.window.showInformationMessage(`CL: No sections found in ${filePick.label}`);
        return;
    }

    const sectionPick = await vscode.window.showQuickPick(sections, { placeHolder: 'Select a section…' });
    if (!sectionPick) { return; }

    const link      = `[[file:${filePick.label}#${sectionPick.headerName}]]`;
    const insertPos = editor.selection.active;
    await editor.edit(eb => eb.insert(insertPos, link));
}
