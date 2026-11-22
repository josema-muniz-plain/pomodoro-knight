# GitHub Actions workflows

This document describes the repository automation under [`.github/workflows/`](../.github/workflows/). The YAML files are the source of truth; this document records each workflow's purpose, trust boundaries, inputs and operational behavior.

## At a glance

| Workflow                                                                  | Trigger                              | Purpose                                                          | Result                                                                     |
| ------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [`ci.yml`](../.github/workflows/ci.yml)                                   | PR to `main`, push to `main`, manual | Validate and build the application                               | A `dist` artifact retained for 7 days                                      |
| [`deploy.yml`](../.github/workflows/deploy.yml)                           | Successful CI on `main`, manual      | Select the CI artifact to deploy and report a deployment failure | Calls the reusable Pages deployment workflow; creates an issue on failure  |
| [`deploy-pages.yml`](../.github/workflows/deploy-pages.yml)               | `workflow_call` only                 | Publish a supplied `dist` artifact to GitHub Pages               | GitHub Pages deployment and `page_url` output                              |
| [`codeql.yml`](../.github/workflows/codeql.yml)                           | PR to `main`, weekly schedule        | Scan JavaScript/TypeScript for code-security issues              | Code scanning results in GitHub Security                                   |
| [`dependency-review.yml`](../.github/workflows/dependency-review.yml)     | PR to `main`                         | Review dependency changes for known vulnerabilities              | PR summary; fails on high/critical findings                                |
| [`copilot-setup-steps.yml`](../.github/workflows/copilot-setup-steps.yml) | Cloud-agent setup, manual test       | Prepare Node and dependencies for the managed cloud agent        | Prepared environment; cloud use still needs verification after publication |

## Delivery flow

```mermaid
flowchart TD
  PR[Pull request to main] --> CI[ci.yml]
  Push[Push to main] --> CI
  ManualCI[Manual CI run] --> CI
  PR --> CodeQL[codeql.yml]
  Schedule[Monday at 04:23 UTC] --> CodeQL
  CodeQL --> Security[GitHub Security findings]
  PR --> Dependencies[dependency-review.yml]
  Dependencies --> Review[PR summary; fails on high/critical vulnerabilities]
  CI -->|build succeeds| Artifact[(dist artifact, retained for 7 days)]
  CI --> Gate{Successful CI run on main?}
  Gate -->|Yes| Deploy[deploy.yml]
  Gate -->|No| Stop[No automatic deployment]
  ManualDeploy[Manual deploy + CI run ID] --> Deploy
  Deploy --> PagesWorkflow[Reusable deploy-pages.yml]
  Artifact -.->|Download without rebuilding| PagesWorkflow
  PagesWorkflow --> Pages[GitHub Pages and page_url output]
  PagesWorkflow -->|failure| FailureIssue[Deployment failure issue]
```

The automatic deploy path only continues when the triggering CI run completed successfully on `main`. A manually dispatched deploy instead receives the CI run ID from the operator. The reusable deployment job is governed by the `github-pages` Environment, including approval if configured.

CodeQL and dependency review are independent workflows, not `needs` dependencies of the CI build or deployment. Whether their checks block merging is controlled by repository rulesets or branch protection, not by these workflow dependencies.

## Common conventions

- Workflow and job names are human-readable so they are identifiable in the Actions UI.
- Workflows declare permissions explicitly. A job can further reduce them when it needs less access.
- Job summaries use `$GITHUB_STEP_SUMMARY`; step-to-job data uses `$GITHUB_OUTPUT`.
- `dist` is built once by CI and then downloaded by the deployment workflow. Deployments do not rebuild the application.
- Workflow files use official actions pinned to major versions. Updating an action major version should be reviewed like any other supply-chain change.

## CI — `ci.yml`

### Trigger and permissions

CI runs on pushes to `main`, pull requests targeting `main`, and `workflow_dispatch`. It has only:

```yaml
permissions:
  contents: read
```

This is sufficient to check out the source and execute validation. CI does not publish packages, deploy, or write to the repository.

