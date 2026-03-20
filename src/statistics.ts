import * as vscode from 'vscode';
import { getConfig } from './config';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { getSectionRange } from './documentUtils';

/** Statistics for a single chevron section */
export interface SectionStats {
    name:      string;
    itemCount: number;
    wordCount: number;
    lineIndex: number;
}

/** Aggregated statistics for an entire document */
export interface FileStats {
    totalSections: number;
    totalItems:    number;
    totalWords:    number;
    avgItems:      number;
    mostPopulated: SectionStats | null;
    leastPopulated: SectionStats | null;
    sections:      SectionStats[];
}

/** Computes statistics for all chevron sections in a document */
export function computeFileStats(
    doc: vscode.TextDocument | { lineCount: number; lineAt: (i: number) => { text: string } },
    prefix: string
): FileStats {
    const sections: SectionStats[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (!isHeader(text)) { continue; }

        const name      = text.replace(/^> /, '');
        const [, end]   = getSectionRange(doc as vscode.TextDocument, i);
        let itemCount   = 0;
        let wordCount   = 0;

        for (let j = i + 1; j <= end; j++) {
            const line    = doc.lineAt(j).text;
            const bullet  = parseBullet(line, prefix);
            const numbered = parseNumbered(line);
            if (bullet) {
                itemCount++;
                wordCount += bullet.content.trim().split(/\s+/).filter(Boolean).length;
            } else if (numbered) {
                itemCount++;
                wordCount += numbered.content.trim().split(/\s+/).filter(Boolean).length;
            }
        }
        sections.push({ name, itemCount, wordCount, lineIndex: i });
    }

    const totalSections = sections.length;
    const totalItems    = sections.reduce((s, c) => s + c.itemCount, 0);
    const totalWords    = sections.reduce((s, c) => s + c.wordCount, 0);
    const avgItems      = totalSections > 0 ? totalItems / totalSections : 0;
    const sorted        = [...sections].sort((a, b) => b.itemCount - a.itemCount);

    return {
        totalSections,
        totalItems,
        totalWords,
        avgItems,
        mostPopulated:  sorted[0]  ?? null,
        leastPopulated: sorted[sorted.length - 1] ?? null,
        sections,
    };
}
