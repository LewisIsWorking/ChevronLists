/** Colour values for a single token type */
export interface TokenColour {
    foreground?: string;
    bold?:       boolean;
    italic?:     boolean;
}

/** A complete named colour preset */
export interface ColourPreset {
    id:          string;
    label:       string;
    description: string;
    tokens: {
        chevronHeader:  TokenColour;
        chevronPrefix:  TokenColour;
        chevronNumber:  TokenColour;
        chevronContent: TokenColour;
        chevronLabel:   TokenColour;
    };
}

/** All built-in colour presets */
export const COLOUR_PRESETS: ColourPreset[] = [
    {
        id: 'default', label: '$(symbol-color) Default',
        description: 'Amber header, muted grey prefix, blue numbers, gold labels',
        tokens: {
            chevronHeader:  { foreground: '#E5C07B', bold: true },
            chevronPrefix:  { foreground: '#5C6370' },
            chevronNumber:  { foreground: '#61AFEF' },
            chevronContent: {},
            chevronLabel:   { foreground: '#E5C07B', bold: true },
        },
    },
    {
        id: 'ocean', label: '$(symbol-color) Ocean',
        description: 'Teal header, slate prefix, cyan numbers',
        tokens: {
            chevronHeader:  { foreground: '#56B6C2', bold: true },
            chevronPrefix:  { foreground: '#4B5263' },
            chevronNumber:  { foreground: '#2BBAC5' },
            chevronContent: {},
            chevronLabel:   { foreground: '#56B6C2', bold: true },
        },
    },
    {
        id: 'forest', label: '$(symbol-color) Forest',
        description: 'Green header, dark prefix, lime numbers',
        tokens: {
            chevronHeader:  { foreground: '#98C379', bold: true },
            chevronPrefix:  { foreground: '#3E5730' },
            chevronNumber:  { foreground: '#7CC26E' },
            chevronContent: {},
            chevronLabel:   { foreground: '#98C379', bold: true },
        },
    },
    {
        id: 'sunset', label: '$(symbol-color) Sunset',
        description: 'Coral header, muted orange prefix, gold numbers',
        tokens: {
            chevronHeader:  { foreground: '#E06C75', bold: true },
            chevronPrefix:  { foreground: '#6B4C3B' },
            chevronNumber:  { foreground: '#E5C07B' },
            chevronContent: {},
            chevronLabel:   { foreground: '#E06C75', bold: true },
        },
    },
    {
        id: 'monochrome', label: '$(symbol-color) Monochrome',
        description: 'Bold white header, grey prefix, silver numbers',
        tokens: {
            chevronHeader:  { foreground: '#FFFFFF', bold: true },
            chevronPrefix:  { foreground: '#5C6370' },
            chevronNumber:  { foreground: '#ABB2BF' },
            chevronContent: {},
            chevronLabel:   { foreground: '#FFFFFF', bold: true },
        },
    },
    {
        id: 'custom', label: '$(symbol-color) Custom',
        description: 'Clear all preset colours — use your own semanticTokenColorCustomizations',
        tokens: {
            chevronHeader:  {},
            chevronPrefix:  {},
            chevronNumber:  {},
            chevronContent: {},
            chevronLabel:   {},
        },
    },
];

/** Finds a preset by id. Returns undefined if not found. */
export function findPreset(id: string): ColourPreset | undefined {
    return COLOUR_PRESETS.find(p => p.id === id);
}
