import type { LineReader } from './types';
import { isHeader, parseBullet, parseNumbered } from './patterns';

/** A single tag occurrence found in a document */
export interface TagOccurrence {
    tag:       string;   // without the # prefix
    itemText:  string;   // full item content
    section:   string;   // parent header name
    line:      number;
}

/** Regex that matches #tag tokens inside item content */
export const TAG_RE = /#([\w-]+)/g;

/** Extracts all unique tag names from a content string */
export function extractTags(content: string): string[] {
    const tags: string[] = [];
    for (const match of content.matchAll(TAG_RE)) {
        tags.push(match[1].toLowerCase());
    }
    return [...new Set(tags)];
}

/** Strips all #tag tokens from a content string for display */
export function stripTags(content: string): string {
    return content.replace(/#[\w-]+/g, '').replace(/\s{2,}/g, ' ').trim();
}

/** Collects all tag occurrences in a document */
export function collectTags(doc: LineReader, prefix: string): TagOccurrence[] {
    const occurrences: TagOccurrence[] = [];
    let section = '';

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (isHeader(text)) { section = text.replace(/^> /, ''); continue; }

        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;

        if (!content) { continue; }
        for (const tag of extractTags(content)) {
            occurrences.push({ tag, itemText: content, section, line: i });
        }
    }
    return occurrences;
}

/** Returns all unique tag names from a document, sorted alphabetically */
export function uniqueTags(doc: LineReader, prefix: string): string[] {
    const all = collectTags(doc, prefix).map(o => o.tag);
    return [...new Set(all)].sort();
}
