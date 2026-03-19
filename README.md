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
- Works on numbered items too — picks up the correct number at the new depth
- Tab only fires when no Copilot inline suggestion is visible

### Syntax Highlighting
- `> Header` lines are coloured as section headings
- `>> -` and `>> 1.` prefixes are styled distinctly from item content
- Colours are driven by your active theme automatically

### Folding
- Each `> Header` block can be folded/collapsed via the standard VS Code fold gutter

### Minimap Indicators
- `> Header` lines appear as coloured markers in the overview ruler / scrollbar gutter

### Select Section Items
- Run `Chevron Lists: Select Section Items` (`Ctrl+Shift+P`) to select all list items under the nearest `> Header`

## Settings

| Setting | Default | Description |
|---|---|---|
| `chevron-lists.listPrefix` | `-` | Prefix character for list items. Change to `*` for `>> *`, etc. |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert a blank line between `> Header` and the first list item |

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
