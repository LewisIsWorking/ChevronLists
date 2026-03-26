import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parseCheck } from './checkParser';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: marks all checkbox items in the current section as done */
export async function onMarkAllDoneSection(): Promise<void> {
    await toggleSectionCheckboxes('done');
}

/** Command: marks all checkbox items in the current section as undone */
export async function onMarkAllUndoneSection(): Promise<void> {
    await toggleSectionCheckboxes('todo');
}

async function toggleSectionCheckboxes(target: 'done' | 'todo'): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);
    let changed = 0;

    await editor.edit(eb => {
        for (let i = headerLine + 1; i <= end; i++) {
            const text     = doc.lineAt(i).text;
            const bullet   = parseBullet(text, prefix);
            const numbered = parseNumbered(text);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (!content) { continue; }
            const check = parseCheck(content);
            if (!check) { continue; }
            if (check.state === target) { continue; }
            const chevrons   = bullet?.chevrons ?? numbered!.chevrons;
            const num        = numbered?.num ?? null;
            const mark       = target === 'done' ? '[x]' : '[ ]';
            const newContent = `${mark} ${check.contentWithout}`;
            const newLine    = num !== null
                ? `${chevrons} ${num}. ${newContent}`
                : `${chevrons} ${prefix} ${newContent}`;
            eb.replace(doc.lineAt(i).range, newLine);
            changed++;
        }
    });

    vscode.window.showInformationMessage(
        changed > 0
            ? `CL: ${changed} item${changed === 1 ? '' : 's'} marked ${target === 'done' ? 'done' : 'undone'}`
            : `CL: No items to change`
    );
}
