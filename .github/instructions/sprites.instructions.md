---
applyTo: "sprites/**"
---

# Sprite Creation & Modification Instructions

These instructions apply specifically to files in the `sprites/` directory. Follow these rules when creating, modifying, or reviewing ASCII art sprites.

## Sprite File Format

Every sprite file must follow this exact structure:

```
# level: <integer>
# name: <display-name>
<blank line optional>
<ascii-art-lines>
```

### Header Requirements

1. **`# level: <integer>`** (mandatory)
   - Must be >= 1
   - Must be unique across all sprite files (no duplicates)
   - Example: `# level: 1`, `# level: 5`

2. **`# name: <string>`** (mandatory)
   - Non-empty display name for the sprite
   - Can contain spaces and punctuation
   - Example: `# name: Tomatito`, `# name: Knight's Guardian`

### Header Rules
- Headers must be at the very top of the file
- Format: `# key: value` (space after `#`, space around `:`)
- No other content (comments, notes) before the body starts
- Body begins at the first non-header line

## ASCII Art Constraints

### Dimensions
- **Max width**: 24 columns (trailing spaces are ignored)
- **Max height**: 10 rows

Measure width excluding trailing whitespace. Example:
```
     .-'''-.          <- 7 columns (widest content)
```

### Character Set
- Only printable ASCII: 0x20–0x7E (space through tilde `~`)
- Allowed: `! " # $ % & ' ( ) * + , - . / 0-9 : ; < = > ? @ A-Z [ \ ] ^ _ ` a-z { | } ~`
- NOT allowed:
  - Unicode or emojis
  - Tabs (use spaces instead)
  - Control characters or non-printable chars
  - High-ASCII or extended ASCII

### Line Handling
- Empty lines at the start and end are trimmed automatically
- Empty lines in the middle of the sprite are preserved
- Trailing spaces on a line do not contribute to width
- Each row is independent (width calculated per row)

## Quality Checklist

Before creating or modifying a sprite, ensure:

- [ ] Header has `# level: N` where N is a positive integer
- [ ] Header has `# name: "..."` with a non-empty display name
- [ ] Level number is not used in any other sprite file
- [ ] Sprite body is not empty
- [ ] All lines are <= 24 characters (without trailing spaces)
- [ ] Total height is <= 10 rows
- [ ] No tabs; only spaces for alignment
- [ ] No Unicode, emojis, or special characters outside ASCII 0x20–0x7E
- [ ] File is saved as UTF-8 (no BOM)
- [ ] File ends with a newline

## Validation

After creating or modifying a sprite, always run:

```bash
npm run validate:sprites
```

This will:
1. Check header integrity (level, name)
2. Verify dimensions (24x10 max)
3. Confirm all characters are printable ASCII
4. Detect duplicate level numbers
5. Report errors with line-by-line details

If validation fails, do not commit. Fix the errors and run again.

## Examples

### Valid Sprite (level-1.txt)
```
# level: 1
# name: Tomatito
       \|/
     .-'''-.
    /  o o  \
   |    ^    |
    \  '-'  /
     '-----'
```
- Level: 1 (unique)
- Name: Tomatito (non-empty)
- Width: 7 (line `     .-'''-.`)
- Height: 6 rows
- All ASCII printable
- PASS

### Invalid Examples

❌ **Missing level header**
```
# name: Broken
  /\_/\
```
Error: falta la cabecera "level" (missing "level" header)

❌ **Duplicate level**
If another file already has `# level: 2`:
```
# level: 2
# name: Other
  ...
```
Error: nivel duplicado: 2 (duplicate level)

❌ **Too wide**
```
# level: 3
# name: BigSprite
abcdefghijklmnopqrstuvwxyz
```
Error: demasiado ancho: 26 > 24 (too wide)

❌ **Non-ASCII character**
```
# level: 4
# name: Emoji Sprite
  😀
```
Error: carácter no imprimible (ASCII) (non-printable character)

## Best Practices

1. **Design for the Pomodoro theme**: Sprites should represent tomato knights, progress levels, or related imagery
2. **Keep it simple**: ASCII art works best with bold shapes and clear outlines
3. **Centered alignment**: Usually sprites are centered on their 24-column canvas
4. **Progressive complexity**: Higher levels can have slightly more detail
5. **Test locally**: Create the file, run `npm run validate:sprites`, review output
6. **Commit with care**: Sprites are tracked in git; only commit when validation passes

## Common Patterns

### Centering a 7-character sprite on 24 columns
```
       <-- 8 spaces (24 - 7) / 2 = 8.5 ≈ 8
```

### Multi-line sprite with consistent alignment
```
# level: 2
# name: Progressive Knight
    ___
   / o \
  /  |  \
   \ | /
    \|/
```

## When to Validate

- After creating a new sprite file
- After modifying an existing sprite
- Before committing changes to `sprites/`
- In CI: validation runs automatically before build

---

**Last updated**: Phase 1.5  
**Related**: `copilot-instructions.md`, `scripts/validate-sprites.mjs`
