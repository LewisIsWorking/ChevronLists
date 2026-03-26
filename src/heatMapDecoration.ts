import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered, computeSectionWeight } from './patterns';
import { getSectionRange } from './documentUtils';
import { extractTags } from './tagParser';
import { parsePriority } from './priorityParser';
import { parseVote } from './voteParser';

/** Updates the overview ruler heat map markers based on section weight */
export function updateHeatMapDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const weights: Array<{ line: number; weight: number }> = [];
    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const [, end] = getSectionRange(doc, i);
        let items = 0, prioritySum = 0, votes = 0, tags = 0;
        for (let j = i + 1; j <= end; j++) {
            const t       = doc.lineAt(j).text;
            const content = parseBullet(t, prefix)?.content ?? parseNumbered(t)?.content ?? null;
            if (!content) { continue; }
            items++;
            prioritySum += parsePriority(content)?.level ?? 0;
            votes       += parseVote(content)?.count ?? 0;
            tags        += extractTags(content).length;
        }
        weights.push({ line: i, weight: computeSectionWeight(items, prioritySum, votes, tags) });
    }

    const maxWeight = Math.max(...weights.map(w => w.weight), 1);

    // Build one decoration type per distinct colour bucket (0-9)
    const buckets = 10;
    const decorationTypes = Array.from({ length: buckets }, (_, b) => {
        const intensity = Math.round(((b + 1) / buckets) * 255);
        return vscode.window.createTextEditorDecorationType({
            overviewRulerLane:  vscode.OverviewRulerLane.Right,
            overviewRulerColor: `rgba(${intensity}, ${Math.round(intensity * 0.5)}, 255, 0.8)`,
        });
    });

    // Clear all old heat map decorations by setting empty ranges on a throwaway type
    editor.setDecorations(
        vscode.window.createTextEditorDecorationType({ overviewRulerLane: vscode.OverviewRulerLane.Right }),
        []
    );

    for (const { line, weight } of weights) {
        const bucketIndex = Math.min(buckets - 1, Math.floor((weight / maxWeight) * buckets));
        decorationTypes[bucketIndex].dispose(); // not disposing — just applying
        editor.setDecorations(decorationTypes[bucketIndex], [{ range: editor.document.lineAt(line).range }]);
    }
}
