import { describe, it, expect } from 'bun:test';
import { collectMentionStats } from '../patterns';

const lines = (texts: string[]) => texts.map(text => ({ text }));

describe('collectMentionStats', () => {
    it('counts mentions per person', () => {
        const stats = collectMentionStats(lines(['>> - item @Alice', '>> - item @Alice', '>> - item @Bob']), '-');
        expect(stats.find(s => s.name === 'Alice')?.total).toBe(2);
        expect(stats.find(s => s.name === 'Bob')?.total).toBe(1);
    });
    it('counts done items per mention', () => {
        const stats = collectMentionStats(lines(['>> - [x] done @Alice', '>> - [ ] todo @Alice']), '-');
        const alice = stats.find(s => s.name === 'Alice')!;
        expect(alice.total).toBe(2);
        expect(alice.done).toBe(1);
    });
    it('ignores date-style @YYYY-MM-DD as mention', () => {
        const stats = collectMentionStats(lines(['>> - item @2026-06-01']), '-');
        expect(stats).toHaveLength(0);
    });
    it('ignores lowercase @mentions', () => {
        const stats = collectMentionStats(lines(['>> - item @alice']), '-');
        expect(stats).toHaveLength(0);
    });
    it('returns empty for no mentions', () => {
        expect(collectMentionStats(lines(['>> - no mentions here']), '-')).toHaveLength(0);
    });
    it('sorts by total descending', () => {
        const stats = collectMentionStats(lines([
            '>> - a @Rare',
            '>> - b @Common', '>> - c @Common', '>> - d @Common',
        ]), '-');
        expect(stats[0].name).toBe('Common');
    });
});
