import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { extractTags } from './tagParser';
import { parseCheck } from './checkParser';
import { getSectionRange } from './documentUtils';

const SUMMARY_DECORATION = vscode.window.createTextEditorDecorationType({
    after: {
        margin:    '0 0 0 1em',
        color:     new vscode.ThemeColor('editorLineNumber.foreground'),
        fontStyle: 'normal',
    },
});

/** Updates the inline section summary decorations on all headers */
export function updateSummaryDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const options: vscode.DecorationOptions[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const [, end] = getSectionRange(doc, i);
        let items = 0, done = 0, tags = 0;
        for (let j = i + 1; j <= end; j++) {
            const t = doc.lineAt(j).text;
            const content = parseBullet(t, prefix)?.content ?? parseNumbered(t)?.content ?? null;
            if (!content) { continue; }
            items++;
            tags += extractTags(content).length;
            if (parseCheck(content)?.state === 'done') { done++; }
        }
        if (items === 0) { continue; }
        const parts = [`${items} item${items === 1 ? '' : 's'}`];
        if (done > 0) { parts.push(`${done} done`); }
        if (tags > 0) { parts.push(`${tags} tag${tags === 1 ? '' : 's'}`); }
        options.push({
            range: doc.lineAt(i).range,
            renderOptions: { after: { contentText: `  (${parts.join(' · ')})` } },
        });
    }
    editor.setDecorations(SUMMARY_DECORATION, options);
}
