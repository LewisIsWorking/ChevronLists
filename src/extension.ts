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
         onRenumberItems,
         onConvertBulletsToNumbered,
         onConvertNumberedToBullets }                        from './sortCommands';
import { onShowWordCount, onShowNestingSummary }             from './wordCountCommands';
import { onPasteAsBullets, onPasteAsNumbered }              from './pasteCommands';
import { onDuplicateItem }                                   from './duplicateItem';
import { onRenameSection }                                   from './renameSectionCommands';
import { onRenameTag, onRenameTagWorkspace }                from './renameTagCommands';
import { onMoveItemUp, onMoveItemDown }                     from './moveItemCommands';
import { onImportTemplatesFromFile,
         onExportTemplatesToFile }                          from './templateFileCommands';
import { onMarkAllDone, onMarkAllUndone,
         onRemoveAllCheckboxes }                            from './completionCommands';
import { onUppercaseItem, onLowercaseItem,
         onTitleCaseItem }                                  from './textTransformCommands';
import { onStrikethroughItem, onRemoveStrikethrough }       from './strikethroughCommands';
import { onCompareStatistics }                              from './compareStatsCommands';
import { onSetItemColour }                                  from './colourLabelCommands';
import { onShowWorkspaceStatistics }                        from './workspaceStatsCommands';
import { onStripComments }                                   from './commentCommands';
import { onLockSection, onUnlockSection }                    from './lockCommands';
import { onToggleFlag, onFilterFlaggedItems }                from './flagCommands';
import { onSnapshotSection, onRestoreSnapshot,
         onListSnapshots }                                   from './snapshotCommands';
import { onSortSectionsAZ, onSortSectionsZA }               from './sectionSortCommands';
import { onFilterByMentionWorkspace }                       from './mentionWorkspaceCommands';
import { onPreviewItem }                                    from './previewItemCommands';
import { onMoveItemToTop, onMoveItemToBottom }              from './moveItemEdgeCommands';
import { onShowTagHeatmap, onShowCompletionHeatmap }        from './heatmapCommands';
import { onStampItem, onShowOldItems }                      from './itemAgeCommands';
import { onInsertTableOfContents }                          from './tocCommands';
import { onSetListStartNumber }                             from './listStartCommands';
import { ChevronNumberingCodeActionProvider }               from './numberingCodeActions';
import { ChevronCodeActionProvider }                        from './codeActionProvider';
import { onRebaseListFromHere, onOffsetListNumbers }        from './listRebaseCommands';
import { onStripAllMetadata }                               from './metadataStripCommands';
import { onShowWordFrequency }                              from './wordFrequencyCommands';
import { onEditItemContent }                                from './editItemCommands';
import { onCollectItemsByTag }                             from './collectByTagCommands';
import { onConvertSectionToTable }                         from './tableExportCommands';
import { onMoveItemToSection }                             from './moveItemToSectionCommands';
import { onDiffTwoSections }                              from './diffSectionCommands';
import { onClearAllPriority, onClearAllDueDates }         from './batchClearCommands';
import { onToggleItemCountBadge, updateBadgeDecorations } from './itemCountBadge';
import { onPasteAsSection }                               from './pasteSectionCommands';
import { onFoldAllSections, onUnfoldAllSections }         from './foldAllCommands';
import { onRemoveOldItems }                               from './removeOldItemsCommands';
import { onShowJumpHistory }                              from './jumpHistory';
import { onDuplicateItemAndIncrement }                    from './duplicateIncrementCommands';
import { updateGoalDecorations }                          from './goalProgressDecoration';
import { onNewSection }                                   from './newSectionCommands';
import { onSectionHealthCheck }                           from './healthCheckCommands';
import { ChevronTagCompletionProvider,
         ChevronMentionCompletionProvider,
         ChevronLinkCompletionProvider,
         ChevronPriorityCompletionProvider,
         ChevronDateCompletionProvider,
         ChevronEstimateCompletionProvider,
         ChevronRatingCompletionProvider }              from './completionProviders';
