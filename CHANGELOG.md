# Changelog

## [17.1.0] - 2026-03-20
### Added
- `CL: Show Age Stats` — oldest, newest, and average age of `@created:` stamped items in the current section
- `CL: Set Section Colour` — tags the section header with `[colour:X]` and renders it in that colour token
- `CL: Stamp All Items` — adds `@created:today` to every unstamped item in the section at once
### Improved
- Status bar tooltip now shows full stats with completion % and links to statistics panel

## [16.7.0] - 2026-03-20
### Added
- `CL: Show Word Cloud` — proportionally-sized SVG word cloud for the most frequent words in the current section
- `CL: Set Due Date` — natural-language date input on the item at cursor: ISO, weekday names, `+7`, `today`, `next week`, `next month`
- `CL: Find Similar Sections` — Levenshtein similarity flags section name pairs that may be duplicates
- `CL: Show Vote Leaderboard` — all `+N` voted items across the file sorted by vote count descending

## [15.9.0] - 2026-03-20
### Added
- `CL: Group Items by Tag` — clusters items in the section by primary `#tag`, inserting `// #tag` divider lines between groups
- `CL: Show Progress Report` — opens a side panel with per-section summary: items, done/total %, words/goal, flagged, overdue
- `CL: Merge Item with Next` — joins the item at the cursor with the item below it, separated by ` — `
- `CL: Split Item at Cursor` — splits the item at the cursor position into two separate items

## [15.5.0] - 2026-03-20
### Added
- **Smart Tab for autocomplete** — Tab now confirms the suggestion widget if open, falling through to indent only when it's not
- `CL: Copy Item as Rich Text` — converts marker syntax to readable symbols (✓/☐, 🔴/🟠/🟡, ⭐, ❓) before copying
- `CL: Show Dependency Graph` — webview SVG graph of all `>>depends:` relationships in the file
- `CL: Set Expiry on All Items` — sets `@expires:YYYY-MM-DD` on every item in the current section at once

## [15.1.0] - 2026-03-20
### Added
- `CL: Toggle Section Summary` / `CL: Toggle Checklist Progress Bar` / `CL: Toggle Word Goal Bar` / `CL: Toggle Age Highlight` / `CL: Toggle All Decorations`
- `CL: Filter by Colour Label (Workspace)` — cross-file colour filter
- `@expires:YYYY-MM-DD` syntax + `CL: Show Expired Items`
- `CL: Browse Templates` — webview gallery with preview and one-click insert

## [14.7.0] - 2026-03-20
### Added
- **Section Summary Decoration** — live `(N items · N done · N tags)` ghost text after every header
- **Checklist Progress Bar** — live `▓▓▓░░ N/N` bar on headers with checkbox items (red/amber/green)
- `CL: Export All Sections as JSON` — full file export to JSON on disk
- `CL: Rewrite Item (AI)` — Claude rewrites item content, all markers preserved

## [14.3.0] - 2026-03-20
### Added
- `chevron-lists.dailyNoteTemplate` setting with `{{date}}`, `{{weekday}}`, `{{day}}` placeholders
- `CL: Copy Section As…` — Markdown, Plain Text, JSON, CSV, HTML in one quick pick
- **Item Age Highlight** — items with `@created:` dates 30+ days old rendered muted/italic
- `CL: Bulk Set Rating` — sets `★N` on every item in the section at once

## [13.9.0] - 2026-03-20
### Added
- **Overdue count badge** — `⚠ N overdue` in status bar; click opens `CL: Show Upcoming`
- `CL: Copy Section as JSON` — full structured JSON with all parsed marker data
- `CL: Move Item to File` — moves item to any section in any workspace file
- `CL: Open Daily Note` — opens/creates `YYYY-MM-DD.md`; `chevron-lists.dailyNotesFolder` setting

## [13.5.0] - 2026-03-20
### Added
- **Rating autocomplete** — `★` triggers `★1`–`★5` with star previews
- `CL: Show Section Weights` — ranks sections by composite score (items×3 + priority + votes + tags)
- `CL: Shift All Due Dates` — shifts every `@date` in section by ±N days
- `CL: Show Completion Streak` — sections where all checkboxes are done

## [13.1.0] - 2026-03-20
### Added
- `CL: Filter by Colour Label` — grouped colour quick pick with counts
- `CL: Pin Section to Top` — moves section to first position
- `★N` star rating syntax (1–5) + `CL: Set Item Rating` + `CL: Filter by Rating`
- `CL: Start Section Timer` + `CL: Stop Section Timer` — live elapsed-time decoration
### Fixed
- `CL: Set List Start Number` now has two modes: **rebase** (on a numbered item — renumbers from cursor down) and **insert** (on a blank line — drops a new item)
- `bad-numbering` diagnostic now squiggles the item **before** the break, not after

