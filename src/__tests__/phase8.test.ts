import { describe, it, expect } from 'bun:test';
import { parseBookmark, collectBookmarks } from '../bookmarkParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseBookmark', () => {
    it('parses a bookmark line', () => {
        expect(parseBookmark('>> [bookmark:Chapter Start]')).toBe('Chapter Start');
    });
    it('trims whitespace from name', () => {
        expect(parseBookmark('>>  [bookmark:  Padded  ]')).toBe('Padded');
    });
    it('returns null for a regular item', () => {
        expect(parseBookmark('>> - plain item')).toBeNull();
    });
    it('returns null for a header', () => {
        expect(parseBookmark('> Header')).toBeNull();
    });
    it('returns null for plain text', () => {
        expect(parseBookmark('just text')).toBeNull();
    });
});

describe('collectBookmarks', () => {
    it('returns empty array for a file with no bookmarks', () => {
        const doc = makeDoc(['> Header', '>> - item']);
        expect(collectBookmarks(doc)).toHaveLength(0);
    });
    it('collects a single bookmark with correct line index', () => {
        const doc = makeDoc(['> Header', '>> [bookmark:My Mark]', '>> - item']);
        const bookmarks = collectBookmarks(doc);
        expect(bookmarks).toHaveLength(1);
        expect(bookmarks[0].name).toBe('My Mark');
        expect(bookmarks[0].line).toBe(1);
    });
    it('collects multiple bookmarks', () => {
        const doc = makeDoc(['>> [bookmark:First]', '>> - item', '>> [bookmark:Second]']);
        const bookmarks = collectBookmarks(doc);
        expect(bookmarks).toHaveLength(2);
        expect(bookmarks[0].name).toBe('First');
        expect(bookmarks[1].name).toBe('Second');
    });
});
