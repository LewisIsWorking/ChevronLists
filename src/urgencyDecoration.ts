import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, isHeader } from './patterns';
import { parsePriority } from './priorityParser';
import { getSectionRange } from './documentUtils';

const URGENCY_DECORATION = vscode.window.createTextEditorDecorationType({
    overviewRulerLane:  vscode.OverviewRulerLane.Left,
    overviewRulerColor: 'rgba(224, 108, 117, 0.8)',
});

const URGENCY_THRESHOLD = 2;

/** Updates overview ruler urgency tints for sections with 2+ !!! items */
export function updateUrgencyDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const urgentRanges: vscode.Range[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const [, end] = getSectionRange(doc, i);
        let urgentCount = 0;
        for (let j = i + 1; j <= end; j++) {
            const t = doc.lineAt(j).text;
            const content = parseBullet(t, prefix)?.content ?? parseNumbered(t)?.content ?? null;
            if (content && parsePriority(content)?.level === 3) { urgentCount++; }
        }
        if (urgentCount >= URGENCY_THRESHOLD) {
            urgentRanges.push(doc.lineAt(i).range);
        }
    }
    editor.setDecorations(URGENCY_DECORATION, urgentRanges);
}
