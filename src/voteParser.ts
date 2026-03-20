import type { LineReader } from './types';
import { parseBullet, parseNumbered } from './patterns';

/** Regex matching +N vote count at end of item content */
export const VOTE_RE = /\+(\d+)(?=\s*$)/;

export interface VoteMatch {
    count:          number;
    contentWithout: string;
}

/** Parses a vote count from item content */
export function parseVote(content: string): VoteMatch | null {
    const match = content.match(VOTE_RE);
    if (!match) { return null; }
    return {
        count:          parseInt(match[1], 10),
        contentWithout: content.replace(match[0], '').trimEnd(),
    };
}

/** Sets or updates the vote count on item content */
export function setVoteCount(content: string, count: number): string {
    const stripped = parseVote(content)?.contentWithout ?? content;
    return count > 0 ? `${stripped} +${count}` : stripped;
}

export interface VotedItem {
    count:   number;
    content: string;
    line:    number;
}

/** Collects all voted items sorted by count descending */
export function collectVotedItems(doc: LineReader, prefix: string): VotedItem[] {
    const results: VotedItem[] = [];
    for (let i = 0; i < doc.lineCount; i++) {
        const text    = doc.lineAt(i).text;
        const bullet  = parseBullet(text, prefix);
        const numbered = parseNumbered(text);
        const content  = bullet?.content ?? numbered?.content ?? null;
        if (!content) { continue; }
        const vote = parseVote(content);
        if (!vote) { continue; }
        results.push({ count: vote.count, content: vote.contentWithout, line: i });
    }
    return results.sort((a, b) => b.count - a.count);
}
