import type { LineReader } from './types';
import { isHeader } from './patterns';

/** A named group containing one or more section header names */
export interface SectionGroup {
    name:     string;
    sections: string[];
    line:     number; // line of the group divider
}

/** Regex matching a group divider line: >> -- Group Name */
export const GROUP_RE = /^>> -- (.+)$/;

/** Parses a group divider line, returns the group name or null */
export function parseGroupDivider(text: string): string | null {
    const match = text.match(GROUP_RE);
    return match ? match[1].trim() : null;
}

/** Collects all section groups from a document */
export function collectGroups(doc: LineReader): SectionGroup[] {
    const groups: SectionGroup[] = [];
    let current: SectionGroup | null = null;

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;
        const groupName = parseGroupDivider(text);

        if (groupName !== null) {
            if (current && current.sections.length > 0) { groups.push(current); }
            current = { name: groupName, sections: [], line: i };
            continue;
        }

        if (isHeader(text) && current) {
            current.sections.push(text.replace(/^> /, ''));
        }

        // A new group divider or end-of-file flushes the current group
    }

    if (current && current.sections.length > 0) { groups.push(current); }
    return groups;
}

/** Returns all unique group names in a document */
export function uniqueGroupNames(doc: LineReader): string[] {
    return [...new Set(collectGroups(doc).map(g => g.name))];
}
