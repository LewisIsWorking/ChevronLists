/**
 * commandRegistrationsD.ts
 * Phase 40+ commands — split from commandRegistrationsC.ts to stay under 200 lines.
 * Exported and spread into registerPhase12to32Commands() in commandRegistrationsC.ts.
 */
import * as vscode from 'vscode';
import { onTodayView }                                    from './todayViewCommands';
import { onShowKanban }                                   from './kanbanCommands';
import { onExportToObsidian }                             from './obsidianExportCommands';
import { onStartItemTimer, onStopItemTimer }              from './itemTimerCommands';
import { onStartFocusTimer, onStopFocusTimer }            from './focusTimerCommands';
import { onMarkAllDoneSection, onMarkAllUndoneSection }   from './bulkCheckboxCommands';
import { onSnapshotItem, onDiffItemWithSnapshot }         from './itemSnapshotCommands';
import { onSmartPaste }                                   from './smartPasteCommands';
import { onShowReadingTime }                              from './readingTimeCommands';
import { onShowTagStats }                                 from './tagStatsCommands';
import { onToggleDoneAllCursors, onSetPriorityAllCursors } from './multiCursorCommands';
import { onShowItemComplexity }                            from './itemComplexityCommands';
import { onFreezeSection, onUnfreezeSection }             from './sectionFreezeCommands';
import { onEvaluateExpression }                           from './expressionCommands';
import { onShowArchive }                                  from './archiveViewCommands';
import { onBatchReplaceText }                             from './batchReplaceCommands';
import { onShowMentionsReport }                           from './mentionsReportCommands';
import { onSortByDueDate }                                from './sortByDateCommands';
import { onCopySectionAsCsvRow }                          from './csvRowCommands';
import { onWrapItemText }                                 from './wrapItemCommands';

export function registerPhase40Commands(): vscode.Disposable[] {
    const r = vscode.commands.registerCommand;
    return [
        r('chevron-lists.todayView',                        onTodayView),
        r('chevron-lists.showKanban',                       onShowKanban),
        r('chevron-lists.exportToObsidian',                 onExportToObsidian),
        r('chevron-lists.startItemTimer',                   onStartItemTimer),
        r('chevron-lists.stopItemTimer',                    onStopItemTimer),
        r('chevron-lists.startFocusTimer',                  onStartFocusTimer),
        r('chevron-lists.stopFocusTimer',                   onStopFocusTimer),
        r('chevron-lists.markAllDoneSection',               onMarkAllDoneSection),
        r('chevron-lists.markAllUndoneSection',             onMarkAllUndoneSection),
        r('chevron-lists.snapshotItem',                     onSnapshotItem),
        r('chevron-lists.diffItemWithSnapshot',             onDiffItemWithSnapshot),
        r('chevron-lists.smartPaste',                       onSmartPaste),
        r('chevron-lists.showReadingTime',                  onShowReadingTime),
        r('chevron-lists.showTagStats',                     onShowTagStats),
        r('chevron-lists.toggleDoneAllCursors',             onToggleDoneAllCursors),
        r('chevron-lists.setPriorityAllCursors',            onSetPriorityAllCursors),
        r('chevron-lists.showItemComplexity',               onShowItemComplexity),
        r('chevron-lists.freezeSection',                    onFreezeSection),
        r('chevron-lists.unfreezeSection',                  onUnfreezeSection),
        r('chevron-lists.evaluateExpression',               onEvaluateExpression),
        r('chevron-lists.showArchive',                      onShowArchive),
        r('chevron-lists.batchReplaceText',                 onBatchReplaceText),
        r('chevron-lists.showMentionsReport',               onShowMentionsReport),
        r('chevron-lists.sortByDueDate',                    onSortByDueDate),
        r('chevron-lists.copySectionAsCsvRow',              onCopySectionAsCsvRow),
        r('chevron-lists.wrapItemText',                     onWrapItemText),
    ];
}
