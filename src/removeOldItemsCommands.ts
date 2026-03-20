import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parseCreatedDate, ageInDays } from './itemAgeParser';

/** Command: removes all items older than a user-specified number of days */
export async function onRemoveOldItems(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const input = await vscode.window.showInputBox({
        prompt:       'Remove items older than how many days?',
        value:        '30',
        placeHolder:  'e.g. 30',
        validateInput: v => /^\d+$/.test(v.trim()) && Number(v.trim()) > 0 ? null : 'Enter a positive integer',
    });
    if (!input?.trim()) { return; }

    const { prefix } = getConfig();
    const days       = Number(input.trim());
    const doc        = editor.document;
    const today      = new Date();

    // Identify lines to remove
    const toRemove: number[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        const dateStr = parseCreatedDate(content);
        if (!dateStr) { continue; }
        if (ageInDays(dateStr, today) >= days) { toRemove.push(i); }
    }

    if (toRemove.length === 0) {
        vscode.window.showInformationMessage(`CL: No items older than ${days} days found`);
        return;
    }

    const confirm = await vscode.window.showWarningMessage(
        `Remove ${toRemove.length} item${toRemove.length === 1 ? '' : 's'} older than ${days} days?`,
        { modal: true }, 'Remove'
    );
    if (confirm !== 'Remove') { return; }

    // Delete in reverse order to preserve line indices
    await editor.edit(eb => {
        for (const line of [...toRemove].reverse()) {
            eb.delete(doc.lineAt(line).rangeIncludingLineBreak);
        }
    });

    vscode.window.showInformationMessage(
        `CL: Removed ${toRemove.length} item${toRemove.length === 1 ? '' : 's'}`
    );
}
