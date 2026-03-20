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
    const seenHeaders  = new Map<string, number>(); // name → first line
    const depthCounter = new Map<string, number>(); // chevrons → expected next number
    let   lastHeaderLine   = -1;
    let   lastHeaderHasItems = false;

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;

        if (isHeader(text)) {
            // Check previous section was not empty
            if (lastHeaderLine >= 0 && !lastHeaderHasItems) {
                issues.push({ line: lastHeaderLine, message: `Empty section — no items under this header`, kind: 'empty-section' });
            }
            const name = text.replace(/^> /, '').trim().toLowerCase();
            if (seenHeaders.has(name)) {
                issues.push({ line: i, message: `Duplicate section name "${text.replace(/^> /, '')}" (first at line ${(seenHeaders.get(name)! + 1)})`, kind: 'duplicate-header' });
            } else {
                seenHeaders.set(name, i);
            }
            lastHeaderLine   = i;
            lastHeaderHasItems = false;
            depthCounter.clear();
            continue;
        }

        const numbered = parseNumbered(text);
        if (numbered) {
            lastHeaderHasItems = true;
            const key  = numbered.chevrons;
            // Only flag if we've already seen a previous item at this depth
            // (first item is allowed to start at any number)
            if (depthCounter.has(key)) {
                const expected = depthCounter.get(key)! + 1;
                if (numbered.num !== expected) {
                    issues.push({ line: i, message: `Expected item ${expected} but found ${numbered.num} at depth ${key}`, kind: 'bad-numbering' });
                }
            }
            depthCounter.set(key, numbered.num);
            continue;
        }

        const bullet = parseBullet(text, prefix);
        if (bullet) {
            lastHeaderHasItems = true;
        }
    }

    // Check final section
    if (lastHeaderLine >= 0 && !lastHeaderHasItems) {
        issues.push({ line: lastHeaderLine, message: `Empty section — no items under this header`, kind: 'empty-section' });
    }

    return issues;
}
