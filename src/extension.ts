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
import { onFilterByTagWorkspace }                            from './tagWorkspaceCommands';
import { onQuickCapture }                                    from './quickCapture';
import { onSaveSectionAsTemplate }                           from './saveTemplate';
import { onExportAsJson, onExportAsCsv }                    from './structuredExportCommands';
import { onToggleNote }                                      from './noteCommands';
import { onShowRecurring, onGenerateNextOccurrence }         from './recurrenceCommands';
import { updateWordGoalDiagnostics, getWordGoalDiagCollection,
         onSetWordCountGoal }                                from './wordGoalCommands';
import { onFilterByMention }                                 from './mentionCommands';
import { onBulkTagItems, onBulkSetPriority,
         onBulkSetDueDate }                                  from './bulkCommands';
import { onCloneItem, onCloneItemToSection }                 from './cloneCommands';
import { onMergeSectionBelow, onSplitSectionHere }           from './mergeSplitCommands';
import { onEnterReadingMode }                                from './readingMode';
import { onCompareSectionToClipboard }                       from './compareCommands';
import { onArchiveDoneItems, onArchiveSection }              from './archiveCommands';
import { onFindInSections, onReplaceInSection }              from './findReplaceCommands';
import { onFocusSection, onUnfocusSection }                  from './focusMode';
import { onAddBookmark, onJumpToBookmark,
         onRemoveBookmark }                                  from './bookmarkCommands';
import { onShowSectionSummary, onCountItemsByTag }          from './counterCommands';
import { pushJumpHistory, onJumpBack,
         clearJumpHistory }                                  from './jumpHistory';
import { onPromoteItemToHeader, onDemoteHeaderToItem }      from './promoteDemote';
import { onExportAsMarkdownDoc }                            from './markdownExportCommands';
import { ChevronFoldingProvider }                            from './foldingProvider';
import { ChevronHoverProvider }                              from './hoverProvider';
import { updateDecorations }                                 from './decorationProvider';
import { createStatusBar, updateStatusBar }                  from './statusBar';
import { ChevronSemanticTokensProvider, buildLegend }        from './semanticProvider';
import { ChevronOutlineProvider }                            from './outlineProvider';
import { getConfig }                                         from './config';

