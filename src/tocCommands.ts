import * as vscode from 'vscode';
import { isHeader } from './patterns';

/** Command: inserts a linked table of contents at the cursor */
export async function onInsertTableOfContents(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const doc = editor.document;
    const headers: string[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (isHeader(text)) { headers.push(text.replace(/^> /, '').trim()); }
    }

    if (headers.length === 0) {
        vscode.window.showInformationMessage('CL: No sections found to build a table of contents');
        return;
    }

    const tocLines = [
        '> Table of Contents',
        ...headers.map(h => `>> - [[${h}]]`),
        '',
    ].join('\n');

    const insertPos = new vscode.Position(editor.selection.active.line, 0);
    await editor.edit(eb => eb.insert(insertPos, tocLines + '\n'));
    vscode.window.showInformationMessage(`CL: Inserted table of contents with ${headers.length} section${headers.length === 1 ? '' : 's'}`);
}
