# TODO · PomodoroKnight

> The **[D1]–[D6]** tags indicate which GH-600 exam domain each task practices (see [README](./README.md#-mapa-gh-600)).
> Tasks marked with 🎓 exist mainly to learn syntax or exam concepts.

> **Task IDs:** `PK-NNN` are stable: do not renumber or reuse them. Each checkbox links to its individual plan in [docs/plans/](./docs/plans/README.md). Details without a checkbox belong to their parent task. Creating a plan does not change task status.

## Phase 0 · Foundations
- [x] [PK-001](docs/plans/completed/PK-001.md) Vite + TypeScript scaffold (vanilla)
- [x] [PK-002](docs/plans/completed/PK-002.md) Configure `base: '/pomodoro-knight/'` in `vite.config.ts`
- [x] [PK-003](docs/plans/completed/PK-003.md) Set up Vitest with a sample test
- [x] [PK-004](docs/plans/completed/PK-004.md) Lint + formatting (ESLint + Prettier)
- [x] [PK-005](docs/plans/completed/PK-005.md) `validate:sprites` script (max dimensions 24×10, printable ASCII only, valid header)
- [x] [PK-006](docs/plans/completed/PK-006.md) CI workflow: lint + test + validate:sprites + build
- [x] [PK-007](docs/plans/completed/PK-007.md) Deploy workflow to GitHub Pages (Source: GitHub Actions)

## Phase 0.5 · Mastering GitHub Actions 🎓 [D2][D4][D5]
Goal: writing and **knowing how to read** every key without looking at the documentation.

### CI (`.github/workflows/ci.yml`)
- [x] [PK-008](docs/plans/completed/PK-008.md) Triggers: `push` to `main`, `pull_request`, and `workflow_dispatch`
- [x] [PK-009](docs/plans/completed/PK-009.md) `permissions: contents: read` at workflow level (least privilege)
- [x] [PK-010](docs/plans/completed/PK-010.md) Separate `lint`, `test`, `validate-sprites`, and `build` jobs, with `needs` so that `build` waits for the others
- [x] [PK-011](docs/plans/completed/PK-011.md) `strategy.matrix` in `test` with several Node versions (`[20, 22]`) and `fail-fast: false`
- [x] [PK-012](docs/plans/completed/PK-012.md) `concurrency` with `group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}` and `cancel-in-progress: true`
- [x] [PK-013](docs/plans/completed/PK-013.md) Job output: `validate-sprites` publishes the number of sprites via `$GITHUB_OUTPUT` → `jobs.<id>.outputs` → `build` reads it with `needs.<id>.outputs.<x>`
- [x] [PK-014](docs/plans/completed/PK-014.md) `build` uploads `dist/` with `actions/upload-artifact` (`retention-days`, `if-no-files-found: error`)
- [x] [PK-015](docs/plans/completed/PK-015.md) Write a summary to `$GITHUB_STEP_SUMMARY` (table of validated sprites)
- [x] [PK-016](docs/plans/completed/PK-016.md) Use the npm cache with `actions/setup-node` (`cache: npm`)

### Deploy (`.github/workflows/deploy.yml`)
- [x] [PK-017](docs/plans/completed/PK-017.md) `workflow_run` trigger (when CI finishes on `main`) or `push` to `main`
- [x] [PK-018](docs/plans/completed/PK-018.md) `permissions`: `pages: write`, `id-token: write`, `contents: read`
- [x] [PK-019](docs/plans/completed/PK-019.md) `environment: github-pages` with output URL (`steps.<id>.outputs.page_url`)
- [x] [PK-020](docs/plans/completed/PK-020.md) `concurrency: group: pages` with `cancel-in-progress: false` (and understand why it differs from CI's)
- [x] [PK-021](docs/plans/completed/PK-021.md) Download the build artifact with `actions/download-artifact`
- [x] [PK-022](docs/plans/completed/PK-022.md) Naming makes sense? Conventions? (ci.yml and deploy.yml)

### Lab (`.github/workflows/actions-lab.yml`) 🎓
- [x] [PK-023](docs/plans/completed/PK-023.md) Print contexts in the CI step summary: `github.ref`, `ref_name`, `head_ref`, `base_ref`, `sha`, `run_id`, `run_attempt`, `actor`, `event_name`

## Phase 1 · MVP
- [x] [PK-024](docs/plans/completed/PK-024.md) Pomodoro timer 25/5 (start / pause / reset)
- [x] [PK-025](docs/plans/completed/PK-025.md) Large ASCII digits for the timer
- [x] [PK-026](docs/plans/completed/PK-026.md) ASCII progress bar
- [x] [PK-027](docs/plans/completed/PK-027.md) `localStorage` persistence
- [x] [PK-028](docs/plans/completed/PK-028.md) Monospaced font and retro-terminal style

## Phase 1.5 · Copilot customization [D1][D2]
- [x] [PK-029](docs/plans/completed/PK-029.md) `.github/copilot-instructions.md` (stack, commands, ASCII art rules)
- [x] [PK-030](docs/plans/completed/PK-030.md) `.github/instructions/sprites.instructions.md` with `applyTo: "sprites/**"`
- [x] [PK-031](docs/plans/completed/PK-031.md) Reusable prompt `.github/prompts/review-sprite.prompt.md`
- [x] [PK-032](docs/plans/completed/PK-032.md) Skill `.github/skills/validate-sprite/SKILL.md`
- [x] [PK-033](docs/plans/completed/PK-033.md) Agent `sprite-reviewer.agent.md` → `tools: [read, search]` (read-only)
- [x] [PK-034](docs/plans/completed/PK-034.md) Agent `blacksmith.agent.md` → `tools: [read, search, edit, execute]` (specialized in ASCII sprites)
- [x] [PK-035](docs/plans/completed/PK-035.md) Agent `orchestrator.agent.md` → `tools: [read, search, agent]`

> **Order:** phases 2–4 cover the GH-600 exam (CI/CD, native Copilot, guardrails). Phases 5–7 are development and polish, to do afterwards.

## Phase 2 · CI/CD and repo governance 🎓 [D2][D4][D6]
- [x] [PK-036](docs/plans/completed/PK-036.md) Protect `main` with a ruleset: required PR + required CI checks [D6]
- [x] [PK-037](docs/plans/completed/PK-037.md) Add `run-name:` to the workflows (e.g. deploy: `Deploy (${{ github.event_name }})`) and optional readable `name:` on jobs, to identify runs better in the Actions UI
- [x] [PK-038](docs/plans/completed/PK-038.md) `if:` conditionals with `success()`, `failure()`, `always()`, and `contains()` (e.g. `always()` on the sprite summary, `failure()` for notifications)
- [x] [PK-039](docs/plans/completed/PK-039.md) Notify (issue or comment) when a deploy fails
- [x] [PK-040](docs/plans/completed/PK-040.md) Extract GitHub Pages artifact publication into a reusable `workflow_call` workflow, called by `deploy.yml` and ready for rollback/staging callers
- [x] [PK-041](docs/plans/completed/PK-041.md) Add a *required reviewer* to the environment to practice manual approvals [D6]
- [x] [PK-042](docs/plans/completed/PK-042.md) Enable secret scanning + push protection, CodeQL, and dependency review [D6]
- [ ] [PK-043](docs/plans/PK-043.md) 🎓 Complete review of GitHub secrets: Actions vs. Dependabot vs. Codespaces secrets; repository, environment, organization, and user scopes; creation through UI, `gh secret`, and API; access policies; `${{ secrets.NAME }}` and `env`; masking and redaction limits; unavailable secrets in forked PRs; reusable-workflow secret passing/inheritance; rotation, least privilege, and when to prefer OIDC over long-lived cloud credentials [D4][D6]
- [x] [PK-044](docs/plans/completed/PK-044.md) 🎓 Concurrency with `queue: max` (e.g. a serialized job) and understand why it must not be combined with `cancel-in-progress: true` [D5]

## Priority follow-up · Workflow review [D2][D4][D6]
> Close these gaps in the existing pipelines before enabling `/agent` issue/comment triggers or adding multi-agent automation. Keep the CI → immutable build artifact → deployment architecture; improve its guarantees rather than adding more workflows.

- [ ] [PK-045](docs/plans/PK-045.md) Make required CI checks run on the actual published PR head, starting with the existing manual `copilot-cli.yml` flow
  - Account for `GITHUB_TOKEN` event suppression; evaluate a least-privilege GitHub App/token publication flow or explicit dispatch, and verify that resulting checks attach to the correct SHA and satisfy the existing ruleset
  - Define any human approval needed before executing untrusted changes; keep validation credentials minimal. Successful pre-publication validation or approval does not replace required checks on the current PR head; never bypass branch protection or auto-merge
- [ ] [PK-046](docs/plans/PK-046.md) Isolate agent generation, untrusted-code validation, and privileged publication in separate jobs/runners with minimal permissions
  - Do not treat CLI command deny rules as a sandbox: allowed npm scripts can invoke Git or other commands indirectly
  - Keep publication credentials out of agent/validation runners; the publisher must verify the change artifact and must not execute agent-controlled code
  - Keep authoritative validators outside the agent's editable scope, or run trusted baseline copies; an agent-editable `scripts/validate-sprites.mjs` must not be the sole validation authority
- [ ] [PK-047](docs/plans/PK-047.md) Harden deterministic change-scope checks in `copilot-cli.yml`
  - Include staged, unstaged, and untracked changes relative to the trusted base; the current `git diff --name-only` misses staged changes
  - Verify the exact patch/file set that will be published, rather than checking a subset and then using unrestricted `git add --all`; test rejection of out-of-scope staged changes
- [ ] [PK-048](docs/plans/PK-048.md) Align the agent validation contract with CI, including the missing `npm run format:check`; prevent drift between both check lists
- [ ] [PK-049](docs/plans/PK-049.md) Validate deployment artifact provenance before publishing, including operator-supplied `run_id`: expected repository/workflow = CI, conclusion = success, branch = main, and an available `dist` artifact
- [ ] [PK-050](docs/plans/PK-050.md) Prevent an older CI run from automatically deploying after a newer commit
  - Review push concurrency in `ci.yml` (`run_id` currently gives each push its own group); Pages serialization alone does not guarantee freshness
  - Check source SHA/freshness before automatic publication; define an explicit authorized rollback path that deliberately permits an older successful artifact
  - Test out-of-order CI completion and manual deployment of an invalid run ID

## Phase 3 · Native Copilot: CLI in Actions and multi-agent [D2][D3][D5]

> **Execution strategy:** use V1 (Copilot CLI locally and in workflows we own) for all active implementation work. V2 is deferred because cloud-agent access is currently blocked in the target repository/organization; the exact licensing or policy cause is not yet verified. Cloud-specific behavior remains theory or a future lab, not a prerequisite for V1.

### V1 · Copilot CLI in Actions and local practice (active)
- [x] [PK-051](docs/plans/completed/PK-051.md) Custom `coding-agent` profile: workflow with `copilot -p --agent=coding-agent --no-ask-user` and `COPILOT_GITHUB_TOKEN`
- [x] [PK-052](docs/plans/completed/PK-052.md) Limit tools in CI with `--allow-tool` / `--deny-tool`
- [x] [PK-053](docs/plans/completed/PK-053.md) Persist a CLI-agent change as a reviewable PR (dedicated branch; workflow-owned commit/push and PR creation; never push or merge `main`)
- [x] [PK-054](docs/plans/completed/PK-054.md) Weekly repository summary workflow (`schedule` with cron; Copilot CLI in Actions) [D2]
- [x] [PK-055](docs/plans/completed/PK-055.md) 🎓 Local CLI practice: `/plan`, `/delegate`, `/fleet`, `--resume`, `--continue`, `--autopilot`
  - Also: `/session`, `/ide`, `/mcp`, `/review`, `/pr`, `--available-tools`, `--output-format=json`, `--disable-builtin-mcps`
- [x] [PK-056](docs/plans/completed/PK-056.md) 🎓 Inspect `~/.copilot/logs/` and `~/.copilot/session-state/<id>/events.jsonl` (new vs. resumed session)

### V1 · Issue-to-PR integration and follow-up (cloud workflow alternatives)
> Reproduce the practical delegation loop with our own Actions workflows, not the native cloud integration: issue → CLI → validated PR → feedback → updated PR. Use an explicit custom command such as `/agent`; native Copilot assignment, `@copilot`, **View session**, and **Approve and run workflows** are not activated by installing the CLI.

- [ ] [PK-057](docs/plans/PK-057.md) Start a CLI task from an issue using an authorized trigger (e.g. `/agent` in an issue comment); fetch its title, body, and relevant comments, reuse the existing issue templates, and link the generated PR back to the issue
  - Select an allowed agent profile for the task, including `blacksmith` for content/sprite issues; adapt deterministic scope checks to the selected profile rather than assuming every task belongs in `src/`, `test/`, or `scripts/`
- [ ] [PK-058](docs/plans/PK-058.md) Accept `/agent` feedback on an existing agent-generated PR and update that same PR branch instead of creating a new PR for every request
  - Reconstruct context from the original task, current diff, relevant review/comments, and validation results; check out and verify the intended head SHA before editing
  - 🎓 Evaluate optional CLI session persistence/resume across runs; retain context reconstruction as the fallback when no compatible session is available
- [ ] [PK-059](docs/plans/PK-059.md) Secure issue/comment entry points before enabling them: verify the actor's current repository write permission, allowlist commands/profiles, ignore bot-triggered loops, and validate issue/PR/repository/branch identities
  - Treat issue text, comments, diffs, and repository content as untrusted input; pass prompts as data, never interpolate them directly into shell source
  - Initially reject fork PRs; separate privileged dispatch/publication from agent execution and untrusted code validation; never execute a PR checkout with write credentials or unrelated secrets
- [ ] [PK-060](docs/plans/PK-060.md) Publish a run summary linked from the issue/PR with the task, selected profile, base/head SHA, changed files, validation results, and Actions run URL (our alternative to **View session**)
  - Upload sanitized CLI logs/session artifacts when useful, including on failure; define retention and access expectations, and avoid persisting tokens or sensitive prompt/tool output
- [ ] [PK-061](docs/plans/PK-061.md) Define stalled/failed-task recovery: cancellation, timeout, authorized retry, and continuation from the existing task branch; report failures back to the issue/PR
  - Serialize work per issue/PR, prevent duplicate PRs on retries, and detect head changes before publishing so concurrent feedback or human commits are not overwritten
- [ ] [PK-062](docs/plans/PK-062.md) End-to-end V1 lab: delegate a content issue to `blacksmith`, inspect the run, review the generated PR, request a change with `/agent`, recover an intentional failure, and confirm required checks pass on the final head without merging automatically

### V2 · GitHub-managed cloud agent (deferred — access blocked)
> These tasks require access to the managed cloud service. Keep the existing setup for future use; it does not launch or configure our V1 CLI runs. Do not treat the remaining items as active implementation work.

- [x] [PK-063](docs/plans/completed/PK-063.md) `.github/v2/copilot-setup-steps.yml` (`copilot-setup-steps` job: Node + `npm ci`)
- [x] [PK-064](docs/plans/completed/PK-064.md) Issue templates (bug / content / feature)
- [ ] [PK-065](docs/plans/PK-065.md) Assign a content issue to the cloud agent and practice: **View session**, `@copilot` on the PR, **Approve and run workflows**
  - Stalled-agent recovery: unassign + reassign the issue, repeat the comment, confirm that the commenter has write access
- [ ] [PK-066](docs/plans/PK-066.md) Configure cloud-agent MCP secrets with the `COPILOT_MCP_` prefix (Agents secrets, not Actions secrets)

### V1 continued · Agent definition, MCP, and multi-agent workflows
> Run these labs through Copilot CLI locally or in our own Actions workflows. Configure MCP credentials through local environment variables or explicitly passed Actions secrets, not cloud-agent Agents secrets. Check support per execution surface; cloud/IDE-only settings are theory where unavailable in CLI. Multi-agent pipelines use workflow jobs, `needs`, and artifacts; publication remains owned by deterministic workflow steps.

- [ ] [PK-067](docs/plans/PK-067.md) 🎓 Agent frontmatter: `description` is required (`name` is not), omitting `tools` = all tools, `tools: []` = none; try `model`, `target`, `disable-model-invocation`, `user-invocable`
- [ ] [PK-068](docs/plans/PK-068.md) Agent `auditor.agent.md` (read-only; prerequisite for the pipeline)
- [ ] [PK-069](docs/plans/PK-069.md) MCP: add a `local` server (command/args) and an `http` (url) server to an agent; try `server/tool` vs. `server/*`
  - Same servers in JSON (`.vscode/mcp.json` → `mcpServers`) vs. agent YAML (`mcp-servers`); adapt `inputs`/`envFile` → `env`
  - Know when to use `sse` (top-level `url`, legacy endpoint) and that a URL inside `args` (`mcp-remote`) is still `local`
- [ ] [PK-070](docs/plans/PK-070.md) Configure authenticated MCP access for V1 with local environment variables and explicitly passed Actions secrets; verify the installed CLI's supported configuration and perform a least-privilege tool call locally and in Actions
  - This replaces the practical V2 Agents-secrets lab; do not assume the cloud-specific `COPILOT_MCP_` prefix automatically injects secrets into CLI servers
  - Restrict credentials to the intended server/step, verify failure when credentials are absent, and keep secret values out of logs and session artifacts
- [ ] [PK-071](docs/plans/PK-071.md) Agent-assisted deployment risk assessment and approval [D2][D3][D6]
  - Deterministic `classify-changes` job (`dorny/paths-filter` or `git diff --name-only`) publishes `risky=true|false` for the deployment gate
  - The auditor agent produces a human-readable risk summary for the reviewer; it advises but never decides the gate
  - Two deploy jobs call `deploy-pages.yml`: `deploy-auto` uses an unprotected environment when `risky == 'false'`; `deploy-reviewed` uses an environment with *Required reviewers* when `risky == 'true'`
  - Understand the limitation: required reviewers belong to an environment, not a conditional; use two environments (e.g. `github-pages` and `github-pages-reviewed`)
- [ ] [PK-072](docs/plans/PK-072.md) `review` + `audit` → `consolidate` pipeline with `needs` and artifacts
- [ ] [PK-073](docs/plans/PK-073.md) Variant with `strategy.matrix.agent: [sprite-reviewer, auditor]`

## Phase 4 · Guardrails and hooks [D4][D6]
> Implement and test guardrails with V1: interactive local CLI and non-interactive CLI in Actions. Cloud-specific differences are theory until V2 access is available. Verify hook syntax against the installed CLI version before implementation.

- [ ] [PK-074](docs/plans/PK-074.md) `.github/hooks/policy.json` with a `preToolUse` hook denying agent-initiated `git push`; verify enforcement in local CLI and Actions without blocking the workflow-owned publication step
  - Provide the appropriate `bash` / `powershell` hook commands for Linux Actions runners and local Windows practice; verify tool names and matching support in the installed CLI
  - 🎓 Compare approval requests in interactive CLI with non-interactive `--no-ask-user` runs; verify behavior rather than assuming an approval request is a denial
- [ ] [PK-075](docs/plans/PK-075.md) 🎓 `preToolUse` vs. `permissionRequest`: verify the installed CLI's schemas and behavior; study cloud-agent compatibility and approval limitations as theory
- [ ] [PK-076](docs/plans/PK-076.md) 🎓 Log the hook payload and map `toolName` (`view`, `grep`, `glob`, `edit`, `create`, `bash`, `task`) to agent tools; check `sessionStart.source` (`new` vs. `resume`)
- [ ] [PK-077](docs/plans/PK-077.md) Hook denying `edit`/`create` outside `sprites/` for the Blacksmith
- [ ] [PK-078](docs/plans/PK-078.md) `postToolUse` / `sessionEnd` hook logging a session summary
- [ ] [PK-079](docs/plans/PK-079.md) 🎓 Deliberately cause failures (nonexistent artifact, npm `E401`, blocked direct push) and document root cause + fix in `docs/incidents.md`

## Phase 5 · Game features
- [ ] [PK-080](docs/plans/PK-080.md) XP system per completed pomodoro
- [ ] [PK-081](docs/plans/PK-081.md) Level curve in `levels.json`
- [ ] [PK-082](docs/plans/PK-082.md) 5 tomato sprites (one per level) in `.txt`
- [ ] [PK-083](docs/plans/PK-083.md) Anti-cheat: invalidate the pomodoro when switching tabs or pausing too long

## Phase 6 · Agentic workflows (gh-aw) and agent-generated content
> gh-aw is **not part of GH-600**, but it compiles to Actions: reviewing the generated `.lock.yml` is good YAML reading practice.
- [ ] [PK-084](docs/plans/PK-084.md) Install gh-aw and configure the engine (secret)
- [ ] [PK-085](docs/plans/PK-085.md) Issue Triage workflow
- [ ] [PK-086](docs/plans/PK-086.md) CI Doctor workflow
- [ ] [PK-087](docs/plans/PK-087.md) 🎓 Read each workflow's `.lock.yml` and identify `permissions`, `safe-outputs` jobs, and `concurrency`
- [ ] [PK-088](docs/plans/PK-088.md) Blacksmith workflow `/forge` (generates sprite + opens PR)
- [ ] [PK-089](docs/plans/PK-089.md) Sprite Preview workflow (comments the sprite on the PR)

## Phase 7 · Extras
- [ ] [PK-090](docs/plans/PK-090.md) **Pi local setup**: Create `.agents/skills/validate-sprite/SKILL.md` and `~/.pi/agent/prompts/validate-sprite.md` for local pi usage (differs from GitHub Copilot's `.github/instructions/` model)
- [ ] [PK-091](docs/plans/PK-091.md) Consider per-PR preview deploys (`pr-preview-action` / Netlify / Cloudflare)
- [ ] [PK-092](docs/plans/PK-092.md) Consider a backend and user accounts
- [ ] [PK-093](docs/plans/PK-093.md) Consider mechanics beyond the cosmetic (battles against Procrastination 👹)

## Phase 8 · Loose ends from completed phases
- [ ] [PK-094](docs/plans/PK-094.md) Update `docs/workflows.md` to cover `copilot-cli.yml`, `weekly-summary.yml`, and `copilot-setup-steps.yml`; distinguish active CLI automation, deferred cloud-agent setup, and educational examples
  - Explicitly document that `copilot-setup-steps.yml` prepares the managed cloud agent, not our own CLI workflow runs
- [ ] [PK-095](docs/plans/PK-095.md) 🎓 Review which CI elements should remain as learning exercises versus operational requirements: standalone context job, Node version matrix, and sprite-count job output
- [ ] [PK-096](docs/plans/PK-096.md) Evaluate whether the weekly summary is actually useful in the Actions UI; keep it as an explicit CLI/cron lab, publish it somewhere readers use, or disable the schedule if it adds no value
- [ ] [PK-097](docs/plans/PK-097.md) 🎓 Review overlap between the `validate-sprite` skill and the `review-sprite` prompt (and `sprites.instructions.md`); decide what each one owns
- [ ] [PK-098](docs/plans/PK-098.md) Multi-IDE setup: add `AGENTS.md` at the root (single source for commands/layout/boundaries) and trim `copilot-instructions.md` to Copilot-specific content [D2]

## Out of repo scope (study as theory) 📚
- Organization/enterprise MCP policies (registry, allowlist)
- Organization audit log (`artifact.destroy`, `actor`, `@timestamp`)
- Copilot SDK (`createSession`, `resumeSession`, `onPreToolUse`)
- Copilot Memory (repository facts vs. user preferences) and context drift (causes and fixes) [D3]
- Firewall allowlist (network egress) vs. MCP allowlist/registry (MCP server usage) [D6]
- Guided lab: [gh-600-lab-instructions](https://github.com/sameeraman/gh-600-lab-instructions)
