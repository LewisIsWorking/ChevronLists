import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isHeader, formatDate } from './patterns';
import { parseCheck } from './checkParser';
import { parseCreatedDate, ageInDays } from './itemAgeParser';

/** Command: archives [x] done items older than N days to > Archive */
export async function onArchiveOldDoneItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const input = await vscode.window.showInputBox({
        prompt:       'Archive done items older than how many days?',
        value:        '30',
        validateInput: v => /^\d+$/.test(v.trim()) && Number(v.trim()) > 0 ? null : 'Enter a positive integer',
    });
    if (!input?.trim()) { return; }

    const { prefix } = getConfig();
    const days       = Number(input.trim());
    const doc        = editor.document;
    const today      = new Date();
    const toArchive: number[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        const check = parseCheck(content);
        if (check?.state !== 'done') { continue; }
        const dateStr = parseCreatedDate(content);
        if (!dateStr || ageInDays(dateStr, today) < days) { continue; }
        toArchive.push(i);
    }

    if (toArchive.length === 0) {
        vscode.window.showInformationMessage(`CL: No done items older than ${days} days found`);
        return;
    }

    const confirm = await vscode.window.showWarningMessage(
        `Archive ${toArchive.length} done item${toArchive.length === 1 ? '' : 's'} older than ${days} days?`,
        { modal: true }, 'Archive'
    );
    if (confirm !== 'Archive') { return; }

    // Find or create Archive section, then move items in reverse order
    let archiveLine = -1;
    for (let i = 0; i < doc.lineCount; i++) {
        if (doc.lineAt(i).text.toLowerCase() === '> archive') { archiveLine = i; break; }
    }

    await editor.edit(eb => {
        for (const line of [...toArchive].reverse()) {
            const itemText = doc.lineAt(line).text;
            eb.delete(doc.lineAt(line).rangeIncludingLineBreak);
            if (archiveLine >= 0) {
                eb.insert(new vscode.Position(archiveLine + 1, 0), itemText + '\n');
            } else {
                eb.insert(new vscode.Position(doc.lineCount, 0), `\n> Archive\n${itemText}\n`);
            }
        }
    });

    vscode.window.showInformationMessage(`CL: Archived ${toArchive.length} item${toArchive.length === 1 ? '' : 's'}`);
}
