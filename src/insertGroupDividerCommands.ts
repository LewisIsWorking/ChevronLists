import * as vscode from 'vscode';
import { findHeaderAbove } from './documentUtils';

/** Command: inserts a >> -- Name group divider below the cursor line */
export async function onInsertGroupDivider(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const name = await vscode.window.showInputBox({
        prompt:      'Group divider name',
        placeHolder: 'e.g. Act One, Phase 2, Backlog…',
    });
    if (!name?.trim()) { return; }

    const cursor     = editor.selection.active;
    const insertLine = cursor.line + 1;
    const insertPos  = new vscode.Position(insertLine, 0);
    await editor.edit(eb => eb.insert(insertPos, `>> -- ${name.trim()}\n`));

    // Place cursor after the inserted divider
    const newPos = new vscode.Position(insertLine + 1, 0);
    editor.selection = new vscode.Selection(newPos, newPos);
    vscode.window.showInformationMessage(`CL: Inserted group "-- ${name.trim()}"`);
}
