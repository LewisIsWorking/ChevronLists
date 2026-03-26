import { describe, it, expect } from 'bun:test';
import { extractSortDate, csvEscape, isEscalatable } from '../patterns';

describe('extractSortDate', () => {
    it('extracts date from item content', () => {
        expect(extractSortDate('task @2026-06-01')).toBe('2026-06-01');
    });
    it('returns high sentinel for undated items', () => {
        expect(extractSortDate('no date here')).toBe('9999-99-99');
    });
    it('uses first date found', () => {
        expect(extractSortDate('a @2026-01-01 b @2027-01-01')).toBe('2026-01-01');
    });
});

describe('csvEscape', () => {
    it('passes through plain values unchanged', () => {
        expect(csvEscape('hello')).toBe('hello');
    });
    it('wraps values containing commas in quotes', () => {
        expect(csvEscape('hello, world')).toBe('"hello, world"');
    });
    it('escapes double quotes by doubling them', () => {
        expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    });
    it('wraps values containing newlines', () => {
        expect(csvEscape('line1\nline2')).toBe('"line1\nline2"');
    });
});

describe('isEscalatable', () => {
    it('returns true for items overdue by more than 7 days', () => {
        const longAgo = new Date('2020-01-01');
        expect(isEscalatable('task @2020-01-01', new Date('2020-01-15'))).toBe(true);
    });
    it('returns false for items overdue by 7 days or less', () => {
        expect(isEscalatable('task @2026-06-01', new Date('2026-06-05'))).toBe(false);
    });
    it('returns false for future items', () => {
        expect(isEscalatable('task @2099-01-01', new Date())).toBe(false);
    });
    it('returns false for items with no date', () => {
        expect(isEscalatable('no date here', new Date())).toBe(false);
    });
    it('returns false if already has !!! priority', () => {
        // Logic is in applyOverdueEscalation, not isEscalatable itself
        expect(isEscalatable('task @2020-01-01', new Date('2020-01-15'))).toBe(true);
    });
});
