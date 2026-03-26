import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered, scoreItemComplexity } from './patterns';

/** Command: shows a complexity score breakdown for the item at cursor */
export async function onShowItemComplexity(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix } = getConfig();
    const lineIndex  = editor.selection.active.line;
    const text       = editor.document.lineAt(lineIndex).text;
    const bullet     = parseBullet(text, prefix);
    const numbered   = parseNumbered(text);
    const content    = bullet?.content ?? numbered?.content ?? null;
    if (!content) { vscode.window.showInformationMessage('CL: Place cursor on a chevron item'); return; }
    const s   = scoreItemComplexity(content);
    const pct = Math.min(100, Math.round((s.total / 7) * 100));
    const bar = '▓'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
    vscode.window.showInformationMessage(
        `CL: Complexity ${bar} ${pct}%\n` +
        `Priority: ${s.priority} · Tags: ${s.tags} · Estimate: ${s.estimate} · ` +
        `Due: ${s.dueDate} · Expiry: ${s.expiry} · Vote: ${s.vote} · Label: ${s.label}`,
        { modal: true }, 'OK'
    );
}
