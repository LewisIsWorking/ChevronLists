import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { parseCheck } from './checkParser';
import { getSectionRange } from './documentUtils';

const makeProgressDec = (color: string) => vscode.window.createTextEditorDecorationType({
    after: { margin: '0 0 0 0.5em', color },
});
const DEC_RED   = makeProgressDec('#E06C75');
const DEC_AMBER = makeProgressDec('#E5C07B');
const DEC_GREEN = makeProgressDec('#98C379');

/** Updates the checklist progress bar decorations on all headers */
export function updateChecklistProgressDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const red: vscode.DecorationOptions[]   = [];
    const amber: vscode.DecorationOptions[] = [];
    const green: vscode.DecorationOptions[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const [, end] = getSectionRange(doc, i);
        let done = 0, total = 0;
        for (let j = i + 1; j <= end; j++) {
            const t = doc.lineAt(j).text;
            const content = parseBullet(t, prefix)?.content ?? parseNumbered(t)?.content ?? null;
            if (!content) { continue; }
            const check = parseCheck(content);
            if (!check) { continue; }
            total++;
            if (check.state === 'done') { done++; }
        }
        if (total === 0) { continue; }

        const pct  = done / total;
        const bars = Math.round(pct * 10);
        const bar  = '▓'.repeat(bars) + '░'.repeat(10 - bars);
        const opt: vscode.DecorationOptions = {
            range: doc.lineAt(i).range,
            renderOptions: { after: { contentText: `  ${bar} ${done}/${total}` } },
        };
        if (pct >= 1)        { green.push(opt); }
        else if (pct >= 0.5) { amber.push(opt); }
        else                 { red.push(opt); }
    }
    editor.setDecorations(DEC_RED,   red);
    editor.setDecorations(DEC_AMBER, amber);
    editor.setDecorations(DEC_GREEN, green);
}
