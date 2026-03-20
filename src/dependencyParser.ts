import type { LineReader } from './types';
import { isHeader } from './patterns';

/** Regex matching >>depends:SectionName on its own line */
export const DEPENDS_RE = /^>>depends:(.+)$/;

export interface Dependency {
    from:    string; // section that has the dependency
    to:      string; // section being depended on
    line:    number;
}

/** Parses a dependency target from a line, or returns null */
export function parseDependency(text: string): string | null {
    const match = text.match(DEPENDS_RE);
    return match ? match[1].trim() : null;
}

/** Collects all dependency declarations in a document */
export function collectDependencies(doc: LineReader): Dependency[] {
    const results: Dependency[] = [];
    let currentSection = '';

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        if (isHeader(text)) { currentSection = text.replace(/^> /, ''); continue; }
        const target = parseDependency(text);
        if (target && currentSection) {
            results.push({ from: currentSection, to: target, line: i });
        }
    }
    return results;
}

/** Returns all unique section names that are depended upon */
export function dependencyTargets(doc: LineReader): string[] {
    return [...new Set(collectDependencies(doc).map(d => d.to))];
}
