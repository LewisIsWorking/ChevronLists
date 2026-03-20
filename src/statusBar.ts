import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { parseCheck } from './checkParser';

let statusBarItem: vscode.StatusBarItem | undefined;

/** Creates and returns the status bar item (call once in activate) */
export function createStatusBar(): vscode.StatusBarItem {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    return statusBarItem;
}

/** Updates the status bar with section, item and completion counts */
export function updateStatusBar(editor?: vscode.TextEditor): void {
    if (!statusBarItem) { return; }
    if (!editor || editor.document.languageId !== 'markdown') {
        statusBarItem.hide();
        return;
    }
    const { prefix } = getConfig();
    let sections = 0, items = 0, done = 0, total = 0;

    for (let i = 0; i < editor.document.lineCount; i++) {
        const text = editor.document.lineAt(i).text;
        if (isHeader(text)) {
            sections++;
        } else {
            const bullet  = parseBullet(text, prefix);
            const numbered = parseNumbered(text);
            const content  = bullet?.content ?? numbered?.content ?? null;
            if (content !== null) {
                items++;
                const check = parseCheck(content);
                if (check) {
                    total++;
                    if (check.state === 'done') { done++; }
                }
            }
        }
    }

    const checkPart = total > 0 ? `  $(check) ${done}/${total}` : '';
    statusBarItem.text    = `$(list-unordered) ${sections}  $(symbol-enum-member) ${items}${checkPart}`;
    statusBarItem.tooltip = `Chevron Lists: ${sections} sections, ${items} items${total > 0 ? `, ${done}/${total} done` : ''}`;
    statusBarItem.show();
}
