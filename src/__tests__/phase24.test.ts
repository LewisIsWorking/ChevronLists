import { describe, it, expect } from 'bun:test';
import { checkLinesHealth } from '../patterns';
import { stripAllMetadata } from '../metadataStripper';
import { extractTags } from '../tagParser';

function lines(texts: string[]) {
    return texts.map((text, index) => ({ text, index }));
}
const check = (texts: string[]) => checkLinesHealth(lines(texts), '-', stripAllMetadata, extractTags);

describe('checkLinesHealth', () => {
    it('returns no issues for healthy items', () => {
        expect(check(['>> - healthy item', '>> - another item'])).toHaveLength(0);
    });
    it('flags an item with no content after stripping metadata', () => {
        expect(check(['>> - #urgent']).some(i => i.kind === 'empty-content')).toBe(true);
    });
    it('flags a very long item', () => {
        const long = 'a'.repeat(201);
        expect(check([`>> - ${long}`]).some(i => i.kind === 'too-long')).toBe(true);
    });
    it('does not flag a 200-char item', () => {
        const exact = 'a'.repeat(200);
        expect(check([`>> - ${exact}`]).some(i => i.kind === 'too-long')).toBe(false);
    });
    it('flags duplicate item content', () => {
        expect(check(['>> - same item', '>> - same item']).some(i => i.kind === 'duplicate')).toBe(true);
    });
    it('duplicate check is case-insensitive', () => {
        expect(check(['>> - Same Item', '>> - same item']).some(i => i.kind === 'duplicate')).toBe(true);
    });
    it('ignores non-chevron lines', () => {
        expect(check(['> Header', 'plain line'])).toHaveLength(0);
    });
    it('reports correct line index for duplicate', () => {
        const dup = check(['>> - item', '>> - other', '>> - item']).find(i => i.kind === 'duplicate');
        expect(dup?.line).toBe(2);
    });
});
