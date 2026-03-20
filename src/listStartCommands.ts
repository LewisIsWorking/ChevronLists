import * as vscode from 'vscode';
import { parseNumbered } from './patterns';

/**
 * Command: inserts a numbered item at the cursor with a user-specified
 * starting number, so subsequent Enter presses continue from that number.
 * If the cursor is already on a numbered line, offers that number + 1 as default.
 */
export async function onSetListStartNumber(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const cursor   = editor.selection.active;
    const lineText = editor.document.lineAt(cursor.line).text;

    // Infer a sensible default: current line number + 1, or 1
    const existing = parseNumbered(lineText);
    const defaultN = existing ? existing.num + 1 : 1;
    const chevrons = existing?.chevrons ?? '>>';

    const input = await vscode.window.showInputBox({
        prompt:      'Start numbered list at…',
        value:       String(defaultN),
        placeHolder: 'e.g. 50',
        validateInput: v => /^\d+$/.test(v.trim()) && Number(v.trim()) > 0
            ? null
            : 'Enter a positive integer',
    });
    if (!input?.trim()) { return; }

    const startNum  = Number(input.trim());
    const prefix    = `${chevrons} ${startNum}. `;
    const insertPos = new vscode.Position(cursor.line + 1, 0);

    await editor.edit(eb => eb.insert(insertPos, `${prefix}\n`));

    const newPos = new vscode.Position(cursor.line + 1, prefix.length);
    editor.selection = new vscode.Selection(newPos, newPos);
    editor.revealRange(new vscode.Range(newPos, newPos));
}
