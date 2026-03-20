import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

const snippetsPath = join(import.meta.dir, '../../snippets/chevron-lists.code-snippets');
const snippets = JSON.parse(readFileSync(snippetsPath, 'utf-8'));

describe('chevron-lists snippets', () => {
    it('contains both snippets', () => {
        expect(snippets).toHaveProperty('Chevron Bullet List');
        expect(snippets).toHaveProperty('Chevron Numbered List');
    });

    describe('chl — Chevron Bullet List', () => {
        const s = snippets['Chevron Bullet List'];
        it('has prefix chl', ()         => expect(s.prefix).toBe('chl'));
        it('is scoped to markdown', ()  => expect(s.scope).toBe('markdown'));
        it('starts with a > header', () => expect(s.body[0]).toMatch(/^> /));
        it('has >> - items', ()         => expect(s.body[1]).toMatch(/^>> - /));
        it('ends with a $0 cursor', ()  => expect(s.body[s.body.length - 1]).toContain('$0'));
        it('has a description', ()      => expect(s.description.length).toBeGreaterThan(0));
    });

    describe('chn — Chevron Numbered List', () => {
        const s = snippets['Chevron Numbered List'];
        it('has prefix chn', ()              => expect(s.prefix).toBe('chn'));
        it('is scoped to markdown', ()       => expect(s.scope).toBe('markdown'));
        it('starts with a > header', ()      => expect(s.body[0]).toMatch(/^> /));
        it('has >> 1. numbered items', ()    => expect(s.body[1]).toMatch(/^>> 1\. /));
        it('increments numbers correctly', () => {
            const numbers = s.body.slice(1).map((line: string) => {
                const match = line.match(/^>> (\d+)\./);
                return match ? parseInt(match[1]) : null;
            }).filter(Boolean);
            expect(numbers).toEqual([1, 2, 3]);
        });
        it('ends with a $0 cursor', ()  => expect(s.body[s.body.length - 1]).toContain('$0'));
        it('has a description', ()      => expect(s.description.length).toBeGreaterThan(0));
    });
});
