import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { parseCheck } from './checkParser';
import { getSectionRange } from './documentUtils';
import { findHeaderAbove } from './documentUtils';

const ARCHIVE_HEADER = '> Archive';

/** Finds or creates the Archive section at the end of the document */
function findArchiveLine(document: vscode.TextDocument): number {
    for (let i = 0; i < document.lineCount; i++) {
        const text = document.lineAt(i).text;
        if (isHeader(text) && text.replace(/^> /, '').toLowerCase() === 'archive') {
            return i;
        }
    }
    return -1;
}

/** Command: moves all [x] done items from the current section to the Archive */
export async function onArchiveDoneItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    const [, end] = getSectionRange(doc, headerLine);
    const doneLines: Array<{ lineIndex: number; text: string }> = [];

    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        const check = parseCheck(content);
        if (check?.state === 'done') { doneLines.push({ lineIndex: i, text }); }
    }

    if (doneLines.length === 0) {
        vscode.window.showInformationMessage('CL: No done items found in this section');
        return;
    }

    await editor.edit(eb => {
        // Delete done lines in reverse order to keep indices valid
        for (const { lineIndex } of [...doneLines].reverse()) {
            eb.delete(doc.lineAt(lineIndex).rangeIncludingLineBreak);
        }
        // Append to archive (or create it)
        const archiveLine = findArchiveLine(doc);
        const insertLine  = archiveLine >= 0
            ? getSectionRange(doc, archiveLine)[1] + 1
            : doc.lineCount;
        const prefix_str  = archiveLine >= 0 ? '' : `\n${ARCHIVE_HEADER}\n`;
        eb.insert(
            new vscode.Position(insertLine, 0),
            prefix_str + doneLines.map(l => l.text).join('\n') + '\n'
        );
    });

    vscode.window.showInformationMessage(`CL: Archived ${doneLines.length} done item${doneLines.length === 1 ? '' : 's'}`);
}

/** Command: moves the entire current section to the Archive area */
export async function onArchiveSection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const doc        = editor.document;
    const headerLine = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    const headerText  = doc.lineAt(headerLine).text;
    const [, end]     = getSectionRange(doc, headerLine);
    const sectionText = Array.from({ length: end - headerLine + 1 }, (_, k) =>
        doc.lineAt(headerLine + k).text
    ).join('\n') + '\n';

    await editor.edit(eb => {
        // Delete the section
        const deleteRange = new vscode.Range(headerLine, 0, end + 1, 0);
        eb.delete(deleteRange);
        // Append to archive
        const archiveLine = findArchiveLine(doc);
        const insertLine  = archiveLine >= 0
            ? getSectionRange(doc, archiveLine)[1] + 1
            : doc.lineCount;
        const prefix_str  = archiveLine >= 0 ? '' : `\n${ARCHIVE_HEADER}\n`;
        eb.insert(new vscode.Position(insertLine, 0), prefix_str + sectionText);
    });

    vscode.window.showInformationMessage(`CL: Archived "${headerText.replace(/^> /, '')}"`);
}
