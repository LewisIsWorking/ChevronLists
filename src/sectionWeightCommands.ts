import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered, computeSectionWeight } from './patterns';
import { getSectionRange } from './documentUtils';
import { extractTags } from './tagParser';
import { parsePriority } from './priorityParser';
import { parseVote } from './voteParser';

interface WeightItem extends vscode.QuickPickItem { lineIndex: number; weight: number; }

/** Command: ranks sections by composite weight score */
export async function onShowSectionWeights(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const results: WeightItem[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const name   = doc.lineAt(i).text.replace(/^> /, '');
        const [, end] = getSectionRange(doc, i);
        let items = 0, prioritySum = 0, voteSum = 0, tagCount = 0;
        for (let j = i + 1; j <= end; j++) {
            const t = doc.lineAt(j).text;
            const bullet  = parseBullet(t, prefix);
            const numbered = parseNumbered(t);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (!content) { continue; }
            items++;
            tagCount    += extractTags(content).length;
            const prio   = parsePriority(content);
            if (prio)   { prioritySum += prio.level; }
            const vote   = parseVote(content);
            if (vote)   { voteSum += vote.count; }
        }
        const weight = computeSectionWeight(items, prioritySum, voteSum, tagCount);
        results.push({ label: name, description: `weight: ${weight}`, lineIndex: i, weight });
    }

    if (results.length === 0) {
        vscode.window.showInformationMessage('CL: No sections found');
        return;
    }

    results.sort((a, b) => b.weight - a.weight);
    const pick        = vscode.window.createQuickPick<WeightItem>();
    pick.items        = results;
    pick.placeholder  = 'Sections ranked by weight (items × 3 + priority + votes + tags)';
    const originalPos = editor.selection.active;
    pick.onDidChangeActive(active => {
        if (!active[0]) { return; }
        const pos = new vscode.Position(active[0].lineIndex, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    });
    pick.onDidAccept(() => { pick.hide(); });
    pick.onDidHide(() => {
        if (!pick.activeItems[0]) { editor.selection = new vscode.Selection(originalPos, originalPos); }
        pick.dispose();
    });
    pick.show();
}
