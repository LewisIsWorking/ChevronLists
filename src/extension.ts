import * as vscode from 'vscode';
import { onEnter }                                           from './enterHandler';
import { onTab, onShiftTab, onExpandSnippet }                from './tabHandler';
import { onNextHeader, onPrevHeader }                        from './navigationHandler';
import { onSelectSectionItems, onDeleteSection,
         onDuplicateSection, onMoveSectionUp,
         onMoveSectionDown }                                 from './sectionCommands';
import { onCopySectionAsMarkdown,
         onCopySectionAsPlainText }                          from './exportCommands';
import { onSortItemsAZ, onSortItemsZA,
         onRenumberItems }                                   from './sortCommands';
import { onSearchItems, onFilterSections }                   from './searchCommands';
import { ChevronFoldingProvider }                            from './foldingProvider';
import { ChevronHoverProvider }                              from './hoverProvider';
import { updateDecorations }                                 from './decorationProvider';
import { createStatusBar, updateStatusBar }                  from './statusBar';

export function activate(context: vscode.ExtensionContext): void {
    const statusBar = createStatusBar();
    updateStatusBar(vscode.window.activeTextEditor);

    context.subscriptions.push(
        statusBar,

        // ── Keyboard handlers ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.onEnter',    onEnter),
        vscode.commands.registerCommand('chevron-lists.onTab',          onTab),
        vscode.commands.registerCommand('chevron-lists.onShiftTab',     onShiftTab),
        vscode.commands.registerCommand('chevron-lists.expandSnippet',  onExpandSnippet),

        // ── Navigation ───────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.nextHeader', onNextHeader),
        vscode.commands.registerCommand('chevron-lists.prevHeader', onPrevHeader),

        // ── Section actions ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.selectSectionItems', onSelectSectionItems),
        vscode.commands.registerCommand('chevron-lists.deleteSection',      onDeleteSection),
        vscode.commands.registerCommand('chevron-lists.duplicateSection',   onDuplicateSection),
        vscode.commands.registerCommand('chevron-lists.moveSectionUp',      onMoveSectionUp),
        vscode.commands.registerCommand('chevron-lists.moveSectionDown',    onMoveSectionDown),

        // ── Export ───────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.copySectionAsMarkdown',  onCopySectionAsMarkdown),
        vscode.commands.registerCommand('chevron-lists.copySectionAsPlainText', onCopySectionAsPlainText),

        // ── Sorting ──────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.sortItemsAZ',    onSortItemsAZ),
        vscode.commands.registerCommand('chevron-lists.sortItemsZA',    onSortItemsZA),
        vscode.commands.registerCommand('chevron-lists.renumberItems',  onRenumberItems),

        // ── Search & Filter ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.searchItems',    onSearchItems),
        vscode.commands.registerCommand('chevron-lists.filterSections', onFilterSections),

        // ── Providers ────────────────────────────────────────────────────────
        vscode.languages.registerFoldingRangeProvider({ language: 'markdown' }, new ChevronFoldingProvider()),
        vscode.languages.registerHoverProvider({ language: 'markdown' }, new ChevronHoverProvider()),

        // ── Decoration events ────────────────────────────────────────────────
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) { updateDecorations(editor); updateStatusBar(editor); }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
                updateStatusBar(editor);
            }
        }),
    );

    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }
}

export function deactivate(): void {}
