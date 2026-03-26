import * as vscode from 'vscode';
import { getConfig } from './config';
import { computeAutoFixEdits } from './patterns';

/**
 * autoFixNumbering.ts — registers the on-edit listener.
 * Pure logic lives in computeAutoFixEdits (patternsUtils.ts).
 */

let isApplyingFix = false;

/** Registers the auto-fix numbering document change listener */
export function registerAutoFixNumbering(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async event => {
            if (isApplyingFix) { return; }
            if (event.document.languageId !== 'markdown') { return; }
            if (!getConfig().autoFixNumbering) { return; }
            if (event.contentChanges.length === 0) { return; }

            const doc   = event.document;
            const lines = Array.from({ length: doc.lineCount }, (_, i) => ({
                text: doc.lineAt(i).text, lineIndex: i,
            }));
            const edits = computeAutoFixEdits(lines);
            if (edits.length === 0) { return; }

            isApplyingFix = true;
            const we = new vscode.WorkspaceEdit();
            for (const e of edits) {
                we.replace(doc.uri, doc.lineAt(e.lineIndex).range, e.newText);
            }
            await vscode.workspace.applyEdit(we);
            isApplyingFix = false;
        })
    );
}
