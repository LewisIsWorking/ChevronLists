import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parsePriority } from './priorityParser';
import { getSectionRange, findHeaderAbove } from './documentUtils';

type EditBuilder = vscode.TextEditorEdit;

/** Returns a sort key 0-3 for a content string by priority (0=highest) */
function priorityKey(content: string): number {
    const level = parsePriority(content)?.level ?? 0;
    return 3 - level; // !!! → 0, !! → 1, ! → 2, none → 3
}

/** Command: sorts items in the section by priority !!! → !! → ! → none */
export async function onSortByPriority(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    const itemLines: Array<{ text: string; key: number }> = [];
    const otherLines: Array<{ text: string; index: number }> = [];

    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        if (bullet || numbered) {
            const content = bullet?.content ?? numbered!.content;
            itemLines.push({ text, key: priorityKey(content) });
        } else {
            otherLines.push({ text, index: i });
        }
    }

    itemLines.sort((a, b) => a.key - b.key);
    const sorted    = itemLines.map(l => l.text);
    const allLines  = [...sorted, ...otherLines.map(l => l.text)];
    const range     = new vscode.Range(headerLine + 1, 0, end + 1, 0);
    await editor.edit((eb: EditBuilder) => eb.replace(range, allLines.join('\n') + '\n'));
    vscode.window.showInformationMessage('CL: Sorted by priority');
}
