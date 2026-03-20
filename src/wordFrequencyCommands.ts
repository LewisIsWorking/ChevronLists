import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { getSectionRange, findHeaderAbove } from './documentUtils';
import { topWords } from './wordFrequency';

/** Command: shows the top 20 most frequent words in the current section */
export async function onShowWordFrequency(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const headerLine  = findHeaderAbove(doc, editor.selection.active.line);
    if (headerLine < 0) { vscode.window.showInformationMessage('CL: No section found at cursor'); return; }
    const [, end]     = getSectionRange(doc, headerLine);
    const sectionName = doc.lineAt(headerLine).text.replace(/^> /, '');

    const contents: string[] = [];
    for (let i = headerLine + 1; i <= end; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (content) { contents.push(content); }
    }

    if (contents.length === 0) {
        vscode.window.showInformationMessage('CL: No items found in this section');
        return;
    }

    const words = topWords(contents);
    if (words.length === 0) {
        vscode.window.showInformationMessage('CL: No significant words found');
        return;
    }

    const maxCount  = words[0].count;
    const bar = (n: number) => '█'.repeat(Math.max(1, Math.round((n / maxCount) * 10)));
    const lines = words.map(({ word, count }) =>
        `${bar(count).padEnd(10)} ${count.toString().padStart(3)}×  ${word}`
    );

    const mdDoc = await vscode.workspace.openTextDocument({
        content: `# Word Frequency — "${sectionName}"\n\n\`\`\`\n${lines.join('\n')}\n\`\`\``,
        language: 'markdown',
    });
    await vscode.window.showTextDocument(mdDoc, vscode.ViewColumn.Beside);
}
