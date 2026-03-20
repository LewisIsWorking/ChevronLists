import * as vscode from 'vscode';
import { isHeader } from './patterns';
import { getSectionRange } from './documentUtils';
import { findHeaderAbove } from './documentUtils';

/** Command: merges the current section with the one immediately below it */
export async function onMergeSectionBelow(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    const [, currentEnd] = getSectionRange(doc, headerLine);

    // Find the next header
    let nextHeader = -1;
    for (let i = currentEnd + 1; i < doc.lineCount; i++) {
        if (isHeader(doc.lineAt(i).text)) { nextHeader = i; break; }
    }
    if (nextHeader < 0) {
        vscode.window.showInformationMessage('CL: No section below to merge with');
        return;
    }

    const [, nextEnd] = getSectionRange(doc, nextHeader);

    // Collect all lines from the next section's items (skip the header)
    const nextItems: string[] = [];
    for (let i = nextHeader + 1; i <= nextEnd; i++) {
        nextItems.push(doc.lineAt(i).text);
    }

    await editor.edit(eb => {
        // Delete the next section header and any blank lines between sections
        const deleteStart = new vscode.Position(currentEnd + 1, 0);
        const deleteEnd   = new vscode.Position(nextHeader + 1, 0);
        eb.delete(new vscode.Range(deleteStart, deleteEnd));
    });
}

/** Command: splits the current section at the cursor line */
export async function onSplitSectionHere(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const doc        = editor.document;
    const splitLine  = editor.selection.active.line;

    if (!doc.lineAt(splitLine).text.startsWith('>>')) {
        vscode.window.showInformationMessage('CL: Place cursor on an item line to split the section there');
        return;
    }

    const headerLine = findHeaderAbove(doc, splitLine);
    if (headerLine < 0) { return; }
    const originalName = doc.lineAt(headerLine).text.replace(/^> /, '');

    const newName = await vscode.window.showInputBox({
        prompt:      'Name for the new section',
        value:       `${originalName} (continued)`,
    });
    if (!newName?.trim()) { return; }

    await editor.edit(eb =>
        eb.insert(new vscode.Position(splitLine, 0), `> ${newName.trim()}\n`)
    );
}
