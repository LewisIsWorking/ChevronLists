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

### Templates
Run `CL: Insert Template` (`Ctrl+Shift+P`) to choose from 5 built-in templates:

| Template | Description |
|----------|-------------|
| Bullet List | Standard chevron bullet list |
| Numbered List | Chevron numbered list |
| Nested List | Two-level nested bullet list |
| Session Notes | RPG / meeting session notes |
| Character Sheet | Quick character / entity profile |

Add your own via `chevron-lists.templates` in settings.

### Navigation
- **Ctrl+Alt+Down** → jump to the next `> Header` in the file
- **Ctrl+Alt+Up** → jump to the previous `> Header` in the file

### Section Commands
All available via `Ctrl+Shift+P` — type `CL:` to filter:

| Command | Description |
|---------|-------------|
| `CL: Select Section Items` | Selects all items under the nearest `> Header` |
| `CL: Delete Section` | Deletes the entire section (header + items) |
| `CL: Duplicate Section` | Copies the section immediately below itself |
| `CL: Move Section Up` | Swaps the section with the one above |
| `CL: Move Section Down` | Swaps the section with the one below |

### Search & Filter
| Command | Description |
|---------|-------------|
| `CL: Search Items` | Live quick pick of all items in the current file with preview |
| `CL: Filter Sections` | Live quick pick of all headers in the current file |
| `CL: Search Items (Workspace)` | Search all chevron items across every markdown file in the workspace |
| `CL: Filter Sections (Workspace)` | Jump to any section in any markdown file in the workspace |

### Sorting & Renumbering
| Command | Description |
|---------|-------------|
| `CL: Sort Items A → Z` | Sorts bullet items alphabetically |
| `CL: Sort Items Z → A` | Reverse alphabetical sort |
| `CL: Renumber Items` | Resets numbered item sequence per chevron depth |

### Export
| Command | Description |
|---------|-------------|
| `CL: Copy Section as Markdown` | Converts section to `##` heading + list, copies to clipboard |
| `CL: Copy Section as Plain Text` | Strips all prefixes, copies clean text to clipboard |

### File Statistics
Run `CL: Show File Statistics` to open a webview panel showing section count, item count, word count, avg items per section, and a full section breakdown table.

### Outline View
Chevron sections appear in VS Code's **Outline panel** and **breadcrumb navigation**. Each section shows its name and item count. Expanding a section shows all its items as children. Clicking any entry jumps directly to that line.

### Colour Presets
Run `CL: Switch Colour Preset` to choose from 6 built-in colour themes:

| Preset | Description |
|--------|-------------|
| `default` | Amber headers, muted grey prefixes, blue numbers |
| `ocean` | Teal headers, slate prefixes, cyan numbers |
| `forest` | Green headers, dark green prefixes, lime numbers |
| `sunset` | Coral headers, muted orange prefixes, gold numbers |
| `monochrome` | Bold white headers, grey prefixes, silver numbers |
| `custom` | Clears all preset colours for full manual control |

### Hover Tooltip
Hover over any `> Header` line to see item count and word count for that section.

### Status Bar
Bottom-right status bar shows total section and item counts for the open file, updating as you type.

### Syntax Highlighting
- `> Header` lines are coloured as section headings
- `>> -` and `>> 1.` prefixes styled distinctly from content
- Colours driven by your active theme (or preset) automatically

### Folding
Each `> Header` block folds via the standard VS Code fold gutter arrow.

### Minimap Indicators
`> Header` lines appear as coloured markers in the overview ruler.


---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `chevron-lists.listPrefix` | `-` | Prefix character for list items. Change to `*` for `>> *`, etc. |
| `chevron-lists.blankLineAfterHeader` | `false` | Insert a blank line between `> Header` and the first item on Enter |
| `chevron-lists.snippetTrigger` | `tab` | How `chl`/`chn` snippets are triggered: `tab`, `ctrl+enter`, or `none` |
| `chevron-lists.colourPreset` | `default` | Built-in colour preset: `default`, `ocean`, `forest`, `sunset`, `monochrome`, `custom` |
| `chevron-lists.templates` | `[]` | User-defined templates for `CL: Insert Template` (name, description, body) |

---

## Development

```bash
bun install        # install dependencies
bun run compile    # compile TypeScript
bun test           # run unit tests with coverage
```

155 unit tests, 100% coverage of all pure logic.

### Releasing a new version

```powershell
.\release.ps1 -Version 2.1.0
```

This will: run tests, warn if no CHANGELOG entry exists, bump `package.json`, compile, package the `.vsix`, commit and push to GitHub, then open the Marketplace upload page.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
