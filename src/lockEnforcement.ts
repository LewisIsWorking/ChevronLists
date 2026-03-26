import * as vscode from 'vscode';
import { isHeader } from './patterns';
import { getSectionRange } from './documentUtils';

const LOCKED_MARKER = '>> [locked]';

/** Pure: returns the line index of the [locked] marker in a section, or -1 */
export function findLockedMarker(doc: vscode.TextDocument, headerLine: number): number {
    const [, end] = getSectionRange(doc, headerLine);
    for (let i = headerLine + 1; i <= end; i++) {
        if (doc.lineAt(i).text.trim() === LOCKED_MARKER) { return i; }
    }
    return -1;
}

/** Registers the lock enforcement listener */
export function registerLockEnforcement(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.workspace.onWillSaveTextDocument(event => {
            const doc = event.document;
            if (doc.languageId !== 'markdown') { return; }

            // Find any locked sections
            for (let i = 0; i < doc.lineCount; i++) {
                if (!isHeader(doc.lineAt(i).text)) { continue; }
                const lockedAt = findLockedMarker(doc, i);
                if (lockedAt < 0) { continue; }

                const sectionName = doc.lineAt(i).text.replace(/^> /, '').trim();
                vscode.window.showWarningMessage(
                    `CL: "${sectionName}" is locked — use CL: Unlock Section to edit it`,
                    'Unlock Section'
                ).then(choice => {
                    if (choice === 'Unlock Section') {
                        const editor = vscode.window.activeTextEditor;
                        if (!editor) { return; }
                        editor.edit(eb => eb.delete(doc.lineAt(lockedAt).rangeIncludingLineBreak));
                    }
                });
                break; // warn once per save
            }
        })
    );
}
