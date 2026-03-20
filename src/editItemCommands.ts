import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { stripAllMetadata } from './metadataStripper';

/**
 * Command: opens an input box with the item's plain content (markers hidden).
 * On save, writes the new text back while preserving all original markers.
 */
export async function onEditItemContent(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);

    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to edit it');
        return;
    }

    const chevrons = bullet?.chevrons ?? numbered!.chevrons;
    const content  = bullet?.content  ?? numbered!.content;
    const num      = numbered?.num ?? null;

    // Show plain text (metadata stripped) but preserve the full content for rebuild
    const plainText = stripAllMetadata(content);

    const newPlain = await vscode.window.showInputBox({
        prompt:      'Edit item content',
        value:       plainText,
        placeHolder: 'Item text (markers will be preserved)',
    });
    if (newPlain === undefined || newPlain === plainText) { return; }

    // Rebuild: replace only the plain-text portion, keep all markers intact
    const newContent = content.replace(plainText, newPlain.trim());
    const newLine    = num !== null
        ? `${chevrons} ${num}. ${newContent}`
        : `${chevrons} ${prefix} ${newContent}`;

    await editor.edit(eb => eb.replace(doc.lineAt(lineIndex).range, newLine));
}
