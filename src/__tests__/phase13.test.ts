import { describe, it, expect } from 'bun:test';
import { renameTagInText } from '../tagParser';

describe('renameTagInText', () => {
    it('renames a tag in item content', () => {
        expect(renameTagInText('item #wip more', 'wip', 'in-progress'))
            .toBe('item #in-progress more');
    });
    it('does not rename a tag that is a prefix of another', () => {
        // #urgent should not match inside #urgently
        expect(renameTagInText('item #urgently', 'urgent', 'critical'))
            .toBe('item #urgently');
    });
    it('renames a tag at the end of a line', () => {
        expect(renameTagInText('item #wip', 'wip', 'done')).toBe('item #done');
    });
    it('renames multiple occurrences', () => {
        expect(renameTagInText('#wip item #wip', 'wip', 'done')).toBe('#done item #done');
    });
    it('returns unchanged string when tag not present', () => {
        expect(renameTagInText('item #other', 'wip', 'done')).toBe('item #other');
    });
    it('renames hyphenated tags', () => {
        expect(renameTagInText('item #in-progress', 'in-progress', 'done'))
            .toBe('item #done');
    });
});
