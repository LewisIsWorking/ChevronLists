import * as vscode from 'vscode';
import { createStatusBar }                                   from './statusBar';
import { createOverdueStatusBar }                            from './overdueStatusBar';
import { getWordGoalDiagCollection }                         from './wordGoalCommands';
import { applyConfiguredPreset }                             from './presetCommands';
import { refreshEditor }                                     from './editorRefresh';
import { ChevronFoldingProvider }                            from './foldingProvider';
import { ChevronHoverProvider }                              from './hoverProvider';
import { ChevronSemanticTokensProvider, buildLegend }        from './semanticProvider';
import { ChevronOutlineProvider }                            from './outlineProvider';
import { ChevronCodeActionProvider }                         from './codeActionProvider';
import { registerCoreCommands }                              from './commandRegistrationsA';
import { registerSearchItemProviderCommands }                from './commandRegistrationsB';
import { registerPhase12to32Commands }                       from './commandRegistrationsC';
import { registerAutoFixNumbering }                          from './autoFixNumbering';
import { registerLockEnforcement }                           from './lockEnforcement';
import { getConfig }                                         from './config';

export function activate(context: vscode.ExtensionContext): void {
    const statusBar    = createStatusBar();
    const overdueBar   = createOverdueStatusBar();
    const dueDateDiags = vscode.languages.createDiagnosticCollection('chevron-lists-dates');
    const wordGoalDiags = getWordGoalDiagCollection();

    context.subscriptions.push(
        statusBar, overdueBar, dueDateDiags, wordGoalDiags,

        // ── Command groups ───────────────────────────────────────────────────
        ...registerCoreCommands(context),
        ...registerSearchItemProviderCommands(context),
        ...registerPhase12to32Commands(),

        // ── Language providers ───────────────────────────────────────────────
        vscode.languages.registerFoldingRangeProvider(
            { language: 'markdown' }, new ChevronFoldingProvider()),
        vscode.languages.registerHoverProvider(
            { language: 'markdown' }, new ChevronHoverProvider()),
        vscode.languages.registerDocumentSymbolProvider(
            { language: 'markdown' }, new ChevronOutlineProvider()),
        vscode.languages.registerCodeActionsProvider(
            { language: 'markdown' },
            new ChevronCodeActionProvider(),
            { providedCodeActionKinds: ChevronCodeActionProvider.providedCodeActionKinds }
        ),
        vscode.languages.registerDocumentSemanticTokensProvider(
            { language: 'markdown' },
            new ChevronSemanticTokensProvider(buildLegend()),
            buildLegend()
        ),

        // ── Decoration & diagnostic events ───────────────────────────────────
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) { refreshEditor(editor, { dueDateDiags }); }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                refreshEditor(editor, { dueDateDiags });
            }
        }),
    );

    registerAutoFixNumbering(context);
    registerLockEnforcement(context);

    if (vscode.window.activeTextEditor) {
        refreshEditor(vscode.window.activeTextEditor, { dueDateDiags });
    }
    applyConfiguredPreset();
}

export function deactivate(): void {}
