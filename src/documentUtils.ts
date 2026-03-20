import type { LineReader, SectionRange } from './types';
import { isHeader, parseNumbered } from './patterns';

/**
 * Scans backwards from lineIndex to find the previous numbered item at the
 * same chevron depth. Returns 0 if none found (so the first item becomes 1).
 */
export function prevNumberAtDepth(
    doc: LineReader,
    lineIndex: number,
    chevrons: string
): number {
    for (let i = lineIndex - 1; i >= 0; i--) {
        const text  = doc.lineAt(i).text;
        const match = parseNumbered(text);
        if (match && match.chevrons === chevrons) { return match.num; }
        if (isHeader(text)) { break; }
    }
    return 0;
}

/**
 * Returns the inclusive [startLine, endLine] range for the chevron section
 * whose header is at headerLine. Ends just before the next header or EOF.
 */
export function getSectionRange(doc: LineReader, headerLine: number): SectionRange {
    let end = headerLine;
    for (let i = headerLine + 1; i < doc.lineCount; i++) {
        if (isHeader(doc.lineAt(i).text)) { break; }
        end = i;
    }
    return [headerLine, end];
}

/**
 * Finds the nearest header at or above fromLine.
 * Returns -1 if no header is found.
 */
export function findHeaderAbove(doc: LineReader, fromLine: number): number {
    for (let i = fromLine; i >= 0; i--) {
        if (isHeader(doc.lineAt(i).text)) { return i; }
    }
    return -1;
}

/**
 * Finds the next header strictly below fromLine.
 * Returns -1 if no header is found.
 */
export function findHeaderBelow(doc: LineReader, fromLine: number): number {
    for (let i = fromLine + 1; i < doc.lineCount; i++) {
        if (isHeader(doc.lineAt(i).text)) { return i; }
    }
    return -1;
}
