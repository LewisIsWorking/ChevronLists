import { describe, it, expect } from 'bun:test';
import { BUILT_IN_TEMPLATES } from '../templateData';

describe('BUILT_IN_TEMPLATES', () => {
    it('contains at least 5 templates', () => {
        expect(BUILT_IN_TEMPLATES.length).toBeGreaterThanOrEqual(5);
    });

    it('every template has name, description and body', () => {
        for (const t of BUILT_IN_TEMPLATES) {
            expect(t.name.length).toBeGreaterThan(0);
            expect(t.description.length).toBeGreaterThan(0);
            expect(t.body.length).toBeGreaterThan(0);
        }
    });

    it('every template body starts with a > header line', () => {
        for (const t of BUILT_IN_TEMPLATES) {
            expect(t.body.startsWith('> ')).toBe(true);
        }
    });

    it('every template body contains at least one >> item', () => {
        for (const t of BUILT_IN_TEMPLATES) {
            expect(t.body).toContain('>> ');
        }
    });

    it('every template body ends with a $0 cursor stop', () => {
        for (const t of BUILT_IN_TEMPLATES) {
            expect(t.body.endsWith('$0')).toBe(true);
        }
    });

    it('all template names are unique', () => {
        const names = BUILT_IN_TEMPLATES.map(t => t.name);
        expect(new Set(names).size).toBe(names.length);
    });

    it('Bullet List template uses >> - prefix', () => {
        const t = BUILT_IN_TEMPLATES.find(t => t.name === 'Bullet List')!;
        expect(t.body).toContain('>> - ');
    });

    it('Numbered List template uses >> 1. prefix', () => {
        const t = BUILT_IN_TEMPLATES.find(t => t.name === 'Numbered List')!;
        expect(t.body).toContain('>> 1. ');
    });
});
