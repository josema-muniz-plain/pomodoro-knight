# Copilot CLI cheat sheet

Run commands from the repository root.

## Start and prompt

```bash
copilot --agent=coding-agent
copilot -p "Explain the timer structure. Do not modify files." --agent=coding-agent
copilot -p "..." --agent=coding-agent --model gpt-6-luna
```

## Plan and sessions

```bash
copilot --plan -i "Plan a keyboard shortcut for start/pause. Do not edit files."
copilot --continue
copilot --resume=<session-id>
```

Useful interactive commands:

```text
/plan       Create a plan before implementation.
/delegate   Hand a subtask to another agent.
/fleet      Coordinate parallel subagents.
/session    Inspect the current session.
/mcp        Inspect MCP configuration.
/review     Review changes.
```

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
```

## Local diagnostics

```text
~/.copilot/logs/
~/.copilot/session-state/<session-id>/events.jsonl
```

On Windows, `~` is normally your user home directory, for example `C:\Users\<user>\.copilot\`.

Do not commit or share logs or session files: they can contain prompts and repository context.
