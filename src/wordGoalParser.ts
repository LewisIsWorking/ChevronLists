/** Regex matching ==N word count goal in a header: > My Section ==500 */
export const GOAL_RE = /==(\d+)/;

/** Parses a word count goal from a header line */
export function parseWordCountGoal(headerText: string): number | null {
    const match = headerText.match(GOAL_RE);
    return match ? parseInt(match[1], 10) : null;
}

/** Returns the header display name with the ==N marker stripped */
export function headerNameWithoutGoal(headerText: string): string {
    return headerText.replace(/^> /, '').replace(GOAL_RE, '').trim();
}
