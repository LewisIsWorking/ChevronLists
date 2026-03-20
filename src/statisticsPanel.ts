import * as vscode from 'vscode';
import { getConfig } from './config';
import { computeFileStats } from './statistics';

function buildHtml(stats: ReturnType<typeof computeFileStats>, fileName: string): string {
    const rows = stats.sections.map(s => `
        <tr>
            <td>${escHtml(s.name)}</td>
            <td>${s.itemCount}</td>
            <td>${s.wordCount}</td>
        </tr>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chevron Lists Statistics</title>
<style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 1.5rem; }
  h1   { font-size: 1.2rem; margin-bottom: 1rem; color: var(--vscode-textLink-foreground); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .card { background: var(--vscode-editor-inactiveSelectionBackground); border-radius: 6px; padding: 0.75rem 1rem; }
  .card .label { font-size: 0.75rem; opacity: 0.7; margin-bottom: 0.25rem; }
  .card .value { font-size: 1.5rem; font-weight: bold; }
  .card .sub   { font-size: 0.75rem; opacity: 0.6; margin-top: 0.25rem; }
  table { width: 100%; border-collapse: collapse; }
  th    { text-align: left; padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--vscode-panel-border); font-size: 0.8rem; opacity: 0.7; }
  td    { padding: 0.35rem 0.6rem; border-bottom: 1px solid var(--vscode-panel-border); font-size: 0.85rem; }
  tr:hover td { background: var(--vscode-list-hoverBackground); }
</style>
</head>
<body>
<h1>📊 ${escHtml(fileName)}</h1>
<div class="grid">
  <div class="card"><div class="label">Sections</div><div class="value">${stats.totalSections}</div></div>
  <div class="card"><div class="label">Total Items</div><div class="value">${stats.totalItems}</div></div>
  <div class="card"><div class="label">Total Words</div><div class="value">${stats.totalWords}</div></div>
  <div class="card"><div class="label">Avg Items / Section</div><div class="value">${stats.avgItems.toFixed(1)}</div></div>
  <div class="card"><div class="label">Most Items</div><div class="value">${stats.mostPopulated?.itemCount ?? '—'}</div><div class="sub">${escHtml(stats.mostPopulated?.name ?? '')}</div></div>
  <div class="card"><div class="label">Fewest Items</div><div class="value">${stats.leastPopulated?.itemCount ?? '—'}</div><div class="sub">${escHtml(stats.leastPopulated?.name ?? '')}</div></div>
</div>
<table>
  <thead><tr><th>Section</th><th>Items</th><th>Words</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</body></html>`;
}

function escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let panel: vscode.WebviewPanel | undefined;

/** Shows the statistics panel for the active markdown document */
export function onShowStatistics(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showInformationMessage('CL: Open a markdown file first');
        return;
    }

    const { prefix } = getConfig();
    const stats      = computeFileStats(editor.document, prefix);
    const fileName   = editor.document.fileName.split(/[\\/]/).pop() ?? 'file';

    if (panel) {
        panel.reveal();
    } else {
        panel = vscode.window.createWebviewPanel(
            'chevron-lists.statistics',
            'CL: Statistics',
            vscode.ViewColumn.Beside,
            { enableScripts: false }
        );
        panel.onDidDispose(() => { panel = undefined; });
    }

    panel.webview.html = buildHtml(stats, fileName);
}
