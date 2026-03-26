import * as vscode from 'vscode';
import { formatDate } from './patterns';

/** Command: inserts today's date as @YYYY-MM-DD at the cursor position */
export async function onInsertDateStamp(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const today    = formatDate(new Date());
    const stamp    = `@${today}`;
    const cursor   = editor.selection.active;
    await editor.edit(eb => eb.insert(cursor, stamp));
    // Move cursor past the inserted stamp
    const newPos = new vscode.Position(cursor.line, cursor.character + stamp.length);
    editor.selection = new vscode.Selection(newPos, newPos);
}
