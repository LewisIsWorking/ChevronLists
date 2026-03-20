import * as vscode from 'vscode';
import { getConfig } from './config';
import { buildHtml } from './htmlExporter';
import * as path from 'path';

let readingPanel: vscode.WebviewPanel | undefined;

/** Command: opens the current file in a clean reading mode webview */
export function onEnterReadingMode(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
        vscode.window.showInformationMessage('CL: Open a markdown file to enter reading mode');
        return;
    }

    const { prefix } = getConfig();
    const doc        = editor.document;
    const fileName   = path.basename(doc.fileName, path.extname(doc.fileName));

    if (readingPanel) {
        readingPanel.reveal();
    } else {
        readingPanel = vscode.window.createWebviewPanel(
            'chevron-lists.reading',
            `${fileName} — Reading Mode`,
            vscode.ViewColumn.Beside,
            { enableScripts: false }
        );
        readingPanel.onDidDispose(() => { readingPanel = undefined; });
    }

    readingPanel.webview.html = buildHtml(doc, prefix, fileName);

    // Live-update when the document changes
    const sub = vscode.workspace.onDidChangeTextDocument(event => {
        if (readingPanel && event.document === doc) {
            readingPanel.webview.html = buildHtml(doc, prefix, fileName);
        }
    });
    readingPanel.onDidDispose(() => sub.dispose());
}
