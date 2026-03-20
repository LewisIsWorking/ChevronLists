import { describe, it, expect } from 'bun:test';
import { toMarkdownTable } from '../patterns';

describe('toMarkdownTable', () => {
    it('produces a header row and separator', () => {
        const result = toMarkdownTable([{ num: 1, content: 'first' }]);
        expect(result).toContain('| # | Content |');
        expect(result).toContain('|---|---------|');
    });
    it('produces correct data rows', () => {
        const result = toMarkdownTable([
            { num: 1, content: 'alpha' },
            { num: 2, content: 'beta' },
        ]);
        expect(result).toContain('| 1 | alpha |');
        expect(result).toContain('| 2 | beta |');
    });
    it('escapes pipe characters in content', () => {
        const result = toMarkdownTable([{ num: 1, content: 'a | b' }]);
        expect(result).toContain('a \\| b');
    });
    it('returns only header rows for empty input', () => {
        const result = toMarkdownTable([]);
        const lines  = result.split('\n').filter(Boolean);
        expect(lines).toHaveLength(2); // header + separator only
    });
});
