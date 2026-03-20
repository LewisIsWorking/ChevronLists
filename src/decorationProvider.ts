import * as vscode from 'vscode';
import { HEADER_RE } from './patterns';

const headerDecorationType = vscode.window.createTextEditorDecorationType({
    overviewRulerColor: new vscode.ThemeColor('editorOverviewRuler.infoForeground'),
    overviewRulerLane:  vscode.OverviewRulerLane.Left,
});

/** Applies overview ruler markers to all chevron header lines in the editor */
export function updateDecorations(editor: vscode.TextEditor): void {
    if (editor.document.languageId !== 'markdown') {
        editor.setDecorations(headerDecorationType, []);
        return;
    }
    const decorations: vscode.DecorationOptions[] = [];
    for (let i = 0; i < editor.document.lineCount; i++) {
        if (HEADER_RE.test(editor.document.lineAt(i).text)) {
            decorations.push({ range: editor.document.lineAt(i).range });
        }
    }
    editor.setDecorations(headerDecorationType, decorations);
}
