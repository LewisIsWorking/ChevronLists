import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isHeader } from './patterns';

type EditBuilder = vscode.TextEditorEdit;

function isCursorAtLineEnd(editor: vscode.TextEditor): boolean {
    const cursor = editor.selection.active;
    return cursor.character === editor.document.lineAt(cursor.line).text.length;
}

async function handleNumbered(
    editor: vscode.TextEditor,
    cursor: vscode.Position,
    chevrons: string,
    num: number,
    content: string
): Promise<void> {
    if (content === '') {
        await editor.edit((eb: EditBuilder) =>
            eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor)));
        return;
    }
    const nextPrefix = `${chevrons} ${num + 1}. `;
    await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${nextPrefix}`));
    const newPos = new vscode.Position(cursor.line + 1, nextPrefix.length);
    editor.selection = new vscode.Selection(newPos, newPos);
    editor.revealRange(new vscode.Range(newPos, newPos));
}

async function handleBullet(
    editor: vscode.TextEditor,
    cursor: vscode.Position,
    chevrons: string,
    content: string,
    prefix: string
): Promise<void> {
    if (content === '') {
        await editor.edit((eb: EditBuilder) =>
            eb.delete(new vscode.Range(cursor.with(undefined, 0), cursor)));
        return;
    }
    const pfx = `${chevrons} ${prefix} `;
    await editor.edit((eb: EditBuilder) => eb.insert(cursor, `\n${pfx}`));
    const newPos = new vscode.Position(cursor.line + 1, pfx.length);
    editor.selection = new vscode.Selection(newPos, newPos);
    editor.revealRange(new vscode.Range(newPos, newPos));
}

/** Handles the Enter key in markdown files */
export async function onEnter(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { await vscode.commands.executeCommand('default:type', { text: '\n' }); return; }
    if (!isCursorAtLineEnd(editor)) { await vscode.commands.executeCommand('default:type', { text: '\n' }); return; }

    const cursor   = editor.selection.active;
    const lineText = editor.document.lineAt(cursor.line).text;
    const { prefix, blankLine } = getConfig();

    const numbered = parseNumbered(lineText);
    if (numbered) {
        await handleNumbered(editor, cursor, numbered.chevrons, numbered.num, numbered.content);
        return;
    }
    const bullet = parseBullet(lineText, prefix);
    if (bullet) {
        await handleBullet(editor, cursor, bullet.chevrons, bullet.content, prefix);
        return;
    }
    if (isHeader(lineText)) {
        const newItem = blankLine ? `\n\n>> ${prefix} ` : `\n>> ${prefix} `;
        await vscode.commands.executeCommand('default:type', { text: newItem });
        return;
    }
    await vscode.commands.executeCommand('default:type', { text: '\n' });
}
