---
name: validate-sprite
description: Validate PomodoroKnight ASCII sprites in sprites/*.txt (header, 24x10 size, printable ASCII, unique levels). Use when creating, editing, or reviewing a sprite, or when sprite validation fails in CI.
---

# Validate sprite

## When to use

- After creating or modifying any file in `sprites/`.
- Before committing sprite changes.
- When the `validate:sprites` CI step fails.

## Procedure

1. Run `npm run validate:sprites`.
2. If it passes, report the result and stop.
3. If it fails, map each error to a fix:

| Error                            | Fix                                                                       |
| -------------------------------- | ------------------------------------------------------------------------- |
| missing `level` or `name` header | Add `# level: <int>` and `# name: <text>` at the top of the file          |
| duplicate level                  | Pick a level number not used by another file in `sprites/`                |
| too wide (> 24)                  | Shorten or re-center the widest line; trailing spaces don't count         |
| too tall (> 10)                  | Remove or merge rows; blank lines at top/bottom are trimmed               |
| non-printable character          | Replace Unicode, emojis, tabs and control characters with ASCII 0x20-0x7E |
| empty body                       | Add the ASCII art after the header                                        |

4. Re-run `npm run validate:sprites` until it passes.

## Rules reference

- Header: `# level: <int >= 1>` (unique) and `# name: <non-empty>`.
- Body: max 24 columns x 10 rows, printable ASCII only, no tabs.
- Full rules: `.github/instructions/sprites.instructions.md`.
- Validator source: `scripts/validate-sprites.mjs`.

Do not commit sprites while validation fails.
