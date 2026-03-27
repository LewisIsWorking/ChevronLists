import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, groupLinesByMention } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: groups section items by @mention into sub-sections */
export async function onGroupItemsByMention(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    const itemLines: Array<{ text: string; index: number }> = [];
    for (let i = headerLine + 1; i <= end; i++) {
        const text = doc.lineAt(i).text;
        if (parseBullet(text, prefix) || parseNumbered(text)) {
            itemLines.push({ text, index: i });
        }
    }

    if (itemLines.length === 0) {
        vscode.window.showInformationMessage('CL: No items found in this section');
        return;
    }

    const groups = groupLinesByMention(itemLines, prefix);
    if (groups.size <= 1) {
        vscode.window.showInformationMessage('CL: No @Mention markers found in section items');
        return;
    }

    const newLines: string[] = [];
    for (const [name, items] of groups.entries()) {
        newLines.push(`>> -- ${name}`);
        for (const item of items) { newLines.push(item.text); }
    }

    const range = new vscode.Range(headerLine + 1, 0, end + 1, 0);
    await editor.edit(eb => eb.replace(range, newLines.join('\n') + '\n'));
    vscode.window.showInformationMessage(`CL: Grouped into ${groups.size} mention groups`);
}
