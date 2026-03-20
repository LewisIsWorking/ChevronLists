import { describe, it, expect } from 'bun:test';
import { replaceDate, stripDate, markDone } from '../patterns';

describe('replaceDate', () => {
    it('replaces an existing date', () => {
        expect(replaceDate('task @2026-01-01', '2026-03-20')).toBe('task @2026-03-20');
    });
    it('returns unchanged when no date present', () => {
        expect(replaceDate('plain task', '2026-03-20')).toBe('plain task');
    });
});

describe('stripDate', () => {
    it('removes @YYYY-MM-DD', () => {
        expect(stripDate('task @2026-01-01')).toBe('task');
    });
    it('returns unchanged when no date', () => {
        expect(stripDate('plain')).toBe('plain');
    });
});

describe('markDone', () => {
    it('replaces [ ] with [x]', () => {
        expect(markDone('[ ] task')).toBe('[x] task');
    });
    it('leaves [x] unchanged', () => {
        expect(markDone('[x] task')).toBe('[x] task');
    });
    it('prepends [x] to unmarked content', () => {
        expect(markDone('plain task')).toBe('[x] plain task');
    });
});
