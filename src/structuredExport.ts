import type { LineReader } from './types';
import { isHeader, parseBullet, parseNumbered } from './patterns';
import { extractTags } from './tagParser';
import { parsePriority } from './priorityParser';
import { extractDate } from './dueDateParser';
import { parseCheck } from './checkParser';

/** A fully parsed item with all metadata */
export interface StructuredItem {
    line:      number;
    depth:     number;
    numbered:  boolean;
    num:       number | null;
    content:   string;
    tags:      string[];
    priority:  number | null;
    dueDate:   string | null;
    done:      boolean | null; // null = no checkbox
}

/** A section with all its items */
export interface StructuredSection {
    line:    number;
    name:    string;
    items:   StructuredItem[];
}

/** Parses a full document into structured sections */
export function parseStructured(doc: LineReader, prefix: string): StructuredSection[] {
    const sections: StructuredSection[] = [];
    let current: StructuredSection | null = null;

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;

        if (isHeader(text)) {
            if (current) { sections.push(current); }
            current = { line: i, name: text.replace(/^> /, ''), items: [] };
            continue;
        }

        if (!current) { continue; }

        const bullet   = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (content === null) { continue; }

        const chevrons = bullet?.chevrons ?? numbered?.chevrons ?? '>>';
        const depth    = chevrons.length - 2;
        const check    = parseCheck(content);
        const rawText  = check ? check.contentWithout : content;
        const priority = parsePriority(rawText);
        const textBody = priority ? priority.contentWithout : rawText;
        const dateMatch = extractDate(textBody);

        current.items.push({
            line:     i,
            depth,
            numbered: !!numbered,
            num:      numbered?.num ?? null,
            content:  dateMatch ? dateMatch.contentWithout : textBody,
            tags:     extractTags(textBody),
            priority: priority?.level ?? null,
            dueDate:  dateMatch?.dateStr ?? null,
            done:     check ? check.state === 'done' : null,
        });
    }

    if (current) { sections.push(current); }
    return sections;
}

/** Converts structured sections to a flat CSV string */
export function toCsv(sections: StructuredSection[]): string {
    const header = 'Section,Depth,Numbered,Number,Content,Tags,Priority,DueDate,Done';
    const rows   = sections.flatMap(s =>
        s.items.map(item => [
            csvCell(s.name),
            item.depth,
            item.numbered,
            item.num ?? '',
            csvCell(item.content),
            csvCell(item.tags.join(' ')),
            item.priority ?? '',
            item.dueDate ?? '',
            item.done === null ? '' : item.done,
        ].join(','))
    );
    return [header, ...rows].join('\n');
}

function csvCell(value: string): string {
    if (/[,"\n]/.test(value)) { return `"${value.replace(/"/g, '""')}"`; }
    return value;
}
