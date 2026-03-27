import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { extractTags } from './tagParser';
import { parseCheck } from './checkParser';
import { parsePriority } from './priorityParser';
import { parseCreatedDate, ageInDays } from './itemAgeParser';
import { getSectionRange } from './documentUtils';

const SUMMARY_DECORATION = vscode.window.createTextEditorDecorationType({
    after: {
        margin:    '0 0 0 1em',
        color:     new vscode.ThemeColor('editorLineNumber.foreground'),
        fontStyle: 'normal',
    },
});

/** Pure: builds a 4-char sparkline for a 0–1 ratio */
function sparkline(ratio: number): string {
    const blocks = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const filled = Math.round(ratio * 4);
    return Array.from({ length: 4 }, (_, i) =>
        i < filled ? blocks[Math.min(7, Math.round((i + 1) / filled * 7))] : '░'
    ).join('');
}

/** Updates the inline section summary decorations on all headers */
export function updateSummaryDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const options: vscode.DecorationOptions[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const [, end] = getSectionRange(doc, i);
        let items = 0, done = 0, totalChecks = 0, tags = 0, urgent = 0, oldItems = 0;
        const today = new Date();
        for (let j = i + 1; j <= end; j++) {
            const t = doc.lineAt(j).text;
            const content = parseBullet(t, prefix)?.content ?? parseNumbered(t)?.content ?? null;
            if (!content) { continue; }
            items++;
            tags += extractTags(content).length;
            const check = parseCheck(content);
            if (check) {
                totalChecks++;
                if (check.state === 'done') { done++; }
            }
            if (parsePriority(content)?.level === 3) { urgent++; }
            const created = parseCreatedDate(content);
            if (created && ageInDays(created, today) >= 30) { oldItems++; }
        }
        if (items === 0) { continue; }
        const parts = [`${items} item${items === 1 ? '' : 's'}`];
        if (totalChecks > 0) {
            parts.push(`${sparkline(done / totalChecks)} ${done} done`);
        }
        if (tags > 0)     { parts.push(`${tags} tag${tags === 1 ? '' : 's'}`); }
        if (urgent > 0)   { parts.push(`${urgent} urgent`); }
        if (oldItems > 0) { parts.push(`${oldItems} old`); }
        options.push({
            range: doc.lineAt(i).range,
            renderOptions: { after: { contentText: `  (${parts.join(' · ')})` } },
        });
    }
    editor.setDecorations(SUMMARY_DECORATION, options);
}