## [12.7.0] - 2026-03-20
### Added
- **Estimate autocomplete** — `~` triggers `~15m`, `~30m`, `~1h`, `~2h`, `~4h`, `~1d`
- **Statistics panel refreshed** — done/total, tags, colour labels, flagged, commented, stamped per section; word goal bars
- `CL: Show Tag Report (Workspace)` — all tags with per-file item counts

## [12.3.0] - 2026-03-20
### Added
- **Priority autocomplete** — `!` triggers `!`/`!!`/`!!!` with descriptions
- **Date autocomplete** — `@` triggers today/tomorrow/next Friday/next week/next month
- `CL: Insert Item Snippet` — 10 pre-configured item templates
- `CL: Insert File Section Link` — inserts `[[file:name.md#SectionName]]`

## [11.9.0] - 2026-03-20
### Added
- `CL: Section Health Check` — empty-content, duplicate, and too-long item detection
- **Tag autocomplete** — `#` suggests existing tags sorted by frequency
- **Mention autocomplete** — `@` suggests known `@PersonName` mentions
- **Section link autocomplete** — `[[` suggests all section headers

## [11.5.0] - 2026-03-20
### Added
- `CL: Show Jump History` — quick pick of all 10 stored positions
- `CL: Duplicate Item and Increment` — `Draw card 1` → `Draw card 2`
- **Word Goal Progress Bar** — live `▓▓▓░░░░░░░ 147/500` on headers with `==N` goals
- `CL: New Section` — prompts for name, inserts header + blank item

## [11.1.0] - 2026-03-20
### Added
- **Smart Header Split** — Enter mid-line on `> Header` splits into two headers
- `CL: Paste Clipboard as Section` — first line → header, remaining lines → items
- `CL: Fold All Sections` + `CL: Unfold All Sections`
- `CL: Remove Old Items` — deletes items older than N days with confirmation

## [10.7.0] - 2026-03-20
### Added
- `CL: Move Item to Section` — true move (removes original)
- `CL: Diff Two Sections` — `+`/`-` diff in side panel
- `CL: Clear All Priority` + `CL: Clear All Due Dates`
- `CL: Toggle Item Count Badge` — live `(N)` decoration on headers

## [10.3.0] - 2026-03-20
### Added
- `CL: Edit Item Content` — input box with plain text; markers preserved on save
- `CL: Collect Items by Tag` — gathers tagged items into a new Results section
- `CL: Convert Section to Markdown Table` — items → `| # | Content |` table
- `chevron-lists.autoArchive` — auto-moves `[x]` items to `> Archive`

## [9.9.0] - 2026-03-20
### Added
- `CL: Rebase List From Here` + `CL: Offset List Numbers`
- `CL: Strip All Metadata` — removes all marker syntax from section items
- `CL: Show Word Frequency` — most-used words in the file
### Fixed
- `[LABEL]` square bracket highlighting no longer overlaps `chevronContent` tokens
- `bad-numbering` diagnostic: first item in a section can now start at any number

## [9.5.0] - 2026-03-20
### Added
- Full `CodeActionProvider` for all 5 diagnostic kinds (bad-numbering, duplicate-header, empty-section, overdue, word-goal)

## [9.4.0] - 2026-03-20
### Added
- `CL: Set List Start Number` — inserts or rebases a numbered list from a given number
- Code actions for `bad-numbering`: Fix this number · Set list start here · Fix all in file

## [9.3.0] - 2026-03-20
### Added
- `CL: Set List Start Number`

## [9.2.0] - 2026-03-20
### Added
- `CL: Move to Top of Section` + `CL: Move to Bottom of Section`
- `CL: Show Tag Heatmap` + `CL: Show Completion Heatmap`
- `@created:YYYY-MM-DD` syntax + `CL: Stamp Item with Date` + `CL: Show Old Items`
- `CL: Insert Table of Contents`

## [8.8.0] - 2026-03-20
### Added
- **esbuild bundling** — VSIX shrunk from 234KB/230 files to ~55KB/13 files
- **Colour theme fix** — `[markdown]: { enabled: true }` ensures semantic tokens fire in all themes
- 12 built-in colour presets: default, ocean, forest, sunset, monochrome, midnight, rose, autumn, arctic, neon, sepia, custom
- `ARCHITECTURE.md` — module boundary rules documented

---

*For history before v8.8.0 see the [GitHub repository](https://github.com/LewisIsWorking/ChevronLists).*
