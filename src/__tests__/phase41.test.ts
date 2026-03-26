import { describe, it, expect } from 'bun:test';
import { collectTagStats } from '../patterns';

const lines = (texts: string[]) => texts.map(text => ({ text }));

describe('collectTagStats', () => {
    it('counts items per tag', () => {
        const stats = collectTagStats(lines(['>> - item #alpha', '>> - item #alpha', '>> - item #beta']), '-');
        expect(stats.find(s => s.tag === 'alpha')?.total).toBe(2);
        expect(stats.find(s => s.tag === 'beta')?.total).toBe(1);
    });
    it('counts done items per tag', () => {
        const stats = collectTagStats(lines(['>> - [x] done #alpha', '>> - [ ] todo #alpha']), '-');
        const alpha = stats.find(s => s.tag === 'alpha')!;
        expect(alpha.total).toBe(2);
        expect(alpha.done).toBe(1);
    });
    it('handles items with multiple tags', () => {
        const stats = collectTagStats(lines(['>> - item #a #b']), '-');
        expect(stats.find(s => s.tag === 'a')?.total).toBe(1);
        expect(stats.find(s => s.tag === 'b')?.total).toBe(1);
    });
    it('returns empty for no tagged items', () => {
        expect(collectTagStats(lines(['>> - no tags here']), '-')).toHaveLength(0);
    });
    it('sorts by total descending', () => {
        const stats = collectTagStats(lines([
            '>> - a #rare',
            '>> - b #common', '>> - c #common', '>> - d #common',
        ]), '-');
        expect(stats[0].tag).toBe('common');
    });
    it('returns zero done when no checkboxes', () => {
        const stats = collectTagStats(lines(['>> - item #x']), '-');
        expect(stats[0].done).toBe(0);
    });
});
