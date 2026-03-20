import type { LineReader } from './types';
import { isHeader, parseBullet, parseNumbered } from './patterns';

export interface DiagnosticIssue {
    line:    number;
    message: string;
    kind:    'duplicate-header' | 'empty-section' | 'bad-numbering';
}

/** Finds all diagnostic issues in a document */
export function collectIssues(doc: LineReader, prefix: string): DiagnosticIssue[] {
    const issues: DiagnosticIssue[] = [];
    const seenHeaders = new Map<string, number>(); // name → first line
    let lastHeaderLine     = -1;
    let lastHeaderHasItems = false;

    // Per-depth: track {line, num} of the previous numbered item
    const prevItem = new Map<string, { line: number; num: number }>();

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;

        if (isHeader(text)) {
            if (lastHeaderLine >= 0 && !lastHeaderHasItems) {
                issues.push({ line: lastHeaderLine, message: `Empty section — no items under this header`, kind: 'empty-section' });
            }
            const name = text.replace(/^> /, '').trim().toLowerCase();
            if (seenHeaders.has(name)) {
                issues.push({ line: i, message: `Duplicate section name "${text.replace(/^> /, '')}" (first at line ${(seenHeaders.get(name)! + 1)})`, kind: 'duplicate-header' });
            } else {
                seenHeaders.set(name, i);
            }
            lastHeaderLine     = i;
            lastHeaderHasItems = false;
            prevItem.clear();
            continue;
        }

        const numbered = parseNumbered(text);
        if (numbered) {
            lastHeaderHasItems = true;
            const key  = numbered.chevrons;
            const prev = prevItem.get(key);

            if (prev !== undefined) {
                const expected = prev.num + 1;
                if (numbered.num !== expected) {
                    // Flag the PREVIOUS item — it's the one that created
                    // the unexpected gap, not the current one.
                    issues.push({
                        line:    prev.line,
                        message: `Sequence break after this item: expected ${expected} next but found ${numbered.num}`,
                        kind:    'bad-numbering',
                    });
                }
            }

            prevItem.set(key, { line: i, num: numbered.num });
            continue;
        }

        if (parseBullet(text, prefix)) { lastHeaderHasItems = true; }
    }

    if (lastHeaderLine >= 0 && !lastHeaderHasItems) {
        issues.push({ line: lastHeaderLine, message: `Empty section — no items under this header`, kind: 'empty-section' });
    }

    return issues;
}
