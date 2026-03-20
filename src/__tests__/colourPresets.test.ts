import { describe, it, expect } from 'bun:test';
import { COLOUR_PRESETS, findPreset } from '../colourPresets';

describe('COLOUR_PRESETS', () => {
    it('contains all six presets', () => {
        const ids = COLOUR_PRESETS.map(p => p.id);
        expect(ids).toContain('default');
        expect(ids).toContain('ocean');
        expect(ids).toContain('forest');
        expect(ids).toContain('sunset');
        expect(ids).toContain('monochrome');
        expect(ids).toContain('custom');
    });

    it('every preset has a label, description and tokens', () => {
        for (const preset of COLOUR_PRESETS) {
            expect(preset.label.length).toBeGreaterThan(0);
            expect(preset.description.length).toBeGreaterThan(0);
            expect(preset.tokens).toBeDefined();
        }
    });

    it('every non-custom preset has a foreground on chevronHeader', () => {
        for (const preset of COLOUR_PRESETS.filter(p => p.id !== 'custom')) {
            expect(preset.tokens.chevronHeader.foreground).toBeDefined();
        }
    });

    it('every non-custom preset has bold:true on chevronHeader', () => {
        for (const preset of COLOUR_PRESETS.filter(p => p.id !== 'custom')) {
            expect(preset.tokens.chevronHeader.bold).toBe(true);
        }
    });

    it('every non-custom preset has a foreground on chevronPrefix', () => {
        for (const preset of COLOUR_PRESETS.filter(p => p.id !== 'custom')) {
            expect(preset.tokens.chevronPrefix.foreground).toBeDefined();
        }
    });

    it('every non-custom preset has a foreground on chevronNumber', () => {
        for (const preset of COLOUR_PRESETS.filter(p => p.id !== 'custom')) {
            expect(preset.tokens.chevronNumber.foreground).toBeDefined();
        }
    });

    it('every non-custom preset has a foreground on chevronLabel', () => {
        for (const preset of COLOUR_PRESETS.filter(p => p.id !== 'custom')) {
            expect(preset.tokens.chevronLabel.foreground).toBeDefined();
        }
    });

    it('custom preset has empty token objects', () => {
        const custom = findPreset('custom')!;
        expect(Object.keys(custom.tokens.chevronHeader)).toHaveLength(0);
        expect(Object.keys(custom.tokens.chevronPrefix)).toHaveLength(0);
        expect(Object.keys(custom.tokens.chevronNumber)).toHaveLength(0);
    });

    it('all foreground values are valid hex colours', () => {
        const hexRe = /^#[0-9A-Fa-f]{6}$/;
        for (const preset of COLOUR_PRESETS.filter(p => p.id !== 'custom')) {
            expect(preset.tokens.chevronHeader.foreground).toMatch(hexRe);
            expect(preset.tokens.chevronPrefix.foreground).toMatch(hexRe);
            expect(preset.tokens.chevronNumber.foreground).toMatch(hexRe);
        }
    });

    it('all preset ids are unique', () => {
        const ids = COLOUR_PRESETS.map(p => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('findPreset', () => {
    it('finds a preset by id', () => {
        expect(findPreset('default')?.id).toBe('default');
        expect(findPreset('ocean')?.id).toBe('ocean');
    });

    it('returns undefined for unknown id', () => {
        expect(findPreset('nonexistent')).toBeUndefined();
    });

    it('matches package.json enum values', () => {
        const { readFileSync } = require('fs');
        const { join }         = require('path');
        const pkg              = JSON.parse(readFileSync(join(import.meta.dir, '../../package.json'), 'utf-8'));
        const enumValues: string[] = pkg.contributes.configuration.properties['chevron-lists.colourPreset'].enum;
        for (const id of enumValues) {
            expect(findPreset(id)).toBeDefined();
        }
    });
});
