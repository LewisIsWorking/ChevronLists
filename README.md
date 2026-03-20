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

Deep nesting works at any depth:

```markdown
> Section
>> - Top level item
>>> - Nested item
>>>> - Deeply nested item
```

---

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
- Works on numbered items, picking up the correct number at the new depth
- **Multi-cursor aware** — Tab/Shift+Tab across multiple selected lines simultaneously (Shift+click to select a range)
- Tab only fires when no Copilot inline suggestion is visible

### Snippets
Type a prefix and press your configured trigger key to insert a starter block:

| Prefix | Expands to |
|--------|-----------|
| `chl` | Chevron bullet list block with Tab stops |
| `chn` | Chevron numbered list block with Tab stops |

Configure the trigger key via `chevron-lists.snippetTrigger` (see Settings).

### Navigation
- **Ctrl+Alt+Down** → jump to the next `> Header` in the file
- **Ctrl+Alt+Up** → jump to the previous `> Header` in the file

### Section Commands
All available via `Ctrl+Shift+P`:

| Command | Description |
|---------|-------------|
| `Chevron Lists: Select Section Items` | Selects all list items under the nearest `> Header` |
| `Chevron Lists: Delete Section` | Deletes the entire section (header + items) |
| `Chevron Lists: Duplicate Section` | Copies the section immediately below itself |
| `Chevron Lists: Move Section Up` | Swaps the section with the one above (separators stay in place) |
| `Chevron Lists: Move Section Down` | Swaps the section with the one below (separators stay in place) |

### Sorting & Renumbering
All available via `Ctrl+Shift+P`:

| Command | Description |
|---------|-------------|
| `Chevron Lists: Sort Items A → Z` | Sorts all bullet items in the current section alphabetically |
| `Chevron Lists: Sort Items Z → A` | Reverse alphabetical sort |
| `Chevron Lists: Renumber Items` | Resets numbered item sequence back to 1, 2, 3... per chevron depth |

### Export
All available via `Ctrl+Shift+P`:

| Command | Description |
|---------|-------------|
| `Chevron Lists: Copy Section as Markdown` | Converts the section to a standard `##` heading + list and copies to clipboard |
| `Chevron Lists: Copy Section as Plain Text` | Strips all prefixes and copies just the header and item text to clipboard |

Both export commands preserve indentation for nested items.

### Hover Tooltip
Hover over any `> Header` line to see a tooltip showing the **item count** and **word count** for that section.

### Status Bar
The bottom-right status bar shows the total **section count** and **item count** for the open markdown file, updating as you type.

### Syntax Highlighting
- `> Header` lines are coloured as section headings
- `>> -` and `>> 1.` prefixes are styled distinctly from item content
- Colours are driven by your active theme automatically

### Folding
Each `> Header` block can be folded/collapsed via the standard VS Code fold gutter arrow.

### Minimap Indicators
`> Header` lines appear as coloured markers in the overview ruler and scrollbar gutter for at-a-glance navigation.

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `chevron-lists.listPrefix` | `-` | Prefix character for list items. Change to `*` for `>> *`, etc. |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert a blank line between `> Header` and the first list item on Enter |
| `chevron-lists.snippetTrigger` | `tab` | How `chl`/`chn` snippets are triggered: `tab`, `ctrl+enter`, or `none` |

### Snippet Trigger Options
- **`tab`** — type `chl` or `chn` then press Tab (default; may conflict with Copilot suggestions)
- **`ctrl+enter`** — type `chl` or `chn` then press Ctrl+Enter (no Copilot conflict)
- **`none`** — disable keyboard expansion; use `Insert Snippet` from the command palette

---

## Development

```bash
bun install        # install dependencies
bun run compile    # compile TypeScript
bun test           # run unit tests with coverage
```

92 unit tests, 100% coverage of all pure logic.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
