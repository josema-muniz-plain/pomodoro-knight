# TODO · PomodoroKnight

> The **[D1]–[D6]** labels indicate which GH-600 exam domain each task practices (see the [README](./README.md#-gh-600-map)).
> Tasks marked 🎓 are primarily for learning exam syntax or concepts.

## Phase 0 · Foundations
- [ ] Scaffold Vite + TypeScript (vanilla)
- [ ] Set `base: '/pomodoro-knight/'` in `vite.config.ts`
- [ ] Configure Vitest with a sample test
- [ ] Linting + formatting (ESLint + Prettier)
- [ ] `validate:sprites` script (max dimensions 24×10, printable ASCII only, valid header)
- [ ] CI workflow: lint + test + validate:sprites + build
- [ ] GitHub Pages deploy workflow (Source: GitHub Actions)

## Phase 0.5 · Mastering GitHub Actions 🎓 [D2][D4][D5]
Goal: write and **know how to read** each key without looking at the documentation.

### CI (`.github/workflows/ci.yml`)
- [ ] Triggers: `push` to `main`, `pull_request`, and `workflow_dispatch`
- [ ] Workflow-level `permissions: contents: read` (least privilege)
- [ ] Separate `lint`, `test`, `validate-sprites`, and `build` jobs, with `needs` so `build` waits for the others
- [ ] `strategy.matrix` in `test` with multiple Node versions (`[20, 22]`) and `fail-fast: false`
- [ ] `concurrency` with `group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}` and `cancel-in-progress: true`
- [ ] Job output: `validate-sprites` publishes the number of sprites via `$GITHUB_OUTPUT` → `jobs.<id>.outputs` → read by `build` using `needs.<id>.outputs.<x>`
- [ ] `build` uploads `dist/` with `actions/upload-artifact` (`retention-days`, `if-no-files-found: error`)
- [ ] Write a summary to `$GITHUB_STEP_SUMMARY` (table of validated sprites)
- [ ] Use npm caching with `actions/setup-node` (`cache: npm`)

### Deploy (`.github/workflows/deploy.yml`)
- [ ] Trigger on `workflow_run` (when CI completes on `main`) or `push` to `main`
- [ ] `permissions`: `pages: write`, `id-token: write`, `contents: read`
- [ ] `environment: github-pages` with an output URL (`steps.<id>.outputs.page_url`)
- [ ] Add a *required reviewer* to the environment to practice manual approvals [D6]
- [ ] `concurrency: group: pages` with `cancel-in-progress: false` (and understand why it's different from CI)
- [ ] Download the build artifact with `actions/download-artifact`

### Lab (`.github/workflows/actions-lab.yml`) 🎓
- [ ] `workflow_dispatch` with `inputs` of types `string`, `boolean`, and `choice`
- [ ] Print contexts: `github.ref`, `ref_name`, `head_ref`, `base_ref`, `sha`, `run_id`, `run_number`, `run_attempt`, `actor`, `triggering_actor`, `workflow`
- [ ] Compare their values on `push`, `pull_request`, and a *re-run* (record findings in `docs/actions-contexts.md`)
- [ ] Compare `actions/checkout` with `ref: ${{ github.head_ref }}` to the default checkout on a PR
- [ ] `if:` conditionals using `success()`, `failure()`, `always()`, and `contains()`
- [ ] Reusable workflow with `on: workflow_call` (inputs + secrets + outputs) and call it from CI

## Phase 1 · MVP
- [ ] 25/5 Pomodoro timer (start / pause / reset)
- [ ] Large ASCII digits for the timer
- [ ] ASCII progress bar
- [ ] XP system for completed pomodoros
- [ ] Level curve in `levels.json`
- [ ] 5 tomato sprites (one per level) in `.txt` files
- [ ] Persistence in `localStorage`
- [ ] Anti-cheating: invalidate the pomodoro when switching tabs or pausing for too long
- [ ] Monospaced font and retro-terminal style

## Phase 1.5 · Copilot customization [D1][D2]
- [ ] `.github/copilot-instructions.md` (stack, commands, ASCII art rules)
- [ ] `.github/instructions/sprites.instructions.md` with `applyTo: "sprites/**"`
- [ ] Root-level `AGENTS.md`
- [ ] Reusable prompt `.github/prompts/review-sprite.prompt.md`
- [ ] Skill `.github/skills/validate-sprite/SKILL.md`
- [ ] `sprite-reviewer.agent.md` agent → `tools: [read, search]` (read-only)
- [ ] `herrero.agent.md` agent → `tools: [read, search, edit, execute]`
- [ ] `orchestrator.agent.md` agent → `tools: [read, search, agent]`
- [ ] Protect `main` with a ruleset: required PR + required CI checks [D6]

## Phase 2 · First agentic workflows (gh-aw)
> gh-aw **isn't covered by GH-600**, but it compiles to Actions: reviewing the generated `.lock.yml` is good practice for reading YAML.
- [ ] Install gh-aw and configure the engine (secret)
- [ ] Issue Triage workflow
- [ ] CI Doctor workflow
- [ ] Issue templates (bug / content / feature)
- [ ] 🎓 Read each workflow's `.lock.yml` and identify `permissions`, `safe-outputs` jobs, and `concurrency`

## Phase 3 · Agent-generated content
- [ ] Blacksmith `/forge` workflow (generates a sprite + opens a PR)
- [ ] Sprite Preview workflow (comments on the sprite in the PR)

## Phase 3.5 · Native Copilot: CLI, cloud agent, and multi-agent [D2][D3][D5]
- [ ] Native Blacksmith: workflow using `copilot -p --agent=herrero --no-ask-user` and `COPILOT_GITHUB_TOKEN`
- [ ] Restrict tools in CI with `--allow-tool` / `--deny-tool`
- [ ] `.github/workflows/copilot-setup-steps.yml` (`copilot-setup-steps` job: Node + `npm ci`)
- [ ] Assign a content issue to the cloud agent and practice: **View session**, `@copilot` in the PR, **Approve and run workflows**
- [ ] `review` + `audit` → `consolidate` pipeline using `needs` and artifacts
- [ ] Variant using `strategy.matrix.agent: [sprite-reviewer, auditor]`
- [ ] MCP: add a `local` server (command/args) and an `http` server (url) to an agent; test `server/tool` vs. `server/*`
- [ ] 🎓 Local CLI practice: `/plan`, `/delegate`, `/fleet`, `--resume`, `--continue`, `--autopilot`
- [ ] 🎓 Inspect `~/.copilot/logs/` and `~/.copilot/session-state/<id>/events.jsonl` (new vs. resumed session)

## Phase 3.75 · Guardrails and hooks [D4][D6]
- [ ] `.github/hooks/policy.json` with `preToolUse` + `matcher: "bash"` that denies `git push`
- [ ] Hook that denies `edit`/`create` outside `sprites/` for the Blacksmith
- [ ] `postToolUse` / `sessionEnd` hook that logs a session summary
- [ ] Enable secret scanning + push protection, CodeQL, and dependency review
- [ ] 🎓 Intentionally trigger failures (missing artifact, `E401` in npm, blocked direct push) and document the root cause + fix in `docs/incidents.md`

## Phase 4 · Extras
- [ ] Weekly Chronicle workflow in an epic tone (`schedule` with cron) [D2]
- [ ] Consider preview deploys for PRs (`pr-preview-action` / Netlify / Cloudflare)
- [ ] Consider a backend and user accounts
- [ ] Consider mechanics beyond cosmetics (battles against Procrastination 👹)

## Out of scope for this repo (study in theory) 📚
- Organization/enterprise MCP policies (registry, allowlist)
- Organization audit log (`artifact.destroy`, `actor`, `@timestamp`)
- Copilot SDK (`createSession`, `resumeSession`, `onPreToolUse`)
- Guided lab: [gh-600-lab-instructions](https://github.com/sameeraman/gh-600-lab-instructions)
