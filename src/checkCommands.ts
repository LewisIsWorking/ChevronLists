import * as vscode from 'vscode';
import { getConfig } from './config';
import { toggleCheckLine, parseCheck } from './checkParser';
import { findHeaderAbove, getSectionRange } from './documentUtils';
import { countChecks } from './checkParser';
import { isHeader } from './patterns';

/** Moves a completed item to the > Archive section, creating it if needed */
async function autoArchiveLine(editor: vscode.TextEditor, lineIndex: number): Promise<void> {
    const doc      = editor.document;
    const itemText = doc.lineAt(lineIndex).text;
    let   archiveLine = -1;

    for (let i = 0; i < doc.lineCount; i++) {
        if (doc.lineAt(i).text.toLowerCase() === '> archive') { archiveLine = i; break; }
    }

    await editor.edit(eb => {
        eb.delete(doc.lineAt(lineIndex).rangeIncludingLineBreak);
        if (archiveLine >= 0) {
            const insertAt = archiveLine + 1;
            eb.insert(new vscode.Position(insertAt, 0), itemText + '\n');
        } else {
            const end = doc.lineCount;
            eb.insert(new vscode.Position(end, 0), `\n> Archive\n${itemText}\n`);
        }
    });
}

/** Command: toggles [x]/[ ] on the item at the cursor; auto-archives if enabled */
export async function onToggleItemDone(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix, autoArchive } = getConfig();
    const doc                     = editor.document;
    const linesToArchive: number[] = [];

    await editor.edit(eb => {
        for (const sel of editor.selections) {
            const lineIndex = sel.active.line;
            const text      = doc.lineAt(lineIndex).text;
            const toggled   = toggleCheckLine(text, prefix);
            if (toggled !== null) {
                eb.replace(doc.lineAt(lineIndex).range, toggled);
                if (autoArchive && parseCheck(toggled.replace(/^(>{2,}) [^ ]+ /, ''))?.state === 'done') {
                    linesToArchive.push(lineIndex);
                }
            }
        }
    });

    // Archive in reverse order so line indices stay valid
    if (linesToArchive.length > 0) {
        for (const line of linesToArchive.reverse()) {
            await autoArchiveLine(editor, line);
        }
    }
}

/** Returns a status string like "3/5 done" for the section containing the cursor, or null */
export function getSectionCheckStatus(
    document: vscode.TextDocument,
    cursorLine: number,
    prefix: string
): string | null {
    const headerLine = findHeaderAbove(document, cursorLine);
    if (headerLine < 0) { return null; }
    const [start, end] = getSectionRange(document, headerLine);
    const { done, total } = countChecks(document, start, end, prefix);
    if (total === 0) { return null; }
    return `${done}/${total} done`;
}
