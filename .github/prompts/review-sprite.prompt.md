---
description: Review an ASCII sprite against the PomodoroKnight sprite rules
agent: agent
tools: ['search', 'runCommands']
---

# Review sprite

Review the sprite `${input:file:sprites/level-1.txt}` following `.github/instructions/sprites.instructions.md`.

## Steps

1. Read the sprite file.
2. Use the `validate-sprite` skill to run the validation and include any errors verbatim.
3. Assess the art: fits the tomato knight theme, clear outline, balanced and centered, complexity appropriate for its level.

## Output

Reply with:

- **Verdict**: PASS or FAIL
- **Rule violations**: list with line numbers (or "none")
- **Suggestions**: up to 3 concrete improvements

Do not edit any file; this is a read-only review.
