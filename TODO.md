# TODO · PomodoroKnight

> The **[D1]–[D6]** tags indicate which GH-600 exam domain each task practices (see [README](./README.md#-mapa-gh-600)).
> Tasks marked with 🎓 exist mainly to learn syntax or exam concepts.

## Phase 0 · Foundations
- [x] Vite + TypeScript scaffold (vanilla)
- [x] Configure `base: '/pomodoro-knight/'` in `vite.config.ts`
- [x] Set up Vitest with a sample test
- [x] Lint + formatting (ESLint + Prettier)
- [x] `validate:sprites` script (max dimensions 24×10, printable ASCII only, valid header)
- [x] CI workflow: lint + test + validate:sprites + build
- [x] Deploy workflow to GitHub Pages (Source: GitHub Actions)

## Phase 0.5 · Mastering GitHub Actions 🎓 [D2][D4][D5]
Goal: writing and **knowing how to read** every key without looking at the documentation.

### CI (`.github/workflows/ci.yml`)
- [x] Triggers: `push` to `main`, `pull_request`, and `workflow_dispatch`
- [x] `permissions: contents: read` at workflow level (least privilege)
- [x] Separate `lint`, `test`, `validate-sprites`, and `build` jobs, with `needs` so that `build` waits for the others
- [x] `strategy.matrix` in `test` with several Node versions (`[20, 22]`) and `fail-fast: false`
- [x] `concurrency` with `group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}` and `cancel-in-progress: true`
- [x] Job output: `validate-sprites` publishes the number of sprites via `$GITHUB_OUTPUT` → `jobs.<id>.outputs` → `build` reads it with `needs.<id>.outputs.<x>`
- [x] `build` uploads `dist/` with `actions/upload-artifact` (`retention-days`, `if-no-files-found: error`)
- [x] Write a summary to `$GITHUB_STEP_SUMMARY` (table of validated sprites)
- [x] Use the npm cache with `actions/setup-node` (`cache: npm`)

### Deploy (`.github/workflows/deploy.yml`)
- [x] `workflow_run` trigger (when CI finishes on `main`) or `push` to `main`
- [x] `permissions`: `pages: write`, `id-token: write`, `contents: read`
- [x] `environment: github-pages` with output URL (`steps.<id>.outputs.page_url`)
- [x] `concurrency: group: pages` with `cancel-in-progress: false` (and understand why it differs from CI's)
- [x] Download the build artifact with `actions/download-artifact`
- [x] Naming makes sense? Conventions? (ci.yml and deploy.yml)

### Lab (`.github/workflows/actions-lab.yml`) 🎓
- [x] Print contexts in the CI step summary: `github.ref`, `ref_name`, `head_ref`, `base_ref`, `sha`, `run_id`, `run_attempt`, `actor`, `event_name`

## Phase 1 · MVP
- [x] Pomodoro timer 25/5 (start / pause / reset)
- [x] Large ASCII digits for the timer
- [x] ASCII progress bar
- [x] `localStorage` persistence
- [x] Monospaced font and retro-terminal style

## Phase 1.5 · Copilot customization [D1][D2]
- [x] `.github/copilot-instructions.md` (stack, commands, ASCII art rules)
- [x] `.github/instructions/sprites.instructions.md` with `applyTo: "sprites/**"`
- [x] Reusable prompt `.github/prompts/review-sprite.prompt.md`
- [x] Skill `.github/skills/validate-sprite/SKILL.md`
- [x] Agent `sprite-reviewer.agent.md` → `tools: [read, search]` (read-only)
- [x] Agent `blacksmith.agent.md` → `tools: [read, search, edit, execute]`
- [x] Agent `orchestrator.agent.md` → `tools: [read, search, agent]`

> **Order:** phases 2–4 cover the GH-600 exam (CI/CD, native Copilot, guardrails). Phases 5–7 are development and polish, to do afterwards.

## Phase 2 · CI/CD and repo governance 🎓 [D2][D4][D6]
- [x] Protect `main` with a ruleset: required PR + required CI checks [D6]
- [x] Add `run-name:` to the workflows (e.g. deploy: `Deploy (${{ github.event_name }})`) and optional readable `name:` on jobs, to identify runs better in the Actions UI
- [x] `if:` conditionals with `success()`, `failure()`, `always()`, and `contains()` (e.g. `always()` on the sprite summary, `failure()` for notifications)
- [x] Notify (issue or comment) when a deploy fails
- [x] Extract GitHub Pages artifact publication into a reusable `workflow_call` workflow, called by `deploy.yml` and ready for rollback/staging callers
- [x] Add a *required reviewer* to the environment to practice manual approvals [D6]
- [x] Enable secret scanning + push protection, CodeQL, and dependency review [D6]
- [x] 🎓 Concurrency with `queue: max` (e.g. a serialized job) and understand why it must not be combined with `cancel-in-progress: true` [D5]

## Phase 3 · Native Copilot: CLI, cloud agent, and multi-agent [D2][D3][D5]
- [ ] `.github/workflows/copilot-setup-steps.yml` (`copilot-setup-steps` job: Node + `npm ci`)
- [ ] Native "blacksmith": workflow with `copilot -p --agent=blacksmith --no-ask-user` and `COPILOT_GITHUB_TOKEN`
- [ ] Limit tools in CI with `--allow-tool` / `--deny-tool`
- [ ] Issue templates (bug / content / feature)
- [ ] Assign a content issue to the cloud agent and practice: **View session**, `@copilot` on the PR, **Approve and run workflows**
  - Stalled-agent recovery: unassign + reassign the issue, repeat the comment, confirm that the commenter has write access
- [ ] 🎓 Agent frontmatter: `description` is required (`name` is not), omitting `tools` = all tools, `tools: []` = none; try `model`, `target`, `disable-model-invocation`, `user-invocable`
- [ ] Agent `auditor.agent.md` (read-only; prerequisite for the pipeline)
- [ ] Agent-assisted deployment risk assessment and approval [D2][D3][D6]
  - Deterministic `classify-changes` job (`dorny/paths-filter` or `git diff --name-only`) publishes `risky=true|false` for the deployment gate
  - The auditor agent produces a human-readable risk summary for the reviewer; it advises but never decides the gate
  - Two deploy jobs call `deploy-pages.yml`: `deploy-auto` uses an unprotected environment when `risky == 'false'`; `deploy-reviewed` uses an environment with *Required reviewers* when `risky == 'true'`
  - Understand the limitation: required reviewers belong to an environment, not a conditional; use two environments (e.g. `github-pages` and `github-pages-reviewed`)
- [ ] `review` + `audit` → `consolidate` pipeline with `needs` and artifacts
- [ ] Variant with `strategy.matrix.agent: [sprite-reviewer, auditor]`
- [ ] MCP: add a `local` server (command/args) and an `http` (url) server to an agent; try `server/tool` vs. `server/*`
  - Same servers in JSON (`.vscode/mcp.json` → `mcpServers`) vs. agent YAML (`mcp-servers`); adapt `inputs`/`envFile` → `env`
  - Know when to use `sse` (top-level `url`, legacy endpoint) and that a URL inside `args` (`mcp-remote`) is still `local`
  - Secrets for the cloud agent must start with `COPILOT_MCP_` (Agents secrets, not Actions secrets)
- [ ] Weekly chronicle workflow in epic tone (`schedule` with cron) [D2]
- [ ] 🎓 Local CLI practice: `/plan`, `/delegate`, `/fleet`, `--resume`, `--continue`, `--autopilot`
  - Also: `/session`, `/ide`, `/mcp`, `/review`, `/pr`, `--available-tools`, `--output-format=json`, `--disable-builtin-mcps`
- [ ] 🎓 Inspect `~/.copilot/logs/` and `~/.copilot/session-state/<id>/events.jsonl` (new vs. resumed session)

## Phase 4 · Guardrails and hooks [D4][D6]
- [ ] `.github/hooks/policy.json` with `preToolUse` + `matcher: "bash"` denying `git push`
  - Provide both `bash` and `powershell` entries (the cloud agent runs on Linux and ignores PowerShell-only hooks); remember that `matcher` is anchored (`"bash|powershell"`)
  - Return `permissionDecision: "ask"` once and confirm that the cloud agent treats it as a denial
- [ ] 🎓 `preToolUse` vs. `permissionRequest` (CLI only, `behavior`/`message`/`interrupt`): which one applies to the cloud agent and why
- [ ] 🎓 Log the hook payload and map `toolName` (`view`, `grep`, `glob`, `edit`, `create`, `bash`, `task`) to agent tools; check `sessionStart.source` (`new` vs. `resume`)
- [ ] Hook denying `edit`/`create` outside `sprites/` for the Blacksmith
- [ ] `postToolUse` / `sessionEnd` hook logging a session summary
- [ ] 🎓 Deliberately cause failures (nonexistent artifact, npm `E401`, blocked direct push) and document root cause + fix in `docs/incidents.md`

## Phase 5 · Game features
- [ ] XP system per completed pomodoro
- [ ] Level curve in `levels.json`
- [ ] 5 tomato sprites (one per level) in `.txt`
- [ ] Anti-cheat: invalidate the pomodoro when switching tabs or pausing too long

## Phase 6 · Agentic workflows (gh-aw) and agent-generated content
> gh-aw is **not part of GH-600**, but it compiles to Actions: reviewing the generated `.lock.yml` is good YAML reading practice.
- [ ] Install gh-aw and configure the engine (secret)
- [ ] Issue Triage workflow
- [ ] CI Doctor workflow
- [ ] 🎓 Read each workflow's `.lock.yml` and identify `permissions`, `safe-outputs` jobs, and `concurrency`
- [ ] Blacksmith workflow `/forge` (generates sprite + opens PR)
- [ ] Sprite Preview workflow (comments the sprite on the PR)

## Phase 7 · Extras
- [ ] **Pi local setup**: Create `.agents/skills/validate-sprite/SKILL.md` and `~/.pi/agent/prompts/validate-sprite.md` for local pi usage (differs from GitHub Copilot's `.github/instructions/` model)
- [ ] Validate the `run_id` in manual deploys (`gh run view`: workflow = CI, conclusion = success, branch = main)
- [ ] Consider per-PR preview deploys (`pr-preview-action` / Netlify / Cloudflare)
- [ ] Consider a backend and user accounts
- [ ] Consider mechanics beyond the cosmetic (battles against Procrastination 👹)

## Phase 8 · Loose ends from completed phases
- [ ] 🎓 Review overlap between the `validate-sprite` skill and the `review-sprite` prompt (and `sprites.instructions.md`); decide what each one owns
- [ ] Multi-IDE setup: add `AGENTS.md` at the root (single source for commands/layout/boundaries) and trim `copilot-instructions.md` to Copilot-specific content [D2]

## Out of repo scope (study as theory) 📚
- Organization/enterprise MCP policies (registry, allowlist)
- Organization audit log (`artifact.destroy`, `actor`, `@timestamp`)
- Copilot SDK (`createSession`, `resumeSession`, `onPreToolUse`)
- Copilot Memory (repository facts vs. user preferences) and context drift (causes and fixes) [D3]
- Firewall allowlist (network egress) vs. MCP allowlist/registry (MCP server usage) [D6]
- Guided lab: [gh-600-lab-instructions](https://github.com/sameeraman/gh-600-lab-instructions)
