import { describe, it, expect } from 'bun:test';
import { getFirstItemPrefix } from '../patternsUtils';

describe('getFirstItemPrefix', () => {
    it('returns the listPrefix when type is unordered', () =>
        expect(getFirstItemPrefix('-', 'unordered')).toBe('-'));

    it('returns 1. when type is ordered', () =>
        expect(getFirstItemPrefix('-', 'ordered')).toBe('1.'));

    it('ignores listPrefix entirely when ordered', () =>
        expect(getFirstItemPrefix('*', 'ordered')).toBe('1.'));

    it('respects a custom bullet prefix when unordered', () =>
        expect(getFirstItemPrefix('*', 'unordered')).toBe('*'));

    it('returns listPrefix for any unknown type (safe default)', () =>
        expect(getFirstItemPrefix('-', 'unknown')).toBe('-'));

    it('returns listPrefix when type is empty string', () =>
        expect(getFirstItemPrefix('-', '')).toBe('-'));
});
