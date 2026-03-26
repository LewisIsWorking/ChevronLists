/**
 * patternsExtra.ts
 * Additional pure utilities — split from patternsExport.ts to stay under 200 lines.
 * Re-exported by patterns.ts so callers use a single import.
 */

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
