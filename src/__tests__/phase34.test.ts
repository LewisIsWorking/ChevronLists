import { describe, it, expect } from 'bun:test';
import { groupLinesByTag } from '../patterns';
import { extractTags } from '../tagParser';

const group = (lines: string[]) => groupLinesByTag(lines, '-', extractTags);

describe('groupLinesByTag', () => {
    it('groups items by their primary tag', () => {
        const groups = group(['>> - item A #alpha', '>> - item B #beta', '>> - item C #alpha']);
        expect(groups.find(g => g.tag === 'alpha')?.lines).toHaveLength(2);
        expect(groups.find(g => g.tag === 'beta')?.lines).toHaveLength(1);
    });
    it('places untagged items in a group with empty tag', () => {
        const groups = group(['>> - has tag #a', '>> - no tag here']);
        expect(groups.find(g => g.tag === '')?.lines).toHaveLength(1);
    });
    it('uses only the first tag as primary', () => {
        const groups = group(['>> - item #beta #alpha']);
        expect(groups.find(g => g.tag === 'beta')).toBeDefined();
        expect(groups.find(g => g.tag === 'alpha')).toBeUndefined();
    });
    it('returns empty array for empty input', () => {
        expect(group([])).toHaveLength(0);
    });
    it('non-chevron lines go to untagged group', () => {
        const groups = group(['> Header', '>> - item #a']);
        expect(groups.find(g => g.tag === '')?.lines[0]).toBe('> Header');
    });
    it('preserves order within groups', () => {
        const groups = group(['>> - first #a', '>> - second #b', '>> - third #a']);
        const aGroup = groups.find(g => g.tag === 'a')!;
        expect(aGroup.lines[0]).toContain('first');
        expect(aGroup.lines[1]).toContain('third');
    });
});
