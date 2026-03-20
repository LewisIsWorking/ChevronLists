import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { toRichText } from './richTextConverter';

/** Command: copies the item at the cursor as formatted readable text */
export async function onCopyItemAsRichText(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const lineIndex  = editor.selection.active.line;
    const text       = doc.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);

    if (!bullet && !numbered) {
        vscode.window.showInformationMessage('CL: Place cursor on a chevron item to copy');
        return;
    }

    const content = bullet?.content ?? numbered!.content;
    const depth   = (bullet?.chevrons ?? numbered!.chevrons).length - 2;
    const indent  = '  '.repeat(depth);
    const rich    = toRichText(content);

    await vscode.env.clipboard.writeText(indent + rich);
    vscode.window.showInformationMessage('CL: Copied as rich text');
}
