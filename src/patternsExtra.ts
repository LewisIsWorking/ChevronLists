/**
 * patternsExtra.ts
 * Additional pure utilities — split from patternsExport.ts to stay under 200 lines.
 * Re-exported by patterns.ts so callers use a single import.
 */

/** Pure: extracts due date string from content for sorting, or high sentinel for undated */
export function extractSortDate(content: string): string {
    return content.match(/@(\d{4}-\d{2}-\d{2})/)?.[1] ?? '9999-99-99';
}

/** Pure: escapes a value for CSV output */
export function csvEscape(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/** Pure: returns true if content is overdue by more than 7 days */
export function isEscalatable(content: string, today: Date = new Date()): boolean {
    const m = content.match(/@(\d{4}-\d{2}-\d{2})/);
    if (!m) { return false; }
    const [y, mo, d] = m[1].split('-').map(Number);
    const due        = new Date(y, mo - 1, d);
    const todayMid   = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.floor((todayMid.getTime() - due.getTime()) / 86400000) > 7;
}

/** Pure: parses a ~Nh/~Nm/~NhNm estimate string to total minutes */
export function parseEstimateToMinutes(content: string): number {
    const match = content.match(/~(\d+h)?(\d+m)?/);
    if (!match || (!match[1] && !match[2])) { return 0; }
    return (match[1] ? parseInt(match[1]) : 0) * 60 + (match[2] ? parseInt(match[2]) : 0);
}

/** Pure: formats total minutes as a readable string */
export function formatTotalMinutes(total: number): string {
    if (total === 0)  { return '0m'; }
    if (total < 60)   { return `${total}m`; }
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Pure: collects item count per section from document lines */
export interface SectionCount { name: string; count: number; }

export function collectSectionCounts(lines: Array<{ text: string }>, prefix: string): SectionCount[] {
    const HEADER_RE = /^> [^>]/;
    const BULLET_RE = new RegExp(`^(>{2,}) ${prefix === '-' ? '-' : prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (.*)$`);
    const NUM_RE    = /^(>{2,}) \d+\. (.*)$/;
    const results: SectionCount[] = [];
    let name  = '', count = 0;
    for (const { text } of lines) {
        if (HEADER_RE.test(text)) {
            if (name) { results.push({ name, count }); }
            name  = text.replace(/^> /, '').replace(/\s*==\d+/, '').replace(/\s*\[colour:[^\]]+\]/gi, '').trim();
            count = 0;
        } else if (BULLET_RE.test(text) || NUM_RE.test(text)) {
            count++;
        }
    }
    if (name) { results.push({ name, count }); }
    return results.sort((a, b) => b.count - a.count);
}

/** Pure: scores item content by marker density */
export function scoreItemComplexity(content: string): {
    priority: number; tags: number; estimate: number;
    dueDate: number; expiry: number; vote: number; label: number; total: number;
} {
    const priority = content.match(/^!!!/) ? 3 : content.match(/^!!/) ? 2 : content.match(/^!/) ? 1 : 0;
    const tags     = (content.match(/#\w+/g) ?? []).length;
    const estimate = /~\w+/.test(content) ? 1 : 0;
    const dueDate  = /@\d{4}-\d{2}-\d{2}/.test(content) ? 1 : 0;
    const expiry   = /@expires:\d{4}-\d{2}-\d{2}/.test(content) ? 1 : 0;
    const vote     = /\+\d+/.test(content) ? 1 : 0;
    const label    = /\[[A-Z][^\]]*\]/.test(content) ? 1 : 0;
    const total    = priority + tags + estimate + dueDate + expiry + vote + label;
    return { priority, tags, estimate, dueDate, expiry, vote, label, total };
}

/** Pure: finds and evaluates the first =expr in content */
export function evaluateExpression(content: string): { original: string; result: number } | null {
    const match = content.match(/=([0-9+\-*/.() ]+)/);
    if (!match) { return null; }
    try {
        const expr = match[1].trim();
        if (!/^[0-9+\-*/.() ]+$/.test(expr)) { return null; }
        // eslint-disable-next-line no-new-func
        const result = new Function(`return (${expr})`)() as number;
        if (typeof result !== 'number' || !isFinite(result)) { return null; }
        return { original: match[0], result: Math.round(result * 10000) / 10000 };
    } catch { return null; }
}

/** Pure: collects per-mention (@Name) stats from document lines */
export interface MentionStat { name: string; total: number; done: number; }

export function collectMentionStats(
    lines: Array<{ text: string }>,
    prefix: string
): MentionStat[] {
    const MENTION_RE = /@([A-Z][A-Za-z]+)/g;
    const DATE_RE    = /@\d{4}-\d{2}-\d{2}/g;
    const CHECK_DONE = /^\[x\] /i;
    const CHECK_ANY  = /^\[(x| ?)\] /i;
    const BULLET_RE  = new RegExp(`^(>{2,}) ${prefix === '-' ? '-' : prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (.*)$`);
    const NUM_RE     = /^(>{2,}) \d+\. (.*)$/;
    const stats      = new Map<string, { total: number; done: number }>();
    for (const { text } of lines) {
        const bm = text.match(BULLET_RE);
        const nm = text.match(NUM_RE);
        const content = bm?.[2] ?? nm?.[2] ?? null;
        if (!content) { continue; }
        const stripped  = content.replace(DATE_RE, '');
        const mentions  = [...stripped.matchAll(MENTION_RE)].map(m => m[1]);
        if (mentions.length === 0) { continue; }
        const done = CHECK_ANY.test(content) && CHECK_DONE.test(content);
        for (const name of mentions) {
            if (!stats.has(name)) { stats.set(name, { total: 0, done: 0 }); }
            const s = stats.get(name)!;
            s.total++;
            if (done) { s.done++; }
        }
    }
    return [...stats.entries()]
        .map(([name, s]) => ({ name, ...s }))
        .sort((a, b) => b.total - a.total);
}
