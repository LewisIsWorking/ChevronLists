import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';

/** Command: splits item content at cursor into two continuation lines */
export async function onWrapItemText(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const cursor     = editor.selection.active;
    const lineIndex  = cursor.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to wrap');
        return;
    }

    const chevrons     = bullet?.chevrons ?? numbered!.chevrons;
    const content      = bullet?.content  ?? numbered!.content;
    const num          = numbered?.num ?? null;
    const linePrefix   = num !== null
        ? `${chevrons} ${num}. `
        : `${chevrons} ${prefix} `;
    const contentStart = linePrefix.length;
    const cursorInContent = Math.max(0, cursor.character - contentStart);

    const before = content.slice(0, cursorInContent).trimEnd();
    const after  = content.slice(cursorInContent).trimStart();
    if (!before || !after) {
        vscode.window.showInformationMessage('CL: Place cursor inside the item content to wrap');
        return;
    }

    // Continuation line uses same depth prefix with two-space indent
    const contPrefix = `${chevrons}   `;
    const lineA      = `${linePrefix}${before}`;
    const lineB      = `${contPrefix}${after}`;

    await editor.edit(eb => eb.replace(doc.lineAt(lineIndex).range, `${lineA}\n${lineB}`));
    const pos = new vscode.Position(lineIndex + 1, contPrefix.length);
    editor.selection = new vscode.Selection(pos, pos);
}
