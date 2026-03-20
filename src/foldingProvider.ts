import * as vscode from 'vscode';
import { HEADER_RE } from './patterns';

/** Provides fold ranges for each chevron section (header to next header) */
export class ChevronFoldingProvider implements vscode.FoldingRangeProvider {
    provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
        const ranges: vscode.FoldingRange[] = [];
        let sectionStart = -1;

        for (let i = 0; i < document.lineCount; i++) {
            if (HEADER_RE.test(document.lineAt(i).text)) {
                if (sectionStart >= 0 && i - 1 > sectionStart) {
                    ranges.push(new vscode.FoldingRange(sectionStart, i - 1));
                }
                sectionStart = i;
            }
        }
        if (sectionStart >= 0 && document.lineCount - 1 > sectionStart) {
            ranges.push(new vscode.FoldingRange(sectionStart, document.lineCount - 1));
        }
        return ranges;
    }
}
