import { describe, it, expect } from 'bun:test';
import { parseCheck } from '../checkParser';
import { parseBullet, parseNumbered, isHeader } from '../patterns';
import type { LineReader } from '../types';

// Mirror the status bar counting logic for testing
function countStatusBar(lines: string[], prefix: string) {
    let sections = 0, items = 0, done = 0, total = 0;
    for (const text of lines) {
        if (isHeader(text)) { sections++; continue; }
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (content !== null) {
            items++;
            const check = parseCheck(content);
            if (check) { total++; if (check.state === 'done') { done++; } }
        }
    }
    return { sections, items, done, total };
}

describe('status bar completion counting', () => {
    it('counts no checkboxes when items have none', () => {
        const r = countStatusBar(['> H', '>> - plain item'], '-');
        expect(r.total).toBe(0);
        expect(r.done).toBe(0);
    });
    it('counts done and total correctly', () => {
        const r = countStatusBar(['> H', '>> - [x] done', '>> - [ ] todo', '>> - plain'], '-');
        expect(r.done).toBe(1);
        expect(r.total).toBe(2);
        expect(r.items).toBe(3);
    });
    it('counts sections correctly alongside items', () => {
        const r = countStatusBar(['> A', '>> - item', '> B', '>> - [x] done'], '-');
        expect(r.sections).toBe(2);
        expect(r.items).toBe(2);
        expect(r.done).toBe(1);
    });
});
