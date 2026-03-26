import { describe, it, expect } from 'bun:test';
import { buildLineDiff, smartPasteLines, countWords, formatReadingTime } from '../patterns';

describe('buildLineDiff', () => {
    it('returns no changes for identical strings', () => {
        expect(buildLineDiff('hello world', 'hello world')).toBe('_No changes detected_');
    });
    it('detects added words', () => {
        const diff = buildLineDiff('hello', 'hello world');
        expect(diff).toContain('+ world');
    });
    it('detects removed words', () => {
        const diff = buildLineDiff('hello world', 'hello');
        expect(diff).toContain('- world');
    });
});

describe('smartPasteLines', () => {
    it('converts numbered list to numbered chevron items', () => {
        const lines = smartPasteLines('1. First\n2. Second', '-', '>>', 1);
        expect(lines[0]).toBe('>> 1. First');
        expect(lines[1]).toBe('>> 2. Second');
    });
    it('converts bullet list to bullet chevron items', () => {
        const lines = smartPasteLines('- Alpha\n- Beta', '-', '>>', 1);
        expect(lines[0]).toBe('>> - Alpha');
        expect(lines[1]).toBe('>> - Beta');
    });
    it('converts plain lines to bullet chevron items', () => {
        const lines = smartPasteLines('Plain text\nAnother line', '-', '>>', 1);
        expect(lines[0]).toBe('>> - Plain text');
    });
    it('handles • bullet style', () => {
        const lines = smartPasteLines('• Item one\n• Item two', '-', '>>', 1);
        expect(lines[0]).toBe('>> - Item one');
    });
    it('continues numbering from startNum', () => {
        const lines = smartPasteLines('1. A\n2. B', '-', '>>', 5);
        expect(lines[0]).toContain('5.');
        expect(lines[1]).toContain('6.');
    });
    it('filters empty lines', () => {
        const lines = smartPasteLines('A\n\nB', '-', '>>', 1);
        expect(lines).toHaveLength(2);
    });
});

describe('countWords and formatReadingTime', () => {
    it('counts words correctly', () => {
        expect(countWords(['hello world', 'foo bar baz'])).toBe(5);
    });
    it('returns 0 for empty input', () => {
        expect(countWords([])).toBe(0);
    });
    it('formats seconds under a minute', () => {
        expect(formatReadingTime(10)).toBe('3 seconds'); // 10 words / 200 wpm * 60 = 3s
    });
    it('formats minutes', () => {
        expect(formatReadingTime(400)).toBe('2 minutes'); // 400 / 200 = 2 min
    });
    it('formats singular minute', () => {
        expect(formatReadingTime(200)).toBe('1 minute');
    });
});
