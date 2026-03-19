# Chevron Lists

A VS Code extension that adds smart Enter-key behaviour for nested blockquote list syntax in markdown.

## Syntax

```
> This is a section header
>> - First item
>> - Second item
>> - Third item
```

## Behaviour

- **Enter** after a `> Header` line → starts a `>> -` list item on the next line (no blank line)
- **Enter** after a `>> - Item` line → continues the list with another `>> -` prefix
- **Enter** on an empty `>> -` line → stops the list and clears the prefix

All other Enter presses in markdown files behave normally.

## License

CC BY-NC-ND 4.0 — © Lewis Creelman. No commercial use. No derivatives.
