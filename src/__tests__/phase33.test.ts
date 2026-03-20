import { describe, it, expect } from 'bun:test';
import { toRichText } from '../richTextConverter';

describe('toRichText', () => {
    it('converts [x] checkbox to ✓', () => {
        expect(toRichText('[x] done task')).toBe('✓ done task');
    });
    it('converts [ ] checkbox to ☐', () => {
        expect(toRichText('[ ] todo task')).toBe('☐ todo task');
    });
    it('converts !!! to 🔴', () => {
        expect(toRichText('!!! urgent')).toBe('🔴 urgent');
    });
    it('converts !! to 🟠', () => {
        expect(toRichText('!! medium')).toBe('🟠 medium');
    });
    it('converts ! to 🟡', () => {
        expect(toRichText('! low')).toBe('🟡 low');
    });
    it('converts * star marker to ⭐', () => {
        expect(toRichText('* key task')).toBe('⭐ key task');
    });
    it('converts ? flag to ❓', () => {
        expect(toRichText('? unclear')).toBe('❓ unclear');
    });
    it('wraps strikethrough in parens', () => {
        expect(toRichText('~~cancelled~~')).toBe('(cancelled)');
    });
    it('strips colour labels', () => {
        expect(toRichText('{red} blocked item')).toBe('blocked item');
    });
    it('converts // comment to [note: ...]', () => {
        expect(toRichText('task // check first')).toBe('task [note: check first]');
    });
    it('converts due date to (due: ...)', () => {
        expect(toRichText('task @2026-04-01')).toBe('task (due: 2026-04-01)');
    });
    it('converts estimate to (~N)', () => {
        expect(toRichText('task ~2h')).toBe('task (~2h)');
    });
    it('converts votes to (+N)', () => {
        expect(toRichText('idea +5')).toBe('idea (+5)');
    });
    it('keeps tags as-is', () => {
        expect(toRichText('task #urgent')).toContain('#urgent');
    });
    it('handles plain content with no markers', () => {
        expect(toRichText('plain text')).toBe('plain text');
    });
});
