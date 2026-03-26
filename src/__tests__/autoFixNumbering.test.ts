import { describe, it, expect } from 'bun:test';
import { computeAutoFixEdits } from '../patterns';

function makeLines(texts: string[]) {
    return texts.map((text, lineIndex) => ({ text, lineIndex }));
}

describe('computeAutoFixEdits', () => {
    it('returns no edits for a correctly sequenced list', () => {
        expect(computeAutoFixEdits(makeLines(['>> 1. First', '>> 2. Second', '>> 3. Third']))).toHaveLength(0);
    });
    it('detects and fixes a duplicate number', () => {
        const edits = computeAutoFixEdits(makeLines(['>> 1. First', '>> 2. Second', '>> 3. Third', '>> 3. Duplicate']));
        expect(edits).toHaveLength(1);
        expect(edits[0].newText).toBe('>> 4. Duplicate');
    });
    it('fixes a gap in sequence', () => {
        const edits = computeAutoFixEdits(makeLines(['>> 1. First', '>> 2. Second', '>> 5. Gap']));
        expect(edits).toHaveLength(1);
        expect(edits[0].newText).toBe('>> 3. Gap');
    });
    it('does not touch differently-depth lists', () => {
        expect(computeAutoFixEdits(makeLines(['>> 1. Top', '>>> 1. Nested', '>>> 2. Nested', '>> 2. Top']))).toHaveLength(0);
    });
    it('fixes from the first break, cascading the rest', () => {
        const edits = computeAutoFixEdits(makeLines(['>> 1. a', '>> 2. b', '>> 2. c', '>> 2. d']));
        expect(edits).toHaveLength(2);
        expect(edits[0].newText).toBe('>> 3. c');
        expect(edits[1].newText).toBe('>> 4. d');
    });
    it('returns no edits for empty input', () => {
        expect(computeAutoFixEdits([])).toHaveLength(0);
    });
    it('ignores non-numbered lines', () => {
        expect(computeAutoFixEdits(makeLines(['> Header', '>> - bullet', '>> 1. item', '>> 2. item']))).toHaveLength(0);
    });
});