### Concurrency

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}
  cancel-in-progress: true
```

For a pull request, `github.head_ref` is its source branch, so a newer push to the same PR cancels its obsolete CI run. For a push or manual run, `head_ref` is empty and the unique `run_id` is used; those runs do not share a group with one another.

### Jobs and artifact contract

| Job                | Depends on                         | Purpose                                                                                                             |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `context`          | —                                  | Writes selected GitHub context values to the job summary. It also demonstrates `contains()` for code-change events. |
| `lint`             | —                                  | Runs Prettier verification and ESLint on Node 22.                                                                   |
| `test`             | —                                  | Runs Vitest on Node 20 and Node 22. The matrix does not fail fast, so both results are retained.                    |
| `validate-sprites` | —                                  | Runs `npm run validate:sprites`, writes a sprite table even after a validation failure, and exposes `sprite-count`. |
| `build`            | `lint`, `test`, `validate-sprites` | Builds the app, then uploads the `dist` artifact.                                                                   |

```mermaid
flowchart TD
  Start[CI starts] --> Context[Run context summary]
  Start --> Lint[Prettier and ESLint]
  Start --> Test20[Vitest on Node 20]
  Start --> Test22[Vitest on Node 22]
  Start --> Sprites[Validate ASCII sprites]
  Lint --> Build[Production build]
  Test20 --> Build
  Test22 --> Build
  Sprites -->|sprite-count output| Build
  Build --> Artifact[(dist artifact)]
```

The validation jobs run in parallel. `build` requires all of them to succeed; `context` is independent and is not a build dependency.

`validate-sprites` writes its count to `$GITHUB_OUTPUT`:

```yaml
outputs:
  sprite-count: ${{ steps.count.outputs.sprites }}
```

`build` reads it through `needs.validate-sprites.outputs.sprite-count`. This is a job-output example, not a deployment input.

The final artifact is named `dist`, contains `dist/`, is retained for seven days, and treats a missing directory as an error. This artifact name is the contract consumed by `deploy-pages.yml`.

### Useful diagnostics

The `context` job summary includes `event_name`, refs, SHA, actor, `run_id`, and `run_attempt`. For a manual deployment, use the `run_id` of a successful CI run as the deploy workflow input.

The sprite summary uses `if: ${{ always() }}` so that invalid sprites still produce a table useful for diagnosis. Uploading the build artifact uses an explicit `success()` condition; it makes the otherwise default behavior visible in the YAML.

## Deploy orchestrator — `deploy.yml`

This workflow decides whether a Pages deployment may begin. It does not run deployment steps directly.

### Trigger behavior

| Event                             | Deploy behavior                                                 |
| --------------------------------- | --------------------------------------------------------------- |
| `workflow_run` for `CI` on `main` | Deploys only when the CI conclusion is `success`.               |
| `workflow_dispatch`               | Deploys the artifact identified by the required `run_id` input. |

The manual `run_id` is currently an operator-supplied value. It must identify a CI run that uploaded the `dist` artifact. Semantic validation that it is specifically a successful `main` CI run is intentionally deferred to the backlog.

### Permissions and concurrency

At workflow level, deployment has `actions: read`, `contents: read`, `pages: write`, and `id-token: write`. The reusable workflow cannot elevate these permissions; it receives at most the permissions granted by this caller.

All deployments share this concurrency group:

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

A later deployment waits rather than interrupting one already publishing. This is deliberately different from CI, where cancelling an obsolete PR validation is desirable.

### Called workflow and failure notification

The `deploy` job calls:

```yaml
uses: ./.github/workflows/deploy-pages.yml
```

and passes the selected artifact run ID and the `github-pages` Environment name. A reusable-workflow call is a job, not a step: it cannot also contain `runs-on` or `steps` in the caller.

If that job fails, `notify-deploy-failure` runs with only `issues: write`. It creates an issue with links to the failed deployment run and, for automatic runs, the CI run that triggered it. It does not create an issue when deployment was skipped because CI failed.

## Reusable Pages publisher — `deploy-pages.yml`

This workflow is invoked only by another workflow through `workflow_call`.

### Inputs and output

| Name               | Direction      | Meaning                                               |
| ------------------ | -------------- | ----------------------------------------------------- |
| `artifact_run_id`  | Required input | CI run ID from which to download the `dist` artifact. |
| `environment_name` | Required input | GitHub Environment that governs the deployment.       |
| `page_url`         | Output         | URL returned by `actions/deploy-pages`.               |

The output is propagated in three layers:

```text
steps.deployment.outputs.page_url
  → jobs.deploy.outputs.page_url
  → on.workflow_call.outputs.page_url
  → needs.<calling-job>.outputs.page_url