export function activate(context: vscode.ExtensionContext): void {
    const statusBar        = createStatusBar();
    const dueDateDiags     = vscode.languages.createDiagnosticCollection('chevron-lists-dates');
    const wordGoalDiags    = getWordGoalDiagCollection();
    updateStatusBar(vscode.window.activeTextEditor);

    context.subscriptions.push(
        statusBar, dueDateDiags, wordGoalDiags,

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
        vscode.commands.registerCommand('chevron-lists.exportAsHtml',           onExportAsHtml),
        vscode.commands.registerCommand('chevron-lists.exportAsJson',           onExportAsJson),
        vscode.commands.registerCommand('chevron-lists.exportAsCsv',            onExportAsCsv),

        // ── Sorting ──────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.sortItemsAZ',   onSortItemsAZ),
        vscode.commands.registerCommand('chevron-lists.sortItemsZA',   onSortItemsZA),
        vscode.commands.registerCommand('chevron-lists.renumberItems', onRenumberItems),
        vscode.commands.registerCommand('chevron-lists.fixNumbering',  onFixNumbering),

        // ── Search & Filter ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.searchItems',              onSearchItems),
        vscode.commands.registerCommand('chevron-lists.filterSections',           onFilterSections),
        vscode.commands.registerCommand('chevron-lists.searchItemsWorkspace',     onSearchItemsWorkspace),
        vscode.commands.registerCommand('chevron-lists.filterSectionsWorkspace',  onFilterSectionsWorkspace),
        vscode.commands.registerCommand('chevron-lists.filterByTag',              onFilterByTag),
        vscode.commands.registerCommand('chevron-lists.filterByTagWorkspace',     onFilterByTagWorkspace),
        vscode.commands.registerCommand('chevron-lists.filterByPriority',         onFilterByPriority),
        vscode.commands.registerCommand('chevron-lists.filterByMention',          onFilterByMention),
        vscode.commands.registerCommand('chevron-lists.filterPinnedSections',     () => onFilterPinnedSections(context)),
        vscode.commands.registerCommand('chevron-lists.filterGroups',             onFilterGroups),

        // ── Item actions ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.toggleItemDone',          onToggleItemDone),
        vscode.commands.registerCommand('chevron-lists.toggleNote',              onToggleNote),
        vscode.commands.registerCommand('chevron-lists.togglePin',               () => onTogglePin(context)),
        vscode.commands.registerCommand('chevron-lists.goToLinkedSection',       onGoToLinkedSection),
        vscode.commands.registerCommand('chevron-lists.quickCapture',            () => onQuickCapture(context)),

        // ── Bulk ─────────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.bulkTagItems',    onBulkTagItems),
        vscode.commands.registerCommand('chevron-lists.bulkSetPriority', onBulkSetPriority),
        vscode.commands.registerCommand('chevron-lists.bulkSetDueDate',  onBulkSetDueDate),

        // ── Clone ────────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.cloneItem',          onCloneItem),
        vscode.commands.registerCommand('chevron-lists.cloneItemToSection', onCloneItemToSection),

        // ── Merge & Split ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.mergeSectionBelow', onMergeSectionBelow),
        vscode.commands.registerCommand('chevron-lists.splitSectionHere',  onSplitSectionHere),

        // ── Reading Mode ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.enterReadingMode', onEnterReadingMode),

        // ── Compare ──────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.compareSectionToClipboard', onCompareSectionToClipboard),

        // ── Archive ──────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.archiveDoneItems', onArchiveDoneItems),
        vscode.commands.registerCommand('chevron-lists.archiveSection',   onArchiveSection),

        // ── Find & Replace ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.findInSections',   onFindInSections),
        vscode.commands.registerCommand('chevron-lists.replaceInSection', onReplaceInSection),

        // ── Focus Mode ───────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.focusSection',   onFocusSection),
        vscode.commands.registerCommand('chevron-lists.unfocusSection', onUnfocusSection),

        // ── Bookmarks ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.addBookmark',    onAddBookmark),
        vscode.commands.registerCommand('chevron-lists.jumpToBookmark', onJumpToBookmark),
        vscode.commands.registerCommand('chevron-lists.removeBookmark', onRemoveBookmark),

        // ── Counters ─────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showSectionSummary', onShowSectionSummary),
        vscode.commands.registerCommand('chevron-lists.countItemsByTag',    onCountItemsByTag),

        // ── Jump History ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.jumpBack', onJumpBack),

        // ── Promote & Demote ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.promoteItemToHeader', onPromoteItemToHeader),
        vscode.commands.registerCommand('chevron-lists.demoteHeaderToItem',  onDemoteHeaderToItem),

        // ── Markdown Export ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.exportAsMarkdownDoc', onExportAsMarkdownDoc),

        // ── Close handler — clear jump history ───────────────────────────────
        vscode.workspace.onDidCloseTextDocument(doc => clearJumpHistory(doc.uri)),

        // ── Dates & Recurrence ───────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showUpcoming',            onShowUpcoming),
        vscode.commands.registerCommand('chevron-lists.showRecurring',           onShowRecurring),
        vscode.commands.registerCommand('chevron-lists.generateNextOccurrence',  onGenerateNextOccurrence),

        // ── Word Count Goals ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.setWordCountGoal', onSetWordCountGoal),

        // ── Sections ─────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.groupSections',        () => onGroupSections(context)),
        vscode.commands.registerCommand('chevron-lists.saveSectionAsTemplate', onSaveSectionAsTemplate),

        // ── Appearance & Stats ───────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.switchColourPreset', onSwitchColourPreset),
        vscode.commands.registerCommand('chevron-lists.showStatistics',     onShowStatistics),

        // ── Templates ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.insertTemplate', onInsertTemplate),

        // ── Diagnostics ──────────────────────────────────────────────────────
        getDiagnosticCollection(),

        // ── AI Assist ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.suggestItems',     onSuggestItems),
        vscode.commands.registerCommand('chevron-lists.summariseSection', onSummariseSection),
        vscode.commands.registerCommand('chevron-lists.expandItem',       onExpandItem),

        // ── Providers ────────────────────────────────────────────────────────
        vscode.languages.registerFoldingRangeProvider({ language: 'markdown' }, new ChevronFoldingProvider()),
        vscode.languages.registerHoverProvider({ language: 'markdown' }, new ChevronHoverProvider()),
        vscode.languages.registerHoverProvider({ language: 'markdown' }, new ChevronLinkHoverProvider()),
        vscode.languages.registerDocumentSymbolProvider({ language: 'markdown' }, new ChevronOutlineProvider()),
        vscode.languages.registerDefinitionProvider({ language: 'markdown' }, new ChevronLinkDefinitionProvider()),
        vscode.languages.registerDocumentLinkProvider({ language: 'markdown' }, new ChevronDocumentLinkProvider()),
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
                updateWordGoalDiagnostics(editor.document, prefix);
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                const { prefix } = getConfig();
                updateDecorations(editor); updateStatusBar(editor); updateDiagnostics(editor.document);
                updateDueDateDiagnostics(editor.document, dueDateDiags, prefix);
                updateWordGoalDiagnostics(editor.document, prefix);
            }
        }),
    );

    if (vscode.window.activeTextEditor) {
        const { prefix } = getConfig();
        updateDecorations(vscode.window.activeTextEditor);
        updateDiagnostics(vscode.window.activeTextEditor.document);
        updateDueDateDiagnostics(vscode.window.activeTextEditor.document, dueDateDiags, prefix);
        updateWordGoalDiagnostics(vscode.window.activeTextEditor.document, prefix);
    }
    applyConfiguredPreset();
}

export function deactivate(): void {}
