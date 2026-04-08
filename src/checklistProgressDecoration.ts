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

/** Builds a progress bar string of given length */
function buildBar(done: number, total: number, length: number): string {
    const bars = Math.round((done / total) * length);
    return '▓'.repeat(bars) + '░'.repeat(length - bars);
}

/** Pushes a decoration into the correct colour bucket */
function pushDecoration(
    opt: vscode.DecorationOptions,
    pct: number,
    red: vscode.DecorationOptions[],
    amber: vscode.DecorationOptions[],
    green: vscode.DecorationOptions[]
): void {
    if (pct >= 1)        { green.push(opt); }
    else if (pct >= 0.5) { amber.push(opt); }
    else                 { red.push(opt); }
}

/** Updates the checklist progress bar decorations on section headers AND numbered sub-items */
export function updateChecklistProgressDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const doc        = editor.document;
    const red: vscode.DecorationOptions[]   = [];
    const amber: vscode.DecorationOptions[] = [];
    const green: vscode.DecorationOptions[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        if (!isHeader(doc.lineAt(i).text)) { continue; }
        const [, sectionEnd] = getSectionRange(doc, i);

        // ── Section-level progress bar (10 blocks) ───────────────────────
        let done = 0, total = 0;
        for (let j = i + 1; j <= sectionEnd; j++) {
            const content = parseBullet(doc.lineAt(j).text, prefix)?.content
                         ?? parseNumbered(doc.lineAt(j).text)?.content ?? null;
            if (!content) { continue; }
            const check = parseCheck(content);
            if (!check) { continue; }
            total++;
            if (check.state === 'done') { done++; }
        }
        if (total > 0) {
            const pct = done / total;
            pushDecoration({
                range:         doc.lineAt(i).range,
                renderOptions: { after: { contentText: `  ${buildBar(done, total, 10)} ${done}/${total}` } },
            }, pct, red, amber, green);
        }

        // ── Numbered item sub-group progress bars (6 blocks) ─────────────
        // Find each >> N. line within the section and scan until the next >> N. or section end
        for (let j = i + 1; j <= sectionEnd; j++) {
            const numbered = parseNumbered(doc.lineAt(j).text);
            if (!numbered) { continue; }
            // Skip numbered items that themselves have a checkbox (they're list items, not headers)
            if (parseCheck(numbered.content)) { continue; }

            // Find the end of this numbered group: next numbered item at same depth, or section end
            let groupEnd = sectionEnd;
            for (let k = j + 1; k <= sectionEnd; k++) {
                const next = parseNumbered(doc.lineAt(k).text);
                if (next && next.chevrons === numbered.chevrons && !parseCheck(next.content)) {
                    groupEnd = k - 1;
                    break;
                }
                // Also stop at a header
                if (isHeader(doc.lineAt(k).text)) { groupEnd = k - 1; break; }
            }

            // Count checkboxes in this group
            let gDone = 0, gTotal = 0;
            for (let k = j + 1; k <= groupEnd; k++) {
                const content = parseBullet(doc.lineAt(k).text, prefix)?.content
                             ?? parseNumbered(doc.lineAt(k).text)?.content ?? null;
                if (!content) { continue; }
                const check = parseCheck(content);
                if (!check) { continue; }
                gTotal++;
                if (check.state === 'done') { gDone++; }
            }

            if (gTotal === 0) { continue; }
            const gPct = gDone / gTotal;
            pushDecoration({
                range:         doc.lineAt(j).range,
                renderOptions: { after: { contentText: `  ${buildBar(gDone, gTotal, 6)} ${gDone}/${gTotal}` } },
            }, gPct, red, amber, green);
        }
    }

    editor.setDecorations(DEC_RED,   red);
    editor.setDecorations(DEC_AMBER, amber);
    editor.setDecorations(DEC_GREEN, green);
}