```

For example, a job in the caller that has `needs: deploy` can read:

```yaml
${{ needs.deploy.outputs.page_url }}
```

### Deployment steps and Environment

The reusable job downloads artifact `dist` from `artifact_run_id`, configures Pages, uploads the artifact, and invokes `actions/deploy-pages`.

It assigns the job to the supplied Environment and publishes the URL there:

```yaml
environment:
  name: ${{ inputs.environment_name }}
  url: ${{ steps.deployment.outputs.page_url }}
```

The `github-pages` Environment is where required-reviewer protection is configured in the GitHub UI. A future rollback or staging workflow can reuse this publisher with a different artifact run ID or Environment.

## CodeQL — `codeql.yml`

CodeQL scans JavaScript and TypeScript:

```yaml
languages: javascript-typescript
```

It runs on pull requests targeting `main` and every Monday at 04:23 UTC. Scheduled workflow runs analyze the default branch, allowing updated CodeQL queries to find issues in unchanged code.

> It does **not** currently run on direct pushes to `main`. Pull-request checks and the scheduled scan are the configured coverage.

The workflow needs `contents: read` to inspect source code and `security-events: write` to upload SARIF results to GitHub Code Scanning. It does not have `pull-requests: write` and does not post a conversational PR comment; findings appear in checks and in **Security → Code scanning**.

## Dependency review — `dependency-review.yml`

Dependency review runs for pull requests targeting `main`. It uses `actions/dependency-review-action` to compare dependency changes and fails when a newly introduced vulnerability has severity `high` or `critical`:

```yaml
fail-on-severity: high
```

It has `contents: read` to inspect the change and `pull-requests: write` because `comment-summary-in-pr: always` publishes the dependency-review summary on the pull request. Removing the comment would allow this permission to be reduced to read-only access.

## Archived V1 CLI workflows

The former V1 workflows are preserved outside `.github/workflows/`, so Actions does not discover or execute them from this branch. Their removal only takes effect on the default branch once these changes are merged. Existing runs and the `COPILOT_GITHUB_TOKEN` secret are not deleted. Restoring either file requires a security review; the known gaps below remain unresolved.

### Coding agent CLI — `copilot-cli.yml`

[`.github/v1/copilot-cli.yml`](../.github/v1/copilot-cli.yml) was launched only through `workflow_dispatch`. Its required `task` input is a complete natural-language request, not an issue number. It checks out the repository's default branch even if the operator selects a different branch when dispatching the workflow.

```mermaid
flowchart TD
  Task[Manual dispatch with task] --> Checkout[Checkout default branch without persisted credentials]
  Checkout --> Setup[Node 22, npm ci, and Copilot CLI]
  Setup --> Agent[Run Copilot CLI with coding-agent]
  Agent --> Scope{Changes only in src/, test/, scripts/?}
  Scope -->|No| Fail[Fail without publishing a PR]
  Scope -->|Yes| Validate[Tests, lint, build, and sprite validation]
  Validate -->|Failure| Fail
  Validate -->|Success| Changes{Any changes to publish?}
  Changes -->|No| End[Finish without a PR]
  Changes -->|Yes| Publish[Workflow creates branch, commit, and push]
  Publish --> PR[Open reviewable PR against default branch]
  PR -.-> Human[Human review and merge]
