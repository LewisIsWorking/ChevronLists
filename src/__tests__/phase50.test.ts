import { describe, it, expect } from 'bun:test';
import { rankWordFrequency } from '../patterns';

describe('rankWordFrequency', () => {
    it('counts word occurrences', () => {
        const freq = rankWordFrequency(['apple', 'banana', 'apple', 'cherry', 'apple']);
        expect(freq[0]).toEqual(['apple', 3]);
    });
    it('filters stop words', () => {
        const freq = rankWordFrequency(['the', 'and', 'task', 'the']);
        expect(freq.find(([w]) => w === 'the')).toBeUndefined();
        expect(freq.find(([w]) => w === 'task')).toBeDefined();
    });
    it('filters words shorter than 3 chars', () => {
        const freq = rankWordFrequency(['do', 'go', 'task']);
        expect(freq.find(([w]) => w === 'do')).toBeUndefined();
        expect(freq.find(([w]) => w === 'task')).toBeDefined();
    });
    it('sorts by frequency descending', () => {
        const freq = rankWordFrequency(['rare', 'common', 'common', 'common', 'rare']);
        expect(freq[0][0]).toBe('common');
        expect(freq[1][0]).toBe('rare');
    });
    it('returns empty array for empty input', () => {
        expect(rankWordFrequency([])).toHaveLength(0);
    });
    it('returns empty for all stop words', () => {
        expect(rankWordFrequency(['the', 'and', 'is', 'as'])).toHaveLength(0);
    });
});
