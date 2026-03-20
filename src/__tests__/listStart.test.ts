import { describe, it, expect } from 'bun:test';
import { parseNumbered } from '../patterns';

// Mirror the defaultN logic from listStartCommands
function inferDefault(lineText: string): number {
    const existing = parseNumbered(lineText);
    return existing ? existing.num + 1 : 1;
}

describe('inferDefault for set list start number', () => {
    it('suggests 1 for a non-numbered line', () => {
        expect(inferDefault('>> - bullet')).toBe(1);
    });
    it('suggests current + 1 for a numbered line', () => {
        expect(inferDefault('>> 49. Test49')).toBe(50);
    });
    it('suggests 1 for a header line', () => {
        expect(inferDefault('> Header')).toBe(1);
    });
    it('suggests next number for deep nesting', () => {
        expect(inferDefault('>>> 7. nested')).toBe(8);
    });
});
