import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, formatDate } from './patterns';
import { parseCreatedDate, ageInDays } from './itemAgeParser';
import { parseCheck } from './checkParser';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: moves [x] done items older than N days to > Archive */
export async function onArchiveOldDoneItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const input = await vscode.window.showInputBox({
        prompt:       'Archive done items older than how many days?',
        value:        '7',
        validateInput: v => /^\d+$/.test(v.trim()) && Number(v.trim()) > 0 ? null : 'Enter a positive integer',
    });
    if (!input?.trim()) { return; }

    const { prefix }  = getConfig();
    const days        = Number(input.trim());
    const doc         = editor.document;
    const today       = new Date();
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    // Find archive section or note we need to create it
    let archiveLine = -1;
    for (let i = 0; i < doc.lineCount; i++) {
        if (doc.lineAt(i).text.toLowerCase() === '> archive') { archiveLine = i; break; }
    }

    const toArchive: number[] = [];
    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const content = parseBullet(text, prefix)?.content ?? parseNumbered(text)?.content ?? null;
        if (!content) { continue; }
        if (parseCheck(content)?.state !== 'done') { continue; }
        const dateStr = parseCreatedDate(content);
        if (!dateStr || ageInDays(dateStr, today) < days) { continue; }
        toArchive.push(i);
    }

    if (toArchive.length === 0) {
        vscode.window.showInformationMessage(`CL: No done items older than ${days} days found`); return;
    }
    const confirm = await vscode.window.showWarningMessage(
        `Archive ${toArchive.length} done item${toArchive.length === 1 ? '' : 's'} older than ${days} days?`,
        { modal: true }, 'Archive'
    );
    if (confirm !== 'Archive') { return; }

    const itemTexts = toArchive.map(l => doc.lineAt(l).text);
    await editor.edit(eb => {
        for (const line of [...toArchive].reverse()) {
            eb.delete(doc.lineAt(line).rangeIncludingLineBreak);
        }
        if (archiveLine >= 0) {
            const insertAt = new vscode.Position(archiveLine + 1, 0);
            eb.insert(insertAt, itemTexts.join('\n') + '\n');
        } else {
            eb.insert(new vscode.Position(doc.lineCount, 0), `\n> Archive\n${itemTexts.join('\n')}\n`);
        }
    });
    vscode.window.showInformationMessage(`CL: Archived ${toArchive.length} old done item${toArchive.length === 1 ? '' : 's'}`);
}
