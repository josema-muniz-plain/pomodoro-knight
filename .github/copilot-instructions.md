# Copilot Instructions — PomodoroKnight

This document defines the technical stack, available commands, and ASCII art rules for GitHub Copilot when working on the PomodoroKnight project.

---

## Technology Stack

### Frontend

- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 8.3+
- **Package Manager**: npm (Node 20+, 22)
- **Module System**: ES modules (`"type": "module"` in package.json)

### Testing & Quality

- **Test Framework**: Vitest 5.0+
- **Test Environment**: Node.js (globals enabled)
- **Linter**: ESLint 9.13+ with TypeScript support
- **Formatter**: Prettier 3.3+

### Environment

- **Deployment**: GitHub Pages via GitHub Actions
- **Base Path**: `/pomodoro-knight/` (set in `vite.config.ts`)
- **CI/CD**: GitHub Actions workflows

---

## Available Commands

All commands are defined in `package.json`:

### Development

```bash
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # TypeScript check + Vite bundle (tsc --noEmit && vite build)
npm run preview      # Preview production build locally
```

### Quality Assurance

```bash
npm run test         # Run Vitest in watch mode
npm run test:run     # Run Vitest once (CI mode)
npm run lint         # Check code with ESLint
npm run format       # Auto-format with Prettier
npm run format:check # Check formatting without changes
npm run validate:sprites  # Validate all sprites (see ASCII Art Rules section)
```

### Typical Workflows

- Before committing: `npm run lint && npm run format && npm run test:run`
- Sprite creation: Create `.txt` file in `sprites/`, then `npm run validate:sprites`
- Pre-deployment check: `npm run build && npm run test:run && npm run validate:sprites`

---

## ASCII Art Rules (Sprites)

All sprites are stored in `sprites/*.txt` and validated by `scripts/validate-sprites.mjs`.

### Structure

Each sprite file has two sections:

1. **Header** (metadata, required)
   - Format: `# key: value` (one per line at the start of the file)
   - Required keys:
     - `level: <integer>` — Must be >= 1, unique per file, no duplicates across all sprites
     - `name: <string>` — Display name of the sprite (not empty)

2. **Body** (the ASCII art)
   - Comes after the header block (first non-header line starts the body)
   - Can have multiple lines and spaces

### Constraints

- Max width: 24 columns (trailing spaces don't count)
- Max height: 10 rows
- Characters: Only printable ASCII (0x20–0x7E, space through tilde)
  - NOT allowed: Unicode, emojis, tabs, control characters
  - Allowed: `! " # $ % & ' ( ) * + , - . /` and alphanumerics, etc.
- Empty lines: Trimmed at top/bottom, preserved in the middle

### Example: sprites/level-1.txt

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

Validation:

- Width: 7 columns (widest line)
- Height: 6 rows
- All printable ASCII: PASS
- Header complete: level=1, name=Tomatito
- No duplicate levels: (assuming this is unique)

### Validation Rules (enforced by validate:sprites)

1. Every sprite file must have `level` and `name` headers
2. `level` must be a positive integer with no duplicates
3. Sprite body cannot exceed 24x10
4. Only printable ASCII characters allowed
5. Empty sprites (no body) are invalid
6. Validation runs in CI for every commit

---

## Code Style Conventions

### TypeScript

- Strict mode enabled (tsconfig.json)
- No `any` types without justification
- Use interfaces over types (where applicable)
- Explicit return types on functions

### Naming

- Files: kebab-case (e.g., `validate-sprites.mjs`, `level-1.txt`)
- Classes/Interfaces: PascalCase (e.g., `PomodoroTimer`, `GameState`)
- Functions/Variables: camelCase (e.g., `getCurrentLevel`, `isValidSprite`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_WIDTH`, `DEFAULT_POMODORO_DURATION`)

### File Organization

```
pomodoro-knight/
  src/                 # TypeScript source
  sprites/             # Sprite .txt files (ASCII art)
  scripts/             # Node.js build & validation scripts (.mjs)
  .github/
    workflows/         # GitHub Actions workflows
    instructions/      # Copilot context files
    copilot-instructions.md  # This file
  test/                # Vitest specs
  dist/                # Build output (generated, not committed)
```

### Formatting

- Prettier: 2-space indent, single quotes, semicolons, 80-char line wrap (configurable)
- ESLint: No unused variables, consistent arrow functions, etc.
- Run `npm run format` before committing

---

## Copilot Context

When working on this project:

1. Sprites: Follow the 24x10 ASCII art rules strictly. Always validate with `npm run validate:sprites`.
2. Commands: Suggest using npm scripts, not running raw node/vite commands.
3. Tests: Write Vitest tests for logic; use globals (no imports needed).
4. Types: Prioritize type safety; suggest TypeScript solutions over JavaScript.
5. CI/CD: Reference GitHub Actions workflows in `.github/workflows/` for deployment context.

---

## Key References

- Vite Config: `vite.config.ts` (base path, test environment)
- Sprite Validator: `scripts/validate-sprites.mjs` (rules and checks)
- CI Workflows: `.github/workflows/ci.yml` (lint, test, build, validate-sprites)
- README: `README.md` (general project goals and GH-600 exam domains)
- TODO: `TODO.md` (project phases and roadmap)

---

Last updated: Phase 1.5
Domains: [D1] Security & Policy, [D2] GitHub Actions & Automation
