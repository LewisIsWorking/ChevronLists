import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, csvEscape } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';
import { stripAllMetadata } from './metadataStripper';

/** Command: copies section items as a single CSV row */
export async function onCopySectionAsCsvRow(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);
    const fields: string[] = [];

    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        fields.push(csvEscape(stripAllMetadata(content).trim()));
    }

    if (fields.length === 0) {
        vscode.window.showInformationMessage('CL: No items found in this section');
        return;
    }

    await vscode.env.clipboard.writeText(fields.join(','));
    vscode.window.showInformationMessage(`CL: ${fields.length} item${fields.length === 1 ? '' : 's'} copied as CSV row`);
}
