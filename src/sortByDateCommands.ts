import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, extractSortDate } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: sorts items in the current section by @YYYY-MM-DD ascending, undated last */
export async function onSortByDueDate(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    const itemLines:  Array<{ text: string; sortKey: string }> = [];
    const otherLines: string[] = [];

    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        if (bullet || numbered) {
            const content = bullet?.content ?? numbered!.content;
            itemLines.push({ text, sortKey: extractSortDate(content) });
        } else {
            otherLines.push(text);
        }
    }

    itemLines.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    const allLines = [...itemLines.map(l => l.text), ...otherLines];
    const range    = new vscode.Range(headerLine + 1, 0, end + 1, 0);
    await editor.edit(eb => eb.replace(range, allLines.join('\n') + '\n'));
    vscode.window.showInformationMessage('CL: Sorted by due date');
}
