# Copilot CLI cheat sheet

Run commands from the repository root.

## Start and prompt

```bash
copilot
copilot login
copilot --agent=coding-agent
copilot -p "Explain the timer structure. Do not modify files." --agent=coding-agent
copilot -p "..." --agent=coding-agent --model gpt-6-luna
```

Use `copilot login` to authenticate the CLI when required.

`-p` supplies the initial prompt non-interactively instead of opening a terminal conversation. It does not by itself prevent later questions; add `--no-ask-user` in CI to ensure Copilot never waits for user input.

## Plan and sessions

```bash
copilot --plan -i "Plan a keyboard shortcut for start/pause. Do not edit files."
copilot --continue
copilot --resume=<session-id>
```

## Initialize repository instructions

```bash
copilot init
```

Analyzes the repository with read-only tools and generates `.github/copilot-instructions.md`. The file gives Copilot project context such as the technology stack, structure, coding conventions, and build and test commands.

Run it only when you want to create or refresh those instructions. Review the generated change before committing, especially when `.github/copilot-instructions.md` already exists:

```bash
git diff -- .github/copilot-instructions.md
```

Useful interactive commands:

```text
/plan       Create a plan before implementation.
/agent      Browse and select custom agents.
/delegate   Send the current session to the Copilot cloud agent to create a PR.
/fleet      Coordinate parallel subagents.
/ide        Connect to or inspect an IDE workspace.
/mcp        Inspect or configure MCP servers.
/pr         Work with pull requests for the current branch.
/review     Review changes.
/session    Inspect the current session.
```

### Local, parallel, and cloud execution

```text
--autopilot  Continue the objective locally in the CLI or runner.
/fleet       Split work among parallel subagents in the CLI.
/delegate    Send the current session and its context to the Copilot cloud agent.
& <prompt>   Start a new cloud-agent task from the supplied prompt (version-dependent).
```

#### `--autopilot`: continue locally

`--autopilot` lets Copilot continue through the next steps of a defined task without waiting for the user to send a separate “continue” message between iterations. It is most commonly used in a local, interactive CLI session where you can supervise it, but it can also be used in CI when combined with `-p`, `--no-ask-user`, and narrowly scoped permissions. It does not grant tool, path, network, or Git permissions, and it does not delegate work to the cloud.

```bash
copilot -p "Fix failing tests and run npm test." --autopilot \
  --allow-tool write \
  --allow-tool 'shell(npm:*)'
```

The agent may inspect the tests, make a permitted change, run `npm test`, and continue investigating a resulting failure. The `--allow-tool` options, not `--autopilot`, define what it is allowed to do.

#### `/fleet`: split local work

`/fleet` coordinates parallel subagents in the CLI. Use it when independent parts of an investigation can be split and their results combined:

```text
/fleet Review frontend, backend, and workflow tests. Split by area and summarize findings.
```

#### `/delegate`: hand off the current task to the cloud agent

`/delegate` creates a remote task on GitHub from the current session and Copilot creates a pull request with its changes. Use it for a self-contained, reviewable task. Select the PR target branch when needed:

```text
/delegate --base main
```

Example: build context in the local session first, then delegate it without repeating the task:

```text
You: The keyboard tests fail when Space is pressed. Investigate, fix it, and run npm test.
Copilot: The listener does not ignore events from input fields. I can correct it and validate it.
You: /delegate --base main
```

The cloud agent receives the session context, works remotely, and creates a PR against `main`. Review its diff, tests, permissions, and PR before merging.

#### `& <prompt>`: create a new cloud task directly

Some versions support `& <prompt>` as a shortcut to start a new cloud-agent task from the text following `&`, rather than delegating context already built in the session:

```text
& Investigate why the deployment workflow fails. Apply the smallest safe fix, run relevant validation, and open a draft PR against main.
```

The `&` is not part of the task prompt; it signals delegation to the cloud agent. Cloud delegation requires a GitHub/Copilot account and repository access that support the feature.

## Safe autonomous work

Use a branch and allow only the required tools. Do not use `--allow-all` or `--yolo` for normal work.

```bash
copilot --agent=coding-agent --autopilot \
  --allow-tool 'write' \
  --allow-tool 'shell(npm:*)' \
  --deny-tool 'shell(git:*)'
```

## Automation and isolation

```bash
copilot -p "..." --no-ask-user --silent
copilot -p "..." --output-format=json
copilot -p "..." --disable-builtin-mcps --no-custom-instructions
copilot -p "..." --secret-env-vars COPILOT_GITHUB_TOKEN
copilot -p "..." --available-tools read search
```

`--available-tools` limits the tools visible to the agent. Prefer it for read-only or narrowly scoped automation; combine it with specific `--allow-tool` rules when a task needs controlled write or shell access.

`--no-ask-user` only disables Copilot's ability to ask the user questions. It does not make the agent continue autonomously, and it does not grant permissions. Use it in CI so a workflow cannot block waiting for a reply; make the prompt precise because Copilot must proceed with the available context.

```bash
copilot -p "Summarize the current branch in summary.md." \
  --no-ask-user \
  --allow-tool write
```

Use both flags when the task and least-privilege permissions are already clear:

```bash
copilot -p "Fix failing tests and run npm test." \
  --autopilot \
  --no-ask-user \
  --allow-tool write \
  --allow-tool 'shell(npm:*)'
```

## Local diagnostics

```text
~/.copilot/logs/
~/.copilot/session-state/<session-id>/events.jsonl
```

On Windows, `~` is normally your user home directory, for example `C:\Users\<user>\.copilot\`.

Do not commit or share logs or session files: they can contain prompts and repository context.
