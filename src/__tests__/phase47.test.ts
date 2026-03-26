import { describe, it, expect } from 'bun:test';
import { collectSectionCounts } from '../patterns';

const lines = (texts: string[]) => texts.map(text => ({ text }));

describe('collectSectionCounts', () => {
    it('counts items per section', () => {
        const counts = collectSectionCounts(lines([
            '> Section A', '>> - item 1', '>> - item 2',
            '> Section B', '>> - item 1',
        ]), '-');
        expect(counts.find(s => s.name === 'Section A')?.count).toBe(2);
        expect(counts.find(s => s.name === 'Section B')?.count).toBe(1);
    });
    it('sorts by count descending', () => {
        const counts = collectSectionCounts(lines([
            '> Small', '>> - a',
            '> Big', '>> - b', '>> - c', '>> - d',
        ]), '-');
        expect(counts[0].name).toBe('Big');
    });
    it('ignores non-item lines', () => {
        const counts = collectSectionCounts(lines(['> S', 'plain text', '>> - item']), '-');
        expect(counts[0].count).toBe(1);
    });
    it('returns empty for no sections', () => {
        expect(collectSectionCounts(lines([]), '-')).toHaveLength(0);
    });
    it('strips ==N goal markers from section names', () => {
        const counts = collectSectionCounts(lines(['> My Section ==500', '>> - item']), '-');
        expect(counts[0].name).toBe('My Section');
    });
    it('counts numbered items too', () => {
        const counts = collectSectionCounts(lines(['> S', '>> 1. first', '>> 2. second']), '-');
        expect(counts[0].count).toBe(2);
    });
});
