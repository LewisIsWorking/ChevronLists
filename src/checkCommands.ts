import * as vscode from 'vscode';
import { getConfig } from './config';
import { toggleCheckLine } from './checkParser';
import { findHeaderAbove } from './documentUtils';
import { countChecks } from './checkParser';
import { getSectionRange } from './documentUtils';

/** Command: toggles [x]/[ ] on the item at the cursor */
export async function onToggleItemDone(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;

    await editor.edit(eb => {
        for (const sel of editor.selections) {
            const lineIndex = sel.active.line;
            const text      = doc.lineAt(lineIndex).text;
            const toggled   = toggleCheckLine(text, prefix);
            if (toggled !== null) {
                eb.replace(doc.lineAt(lineIndex).range, toggled);
            }
        }
    });
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
