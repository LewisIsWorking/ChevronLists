import { describe, it, expect } from 'bun:test';
import { parseWordCountGoal, headerNameWithoutGoal } from '../wordGoalParser';
import { parseNote, buildNoteLine, getNoteLineForItem } from '../noteParser';
import type { LineReader } from '../types';

function makeDoc(lines: string[]): LineReader {
    return { lineCount: lines.length, lineAt: (i: number) => ({ text: lines[i] }) };
}

// Mirror simple diff logic for testing
function simpleDiff(current: string[], clipboard: string[]): string[] {
    const all = [...new Set([...current, ...clipboard])];
    return all.map(line => {
        const inC = current.includes(line);
        const inCb = clipboard.includes(line);
        if (inC && inCb) { return `= ${line}`; }
        if (inC) { return `- ${line}`; }
        return `+ ${line}`;
    });
}

describe('simpleDiff', () => {
    it('marks items in both as =', () => {
        const diff = simpleDiff(['a', 'b'], ['a', 'b']);
        expect(diff.every(l => l.startsWith('='))).toBe(true);
    });
    it('marks items only in section as -', () => {
        const diff = simpleDiff(['a'], ['b']);
        expect(diff.some(l => l.startsWith('- a'))).toBe(true);
    });
    it('marks items only in clipboard as +', () => {
        const diff = simpleDiff(['a'], ['b']);
        expect(diff.some(l => l.startsWith('+ b'))).toBe(true);
    });
    it('handles empty arrays', () => {
        expect(simpleDiff([], [])).toHaveLength(0);
    });
    it('handles identical content', () => {
        const diff = simpleDiff(['same'], ['same']);
        expect(diff).toHaveLength(1);
        expect(diff[0]).toBe('= same');
    });
});

describe('parseWordCountGoal (from wordGoalParser)', () => {
    it('parses goal correctly', () => expect(parseWordCountGoal('> Section ==300')).toBe(300));
    it('returns null for no goal', () => expect(parseWordCountGoal('> Section')).toBeNull());
});

describe('parseNote (from noteParser)', () => {
    it('parses note text correctly', () => expect(parseNote('>> > This note')?.note).toBe('This note'));
    it('returns null for non-note line', () => expect(parseNote('>> - item')).toBeNull());
});

describe('buildNoteLine', () => {
    it('builds correct format', () => expect(buildNoteLine('>>', 'test')).toBe('>> > test'));
});

describe('getNoteLineForItem', () => {
    it('finds note on next line', () => {
        expect(getNoteLineForItem(makeDoc(['>> - item', '>> > note']), 0)).toBe(1);
    });
    it('returns -1 when no note', () => {
        expect(getNoteLineForItem(makeDoc(['>> - item', '>> - other']), 0)).toBe(-1);
    });
});
