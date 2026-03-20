import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered, diffLines } from './patterns';
import { getSectionRange } from './documentUtils';
import { stripAllMetadata } from './metadataStripper';

interface SectionPickItem extends vscode.QuickPickItem { headerLine: number; }

/** Command: shows a line-by-line diff of any two sections */
export async function onDiffTwoSections(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;

    const sections: SectionPickItem[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        if (isHeader(doc.lineAt(i).text)) {
            sections.push({ label: doc.lineAt(i).text.replace(/^> /, ''), headerLine: i });
        }
    }

    if (sections.length < 2) {
        vscode.window.showInformationMessage('CL: Need at least 2 sections to diff');
        return;
    }

    const pickA = await vscode.window.showQuickPick(sections, { placeHolder: 'Select first section…' });
    if (!pickA) { return; }
    const pickB = await vscode.window.showQuickPick(
        sections.filter(s => s.headerLine !== pickA.headerLine),
        { placeHolder: 'Select second section…' }
    );
    if (!pickB) { return; }

    const getItems = (headerLine: number): string[] => {
        const [, end] = getSectionRange(doc, headerLine);
        const lines: string[] = [];
        for (let i = headerLine + 1; i <= end; i++) {
            const t = doc.lineAt(i).text;
            const bullet  = parseBullet(t, prefix);
            const numbered = parseNumbered(t);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (content) { lines.push(stripAllMetadata(content)); }
        }
        return lines;
    };

    const diff   = diffLines(getItems(pickA.headerLine), getItems(pickB.headerLine));
    const content = `# Diff: "${pickA.label}" vs "${pickB.label}"\n\n\`\`\`diff\n${diff.join('\n')}\n\`\`\``;
    const mdDoc  = await vscode.workspace.openTextDocument({ content, language: 'markdown' });
    await vscode.window.showTextDocument(mdDoc, vscode.ViewColumn.Beside);
}
