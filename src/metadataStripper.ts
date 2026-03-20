import type { LineReader } from './types';

/** Strips all known Chevron Lists markers from item content, leaving plain text */
export function stripAllMetadata(content: string): string {
    let s = content;
    s = s.replace(/\[x\]\s*/gi, '');               // checkboxes
    s = s.replace(/\[ \]\s*/g, '');
    s = s.replace(/!{1,3}\s*/g, '');               // priority
    s = s.replace(/#[\w-]+/g, '');                 // tags
    s = s.replace(/@\d{4}-\d{2}-\d{2}/g, '');     // due dates
    s = s.replace(/@created:\d{4}-\d{2}-\d{2}/g, ''); // creation dates
    s = s.replace(/@(?:daily|weekly|monthly)/g, ''); // recurrence
    s = s.replace(/~\d+h(?:\d+m)?/g, '');          // time estimates (hours)
    s = s.replace(/~\d+m/g, '');                    // time estimates (minutes)
    s = s.replace(/\+\d+/g, '');                    // votes
    s = s.replace(/\* /g, '');                      // star marker
    s = s.replace(/\{(?:red|green|blue|yellow|orange|purple)\}\s*/g, ''); // colour labels
    s = s.replace(/~~(.+?)~~/g, '$1');              // strikethrough (keep text)
    s = s.replace(/\? /, '');                       // flag marker
    s = s.replace(/\s*\/\/.*$/, '');               // inline comments
    s = s.replace(/\[\[[\w\s]+\]\]/g, '');          // section links
    s = s.replace(/\[\[file:[^\]]+\]\]/g, '');      // file links
    s = s.replace(/\s{2,}/g, ' ').trim();
    return s;
}
