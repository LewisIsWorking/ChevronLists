import { describe, it, expect } from 'bun:test';
import { diffLines } from '../patterns';

describe('diffLines', () => {
    it('marks identical lines with leading spaces', () => {
        expect(diffLines(['same'], ['same'])[0]).toBe('  same');
    });
    it('marks removed lines with -', () => {
        expect(diffLines(['only in a'], [])[0]).toBe('- only in a');
    });
    it('marks added lines with +', () => {
        expect(diffLines([], ['only in b'])[0]).toBe('+ only in b');
    });
    it('marks changed lines as - then +', () => {
        const result = diffLines(['old line'], ['new line']);
        expect(result[0]).toBe('- old line');
        expect(result[1]).toBe('+ new line');
    });
    it('returns empty for identical arrays', () => {
        const result = diffLines(['a', 'b'], ['a', 'b']);
        expect(result.every(l => l.startsWith('  '))).toBe(true);
    });
    it('handles arrays of different lengths', () => {
        const result = diffLines(['a', 'b', 'c'], ['a']);
        expect(result).toHaveLength(3);
        expect(result[1]).toBe('- b');
        expect(result[2]).toBe('- c');
    });
});
