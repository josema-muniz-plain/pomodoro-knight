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
- [ ] `workflow_dispatch` with `inputs` of types `string`, `boolean`, and `choice`
- [ ] Print contexts: `github.ref`, `ref_name`, `head_ref`, `base_ref`, `sha`, `run_id`, `run_number`, `run_attempt`, `actor`, `triggering_actor`, `workflow`
- [ ] Compare their values on `push`, `pull_request`, and on a *re-run* (note the results in `docs/actions-contexts.md`)
- [ ] `actions/checkout` with `ref: ${{ github.head_ref }}` vs. default checkout in a PR
- [ ] `if:` conditionals with `success()`, `failure()`, `always()`, and `contains()`
- [ ] Reusable workflow with `on: workflow_call` (inputs + secrets + outputs) and call it from CI

## Phase 1 · MVP
- [ ] Pomodoro timer 25/5 (start / pause / reset)
- [ ] Large ASCII digits for the timer
- [ ] ASCII progress bar
- [ ] `localStorage` persistence
- [ ] Monospaced font and retro-terminal style

## Phase 1.5 · Copilot customization [D1][D2]
- [ ] `.github/copilot-instructions.md` (stack, commands, ASCII art rules)
- [ ] `.github/instructions/sprites.instructions.md` with `applyTo: "sprites/**"`
- [ ] `AGENTS.md` at the root
- [ ] Reusable prompt `.github/prompts/review-sprite.prompt.md`
- [ ] Skill `.github/skills/validate-sprite/SKILL.md`
- [ ] Agent `sprite-reviewer.agent.md` → `tools: [read, search]` (read-only)
- [ ] Agent `herrero.agent.md` → `tools: [read, search, edit, execute]`
- [ ] Agent `orchestrator.agent.md` → `tools: [read, search, agent]`
- [ ] Protect `main` with a ruleset: required PR + required CI checks [D6]
- [ ] XP system per completed pomodoro
- [ ] Level curve in `levels.json`
- [ ] 5 tomato sprites (one per level) in `.txt`
- [ ] Anti-cheat: invalidate the pomodoro when switching tabs or pausing too long

## Phase 2 · First agentic workflows (gh-aw)
> gh-aw is **not part of GH-600**, but it compiles to Actions: reviewing the generated `.lock.yml` is good YAML reading practice.
- [ ] Install gh-aw and configure the engine (secret)
- [ ] Issue Triage workflow
- [ ] CI Doctor workflow
- [ ] Issue templates (bug / content / feature)
- [ ] 🎓 Read each workflow's `.lock.yml` and identify `permissions`, `safe-outputs` jobs, and `concurrency`

## Phase 3 · Agent-generated content
- [ ] Blacksmith workflow `/forge` (generates sprite + opens PR)
- [ ] Sprite Preview workflow (comments the sprite on the PR)

## Phase 3.5 · Native Copilot: CLI, cloud agent, and multi-agent [D2][D3][D5]
- [ ] Native "blacksmith": workflow with `copilot -p --agent=herrero --no-ask-user` and `COPILOT_GITHUB_TOKEN`
- [ ] Limit tools in CI with `--allow-tool` / `--deny-tool`
- [ ] `.github/workflows/copilot-setup-steps.yml` (`copilot-setup-steps` job: Node + `npm ci`)
- [ ] Assign a content issue to the cloud agent and practice: **View session**, `@copilot` on the PR, **Approve and run workflows**
- [ ] `review` + `audit` → `consolidate` pipeline with `needs` and artifacts
- [ ] Variant with `strategy.matrix.agent: [sprite-reviewer, auditor]`
- [ ] MCP: add a `local` server (command/args) and an `http` (url) server to an agent; try `server/tool` vs. `server/*`
- [ ] 🎓 Local CLI practice: `/plan`, `/delegate`, `/fleet`, `--resume`, `--continue`, `--autopilot`
- [ ] 🎓 Inspect `~/.copilot/logs/` and `~/.copilot/session-state/<id>/events.jsonl` (new vs. resumed session)

## Phase 3.75 · Guardrails and hooks [D4][D6]
- [ ] `.github/hooks/policy.json` with `preToolUse` + `matcher: "bash"` denying `git push`
- [ ] Hook denying `edit`/`create` outside `sprites/` for the Blacksmith
- [ ] `postToolUse` / `sessionEnd` hook logging a session summary
- [ ] Enable secret scanning + push protection, CodeQL, and dependency review
- [ ] 🎓 Deliberately cause failures (nonexistent artifact, npm `E401`, blocked direct push) and document root cause + fix in `docs/incidents.md`

## Phase 3.9 · Pipeline improvements 🎓 [D2][D4][D6]
- [ ] Conditional manual approval: only require a reviewer when the change is "risky" (e.g. changes in `.github/workflows/**`, `package.json`/lockfile, or `vite.config.ts`); docs/sprites-only changes deploy automatically
  - Idea: a `classify-changes` job (`dorny/paths-filter` or `git diff --name-only`) publishes `risky=true|false` as an output
  - Two deploy jobs: `deploy-auto` (no environment, `if: risky == 'false'`) and `deploy-reviewed` (environment with *Required reviewers*, `if: risky == 'true'`)
  - Understand the limitation: required reviewers are a property of the environment, not conditional, hence two environments (e.g. `github-pages` and `github-pages-reviewed`)
- [ ] Add a *required reviewer* to the environment to practice manual approvals [D6]
- [ ] Validate the `run_id` in manual deploys (`gh run view`: workflow = CI, conclusion = success, branch = main)
- [ ] Reusable workflow shared by CI and deploy for lint + test + build
- [ ] Notify (issue or comment) when a deploy fails
- [ ] Add `run-name:` to the workflows (e.g. deploy: `Deploy (${{ github.event_name }})`) and optional readable `name:` on jobs, to identify runs better in the Actions UI

## Phase 4 · Extras
- [ ] Weekly chronicle workflow in epic tone (`schedule` with cron) [D2]
- [ ] Consider per-PR preview deploys (`pr-preview-action` / Netlify / Cloudflare)
- [ ] Consider a backend and user accounts
- [ ] Consider mechanics beyond the cosmetic (battles against Procrastination 👹)

## Out of repo scope (study as theory) 📚
- Organization/enterprise MCP policies (registry, allowlist)
- Organization audit log (`artifact.destroy`, `actor`, `@timestamp`)
- Copilot SDK (`createSession`, `resumeSession`, `onPreToolUse`)
- Guided lab: [gh-600-lab-instructions](https://github.com/sameeraman/gh-600-lab-instructions)
