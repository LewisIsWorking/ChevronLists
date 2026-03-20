import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, toMarkdownTable } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';
import { stripAllMetadata } from './metadataStripper';

/** Command: converts the current section's items to a markdown table */
export async function onConvertSectionToTable(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }

    const sectionName = doc.lineAt(headerLine).text.replace(/^> /, '');
    const [, end]     = getSectionRange(doc, headerLine);

    const rows: Array<{ num: number; content: string }> = [];
    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        rows.push({ num: rows.length + 1, content: stripAllMetadata(content) });
    }

    if (rows.length === 0) {
        vscode.window.showInformationMessage('CL: No items found in this section');
        return;
    }

    const tableContent = `# ${sectionName}\n\n${toMarkdownTable(rows)}\n`;
    const mdDoc = await vscode.workspace.openTextDocument({ content: tableContent, language: 'markdown' });
    await vscode.window.showTextDocument(mdDoc, vscode.ViewColumn.Beside);
    vscode.window.showInformationMessage(`CL: Table created with ${rows.length} row${rows.length === 1 ? '' : 's'}`);
}
