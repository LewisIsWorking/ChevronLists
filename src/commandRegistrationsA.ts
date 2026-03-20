/**
 * commandRegistrationsA.ts
 * Core registrations: keyboard, navigation, section, sorting, transforms, paste, rename.
 */
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
import { onRebaseListFromHere, onOffsetListNumbers }        from './listRebaseCommands';
import { onStripAllMetadata }                               from './metadataStripCommands';
import { onShowWordFrequency }                              from './wordFrequencyCommands';
import { onFixNumbering, getDiagnosticCollection }          from './diagnosticProvider';

export function registerCoreCommands(
    context: vscode.ExtensionContext
): vscode.Disposable[] {
    const r = vscode.commands.registerCommand;
    return [
        r('chevron-lists.onEnter',       onEnter),
        r('chevron-lists.onTab',         onTab),
        r('chevron-lists.onShiftTab',    onShiftTab),
        r('chevron-lists.expandSnippet', onExpandSnippet),
        r('chevron-lists.nextHeader',    onNextHeader),
        r('chevron-lists.prevHeader',    onPrevHeader),
        r('chevron-lists.selectSectionItems',          onSelectSectionItems),
        r('chevron-lists.deleteSection',               onDeleteSection),
        r('chevron-lists.duplicateSection',            onDuplicateSection),
        r('chevron-lists.moveSectionUp',               onMoveSectionUp),
        r('chevron-lists.moveSectionDown',             onMoveSectionDown),
        r('chevron-lists.copySectionAsMarkdown',       onCopySectionAsMarkdown),
        r('chevron-lists.copySectionAsPlainText',      onCopySectionAsPlainText),
        r('chevron-lists.sortItemsAZ',                 onSortItemsAZ),
        r('chevron-lists.sortItemsZA',                 onSortItemsZA),
        r('chevron-lists.renumberItems',               onRenumberItems),
        r('chevron-lists.fixNumbering',                onFixNumbering),
        r('chevron-lists.convertBulletsToNumbered',    onConvertBulletsToNumbered),
        r('chevron-lists.convertNumberedToBullets',    onConvertNumberedToBullets),
        r('chevron-lists.showWordCount',               onShowWordCount),
        r('chevron-lists.showNestingSummary',          onShowNestingSummary),
        r('chevron-lists.pasteAsBullets',              onPasteAsBullets),
        r('chevron-lists.pasteAsNumbered',             onPasteAsNumbered),
        r('chevron-lists.duplicateItem',               onDuplicateItem),
        r('chevron-lists.renameSection',               onRenameSection),
        r('chevron-lists.renameTag',                   onRenameTag),
        r('chevron-lists.renameTagWorkspace',          onRenameTagWorkspace),
        r('chevron-lists.moveItemUp',                  onMoveItemUp),
        r('chevron-lists.moveItemDown',                onMoveItemDown),
        r('chevron-lists.importTemplatesFromFile',     onImportTemplatesFromFile),
        r('chevron-lists.exportTemplatesToFile',       onExportTemplatesToFile),
        r('chevron-lists.markAllDone',                 onMarkAllDone),
        r('chevron-lists.markAllUndone',               onMarkAllUndone),
        r('chevron-lists.removeAllCheckboxes',         onRemoveAllCheckboxes),
        r('chevron-lists.uppercaseItem',               onUppercaseItem),
        r('chevron-lists.lowercaseItem',               onLowercaseItem),
        r('chevron-lists.titleCaseItem',               onTitleCaseItem),
        r('chevron-lists.strikethroughItem',           onStrikethroughItem),
        r('chevron-lists.removeStrikethrough',         onRemoveStrikethrough),
        r('chevron-lists.compareStatistics',           onCompareStatistics),
        r('chevron-lists.showWorkspaceStatistics',     onShowWorkspaceStatistics),
        r('chevron-lists.setItemColour',               onSetItemColour),
        r('chevron-lists.stripComments',               onStripComments),
        r('chevron-lists.lockSection',                 onLockSection),
        r('chevron-lists.unlockSection',               onUnlockSection),
        r('chevron-lists.toggleFlag',                  onToggleFlag),
        r('chevron-lists.filterFlaggedItems',          onFilterFlaggedItems),
        r('chevron-lists.snapshotSection',             () => onSnapshotSection(context)),
        r('chevron-lists.restoreSnapshot',             () => onRestoreSnapshot(context)),
        r('chevron-lists.listSnapshots',               () => onListSnapshots(context)),
        r('chevron-lists.sortSectionsAZ',              onSortSectionsAZ),
        r('chevron-lists.sortSectionsZA',              onSortSectionsZA),
        r('chevron-lists.filterByMentionWorkspace',    onFilterByMentionWorkspace),
        r('chevron-lists.previewItem',                 onPreviewItem),
        r('chevron-lists.moveItemToTop',               onMoveItemToTop),
        r('chevron-lists.moveItemToBottom',            onMoveItemToBottom),
        r('chevron-lists.showTagHeatmap',              onShowTagHeatmap),
        r('chevron-lists.showCompletionHeatmap',       onShowCompletionHeatmap),
        r('chevron-lists.stampItem',                   onStampItem),
        r('chevron-lists.showOldItems',                onShowOldItems),
        r('chevron-lists.insertTableOfContents',       onInsertTableOfContents),
        r('chevron-lists.setListStartNumber',          onSetListStartNumber),
        r('chevron-lists.rebaseListFromHere',          onRebaseListFromHere),
        r('chevron-lists.offsetListNumbers',           onOffsetListNumbers),
        r('chevron-lists.stripAllMetadata',            onStripAllMetadata),
        r('chevron-lists.showWordFrequency',           onShowWordFrequency),
        getDiagnosticCollection(),
    ];
}
