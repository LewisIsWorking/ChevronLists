import * as vscode from 'vscode';
import * as path from 'path';
import { getConfig } from './config';
import { computeFileStats } from './statistics';

async function saveFile(document: vscode.TextDocument, content: string, ext: string, label: string): Promise<void> {
    const base    = path.basename(document.fileName, path.extname(document.fileName));
    const saveUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(path.join(path.dirname(document.fileName), `${base}-stats.${ext}`)),
        filters:    { [label]: [ext] },
    });
    if (!saveUri) { return; }
    await vscode.workspace.fs.writeFile(saveUri, Buffer.from(content, 'utf-8'));
    vscode.window.showInformationMessage(`CL: Statistics exported to ${path.basename(saveUri.fsPath)}`);
}

/** Command: exports file statistics as a CSV */
export async function onExportStatsAsCsv(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const stats  = computeFileStats(editor.document, prefix);
    const header = 'Section,Items,Words';
    const rows   = stats.sections.map(s => `"${s.name}",${s.itemCount},${s.wordCount}`);
    const summary = `"TOTAL",${stats.totalItems},${stats.totalWords}`;
    await saveFile(editor.document, [header, ...rows, summary].join('\n'), 'csv', 'CSV Files');
}

/** Command: exports file statistics as JSON */
export async function onExportStatsAsJson(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const stats  = computeFileStats(editor.document, prefix);
    await saveFile(editor.document, JSON.stringify(stats, null, 2), 'json', 'JSON Files');
}
