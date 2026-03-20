# Chevron Lists

A VS Code extension that adds smart keyboard behaviour for nested blockquote list syntax in markdown.

## Syntax

```markdown
> This is a section header
>> - First item
>> - Second item
>> - Third item
```

Numbered lists are also supported:

```markdown
> This is a section header
>> 1. First item
>> 2. Second item
>> 3. Third item
```

## Features

### Smart Enter
- **Enter** after a `> Header` → starts a `>> -` list item on the next line
- **Enter** after a `>> - Item` → continues the list with another `>> -` prefix
- **Enter** on an empty `>> -` line → stops the list and clears the prefix
- **Enter** after a `>> 1. Item` → continues with `>> 2.` (auto-incrementing)
- **Enter** on an empty `>> 1.` line → stops the numbered list
- All other Enter presses in markdown files behave normally

### Tab / Shift+Tab — Nesting
- **Tab** on a `>> -` line → promotes it to `>>> -` (deeper nesting)
- **Shift+Tab** on a `>>> -` line → demotes it back one level
- Works at arbitrary depth (`>>`, `>>>`, `>>>>`, etc.)
- Works on numbered items too, picking up the correct number at the new depth
- Multi-cursor aware — Tab/Shift+Tab across multiple selected chevron lines simultaneously
- Tab only fires when no Copilot inline suggestion is visible

### Navigation
- **Alt+Down** → jump to the next `> Header` in the file
- **Alt+Up** → jump to the previous `> Header` in the file

### Section Commands
All available via `Ctrl+Shift+P`:
- **Chevron Lists: Select Section Items** — selects all list items under the nearest `> Header`
- **Chevron Lists: Delete Section** — deletes the entire section (header + items)
- **Chevron Lists: Duplicate Section** — copies the section immediately below itself
- **Chevron Lists: Move Section Up** — swaps the section with the one above
- **Chevron Lists: Move Section Down** — swaps the section with the one below

### Hover Tooltip
- Hover over a `> Header` line to see item count and word count for that section

### Status Bar
- Shows total section and item counts for the open markdown file (bottom right)

### Syntax Highlighting
- `> Header` lines are coloured as section headings
- `>> -` and `>> 1.` prefixes are styled distinctly from item content
- Colours are driven by your active theme automatically

### Folding
- Each `> Header` block can be folded/collapsed via the standard VS Code fold gutter

### Minimap Indicators
- `> Header` lines appear as coloured markers in the overview ruler / scrollbar gutter

## Settings

| Setting | Default | Description |
|---|---|---|
| `chevron-lists.listPrefix` | `-` | Prefix character for list items. Change to `*` for `>> *`, etc. |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert a blank line between `> Header` and the first list item |

## Development

```bash
bun install       # install dependencies
bun run compile   # compile TypeScript
bun test          # run unit tests
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
