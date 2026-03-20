/** A single user-defined or built-in template */
export interface ChevronTemplate {
    name:        string;
    description: string;
    body:        string; // VS Code snippet syntax with $1, $2, $0 tab stops
}

/** Built-in templates shipped with the extension */
export const BUILT_IN_TEMPLATES: ChevronTemplate[] = [
    {
        name:        'Bullet List',
        description: 'Standard chevron bullet list',
        body:        '> ${1:Section Header}\n>> - ${2:First item}\n>> - ${3:Second item}\n>> - $0',
    },
    {
        name:        'Numbered List',
        description: 'Chevron numbered list',
        body:        '> ${1:Section Header}\n>> 1. ${2:First item}\n>> 2. ${3:Second item}\n>> 3. $0',
    },
    {
        name:        'Nested List',
        description: 'Two-level nested bullet list',
        body:        '> ${1:Section Header}\n>> - ${2:Top item}\n>>> - ${3:Nested item}\n>>> - ${4:Nested item}\n>> - $0',
    },
    {
        name:        'Session Notes',
        description: 'RPG / meeting session notes template',
        body:        '> ${1:Session Title}\n>> - ${2:Key event}\n>> - ${3:Key event}\n>> - ${4:Key event}\n>> - Notes: $0',
    },
    {
        name:        'Character Sheet',
        description: 'Quick character / entity profile',
        body:        '> ${1:Character Name}\n>> - Role: ${2:role}\n>> - Traits: ${3:traits}\n>> - Notes: $0',
    },
];
