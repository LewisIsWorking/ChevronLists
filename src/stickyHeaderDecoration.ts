import * as vscode from 'vscode';
import { isHeader } from './patterns';
import { getSectionRange } from './documentUtils';

const STICKY_DECORATION = vscode.window.createTextEditorDecorationType({
    before: {
        color:            new vscode.ThemeColor('editorLineNumber.foreground'),
        fontStyle:        'italic',
        margin:           '0 0 0 0',
    },
    isWholeLine: true,
});

/** Updates the sticky header decoration showing the current section name at top of viewport */
export function updateStickyHeader(editor: vscode.TextEditor | undefined): void {
    if (!editor || editor.document.languageId !== 'markdown') { return; }
    const doc     = editor.document;
    const curLine = editor.selection.active.line;

    // Find the header above the cursor
    let headerLine = -1;
    for (let i = curLine; i >= 0; i--) {
        if (isHeader(doc.lineAt(i).text)) { headerLine = i; break; }
    }

    if (headerLine < 0) { editor.setDecorations(STICKY_DECORATION, []); return; }

    // Only show the decoration if the header is scrolled out of view
    const visibleStart = editor.visibleRanges[0]?.start.line ?? 0;
    if (headerLine >= visibleStart) { editor.setDecorations(STICKY_DECORATION, []); return; }

    const sectionName = doc.lineAt(headerLine).text.replace(/^> /, '').trim();
    const [, end]     = getSectionRange(doc, headerLine);

    // Show the sticky header on the first visible item in the section
    const targetLine  = Math.max(visibleStart, headerLine + 1);
    if (targetLine > end) { editor.setDecorations(STICKY_DECORATION, []); return; }

    editor.setDecorations(STICKY_DECORATION, [{
        range: doc.lineAt(targetLine).range,
        renderOptions: { before: { contentText: `↑ ${sectionName}  ` } },
    }]);
}