```

The CLI runs with `--agent=coding-agent`, using [the repository agent definition](../.github/agents/coding-agent.agent.md), and currently selects `gpt-6-luna`. The agent works in the temporary runner checkout. A later workflow step, not the agent, owns Git publication. There is no automatic merge.

### Permissions and validation boundaries

- Workflow permissions are `contents: write` and `pull-requests: write` for branch and PR publication.
- Copilot authenticates through the `COPILOT_GITHUB_TOKEN` repository secret. The checkout uses `persist-credentials: false` to avoid leaving the workflow token in Git configuration while the agent runs.
- CLI tool rules allow `write` and `shell(npm:*)`; they explicitly deny `shell(git:*)`, `shell(rm)`, and `write(.env)`.
- `--no-ask-user` prevents interactive questions. Built-in MCPs and temporary-directory access are disabled, and the Copilot token is declared through `--secret-env-vars`.
- After the agent returns, the workflow checks tracked and untracked changes against `src/`, `test/`, and `scripts/`. A change outside those paths fails the run. This scope check is repeated before publication.
- Validation runs `npm run test:run`, `npm run lint`, `npm run build`, and `npm run validate:sprites`, in that order. Unlike CI, this workflow does **not** run `npm run format:check` or a Node-version matrix.

These are configured tool restrictions and post-run checks, not a complete sandbox: allowing npm commands permits project scripts to execute. Review the diff and validation results before merging.

When changes remain, the workflow creates `copilot/run-<run_id>`, commits them, pushes the branch, and opens a PR against the default branch. If there are no changes, it records that outcome in the job summary without creating a PR. Repository settings must permit GitHub Actions to create pull requests.

### Important: the generated PR does not automatically trigger PR checks

Publication uses the workflow's `GITHUB_TOKEN` (`github.token`), not the Copilot authentication token. GitHub normally suppresses new workflow runs caused by events generated with `GITHUB_TOKEN`, except explicit `workflow_dispatch` and `repository_dispatch` events.

Therefore, do **not** assume that this workflow's push or PR creation automatically triggers CI, CodeQL, or dependency review. The validation step inside this workflow is not a replacement for all those checks. If checks are missing, investigate this event boundary rather than bypassing required checks. An authorized human update to the PR branch or a separately designed GitHub App/token-based publication path can generate eligible events; neither is automated here.

For local CLI usage and the distinction between local execution and cloud delegation, see [the Copilot CLI cheat sheet](copilot-cli-cheatsheet.md).

### Weekly summary — `weekly-summary.yml`

[`.github/v1/weekly-summary.yml`](../.github/v1/weekly-summary.yml) formerly ran every Monday at **09:00 UTC** or through `workflow_dispatch`. Its scheduled and manual triggers are inactive in this branch. It has only `contents: read` and uses `COPILOT_GITHUB_TOKEN` to authenticate Copilot CLI.

```mermaid
flowchart TD
  Schedule[Monday at 09:00 UTC] --> Checkout[Checkout full history]
  Manual[Manual dispatch] --> Checkout
  Checkout --> Commits[Collect commits from the last seven days]
  Commits --> HasCommits{Any commits?}
  HasCommits -->|No| Empty[Write no-activity job summary]
  HasCommits -->|Yes| Prompt[Prepare prompt from commit list]
  Prompt --> Copilot[Copilot CLI summarizes commits]
  Copilot --> Summary[Append Markdown to Actions job summary]