import { onInsertItemSnippet }                            from './itemSnippetCommands';
import { onInsertFileSectionLink }                        from './fileSectionLinkCommands';
import { onShowTagReportWorkspace }                       from './tagReportCommands';
import { onFilterByColourLabel }                          from './colourFilterCommands';
import { onPinSectionToTop }                             from './pinToTopCommands';
import { onSetItemRating, onFilterByRating }             from './ratingCommands';
import { onStartSectionTimer, onStopSectionTimer }       from './sectionTimer';
import { onShowSectionWeights }                           from './sectionWeightCommands';
import { onShiftAllDueDates }                             from './shiftDueDatesCommands';
import { onShowCompletionStreak }                         from './completionStreakCommands';
import { createOverdueStatusBar,
         updateOverdueStatusBar }                         from './overdueStatusBar';
import { onCopySectionAsJson }                            from './jsonCopyCommands';
import { onMoveItemToFile }                               from './moveItemToFileCommands';
import { onOpenDailyNote }                                from './dailyNoteCommands';
import { onCopySectionAs }                                from './copySectionAsCommands';
import { updateAgeDecorations }                           from './ageHighlightDecoration';
import { onBulkSetRating }                                from './bulkRatingCommands';
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
import { onToggleStar, onFilterStarredItems }               from './starCommands';
import { onExportStatsAsCsv, onExportStatsAsJson }          from './statsExportCommands';
import { onGoToLinkedFile,
         ChevronFileLinkHoverProvider }                     from './fileLinkCommands';
import { onShowTimeEstimates }                              from './estimateCommands';
import { onShowDependencies }                               from './dependencyCommands';
import { onSortByVotes, onAddVote, onRemoveVote }           from './voteCommands';
import { onHideSection, onShowHiddenSections }              from './visibilityCommands';
import { ChevronFoldingProvider }                            from './foldingProvider';
import { ChevronHoverProvider }                              from './hoverProvider';
import { updateDecorations }                                 from './decorationProvider';
import { createStatusBar, updateStatusBar }                  from './statusBar';
import { ChevronSemanticTokensProvider, buildLegend }        from './semanticProvider';
import { ChevronOutlineProvider }                            from './outlineProvider';
import { getConfig }                                         from './config';

