import { describe, it, expect } from 'bun:test';

// ── Pure sorting helpers (mirrored from sortCommands.ts for testing) ──────────

interface ItemLine { lineIndex: number; text: string; sortKey: string; }

function parseBulletContent(text: string, prefix: string): string | null {
    const re    = new RegExp(`^(>{2,}) ${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (.*)$`);
    const match = text.match(re);
    return match ? match[2] : null;
}

function collectItems(lines: string[], prefix: string): ItemLine[] {
    return lines.map((text, i) => {
        const content = parseBulletContent(text, prefix);
        return content !== null ? { lineIndex: i, text, sortKey: content.toLowerCase() } : null;
    }).filter(Boolean) as ItemLine[];
}

function sortAZ(items: ItemLine[]): ItemLine[] {
    return [...items].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
}

function sortZA(items: ItemLine[]): ItemLine[] {
    return [...items].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}

function renumber(lines: string[]): string[] {
    const re       = /^(>{2,}) (\d+)\. (.*)$/;
    const counters = new Map<string, number>();
    return lines.map(line => {
        const match = line.match(re);
        if (!match) { return line; }
        const chevrons = match[1];
        const content  = match[3];
        const next     = (counters.get(chevrons) ?? 0) + 1;
        counters.set(chevrons, next);
        return `${chevrons} ${next}. ${content}`;
    });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('sortAZ', () => {
    it('sorts items alphabetically ascending', () => {
        const items = collectItems(['>> - Zebra', '>> - Apple', '>> - Mango'], '-');
        const sorted = sortAZ(items).map(i => i.text);
        expect(sorted).toEqual(['>> - Apple', '>> - Mango', '>> - Zebra']);
    });
    it('is case-insensitive', () => {
        const items = collectItems(['>> - banana', '>> - Apple', '>> - cherry'], '-');
        const sorted = sortAZ(items).map(i => i.text);
        expect(sorted).toEqual(['>> - Apple', '>> - banana', '>> - cherry']);
    });
    it('does not mutate the original array', () => {
        const items  = collectItems(['>> - Zebra', '>> - Apple'], '-');
        const sorted = sortAZ(items);
        expect(items[0].text).toBe('>> - Zebra');
        expect(sorted[0].text).toBe('>> - Apple');
    });
    it('handles a single item without error', () => {
        const items  = collectItems(['>> - Only'], '-');
        const sorted = sortAZ(items);
        expect(sorted).toHaveLength(1);
    });
    it('works with a custom prefix', () => {
        const items  = collectItems(['>> * Zebra', '>> * Apple'], '*');
        const sorted = sortAZ(items).map(i => i.text);
        expect(sorted).toEqual(['>> * Apple', '>> * Zebra']);
    });
});

describe('sortZA', () => {
    it('sorts items alphabetically descending', () => {
        const items  = collectItems(['>> - Apple', '>> - Mango', '>> - Zebra'], '-');
        const sorted = sortZA(items).map(i => i.text);
        expect(sorted).toEqual(['>> - Zebra', '>> - Mango', '>> - Apple']);
    });
    it('is case-insensitive', () => {
        const items  = collectItems(['>> - apple', '>> - Banana', '>> - Cherry'], '-');
        const sorted = sortZA(items).map(i => i.text);
        expect(sorted).toEqual(['>> - Cherry', '>> - Banana', '>> - apple']);
    });
});

describe('renumber', () => {
    it('resets numbers from 1', () => {
        const result = renumber(['>> 5. first', '>> 6. second', '>> 7. third']);
        expect(result).toEqual(['>> 1. first', '>> 2. second', '>> 3. third']);
    });
    it('tracks depth independently', () => {
        const result = renumber(['>> 3. top', '>>> 5. nested', '>>> 6. nested2', '>> 4. top2']);
        expect(result).toEqual(['>> 1. top', '>>> 1. nested', '>>> 2. nested2', '>> 2. top2']);
    });
    it('leaves non-numbered lines untouched', () => {
        const result = renumber(['>> - bullet', '>> 3. numbered', '>> - bullet2']);
        expect(result).toEqual(['>> - bullet', '>> 1. numbered', '>> - bullet2']);
    });
    it('handles already correct numbering', () => {
        const result = renumber(['>> 1. first', '>> 2. second']);
        expect(result).toEqual(['>> 1. first', '>> 2. second']);
    });
    it('handles empty input', () => {
        expect(renumber([])).toEqual([]);
    });
});
