import type { LineReader } from './types';
import { parseBullet, parseNumbered } from './patterns';

/** All supported colour label names */
export const COLOUR_LABELS = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'] as const;
export type ColourLabel = typeof COLOUR_LABELS[number];

/** Regex matching {colour} in item content */
export const COLOUR_LABEL_RE = /\{(red|green|blue|yellow|orange|purple)\}/g;

/** Parses the first colour label from item content */
export function parseColourLabel(content: string): ColourLabel | null {
    const match = content.match(/\{(red|green|blue|yellow|orange|purple)\}/);
    return match ? match[1] as ColourLabel : null;
}

/** Sets (or replaces) the colour label on item content */
export function setColourLabel(content: string, label: ColourLabel): string {
    const stripped = content.replace(COLOUR_LABEL_RE, '').replace(/\s{2,}/g, ' ').trim();
    return `{${label}} ${stripped}`;
}

/** Removes any colour label from item content */
export function removeColourLabel(content: string): string {
    return content.replace(COLOUR_LABEL_RE, '').replace(/\s{2,}/g, ' ').trim();
}

export interface ColourLabelOccurrence {
    label:   ColourLabel;
    content: string;
    section: string;
    line:    number;
}

/** Collects all colour-labelled items in a document */
export function collectColourLabels(doc: LineReader, prefix: string): ColourLabelOccurrence[] {
    const results: ColourLabelOccurrence[] = [];
    let section = '';
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (text.startsWith('> ') && !text.startsWith('>> ')) { section = text.replace(/^> /, ''); continue; }
        const bullet   = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        const label = parseColourLabel(content);
        if (!label) { continue; }
        results.push({ label, content: removeColourLabel(content), section, line: i });
    }
    return results;
}
