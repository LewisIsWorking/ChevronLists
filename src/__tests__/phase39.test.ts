import { describe, it, expect } from 'bun:test';
import { convertToObsidian, formatElapsed } from '../patterns';

describe('formatElapsed', () => {
    it('formats seconds only', () => expect(formatElapsed(45000)).toBe('45s'));
    it('formats minutes', () => expect(formatElapsed(90000)).toBe('1m'));
    it('formats hours and minutes', () => expect(formatElapsed(3720000)).toBe('1h 2m'));
    it('formats zero as 0s', () => expect(formatElapsed(0)).toBe('0s'));
    it('formats exactly one hour', () => expect(formatElapsed(3600000)).toBe('1h 0m'));
});

describe('convertToObsidian', () => {
    it('converts a header to ## heading', () => {
        const out = convertToObsidian(['> My Section', '>> - item'], '-');
        expect(out).toContain('## My Section');
    });
    it('inserts YAML frontmatter before first heading', () => {
        const out = convertToObsidian(['> Section', '>> - item'], '-');
        expect(out).toContain('---');
        expect(out).toContain('tags:');
    });
    it('converts [x] items to markdown checkboxes', () => {
        const out = convertToObsidian(['> S', '>> - [x] done'], '-');
        expect(out).toContain('- [x] done');
    });
    it('converts [ ] items to unchecked markdown checkboxes', () => {
        const out = convertToObsidian(['> S', '>> - [ ] todo'], '-');
        expect(out).toContain('- [ ] todo');
    });
    it('converts !!! to red emoji', () => {
        const out = convertToObsidian(['> S', '>> - !!! urgent'], '-');
        expect(out).toContain('🔴');
    });
    it('converts @date to calendar emoji', () => {
        const out = convertToObsidian(['> S', '>> - task @2026-06-01'], '-');
        expect(out).toContain('📅 2026-06-01');
    });
    it('collects tags into frontmatter', () => {
        const out = convertToObsidian(['> S', '>> - item #urgent'], '-');
        expect(out).toContain('urgent');
    });
    it('produces a second ## for a second section', () => {
        const out = convertToObsidian(['> A', '>> - a', '> B', '>> - b'], '-');
        const matches = out.match(/^## /mg);
        expect(matches?.length).toBe(2);
    });
    it('handles empty input gracefully', () => {
        expect(convertToObsidian([], '-')).toBe('');
    });
});
