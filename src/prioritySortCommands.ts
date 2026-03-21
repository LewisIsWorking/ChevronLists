import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';
import { parsePriority } from './priorityParser';

function priorityLevel(content: string): number {
    return parsePriority(content)?.level ?? 0;
}

/** Command: sorts items in the current section by priority level descending */
export async function onSortByPriority(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    const lines: string[] = [];
    for (let i = headerLine + 1; i <= end; i++) { lines.push(doc.lineAt(i).text); }

    const sorted = [...lines].sort((a, b) => {
        const bullet1 = parseBullet(a, prefix); const num1 = parseNumbered(a);
        const bullet2 = parseBullet(b, prefix); const num2 = parseNumbered(b);
        const lvlA = priorityLevel(bullet1?.content ?? num1?.content ?? '');
        const lvlB = priorityLevel(bullet2?.content ?? num2?.content ?? '');
        return lvlB - lvlA; // highest priority first
    });

    const isSame = lines.every((l, i) => l === sorted[i]);
    if (isSame) { vscode.window.showInformationMessage('CL: Items already sorted by priority'); return; }

    const range = new vscode.Range(headerLine + 1, 0, end + 1, 0);
    await editor.edit(eb => eb.replace(range, sorted.join('\n') + '\n'));
    vscode.window.showInformationMessage('CL: Sorted by priority');
}
