import type { LineReader } from './types';
import { isHeader, parseBullet, parseNumbered } from './patterns';

/** Converts a chevron document to a clean standard markdown string */
export function toMarkdownDocument(doc: LineReader, prefix: string): string {
    const lines: string[] = [];

    for (let i = 0; i < doc.lineCount; i++) {
        const text = doc.lineAt(i).text;

        if (isHeader(text)) {
            const name = text.replace(/^> /, '');
            // Blank line before each header (except at the top)
            if (lines.length > 0) { lines.push(''); }
            lines.push(`## ${name}`);
            lines.push('');
            continue;
        }

        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);

        if (bullet) {
            const indent = '  '.repeat(bullet.chevrons.length - 2);
            lines.push(`${indent}- ${bullet.content}`);
        } else if (numbered) {
            const indent = '  '.repeat(numbered.chevrons.length - 2);
            lines.push(`${indent}${numbered.num}. ${numbered.content}`);
        }
    }

    return lines.join('\n').trimEnd() + '\n';
}
