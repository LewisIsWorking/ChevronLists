import * as vscode from 'vscode';
import { getConfig } from './config';
import { parseBullet, parseNumbered } from './patterns';
import { parsePriority } from './priorityParser';

const DEC_URGENT = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(224, 108, 117, 0.10)',
    isWholeLine: true,
});
const DEC_HIGH = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(229, 192, 123, 0.10)',
    isWholeLine: true,
});
const DEC_NORMAL = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255, 220, 80, 0.07)',
    isWholeLine: true,
});

/** Updates item priority background decorations */
export function updatePriorityDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const { prefix }  = getConfig();
    const doc         = editor.document;
    const urgent: vscode.Range[] = [];
    const high:   vscode.Range[] = [];
    const normal: vscode.Range[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        const text    = doc.lineAt(i).text;
        const content = parseBullet(text, prefix)?.content ?? parseNumbered(text)?.content ?? null;
        if (!content) { continue; }
        const level = parsePriority(content)?.level ?? 0;
        const range = doc.lineAt(i).range;
        if (level === 3)      { urgent.push(range); }
        else if (level === 2) { high.push(range); }
        else if (level === 1) { normal.push(range); }
    }

    editor.setDecorations(DEC_URGENT, urgent);
    editor.setDecorations(DEC_HIGH,   high);
    editor.setDecorations(DEC_NORMAL, normal);
}
