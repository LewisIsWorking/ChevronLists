import { describe, it, expect } from 'bun:test';
import {
    prevNumberAtDepth,
    getSectionRange,
    findHeaderAbove,
    findHeaderBelow,
} from '../documentUtils';
import type { LineReader } from '../types';

/** Builds a LineReader from an array of strings */
function makeDoc(lines: string[]): LineReader {
    return {
        lineCount: lines.length,
        lineAt: (i: number) => ({ text: lines[i] }),
    };
}

describe('prevNumberAtDepth', () => {
    it('returns 0 when no previous numbered item exists', () => {
        const doc = makeDoc(['> Header', '>> 1. first']);
        expect(prevNumberAtDepth(doc, 1, '>>')).toBe(0);
    });
    it('returns the most recent number at the same depth', () => {
        const doc = makeDoc(['> Header', '>> 1. a', '>> 2. b', '>> 3. c']);
        expect(prevNumberAtDepth(doc, 3, '>>')).toBe(2);
    });
    it('ignores items at a different depth', () => {
        const doc = makeDoc(['> Header', '>> 1. a', '>>> 1. nested', '>>> 2. nested']);
        expect(prevNumberAtDepth(doc, 3, '>>>')).toBe(1);
    });
    it('stops searching at a header line', () => {
        const doc = makeDoc(['> Header1', '>> 5. a', '> Header2', '>> 1. b']);
        expect(prevNumberAtDepth(doc, 3, '>>')).toBe(0);
    });
});

describe('getSectionRange', () => {
    it('returns just the header line when section has no items', () => {
        const doc = makeDoc(['> Header']);
        expect(getSectionRange(doc, 0)).toEqual([0, 0]);
    });
    it('returns the full range up to the next header', () => {
        const doc = makeDoc(['> A', '>> - one', '>> - two', '> B', '>> - three']);
        expect(getSectionRange(doc, 0)).toEqual([0, 2]);
    });
    it('returns range to end of file when no next header', () => {
        const doc = makeDoc(['> A', '>> - one', '>> - two']);
        expect(getSectionRange(doc, 0)).toEqual([0, 2]);
    });
    it('works for a middle section', () => {
        const doc = makeDoc(['> A', '>> - one', '> B', '>> - two', '>> - three', '> C']);
        expect(getSectionRange(doc, 2)).toEqual([2, 4]);
    });
});

describe('findHeaderAbove', () => {
    it('finds a header on the same line', () => {
        const doc = makeDoc(['> Header', '>> - item']);
        expect(findHeaderAbove(doc, 0)).toBe(0);
    });
    it('finds the nearest header above the cursor', () => {
        const doc = makeDoc(['> Header', '>> - item', '>> - item2']);
        expect(findHeaderAbove(doc, 2)).toBe(0);
    });
    it('returns -1 when no header exists above', () => {
        const doc = makeDoc(['>> - item', '>> - item2']);
        expect(findHeaderAbove(doc, 1)).toBe(-1);
    });
    it('finds the closest of multiple headers', () => {
        const doc = makeDoc(['> A', '>> - a', '> B', '>> - b']);
        expect(findHeaderAbove(doc, 3)).toBe(2);
    });
});

describe('findHeaderBelow', () => {
    it('finds the next header strictly below the cursor', () => {
        const doc = makeDoc(['> Header', '>> - item', '> Next']);
        expect(findHeaderBelow(doc, 0)).toBe(2);
    });
    it('returns -1 when no header exists below', () => {
        const doc = makeDoc(['> Header', '>> - item']);
        expect(findHeaderBelow(doc, 0)).toBe(-1);
    });
    it('does not return the header on the cursor line', () => {
        const doc = makeDoc(['> Header', '>> - item', '> Next']);
        expect(findHeaderBelow(doc, 2)).toBe(-1);
    });
    it('skips non-header lines between sections', () => {
        const doc = makeDoc(['> A', '>> - one', '>> - two', '> B']);
        expect(findHeaderBelow(doc, 0)).toBe(3);
    });
});
