import * as vscode from 'vscode';
import * as path from 'path';
import { getConfig } from './config';
import { isHeader } from './patterns';
import { getSectionRange } from './documentUtils';
import type { ChevronTemplate } from './templateData';

/** Command: imports all sections from a .md file as named templates */
export async function onImportTemplatesFromFile(): Promise<void> {
    const fileUris = await vscode.window.showOpenDialog({
        filters: { 'Markdown Files': ['md'] },
        canSelectMany: false,
        openLabel: 'Import Templates from File',
    });
    if (!fileUris?.length) { return; }

    const doc = await vscode.workspace.openTextDocument(fileUris[0]);
    const { prefix } = getConfig();
    const imported: ChevronTemplate[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (!isHeader(text)) { continue; }
        const name     = text.replace(/^> /, '');
        const [, end]  = getSectionRange(doc, i);
        const bodyLines = [`> \${1:${name}}`];
        let   tabStop  = 2;
        for (let j = i + 1; j <= end; j++) {
            const line = doc.lineAt(j).text;
            if (line.startsWith('>> ')) {
                const content = line.replace(/^>> [^ ]+ /, '') || 'item';
                bodyLines.push(line.replace(content, `\${${tabStop++}:${content}}`));
            }
        }
        bodyLines.push('$0');
        imported.push({ name, description: `Imported from ${path.basename(fileUris[0].fsPath)}`, body: bodyLines.join('\n') });
    }

    if (imported.length === 0) {
        vscode.window.showInformationMessage('CL: No sections found in the selected file');
        return;
    }

    const cfg      = vscode.workspace.getConfiguration('chevron-lists');
    const existing = cfg.get<ChevronTemplate[]>('templates', []);
    await cfg.update('templates', [...existing, ...imported], vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`CL: Imported ${imported.length} template${imported.length === 1 ? '' : 's'}`);
}

/** Command: exports all user-defined templates to a .md file */
export async function onExportTemplatesToFile(): Promise<void> {
    const cfg       = vscode.workspace.getConfiguration('chevron-lists');
    const templates = cfg.get<ChevronTemplate[]>('templates', []);

    if (templates.length === 0) {
        vscode.window.showInformationMessage('CL: No user-defined templates to export');
        return;
    }

    const saveUri = await vscode.window.showSaveDialog({ filters: { 'Markdown Files': ['md'] } });
    if (!saveUri) { return; }

    const content = templates.map(t =>
        `> ${t.name}\n${t.body.replace(/\$\{[0-9]+:([^}]+)\}/g, '$1').replace(/\$0/g, '').replace(/\$[0-9]+/g, '')}`
    ).join('\n\n') + '\n';

    await vscode.workspace.fs.writeFile(saveUri, Buffer.from(content, 'utf-8'));
    vscode.window.showInformationMessage(`CL: Exported ${templates.length} template${templates.length === 1 ? '' : 's'}`);
}
