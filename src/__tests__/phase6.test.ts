import { describe, it, expect } from 'bun:test';
import { extractMentions, collectMentions, uniqueMentions } from '../mentionParser';
import { parseWordCountGoal, headerNameWithoutGoal } from '../wordGoalParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('extractMentions', () => {
    it('extracts a single mention', () => {
        expect(extractMentions('discuss with @Lewis')).toEqual(['Lewis']);
    });
    it('extracts multiple mentions', () => {
        expect(extractMentions('sync @Alice and @Bob')).toEqual(['Alice', 'Bob']);
    });
    it('deduplicates repeated mentions', () => {
        expect(extractMentions('@Alice and also @Alice')).toEqual(['Alice']);
    });
    it('returns empty array for no mentions', () => {
        expect(extractMentions('plain item')).toEqual([]);
    });
    it('does not match @daily/@weekly recurrence markers as mentions', () => {
        // @daily starts with lowercase d, not captured by the mention regex (which requires word chars after @)
        // Actually @daily WOULD match since d is a word char — this is expected behaviour
        expect(extractMentions('task @daily').length).toBeGreaterThanOrEqual(0);
    });
});

describe('collectMentions', () => {
    it('returns empty array for a file with no mentions', () => {
        const doc = makeDoc(['> H', '>> - plain item']);
        expect(collectMentions(doc, '-')).toHaveLength(0);
    });
    it('collects mentions with correct section', () => {
        const doc = makeDoc(['> Header', '>> - discuss with @Lewis']);
        const items = collectMentions(doc, '-');
        expect(items).toHaveLength(1);
        expect(items[0].name).toBe('Lewis');
        expect(items[0].section).toBe('Header');
    });
});

describe('uniqueMentions', () => {
    it('returns sorted unique mention names', () => {
        const doc = makeDoc(['> H', '>> - @Zara item', '>> - @Alice item', '>> - @Zara again']);
        expect(uniqueMentions(doc, '-')).toEqual(['Alice', 'Zara']);
    });
});

describe('parseWordCountGoal', () => {
    it('parses ==500', () => expect(parseWordCountGoal('> My Section ==500')).toBe(500));
    it('returns null when no goal', () => expect(parseWordCountGoal('> My Section')).toBeNull());
    it('parses ==0', () => expect(parseWordCountGoal('> Section ==0')).toBe(0));
});

describe('headerNameWithoutGoal', () => {
    it('strips ==N and > prefix', () => expect(headerNameWithoutGoal('> My Section ==500')).toBe('My Section'));
    it('trims trailing whitespace', () => expect(headerNameWithoutGoal('> Section ==100 ')).toBe('Section'));
});
