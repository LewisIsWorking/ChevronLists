import * as vscode from 'vscode';
import { isHeader } from './patterns';
import { findHeaderAbove, getSectionRange } from './documentUtils';

/** Command: moves the current section to the first position in the file */
export async function onPinSectionToTop(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    // Find first header in the file
    let firstHeader = -1;
    for (let i = 0; i < doc.lineCount; i++) {
        if (isHeader(doc.lineAt(i).text)) { firstHeader = i; break; }
    }
    if (firstHeader === headerLine) {
        vscode.window.showInformationMessage('CL: Section is already at the top');
        return;
    }

    const [, end]       = getSectionRange(doc, headerLine);
    const sectionLines  = Array.from({ length: end - headerLine + 1 }, (_, k) => doc.lineAt(headerLine + k).text);
    const sectionText   = sectionLines.join('\n') + '\n';
    const deleteRange   = new vscode.Range(headerLine, 0, end + 1, 0);
    const insertPos     = new vscode.Position(firstHeader, 0);

    await editor.edit(eb => {
        eb.delete(deleteRange);
        eb.insert(insertPos, sectionText);
    });

    const pos = new vscode.Position(firstHeader, 0);
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    vscode.window.showInformationMessage(`CL: "${sectionLines[0].replace(/^> /, '')}" pinned to top`);
}
