import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isHeader } from './patterns';
import { findHeaderAbove } from './documentUtils';
import { getSectionRange } from './documentUtils';

/** Command: converts the item at the cursor into a new section header */
export async function onPromoteItemToHeader(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix }  = getConfig();
    const doc         = editor.document;
    const lineIndex   = editor.selection.active.line;
    const text        = doc.lineAt(lineIndex).text;
    const bullet      = parseBullet(text, prefix);
    const numbered    = parseNumbered(text);
    const content     = bullet?.content ?? numbered?.content;

    if (!content) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to promote it');
        return;
    }

    await editor.edit(eb =>
        eb.replace(doc.lineAt(lineIndex).range, `> ${content}`)
    );
}

/** Command: converts the current section header into a bullet item in the section above */
export async function onDemoteHeaderToItem(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix }  = getConfig();
    const doc         = editor.document;
    const cursor      = editor.selection.active;

    // Find the current header
    let headerLine = -1;
    for (let i = cursor.line; i >= 0; i--) {
        if (isHeader(doc.lineAt(i).text)) { headerLine = i; break; }
    }
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section header found at cursor'); return; }

    // Find the section above
    let prevHeader = -1;
    for (let i = headerLine - 1; i >= 0; i--) {
        if (isHeader(doc.lineAt(i).text)) { prevHeader = i; break; }
    }
    if (prevHeader < 0) { vscode.window.showInformationMessage('CL: No section above to demote into'); return; }

    const name         = doc.lineAt(headerLine).text.replace(/^> /, '');
    const [, prevEnd]  = getSectionRange(doc, prevHeader);
    const insertLine   = headerLine <= prevEnd ? prevEnd : prevEnd;

    await editor.edit(eb => {
        // Delete the header line
        eb.delete(doc.lineAt(headerLine).rangeIncludingLineBreak);
        // Insert as a bullet at the end of the previous section
        eb.insert(new vscode.Position(insertLine + 1, 0), `>> ${prefix} ${name}\n`);
    });
}
