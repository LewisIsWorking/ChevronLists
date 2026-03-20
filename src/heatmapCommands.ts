import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { extractTags } from './tagParser';
import { parseCheck } from './checkParser';
import { getSectionRange } from './documentUtils';

interface SectionHeat { name: string; line: number; value: number; total: number; }

function buildHeatData(
    document: vscode.TextDocument,
    prefix: string,
    mode: 'tags' | 'completion'
): SectionHeat[] {
    const results: SectionHeat[] = [];
    for (let i = 0; i < document.lineCount; i++) {
        const text = document.lineAt(i).text;
        if (!isHeader(text)) { continue; }
        const name   = text.replace(/^> /, '');
        const [, end] = getSectionRange(document, i);
        let tags = 0, done = 0, total = 0;
        for (let j = i + 1; j <= end; j++) {
            const line    = document.lineAt(j).text;
            const bullet  = parseBullet(line, prefix);
            const numbered = parseNumbered(line);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (!content) { continue; }
            tags += extractTags(content).length;
            const check = parseCheck(content);
            if (check) { total++; if (check.state === 'done') { done++; } }
        }
        results.push({
            name, line: i,
            value: mode === 'tags' ? tags : (total > 0 ? Math.round((done / total) * 100) : 0),
            total: mode === 'tags' ? tags : total,
        });
    }
    return results.sort((a, b) => b.value - a.value);
}

async function showHeatmap(document: vscode.TextDocument, prefix: string, mode: 'tags' | 'completion'): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }
    const data = buildHeatData(document, prefix, mode);
    if (data.length === 0) { vscode.window.showInformationMessage('CL: No sections found'); return; }

    interface HeatItem extends vscode.QuickPickItem { lineIndex: number; }
    const pick = vscode.window.createQuickPick<HeatItem>();
    pick.items = data.map(d => ({
        label:       d.name,
        description: mode === 'tags'
            ? `${d.value} tag${d.value === 1 ? '' : 's'}`
            : d.total > 0 ? `${d.value}% done` : 'no checkboxes',
        lineIndex:   d.line,
    }));
    pick.placeholder = mode === 'tags' ? 'Sections ranked by tag count' : 'Sections ranked by completion %';
    const originalPos = editor.selection.active;
    pick.onDidChangeActive(active => {
        if (!active[0]) { return; }
        const pos = new vscode.Position(active[0].lineIndex, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    });
    pick.onDidAccept(() => { pick.hide(); });
    pick.onDidHide(() => {
        if (!pick.activeItems[0]) {
            const pos = new vscode.Position(originalPos.line, originalPos.character);
            editor.selection = new vscode.Selection(pos, pos);
        }
        pick.dispose();
    });
    pick.show();
}

/** Command: sections ranked by tag count */
export async function onShowTagHeatmap(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    await showHeatmap(editor.document, getConfig().prefix, 'tags');
}

/** Command: sections ranked by completion percentage */
export async function onShowCompletionHeatmap(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    await showHeatmap(editor.document, getConfig().prefix, 'completion');
}
