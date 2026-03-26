import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, evaluateExpression } from './patterns';

/** Command: evaluates the first =expr in the item at cursor and replaces it with the result */
export async function onEvaluateExpression(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const lineIndex  = editor.selection.active.line;
    const text       = editor.document.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    const content    = bullet?.content ?? numbered?.content ?? null;
    if (!content) { vscode.window.showInformationMessage('CL: Place cursor on a chevron item'); return; }
    const result = evaluateExpression(content);
    if (!result) {
        vscode.window.showInformationMessage('CL: No =expression found in item (e.g. =2+2)');
        return;
    }
    const chevrons   = bullet?.chevrons ?? numbered!.chevrons;
    const num        = numbered?.num ?? null;
    const newContent = content.replace(result.original, `=${result.result}`);
    const newLine    = num !== null
        ? `${chevrons} ${num}. ${newContent}`
        : `${chevrons} ${prefix} ${newContent}`;
    await editor.edit(eb => eb.replace(editor.document.lineAt(lineIndex).range, newLine));
    vscode.window.showInformationMessage(`CL: ${result.original.slice(1)} = ${result.result}`);
}