```

The checkout uses `fetch-depth: 0` and `persist-credentials: false`. After installing Node 22 and Copilot CLI, the workflow runs `git log --since='7 days ago'` over the checked-out history, collecting commit hashes, dates, authors, and subjects. This is a commit-history summary, not a query of all repository issues, PRs, or push events. Scheduled runs use the default branch; manual runs use the selected ref.

If no commits are found, the workflow writes a fixed no-activity message and skips Copilot. Otherwise it prepares a prompt asking for a concise, neutral English summary grounded only in the supplied commits.

Copilot currently uses `gpt-6-luna` with shell and write tools denied, custom instructions and built-in MCPs disabled, temporary-directory access disabled, and the token declared through `--secret-env-vars`. The workflow shell captures the response in `weekly-summary.md` and appends it to `$GITHUB_STEP_SUMMARY`.

The result appears in the Actions run summary. No changes are committed, no artifact is uploaded, and no issue or PR is created.

## V2 cloud-agent setup — `copilot-setup-steps.yml`

[`.github/workflows/copilot-setup-steps.yml`](../.github/workflows/copilot-setup-steps.yml) defines the managed Copilot cloud agent's setup job. It was previously archived under `.github/v2/` while access was blocked. Publishing it to the default branch and verifying it in an actual cloud session remain necessary; its presence in this branch does not establish that the agent used it.

```mermaid
flowchart LR
  Start[Cloud-agent setup] --> Checkout[Checkout repository]
  Checkout --> Node[Set up Node 22 with npm cache]
  Node --> Install[npm ci]
  Install --> Ready[Development environment prepared]
```

The workflow has `contents: read` and one job named `copilot-setup-steps`. It only checks out the repository and installs dependencies. It does not run a coding task, validate changes, or create a PR by itself. A manual dispatch can test the setup job but does not prove that the cloud agent used it.

It is separate from the archived `copilot-cli.yml`, which installed and invoked Copilot CLI in its own runner job. The CLI workflow did not call this setup. See [the cloud-agent lab](cloud-agent-lab.md) for the evidence and remaining checks.

## Implemented automation versus roadmap

The workflows listed above are present in this branch. The V1 coding-agent and weekly-summary workflows are archived under `.github/v1/` and are not active here. There are currently no gh-aw `.md` / `.lock.yml` workflow pairs under `.github/workflows/`. The V2 setup is in its intended workflow location but its use by a cloud session remains to be verified after publication.

Issue Triage, CI Doctor, Blacksmith `/forge`, and Sprite Preview are still planned workflows in the README, not active automation. The archived weekly summary was a neutral commit recap, not the planned epic-tone Weekly Chronicle. Agent definitions alone do not establish workflow triggers.

## Repository security settings

Secret scanning and push protection are repository settings, not workflow YAML. Confirm their state in **Settings → Security → Advanced Security**.

| Control           | What it protects                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| Secret scanning   | Detects recognized credentials already present in repository content.                                 |
| Push protection   | Blocks a push containing a detected secret unless the contributor resolves or explicitly bypasses it. |
| CodeQL            | Finds supported code-security patterns in JavaScript/TypeScript.                                      |
| Dependency review | Reviews dependencies introduced or changed by a pull request.                                         |

These controls are deterministic guardrails. An agent can later explain a finding or propose a remediation, but it should not be the authority that bypasses a security gate.

## Operating the workflows

### Find an artifact run ID

1. Open **Actions → CI** and select a successful run.
2. Open the `Run context` job summary, or copy the numeric ID from the run URL.
3. Use that number as `run_id` when manually dispatching **Deploy to GitHub Pages**.

### Approve a protected deployment

If the `github-pages` Environment requires approval, the deployment job waits in Actions until an authorized reviewer approves it under the Environment protection rules.

### Investigate a failed deployment

1. Open the failed **Deploy to GitHub Pages** run and inspect the called workflow job.
2. Open the issue created by `notify-deploy-failure`; it links back to the failed run.
3. Check whether the CI artifact still exists. CI retains it for seven days.
4. After correcting the cause, deploy a successful CI artifact again.

## Changing a workflow

When changing workflow automation:

1. Keep permissions at the smallest scope required by the specific workflow or job.
2. Review trigger changes carefully, especially `workflow_run`, schedules, and manual inputs.
3. Preserve the `dist` artifact contract unless both CI and the reusable deploy workflow are updated together.
4. Consider concurrent runs and whether work should be cancelled or allowed to finish.
5. Test through a pull request where possible and inspect both checks and job summaries.
