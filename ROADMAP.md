# Chevron Lists — Roadmap

## Legend
- ✅ Done
- 🚧 In progress
- ⬜ Not started

---

## v0.0.1 — Initial Release ✅
- ✅ Smart Enter after `> Header` starts `>> -` list item (no blank line)
- ✅ Smart Enter after `>> - Item` continues the list
- ✅ Smart Enter on empty `>> -` line stops the list and clears the prefix
- ✅ All other Enter presses behave normally

---

## v0.1.0 — Tab to Indent ✅
- ✅ Tab on a `>> -` line promotes it to `>>> -`
- ✅ Shift+Tab on a `>>> -` line demotes it back to `>> -`
- ✅ Full nested list hierarchy (arbitrary depth)

---

## v0.2.0 — Auto-Numbering ✅
- ✅ Support `>> 1.` style numbered chevron lists
- ✅ Auto-increment the number on each Enter
- ✅ Tab/Shift+Tab on numbered items picks up correct number at new depth

---

## v0.3.0 — Configurable Prefix ✅
- ✅ `chevron-lists.listPrefix` setting (default `-`, e.g. change to `*`)
- ✅ `chevron-lists.blankLineAfterHeader` setting (blank line between header and first item)

---

## v0.4.0 — Smarter List Commands ✅
- ✅ `Chevron Lists: Select Section Items` command selects all items under the nearest `> Header`
- ✅ Fold/collapse chevron sections via standard VS Code fold gutter (FoldingRangeProvider)
- ⚠️ Known: VS Code's built-in markdown blockquote folding also shows a fold arrow on the first `>> -` line — this is VS Code's own behaviour and cannot be suppressed by an extension

---

## v0.5.0 — Syntax Highlighting ✅
- ✅ TextMate grammar injected into markdown
- ✅ `> Header` lines coloured as section headings
- ✅ `>> -` and `>> 1.` prefixes styled distinctly from content

---

## v0.6.0 — Minimap Indicators ✅
- ✅ `> Header` lines appear as coloured markers in the overview ruler / scrollbar gutter

---

## v0.6.1 — Copilot Fix ✅
- ✅ Tab no longer intercepts Copilot inline suggestions

---

## v0.7.0 — Navigation ⬜
- ⬜ `Chevron Lists: Jump to Next Header` — move cursor to the next `> Header` line
- ⬜ `Chevron Lists: Jump to Previous Header` — move cursor to the previous `> Header` line
- ⬜ Keyboard shortcuts for both (e.g. `Alt+Down` / `Alt+Up`)

---

## v0.8.0 — Section Actions ⬜
- ⬜ `Chevron Lists: Delete Section` — delete a `> Header` and all its items in one command
- ⬜ `Chevron Lists: Duplicate Section` — copy a `> Header` and all its items below
- ⬜ `Chevron Lists: Move Section Up / Down` — swap a section with the one above or below

---

## v0.9.0 — Sorting ⬜
- ⬜ `Chevron Lists: Sort Items A→Z` — sort all `>> -` items under the nearest header alphabetically
- ⬜ `Chevron Lists: Sort Items Z→A` — reverse alphabetical sort
- ⬜ `Chevron Lists: Renumber Items` — fix/reset numbering on a `>> 1.` list after manual edits

---

## v1.0.0 — Section Statistics ⬜
- ⬜ Hover over a `> Header` line to see a tooltip showing item count and word count for that section
- ⬜ Status bar item showing total section count and item count for the open file

---

## v1.1.0 — Export ⬜
- ⬜ `Chevron Lists: Copy Section as Markdown` — convert the current section to standard markdown bullet list and copy to clipboard
- ⬜ `Chevron Lists: Copy Section as Plain Text` — strip all prefixes and copy clean text to clipboard

---

## v1.2.0 — Multi-cursor Support ⬜
- ⬜ Tab / Shift+Tab indent/dedent working correctly across multiple selected chevron list lines simultaneously

---

## v1.3.0 — Snippets ⬜
- ⬜ Built-in VS Code snippet: type `chl` + Tab to insert a starter chevron list block
- ⬜ Built-in VS Code snippet: type `chn` + Tab to insert a numbered chevron list block

---
