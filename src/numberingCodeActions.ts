import * as vscode from 'vscode';
import { parseNumbered } from './patterns';
import { prevNumberAtDepth } from './documentUtils';

/**
 * Provides quick-fix code actions for 'bad-numbering' diagnostics.
 * Offers three actions:
 *  1. Fix this number — corrects just the item at the diagnostic line
 *  2. Fix all numbering — runs the existing Fix Numbering command
 *  3. Set list start here — runs Set List Start Number command
 */
export class ChevronNumberingCodeActionProvider implements vscode.CodeActionProvider {
    static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    provideCodeActions(
        document: vscode.TextDocument,
        range:    vscode.Range,
        context:  vscode.CodeActionContext
    ): vscode.CodeAction[] {
        const badNumbering = context.diagnostics.filter(d => d.code === 'bad-numbering');
        if (badNumbering.length === 0) { return []; }

        const actions: vscode.CodeAction[] = [];

        for (const diag of badNumbering) {
            const lineIndex = diag.range.start.line;
            const text      = document.lineAt(lineIndex).text;
            const numbered  = parseNumbered(text);
            if (!numbered) { continue; }

            // Compute what the correct number should be
            const expected = prevNumberAtDepth(document, lineIndex, numbered.chevrons) + 1;

            // ── Action 1: Fix this item ──────────────────────────────────────
            const fixThis = new vscode.CodeAction(
                `Fix: change ${numbered.num} to ${expected}`,
                vscode.CodeActionKind.QuickFix
            );
            fixThis.diagnostics = [diag];
            fixThis.isPreferred = true;
            fixThis.edit = new vscode.WorkspaceEdit();
            fixThis.edit.replace(
                document.uri,
                document.lineAt(lineIndex).range,
                `${numbered.chevrons} ${expected}. ${numbered.content}`
            );
            actions.push(fixThis);

            // ── Action 2: Set list start number here ─────────────────────────
            const setStart = new vscode.CodeAction(
                'Set list start number here…',
                vscode.CodeActionKind.QuickFix
            );
            setStart.diagnostics = [diag];
            setStart.command = {
                command:   'chevron-lists.setListStartNumber',
                title:     'Set List Start Number',
                arguments: [],
            };
            actions.push(setStart);
        }

        // ── Action 3: Fix all numbering in file ──────────────────────────────
        const fixAll = new vscode.CodeAction(
            'Fix all numbering in file',
            vscode.CodeActionKind.QuickFix
        );
        fixAll.diagnostics = badNumbering;
        fixAll.command = {
            command: 'chevron-lists.fixNumbering',
            title:   'Fix Numbering',
        };
        actions.push(fixAll);

        return actions;
    }
}