export function activate(context: vscode.ExtensionContext): void {
    const statusBar        = createStatusBar();
    const overdueBar       = createOverdueStatusBar();
    const dueDateDiags     = vscode.languages.createDiagnosticCollection('chevron-lists-dates');
    const wordGoalDiags    = getWordGoalDiagCollection();
    updateStatusBar(vscode.window.activeTextEditor);

    context.subscriptions.push(
        statusBar, overdueBar, dueDateDiags, wordGoalDiags,

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
        vscode.commands.registerCommand('chevron-lists.convertBulletsToNumbered', onConvertBulletsToNumbered),
        vscode.commands.registerCommand('chevron-lists.convertNumberedToBullets', onConvertNumberedToBullets),

        // ── Word Count & Nesting ─────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showWordCount',      onShowWordCount),
        vscode.commands.registerCommand('chevron-lists.showNestingSummary', onShowNestingSummary),

        // ── Paste as Chevron ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.pasteAsBullets',  onPasteAsBullets),
        vscode.commands.registerCommand('chevron-lists.pasteAsNumbered', onPasteAsNumbered),

        // ── Duplicate Item ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.duplicateItem', onDuplicateItem),

        // ── Rename ───────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.renameSection',        onRenameSection),
        vscode.commands.registerCommand('chevron-lists.renameTag',            onRenameTag),
        vscode.commands.registerCommand('chevron-lists.renameTagWorkspace',   onRenameTagWorkspace),

        // ── Move Item ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.moveItemUp',   onMoveItemUp),
        vscode.commands.registerCommand('chevron-lists.moveItemDown', onMoveItemDown),

        // ── Template File ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.importTemplatesFromFile', onImportTemplatesFromFile),
        vscode.commands.registerCommand('chevron-lists.exportTemplatesToFile',   onExportTemplatesToFile),

        // ── Completion Batch ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.markAllDone',        onMarkAllDone),
        vscode.commands.registerCommand('chevron-lists.markAllUndone',      onMarkAllUndone),
        vscode.commands.registerCommand('chevron-lists.removeAllCheckboxes', onRemoveAllCheckboxes),

        // ── Text Transforms ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.uppercaseItem', onUppercaseItem),
        vscode.commands.registerCommand('chevron-lists.lowercaseItem', onLowercaseItem),
        vscode.commands.registerCommand('chevron-lists.titleCaseItem', onTitleCaseItem),

        // ── Strikethrough ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.strikethroughItem',   onStrikethroughItem),
        vscode.commands.registerCommand('chevron-lists.removeStrikethrough', onRemoveStrikethrough),

        // ── Statistics Comparison ────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.compareStatistics',       onCompareStatistics),
        vscode.commands.registerCommand('chevron-lists.showWorkspaceStatistics', onShowWorkspaceStatistics),

        // ── Colour Labels ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.setItemColour', onSetItemColour),

        // ── Comments ─────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.stripComments', onStripComments),

        // ── Section Lock ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.lockSection',   onLockSection),
        vscode.commands.registerCommand('chevron-lists.unlockSection', onUnlockSection),

        // ── Item Flags ───────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.toggleFlag',         onToggleFlag),
        vscode.commands.registerCommand('chevron-lists.filterFlaggedItems', onFilterFlaggedItems),

        // ── Snapshots ────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.snapshotSection',  () => onSnapshotSection(context)),
        vscode.commands.registerCommand('chevron-lists.restoreSnapshot',  () => onRestoreSnapshot(context)),
        vscode.commands.registerCommand('chevron-lists.listSnapshots',    () => onListSnapshots(context)),

        // ── Section Sort ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.sortSectionsAZ', onSortSectionsAZ),
        vscode.commands.registerCommand('chevron-lists.sortSectionsZA', onSortSectionsZA),

        // ── Mention Workspace ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.filterByMentionWorkspace', onFilterByMentionWorkspace),

        // ── Item Preview ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.previewItem', onPreviewItem),

        // ── Move to Edge ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.moveItemToTop',    onMoveItemToTop),
        vscode.commands.registerCommand('chevron-lists.moveItemToBottom', onMoveItemToBottom),

        // ── Heatmaps ─────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showTagHeatmap',        onShowTagHeatmap),
        vscode.commands.registerCommand('chevron-lists.showCompletionHeatmap', onShowCompletionHeatmap),

        // ── Item Age ─────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.stampItem',    onStampItem),
        vscode.commands.registerCommand('chevron-lists.showOldItems', onShowOldItems),

        // ── Table of Contents ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.insertTableOfContents', onInsertTableOfContents),

        // ── List Start Number ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.setListStartNumber', onSetListStartNumber),

        // ── List Rebase ──────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.rebaseListFromHere', onRebaseListFromHere),
        vscode.commands.registerCommand('chevron-lists.offsetListNumbers',  onOffsetListNumbers),

        // ── Metadata Strip ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.stripAllMetadata', onStripAllMetadata),

        // ── Word Frequency ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showWordFrequency', onShowWordFrequency),

        // ── Item Editing ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.editItemContent', onEditItemContent),

        // ── Collect by Tag ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.collectItemsByTag', onCollectItemsByTag),

        // ── Table Export ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.convertSectionToTable', onConvertSectionToTable),

        // ── Move Item to Section ─────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.moveItemToSection', onMoveItemToSection),

        // ── Section Diff ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.diffTwoSections', onDiffTwoSections),

        // ── Batch Clear ──────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.clearAllPriority',  onClearAllPriority),
        vscode.commands.registerCommand('chevron-lists.clearAllDueDates',  onClearAllDueDates),

        // ── Item Count Badge ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.toggleItemCountBadge', onToggleItemCountBadge),

        // ── Paste as Section ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.pasteAsSection', onPasteAsSection),

        // ── Fold / Unfold All ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.foldAllSections',   onFoldAllSections),
        vscode.commands.registerCommand('chevron-lists.unfoldAllSections', onUnfoldAllSections),

        // ── Remove Old Items ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.removeOldItems', onRemoveOldItems),

        // ── Jump History List ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showJumpHistory', onShowJumpHistory),

        // ── Duplicate with Increment ─────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.duplicateItemAndIncrement', onDuplicateItemAndIncrement),

        // ── New Section ──────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.newSection', onNewSection),

        // ── Health Check ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.sectionHealthCheck', onSectionHealthCheck),

        // ── Completion Providers ─────────────────────────────────────────────
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronTagCompletionProvider(),
            '#'
        ),
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronMentionCompletionProvider(),
            '@'
        ),
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronLinkCompletionProvider(),
            '['
        ),
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronPriorityCompletionProvider(),
            '!'
        ),
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronDateCompletionProvider(),
            '@'
        ),
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronEstimateCompletionProvider(),
            '~'
        ),
        vscode.languages.registerCompletionItemProvider(
            { language: 'markdown' },
            new ChevronRatingCompletionProvider(),
            '★'
        ),

        // ── Item Snippets ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.insertItemSnippet', onInsertItemSnippet),

        // ── Cross-File Section Links ──────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.insertFileSectionLink', onInsertFileSectionLink),

        // ── Workspace Tag Report ─────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showTagReportWorkspace', onShowTagReportWorkspace),

        // ── Colour Label Filter ──────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.filterByColourLabel', onFilterByColourLabel),

        // ── Pin Section to Top ───────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.pinSectionToTop', onPinSectionToTop),

        // ── Item Rating ──────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.setItemRating',    onSetItemRating),
        vscode.commands.registerCommand('chevron-lists.filterByRating',   onFilterByRating),

        // ── Section Timer ────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.startSectionTimer', onStartSectionTimer),
        vscode.commands.registerCommand('chevron-lists.stopSectionTimer',  onStopSectionTimer),

        // ── Section Weights ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showSectionWeights', onShowSectionWeights),

        // ── Shift Due Dates ──────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.shiftAllDueDates', onShiftAllDueDates),

        // ── Completion Streak ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showCompletionStreak', onShowCompletionStreak),

        // ── Copy Section as JSON ─────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.copySectionAsJson', onCopySectionAsJson),

        // ── Move Item to File ─────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.moveItemToFile', onMoveItemToFile),

        // ── Daily Note ───────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.openDailyNote', onOpenDailyNote),

        // ── Copy Section As (unified) ────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.copySectionAs', onCopySectionAs),

        // ── Bulk Rating ──────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.bulkSetRating', onBulkSetRating),

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

        // ── Stars ────────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.toggleStar',         onToggleStar),
        vscode.commands.registerCommand('chevron-lists.filterStarredItems', onFilterStarredItems),

        // ── Statistics Export ────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.exportStatsAsCsv',  onExportStatsAsCsv),
        vscode.commands.registerCommand('chevron-lists.exportStatsAsJson', onExportStatsAsJson),

        // ── Linked Files ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.goToLinkedFile', onGoToLinkedFile),
        vscode.languages.registerHoverProvider({ language: 'markdown' }, new ChevronFileLinkHoverProvider()),

        // ── Time Estimates ───────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showTimeEstimates', onShowTimeEstimates),

        // ── Dependencies ─────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.showDependencies', onShowDependencies),

        // ── Voting ───────────────────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.sortByVotes',  onSortByVotes),
        vscode.commands.registerCommand('chevron-lists.addVote',      onAddVote),
        vscode.commands.registerCommand('chevron-lists.removeVote',   onRemoveVote),

        // ── Section Visibility ───────────────────────────────────────────────
        vscode.commands.registerCommand('chevron-lists.hideSection',        onHideSection),
        vscode.commands.registerCommand('chevron-lists.showHiddenSections', onShowHiddenSections),

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
            if (editor) {
                const { prefix } = getConfig();
                updateDecorations(editor); updateStatusBar(editor); updateDiagnostics(editor.document);
                updateDueDateDiagnostics(editor.document, dueDateDiags, prefix);
                updateWordGoalDiagnostics(editor.document, prefix);
                updateBadgeDecorations(editor);
                updateGoalDecorations(editor);
                updateOverdueStatusBar(editor);
                updateAgeDecorations(editor);
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                const { prefix } = getConfig();
                updateDecorations(editor); updateStatusBar(editor); updateDiagnostics(editor.document);
                updateDueDateDiagnostics(editor.document, dueDateDiags, prefix);
                updateWordGoalDiagnostics(editor.document, prefix);
                updateBadgeDecorations(editor);
                updateGoalDecorations(editor);
                updateOverdueStatusBar(editor);
                updateAgeDecorations(editor);
            }
        }),
    );

    if (vscode.window.activeTextEditor) {
        const { prefix } = getConfig();
        updateDecorations(vscode.window.activeTextEditor);
        updateDiagnostics(vscode.window.activeTextEditor.document);
        updateDueDateDiagnostics(vscode.window.activeTextEditor.document, dueDateDiags, prefix);
        updateWordGoalDiagnostics(vscode.window.activeTextEditor.document, prefix);
        updateBadgeDecorations(vscode.window.activeTextEditor);
        updateGoalDecorations(vscode.window.activeTextEditor);
        updateOverdueStatusBar(vscode.window.activeTextEditor);
        updateAgeDecorations(vscode.window.activeTextEditor);
    }
    applyConfiguredPreset();
}

export function deactivate(): void {}
