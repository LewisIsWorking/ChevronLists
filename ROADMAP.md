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

## v0.3.0 — Configurable Prefix ⬜
- ⬜ Let users define their own list prefix in VS Code settings
- ⬜ e.g. swap `>> -` for `>> *` or `>>> -`
- ⬜ Blank line behaviour toggle (insert blank line before `>> -` or not)

---

## v0.4.0 — Smarter List Commands ⬜
- ⬜ Select all `>> -` items under the current `> Header`
- ⬜ Fold/collapse everything between `> Header` and the next `>` header as a group

---

## v0.5.0 — Syntax Highlighting ⬜
- ⬜ Grammar contribution to colour-code `>` headers differently from regular blockquotes
- ⬜ Colour-code `>> -` items distinctly

---

## v0.6.0 — Minimap Indicators ⬜
- ⬜ Highlight `> Header` lines in the minimap for at-a-glance navigation

---
