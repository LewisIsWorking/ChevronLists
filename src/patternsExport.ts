/**
 * patternsExport.ts
 * Pure export/conversion utilities — split from patternsUtils.ts to stay under 200 lines.
 * Re-exported by patterns.ts so callers use a single import.
 */
import { parseBullet, parseNumbered, isHeader } from './patterns';

/** Formats elapsed milliseconds as Ns / Nm / NhNm */
export function formatElapsed(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours        = Math.floor(totalSeconds / 3600);
    const minutes      = Math.floor((totalSeconds % 3600) / 60);
    const seconds      = totalSeconds % 60;
    if (hours > 0)   { return `${hours}h ${minutes}m`; }
    if (minutes > 0) { return `${minutes}m`; }
    return `${seconds}s`;
}

/** Pure: converts chevron-list lines to Obsidian-compatible markdown */
export function convertToObsidian(lines: string[], prefix: string): string {
    if (lines.length === 0) { return ''; }
    const out: string[]  = [];
    const allTags        = new Set<string>();
    let   firstHeader    = true;
    const date           = new Date().toISOString().slice(0, 10);

    for (const line of lines) {
        if (isHeader(line)) {
            const name = line.replace(/^> /, '').replace(/\s*==\d+/, '').replace(/\s*\[colour:[^\]]+\]/gi, '').trim();
            if (firstHeader) {
                out.push('---', `created: ${date}`, 'tags: []', '---', '', `## ${name}`);
                firstHeader = false;
            } else {
                out.push('', `## ${name}`);
            }
            continue;
        }
        const bullet   = parseBullet(line, prefix);
        const numbered = parseNumbered(line);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { if (line.trim()) { out.push(line); } continue; }
        const depth    = (bullet?.chevrons ?? numbered!.chevrons).length - 2;
        const indent   = '  '.repeat(depth);
        const converted = content
            .replace(/\[x\]\s*/,                        '- [x] ')
            .replace(/\[ \]\s*/,                        '- [ ] ')
            .replace(/\[\]\s*/,                         '- [ ] ')
            .replace(/@expires:(\d{4}-\d{2}-\d{2})/g,  '⏰ $1')
            .replace(/@(\d{4}-\d{2}-\d{2})/g,          '📅 $1')
            .replace(/!!!\s*/,                          '🔴 ')
            .replace(/!!\s*/,                           '🟠 ')
            .replace(/^!\s*/,                           '🟡 ')
            .replace(/\[\[file:([^\]]+)\]\]/g,          '[[$1]]')
            .trim();
        out.push(`${indent}- ${converted}`);
        for (const m of content.matchAll(/#(\w+)/g)) { allTags.add(m[1]); }
    }
    if (allTags.size > 0) {
        const tagList = [...allTags].map(t => `  - ${t}`).join('\n');
        const idx = out.findIndex(l => l === 'tags: []');
        if (idx >= 0) { out[idx] = `tags:\n${tagList}`; }
    }
    return out.join('\n');
}
