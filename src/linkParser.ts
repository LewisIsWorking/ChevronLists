import type { LineReader } from './types';
import { isHeader } from './patterns';

/** A parsed [[SectionName]] link found in an item */
export interface SectionLink {
    target:    string; // the text inside [[ ]]
    line:      number;
    charStart: number;
    charEnd:   number;
}

/** Regex matching [[SectionName]] links */
export const LINK_RE = /\[\[([^\]]+)\]\]/g;

/** Extracts all [[...]] links from a single line of text */
export function extractLinks(text: string): SectionLink[] {
    const links: SectionLink[] = [];
    for (const match of text.matchAll(LINK_RE)) {
        links.push({
            target:    match[1].trim(),
            line:      0, // caller fills this in
            charStart: match.index!,
            charEnd:   match.index! + match[0].length,
        });
    }
    return links;
}

/** Resolves a link target to a line number in the document. Returns -1 if not found. */
export function resolveLink(target: string, doc: LineReader): number {
    const normalised = target.toLowerCase().trim();
    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (isHeader(text)) {
            const name = text.replace(/^> /, '').toLowerCase().trim();
            if (name === normalised) { return i; }
        }
    }
    return -1;
}

/** Collects all links across a document, with resolved target line numbers */
export function collectLinks(doc: LineReader): (SectionLink & { resolvedLine: number })[] {
    const results: (SectionLink & { resolvedLine: number })[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const text  = doc.lineAt(i).text;
        const links = extractLinks(text);
        for (const link of links) {
            results.push({ ...link, line: i, resolvedLine: resolveLink(link.target, doc) });
        }
    }
    return results;
}
