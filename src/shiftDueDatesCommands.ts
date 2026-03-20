import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, shiftDate } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';

/** Command: shifts all @YYYY-MM-DD dates in the section by N days */
export async function onShiftAllDueDates(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const input = await vscode.window.showInputBox({
        prompt:       'Shift all due dates by how many days? (use negative to move back)',
        placeHolder:  'e.g. 7 or -3',
        validateInput: v => /^-?\d+$/.test(v.trim()) && v.trim() !== '0'
            ? null : 'Enter a non-zero integer',
    });
    if (!input?.trim()) { return; }

    const { prefix }  = getConfig();
    const days        = Number(input.trim());
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);
    const DATE_RE     = /@(\d{4}-\d{2}-\d{2})/g;

    let changed = 0;
    await editor.edit(eb => {
        for (let i = headerLine + 1; i <= end; i++) {
            const text = doc.lineAt(i).text;
            if (!DATE_RE.test(text)) { DATE_RE.lastIndex = 0; continue; }
            DATE_RE.lastIndex = 0;
            const newText = text.replace(/@(\d{4}-\d{2}-\d{2})/g, (_, d) => `@${shiftDate(d, days)}`);
            if (newText !== text) { eb.replace(doc.lineAt(i).range, newText); changed++; }
        }
    });

    vscode.window.showInformationMessage(
        changed > 0
            ? `CL: Shifted ${changed} date${changed === 1 ? '' : 's'} by ${days > 0 ? '+' : ''}${days} days`
            : 'CL: No due dates found in this section'
    );
}
