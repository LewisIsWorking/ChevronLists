import { describe, it, expect } from 'bun:test';
import { prevNumberAtDepth } from '../documentUtils';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('prevNumberAtDepth (code action expected number)', () => {
    it('returns 0 when no prior item at depth (first item → expected 1)', () => {
        const doc = makeDoc(['> Header', '>> 5. jumped']);
        expect(prevNumberAtDepth(doc, 1, '>>')).toBe(0);
    });
    it('returns the previous number at the same depth', () => {
        const doc = makeDoc(['> Header', '>> 1. first', '>> 5. jumped']);
        expect(prevNumberAtDepth(doc, 2, '>>')).toBe(1);
    });
    it('does not cross section headers', () => {
        const doc = makeDoc(['> A', '>> 3. last', '> B', '>> 99. jumped']);
        expect(prevNumberAtDepth(doc, 3, '>>')).toBe(0);
    });
    it('handles nested depths independently', () => {
        const doc = makeDoc(['> H', '>> 1. top', '>>> 1. nested', '>> 10. jumped']);
        expect(prevNumberAtDepth(doc, 3, '>>')).toBe(1);
        expect(prevNumberAtDepth(doc, 2, '>>>')).toBe(0);
    });
});
