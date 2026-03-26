import { describe, it, expect } from 'bun:test';
import { parseEstimateToMinutes, formatTotalMinutes } from '../patterns';

describe('parseEstimateToMinutes', () => {
    it('parses hours only', () => expect(parseEstimateToMinutes('task ~2h')).toBe(120));
    it('parses minutes only', () => expect(parseEstimateToMinutes('task ~30m')).toBe(30));
    it('parses hours and minutes', () => expect(parseEstimateToMinutes('task ~1h30m')).toBe(90));
    it('returns 0 when no estimate', () => expect(parseEstimateToMinutes('plain item')).toBe(0));
    it('handles 0 hours + minutes', () => expect(parseEstimateToMinutes('~0h15m')).toBe(15));
});

describe('formatTotalMinutes', () => {
    it('formats minutes only', () => expect(formatTotalMinutes(45)).toBe('45m'));
    it('formats exact hours', () => expect(formatTotalMinutes(120)).toBe('2h'));
    it('formats hours and minutes', () => expect(formatTotalMinutes(90)).toBe('1h 30m'));
    it('formats zero', () => expect(formatTotalMinutes(0)).toBe('0m'));
    it('formats large values', () => expect(formatTotalMinutes(485)).toBe('8h 5m'));
});
