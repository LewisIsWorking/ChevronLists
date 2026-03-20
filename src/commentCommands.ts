import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { stripComment } from './commentParser';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: strips all // comment tails from items in the current section */
export async function onStripComments(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);

    let stripped = 0;
    await editor.edit(eb => {
        for (let i = headerLine + 1; i <= end; i++) {
            const text    = doc.lineAt(i).text;
            const bullet  = parseBullet(text, prefix);
            const numbered = parseNumbered(text);
            if (!bullet && !numbered) { continue; }
            const chevrons = bullet?.chevrons ?? numbered!.chevrons;
            const content  = bullet?.content  ?? numbered!.content;
            const num      = numbered?.num ?? null;
            const cleaned  = stripComment(content);
            if (cleaned === content) { continue; }
            const newLine  = num !== null
                ? `${chevrons} ${num}. ${cleaned}`
                : `${chevrons} ${prefix} ${cleaned}`;
            eb.replace(doc.lineAt(i).range, newLine);
            stripped++;
        }
    });

    vscode.window.showInformationMessage(
        stripped > 0
            ? `CL: Stripped comments from ${stripped} item${stripped === 1 ? '' : 's'}`
            : 'CL: No comments found in this section'
    );
}
