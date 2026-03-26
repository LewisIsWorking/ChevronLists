import * as vscode from 'vscode';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: duplicates the current section immediately below itself with (copy) suffix */
export async function onCloneSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    const headerText  = doc.lineAt(headerLine).text;
    const name        = headerText.replace(/^> /, '').trim();
    const [, end]     = getSectionRange(doc, headerLine);

    // Collect the entire section
    const sectionLines: string[] = [];
    for (let i = headerLine; i <= end; i++) {
        sectionLines.push(doc.lineAt(i).text);
    }

    // Build clone with (copy) suffix on header
    const cloneHeader    = `> ${name} (copy)`;
    const cloneLines     = [cloneHeader, ...sectionLines.slice(1)];
    const insertText     = '\n' + cloneLines.join('\n');
    const insertPos      = new vscode.Position(end + 1, 0);

    await editor.edit(eb => eb.insert(insertPos, insertText + '\n'));

    // Jump to the cloned header
    const newHeaderLine = end + 2;
    const pos = new vscode.Position(newHeaderLine, 0);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    vscode.window.showInformationMessage(`CL: Cloned "${name}" → "${name} (copy)"`);
}
