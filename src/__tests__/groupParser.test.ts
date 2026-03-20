import { describe, it, expect } from 'bun:test';
import { parseGroupDivider, collectGroups, uniqueGroupNames } from '../groupParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

describe('parseGroupDivider', () => {
    it('parses a group divider line', () => {
        expect(parseGroupDivider('>> -- Act One')).toBe('Act One');
    });
    it('trims whitespace from the group name', () => {
        expect(parseGroupDivider('>> --  Padded Name  ')).toBe('Padded Name');
    });
    it('returns null for a regular item line', () => {
        expect(parseGroupDivider('>> - plain item')).toBeNull();
    });
    it('returns null for a header line', () => {
        expect(parseGroupDivider('> My Header')).toBeNull();
    });
    it('returns null for plain text', () => {
        expect(parseGroupDivider('just text')).toBeNull();
    });
    it('returns null for an empty string', () => {
        expect(parseGroupDivider('')).toBeNull();
    });
});

describe('collectGroups', () => {
    it('returns empty array for a file with no group dividers', () => {
        const doc = makeDoc(['> Header', '>> - item']);
        expect(collectGroups(doc)).toHaveLength(0);
    });
    it('collects a group with its sections', () => {
        const doc = makeDoc(['>> -- Phase One', '> Alpha', '>> - item', '> Beta', '>> - item']);
        const groups = collectGroups(doc);
        expect(groups).toHaveLength(1);
        expect(groups[0].name).toBe('Phase One');
        expect(groups[0].sections).toEqual(['Alpha', 'Beta']);
        expect(groups[0].line).toBe(0);
    });
    it('collects multiple groups', () => {
        const doc = makeDoc([
            '>> -- Group A', '> SectionOne', '>> - item',
            '>> -- Group B', '> SectionTwo', '>> - item',
        ]);
        const groups = collectGroups(doc);
        expect(groups).toHaveLength(2);
        expect(groups[0].name).toBe('Group A');
        expect(groups[1].name).toBe('Group B');
    });
    it('does not include a group with no sections', () => {
        const doc = makeDoc(['>> -- Empty Group', '>> -- Another Group', '> SectionA', '>> - item']);
        const groups = collectGroups(doc);
        expect(groups).toHaveLength(1);
        expect(groups[0].name).toBe('Another Group');
    });
    it('records the correct line index for each group', () => {
        const doc = makeDoc(['plain', '>> -- My Group', '> Section', '>> - item']);
        expect(collectGroups(doc)[0].line).toBe(1);
    });
});

describe('uniqueGroupNames', () => {
    it('returns sorted unique group names', () => {
        const doc = makeDoc([
            '>> -- Beta', '> S1', '>> - i',
            '>> -- Alpha', '> S2', '>> - i',
        ]);
        expect(uniqueGroupNames(doc)).toEqual(['Beta', 'Alpha']);
    });
    it('returns empty array for a file with no groups', () => {
        const doc = makeDoc(['> Header', '>> - item']);
        expect(uniqueGroupNames(doc)).toEqual([]);
    });
});
