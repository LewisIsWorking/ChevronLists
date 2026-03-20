import { describe, it, expect } from 'bun:test';
import { parseRating, setRating, removeRating, collectRatedItems } from '../ratingParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseRating', () => {
    it('parses ★3', () => expect(parseRating('★3 good idea')).toBe(3));
    it('parses ★5', () => expect(parseRating('★5 excellent')).toBe(5));
    it('parses ★1', () => expect(parseRating('★1 poor')).toBe(1));
    it('returns null for no rating', () => expect(parseRating('plain item')).toBeNull());
    it('returns null for out-of-range', () => expect(parseRating('★6 invalid')).toBeNull());
});

describe('setRating', () => {
    it('adds a rating to plain content', () => {
        expect(setRating('my idea', 4)).toBe('★4 my idea');
    });
    it('replaces an existing rating', () => {
        expect(setRating('★2 my idea', 5)).toBe('★5 my idea');
    });
});

describe('removeRating', () => {
    it('removes a rating', () => {
        expect(removeRating('★3 my idea')).toBe('my idea');
    });
    it('returns unchanged for no rating', () => {
        expect(removeRating('plain')).toBe('plain');
    });
});

describe('collectRatedItems', () => {
    it('returns empty for no rated items', () => {
        const doc = makeDoc(['> H', '>> - plain item']);
        expect(collectRatedItems(doc, '-')).toHaveLength(0);
    });
    it('collects rated items sorted by rating descending', () => {
        const doc   = makeDoc(['> H', '>> - ★2 ok', '>> - ★5 great', '>> - ★1 poor']);
        const items = collectRatedItems(doc, '-');
        expect(items[0].rating).toBe(5);
        expect(items[1].rating).toBe(2);
        expect(items[2].rating).toBe(1);
    });
    it('strips rating from content', () => {
        const doc = makeDoc(['> H', '>> - ★4 my idea']);
        expect(collectRatedItems(doc, '-')[0].content).toBe('my idea');
    });
    it('records correct section', () => {
        const doc   = makeDoc(['> Ideas', '>> - ★3 a thought']);
        const items = collectRatedItems(doc, '-');
        expect(items[0].section).toBe('Ideas');
    });
});
