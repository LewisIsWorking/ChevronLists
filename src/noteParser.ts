import type { LineReader } from './types';

/** Regex matching an inline note line: >> > Note text */
export const NOTE_RE = /^(>{2,}) > (.*)$/;

/** Parses a note line, returning the note text and its depth */
export function parseNote(text: string): { note: string; chevrons: string } | null {
    const match = text.match(NOTE_RE);
    if (!match) { return null; }
    return { chevrons: match[1], note: match[2] };
}

/** Returns the note line index immediately following the given item line, or -1 if none */
export function getNoteLineForItem(doc: LineReader, itemLine: number): number {
    if (itemLine + 1 >= doc.lineCount) { return -1; }
    const next = doc.lineAt(itemLine + 1).text;
    return parseNote(next) ? itemLine + 1 : -1;
}

/** Builds a note line string for a given chevron depth */
export function buildNoteLine(chevrons: string, text: string): string {
    return `${chevrons} > ${text}`;
}
