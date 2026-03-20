import { describe, it, expect } from 'bun:test';
import { computeFileStats } from '../statistics';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('computeFileStats', () => {
    it('returns zero stats for an empty file', () => {
        const stats = computeFileStats(makeDoc([]) as any, '-');
        expect(stats.totalSections).toBe(0);
        expect(stats.totalItems).toBe(0);
        expect(stats.mostPopulated).toBeNull();
    });

    it('counts sections and items correctly', () => {
        const doc = makeDoc(['> A', '>> - a1', '>> - a2', '> B', '>> - b1']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.totalSections).toBe(2);
        expect(stats.totalItems).toBe(3);
    });

    it('counts words in item content', () => {
        const doc = makeDoc(['> Header', '>> - one two three']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.totalWords).toBe(3);
    });

    it('counts numbered items', () => {
        const doc = makeDoc(['> Header', '>> 1. first item', '>> 2. second item']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.totalItems).toBe(2);
        expect(stats.totalWords).toBe(4);
    });

    it('calculates avgItems correctly', () => {
        const doc = makeDoc(['> A', '>> - a1', '>> - a2', '> B', '>> - b1']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.avgItems).toBe(1.5);
    });

    it('identifies the most populated section', () => {
        const doc = makeDoc(['> A', '>> - a1', '> B', '>> - b1', '>> - b2', '>> - b3']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.mostPopulated?.name).toBe('B');
        expect(stats.mostPopulated?.itemCount).toBe(3);
    });

    it('identifies the least populated section', () => {
        const doc = makeDoc(['> A', '>> - a1', '> B', '>> - b1', '>> - b2']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.leastPopulated?.name).toBe('A');
        expect(stats.leastPopulated?.itemCount).toBe(1);
    });

    it('stores correct line index for each section', () => {
        const doc = makeDoc(['plain', '> Header', '>> - item']);
        const stats = computeFileStats(doc as any, '-');
        expect(stats.sections[0].lineIndex).toBe(1);
    });

    it('works with custom prefix', () => {
        const doc = makeDoc(['> Header', '>> * item one', '>> * item two']);
        const stats = computeFileStats(doc as any, '*');
        expect(stats.totalItems).toBe(2);
    });
});
