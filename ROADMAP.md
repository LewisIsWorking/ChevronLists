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
- ✅ `chevron-lists.blankLineAfterHeader` setting

---

## v0.4.0 — Smarter List Commands ✅
- ✅ `Chevron Lists: Select Section Items` command
- ✅ Fold/collapse chevron sections via standard VS Code fold gutter
- ⚠️ Known: VS Code's built-in blockquote folding also shows a fold arrow on the first `>> -` line

---

## v0.5.0 — Syntax Highlighting ✅
- ✅ TextMate grammar injected into markdown
- ✅ `> Header` lines coloured as section headings
- ✅ `>> -` and `>> 1.` prefixes styled distinctly from content

---

## v0.6.0 — Minimap Indicators ✅
- ✅ `> Header` lines appear as coloured markers in the overview ruler

---

## v0.6.1 — Copilot Fix ✅
- ✅ Tab no longer intercepts Copilot inline suggestions

---

## v1.0.0 — SOLID Refactor + Full Feature Set ✅
- ✅ Full SOLID refactor — 12 focused modules, all under 200 lines
- ✅ 43 unit tests, 100% coverage of all pure logic (Bun test runner)
- ✅ `Ctrl+Alt+Down` / `Ctrl+Alt+Up` — jump to next/previous `> Header`
- ✅ `Chevron Lists: Delete Section` command
- ✅ `Chevron Lists: Duplicate Section` command
- ✅ `Chevron Lists: Move Section Up` — swaps only chevron content, preserving separators
- ✅ `Chevron Lists: Move Section Down` — swaps only chevron content, preserving separators
- ✅ Hover tooltip on `> Header` showing item count and word count
- ✅ Status bar item showing total sections and items in the open file
- ✅ Multi-cursor Tab / Shift+Tab across range and multi-cursor selections

---

## v1.1.0 — Export ⬜
- ⬜ `Chevron Lists: Copy Section as Markdown` — convert to standard markdown bullet list and copy to clipboard
- ⬜ `Chevron Lists: Copy Section as Plain Text` — strip all prefixes and copy clean text to clipboard

---

## v1.2.0 — Sorting ⬜
- ⬜ `Chevron Lists: Sort Items A→Z` — sort all items under the nearest header alphabetically
- ⬜ `Chevron Lists: Sort Items Z→A` — reverse alphabetical sort
- ⬜ `Chevron Lists: Renumber Items` — fix/reset numbering on a `>> 1.` list after manual edits

---

## v1.3.0 — Snippets ⬜
- ⬜ `chl` + Tab → inserts a starter bullet chevron list block with Tab stops
- ⬜ `chn` + Tab → inserts a starter numbered chevron list block with Tab stops

---

## v1.4.0 — Search & Filter ⬜
- ⬜ `Chevron Lists: Search Items` — quick pick showing all items across all sections, jumping to selection
- ⬜ `Chevron Lists: Filter Section` — temporarily hide sections that don't match a keyword

---

## v1.5.0 — Themes ⬜
- ⬜ Semantic token colours so themes can style chevron headers and items independently
- ⬜ Built-in colour theme contribution with recommended chevron colour assignments

---
