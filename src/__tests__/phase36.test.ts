import { describe, it, expect } from 'bun:test';
import { countWordFrequency, levenshtein, similarity, parseNaturalDate } from '../patterns';

const BASE = new Date(2026, 2, 20); // Friday March 20 2026

describe('countWordFrequency', () => {
    it('counts words correctly', () => {
        const freq = countWordFrequency(['hello world hello']);
        expect(freq.get('hello')).toBe(2);
        expect(freq.get('world')).toBe(1);
    });
    it('excludes stop words', () => {
        const freq = countWordFrequency(['the quick fox']);
        expect(freq.has('the')).toBe(false);
    });
    it('excludes words under 3 chars', () => {
        const freq = countWordFrequency(['go do it']);
        expect(freq.size).toBe(0);
    });
    it('is case-insensitive', () => {
        const freq = countWordFrequency(['Apple apple APPLE']);
        expect(freq.get('apple')).toBe(3);
    });
});

describe('levenshtein', () => {
    it('returns 0 for identical strings', () => expect(levenshtein('abc', 'abc')).toBe(0));
    it('returns 1 for single substitution', () => expect(levenshtein('abc', 'axc')).toBe(1));
    it('returns 1 for single insertion', () => expect(levenshtein('abc', 'abcd')).toBe(1));
    it('returns 1 for single deletion', () => expect(levenshtein('abcd', 'abc')).toBe(1));
    it('handles empty strings', () => expect(levenshtein('', 'abc')).toBe(3));
});

describe('similarity', () => {
    it('returns 1 for identical strings', () => expect(similarity('abc', 'abc')).toBe(1));
    it('returns high score for similar strings', () => expect(similarity('Act One', 'Act 1')).toBeGreaterThan(0.5));
    it('returns low score for very different strings', () => expect(similarity('hello', 'xyz')).toBeLessThan(0.5));
});

describe('parseNaturalDate', () => {
    it('parses ISO dates', () => expect(parseNaturalDate('2026-12-31', BASE)).toBe('2026-12-31'));
    it('parses today', () => expect(parseNaturalDate('today', BASE)).toBe('2026-03-20'));
    it('parses tomorrow', () => expect(parseNaturalDate('tomorrow', BASE)).toBe('2026-03-21'));
    it('parses next week', () => expect(parseNaturalDate('next week', BASE)).toBe('2026-03-27'));
    it('parses +N relative days', () => expect(parseNaturalDate('+3', BASE)).toBe('2026-03-23'));
    it('parses weekday names', () => expect(parseNaturalDate('monday', BASE)).toBe('2026-03-23'));
    it('returns null for unrecognised input', () => expect(parseNaturalDate('blurgh', BASE)).toBeNull());
});
