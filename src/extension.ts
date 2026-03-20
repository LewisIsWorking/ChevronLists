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
import { onSwitchColourPreset, applyConfiguredPreset }       from './presetCommands';
import { onShowStatistics }                                  from './statisticsPanel';
import { onInsertTemplate }                                  from './templateCommands';
import { onSearchItemsWorkspace,
         onFilterSectionsWorkspace }                         from './workspaceSearch';
import { updateDiagnostics, onFixNumbering,
         getDiagnosticCollection }                           from './diagnosticProvider';
import { onFilterByTag }                                     from './tagCommands';
import { ChevronLinkHoverProvider, ChevronLinkDefinitionProvider,
         ChevronDocumentLinkProvider, onGoToLinkedSection }  from './linkProvider';
import { onToggleItemDone }                                  from './checkCommands';
import { onTogglePin, onFilterPinnedSections }               from './pinCommands';
import { onExportAsHtml }                                    from './htmlExportCommands';
import { onFilterByPriority }                                from './priorityCommands';
import { onShowUpcoming, updateDueDateDiagnostics }          from './dueDateCommands';
import { onGroupSections, onFilterGroups }                   from './groupCommands';
import { onSuggestItems, onSummariseSection, onExpandItem }  from './aiCommands';
import { onFilterByTagWorkspace }                             from './tagWorkspaceCommands';
import { onQuickCapture }                                    from './quickCapture';
import { onSaveSectionAsTemplate }                           from './saveTemplate';
import { ChevronFoldingProvider }                            from './foldingProvider';
import { ChevronHoverProvider }                              from './hoverProvider';
import { updateDecorations }                                 from './decorationProvider';
import { createStatusBar, updateStatusBar }                  from './statusBar';
import { ChevronSemanticTokensProvider, buildLegend }        from './semanticProvider';
import { ChevronOutlineProvider }                            from './outlineProvider';
import { getConfig }                                         from './config';

export function activate(context: vscode.ExtensionContext): void {
    const statusBar    = createStatusBar();
    const dueDateDiags = vscode.languages.createDiagnosticCollection('chevron-lists-dates');
    updateStatusBar(vscode.window.activeTextEditor);

    context.subscriptions.push(
        statusBar,

        // ── Keyboard handlers ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.onEnter',       onEnter),
        vscode.commands.registerCommand('chevron-lists.onTab',         onTab),
        vscode.commands.registerCommand('chevron-lists.onShiftTab',    onShiftTab),
        vscode.commands.registerCommand('chevron-lists.expandSnippet', onExpandSnippet),

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
        vscode.commands.registerCommand('chevron-lists.sortItemsAZ',   onSortItemsAZ),
        vscode.commands.registerCommand('chevron-lists.sortItemsZA',   onSortItemsZA),
        vscode.commands.registerCommand('chevron-lists.renumberItems', onRenumberItems),

        // ── Search & Filter ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.searchItems',    onSearchItems),
        vscode.commands.registerCommand('chevron-lists.filterSections', onFilterSections),

        // ── Colour Presets ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.switchColourPreset', onSwitchColourPreset),

        // ── Statistics ───────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showStatistics', onShowStatistics),

        // ── Templates ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.insertTemplate', onInsertTemplate),

        // ── Workspace Search ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.searchItemsWorkspace',    onSearchItemsWorkspace),
        vscode.commands.registerCommand('chevron-lists.filterSectionsWorkspace', onFilterSectionsWorkspace),

        // ── Diagnostics ──────────────────────────────────────────────────────
        getDiagnosticCollection(),
        dueDateDiags,
        vscode.commands.registerCommand('chevron-lists.fixNumbering', onFixNumbering),

        // ── Tags ─────────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.filterByTag', onFilterByTag),

        // ── Linked Sections ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.goToLinkedSection', onGoToLinkedSection),
        vscode.languages.registerDefinitionProvider({ language: 'markdown' }, new ChevronLinkDefinitionProvider()),
        vscode.languages.registerDocumentLinkProvider({ language: 'markdown' }, new ChevronDocumentLinkProvider()),

        // ── Item Completion ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.toggleItemDone', onToggleItemDone),

        // ── Pinning ──────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.togglePin',            () => onTogglePin(context)),
        vscode.commands.registerCommand('chevron-lists.filterPinnedSections', () => onFilterPinnedSections(context)),

        // ── HTML Export ──────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.exportAsHtml', onExportAsHtml),

        // ── Priority ─────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.filterByPriority', onFilterByPriority),

        // ── Due Dates ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showUpcoming', onShowUpcoming),

        // ── Section Groups ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.groupSections', () => onGroupSections(context)),
        vscode.commands.registerCommand('chevron-lists.filterGroups',  onFilterGroups),

        // ── AI Assist ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.suggestItems',     onSuggestItems),
        vscode.commands.registerCommand('chevron-lists.summariseSection', onSummariseSection),
        vscode.commands.registerCommand('chevron-lists.expandItem',       onExpandItem),

        // ── Tag Workspace ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.filterByTagWorkspace', onFilterByTagWorkspace),

        // ── Quick Capture ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.quickCapture', () => onQuickCapture(context)),

        // ── Save as Template ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.saveSectionAsTemplate', onSaveSectionAsTemplate),

        // ── Providers ────────────────────────────────────────────────────────
        vscode.languages.registerFoldingRangeProvider({ language: 'markdown' }, new ChevronFoldingProvider()),
        vscode.languages.registerHoverProvider({ language: 'markdown' }, new ChevronHoverProvider()),
        vscode.languages.registerHoverProvider({ language: 'markdown' }, new ChevronLinkHoverProvider()),
        vscode.languages.registerDocumentSymbolProvider({ language: 'markdown' }, new ChevronOutlineProvider()),
        vscode.languages.registerDocumentSemanticTokensProvider(
            { language: 'markdown' },
            new ChevronSemanticTokensProvider(buildLegend()),
            buildLegend()
        ),

        // ── Decoration & diagnostic events ───────────────────────────────────
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                const { prefix } = getConfig();
                updateDecorations(editor); updateStatusBar(editor); updateDiagnostics(editor.document);
                updateDueDateDiagnostics(editor.document, dueDateDiags, prefix);
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                const { prefix } = getConfig();
                updateDecorations(editor); updateStatusBar(editor); updateDiagnostics(editor.document);
                updateDueDateDiagnostics(editor.document, dueDateDiags, prefix);
            }
        }),
    );

    if (vscode.window.activeTextEditor) {
        const { prefix } = getConfig();
        updateDecorations(vscode.window.activeTextEditor);
        updateDiagnostics(vscode.window.activeTextEditor.document);
        updateDueDateDiagnostics(vscode.window.activeTextEditor.document, dueDateDiags, prefix);
    }
    applyConfiguredPreset();
}

export function deactivate(): void {}
