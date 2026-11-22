# Copilot cloud-agent lab

This lab exercises GitHub's managed cloud agent (V2), not the repository's own Copilot CLI workflow (V1). Review agent changes and checks before any human merge. Never put secrets into issue text, comments, or session logs.

## Evidence so far

The repository has access to the cloud agent; this is not yet evidence that the full lab below is complete:

- [Issue #11](https://github.com/josema-muniz-plain/pomodoro-knight/issues/11) was assigned to Copilot and produced [PR #12](https://github.com/josema-muniz-plain/pomodoro-knight/pull/12). Its cloud-agent [run](https://github.com/josema-muniz-plain/pomodoro-knight/actions/runs/45022088811) succeeded. The PR checks subsequently reported success.
- [Issue #7](https://github.com/josema-muniz-plain/pomodoro-knight/issues/7) was assigned to Copilot and produced draft [PR #13](https://github.com/josema-muniz-plain/pomodoro-knight/pull/13). Its cloud-agent [run](https://github.com/josema-muniz-plain/pomodoro-knight/actions/runs/45023311471) succeeded; its initial CI, CodeQL, and dependency-review runs reported `action_required` when inspected.
- Those runs preceded publication of `.github/workflows/copilot-setup-steps.yml`; they do not prove that the setup workflow ran, or that feedback and recovery work.

PR and check states can change; recheck them in GitHub rather than treating this snapshot as a current status.

## Prepare the environment

1. Review and merge the setup workflow into the repository's default branch through the normal PR process.
2. Optionally dispatch `Copilot setup steps` manually to check Node and `npm ci`; a manual run is not proof of cloud-agent integration.
3. In a new cloud-agent session, inspect the session/setup logs for the `copilot-setup-steps` job and successful dependency installation. Record a link and result below. If the workflow is not used, investigate the current GitHub requirements rather than assuming success.

The setup prepares the managed agent's environment; it does not start a task or configure the archived V1 workflow `.github/v1/copilot-cli.yml`.

## PK-065: issue → cloud agent → reviewed PR

1. Create a small content issue using the content template. For example, request a level-2 tomato-knight sprite with a unique level and name under `sprites/`, within the existing ASCII dimensions. Ask for `npm run validate:sprites`; leave source files and the validator unchanged.
2. Assign Copilot using the supported GitHub UI. If the surface offers the repository's `blacksmith` custom agent, select it and record whether it was actually used; otherwise record the limitation rather than assuming it was selected.
3. Open **View session**, inspect the agent's work and the setup result, and record links to the issue, session/run, and generated PR.
4. Review the diff, then request a specific small correction with `@copilot` on that PR. Record the comment, resulting commit and whether the same PR was updated.
5. If GitHub asks an authorized user to **Approve and run workflows**, review what will execute before approving. Record the approval and check conclusions for the final PR head SHA, including CI, CodeQL and dependency review as applicable. Approval is not a substitute for passing required checks.
6. In a controlled retry or stalled-task exercise, investigate unassigning/reassigning the issue, repeating a comment, and checking the commenter's current write permission. Record actual behavior and avoid overwriting human commits or creating duplicate PRs.
7. Review the result manually; do not enable auto-merge. Document failures or unavailable controls honestly.

### Results

- Issue / PR / session: #16 → [PR #17](https://github.com/josema-muniz-plain/pomodoro-knight/pull/17) (merged 2026-11-22 by a human, head `082cff6`). Cloud-agent session runs observed: "Running Copilot cloud agent" (run `45053587280`) and "Addressing comment on PR #17" (run `45054103024`), both success.
- Setup run and result: no standalone "Copilot setup steps" Actions run found; the setup appears integrated into the "Copilot cloud agent" dynamic runs. Inspect the session (View session) logs to confirm whether the `copilot-setup-steps` job (Node 22, `npm ci`) actually executed; not confirmed yet.
- Custom agent selected and evidence: to confirm (assignment was done from the GitHub UI; no programmatic evidence of whether `blacksmith` or default Copilot was used).
- Feedback comment / resulting commit: a comment was addressed (run `45054103024` "Addressing comment on PR #17"); comment text and resulting commit still to record.
- Approval, final head SHA and check results: final head `082cff6`; CI, CodeQL and dependency review passed on the last head (runs `45054252911`, `45054252931`, `45054252854`). Initial PR checks had failed before the `@copilot` iteration.
- Recovery and permission observations:

### Pending explorations

- [ ] **Continue in Copilot CLI from a cloud-started task**: from the #16 session / draft PR #17, use the session's "Continue" / "Continue in CLI" entry point. Observe whether the local Copilot CLI resumes the same session and branch (`copilot/add-level-2-tomato-knight-sprite`) or starts a new task; what it requires (auth, repo path); and whether local changes conflict with the cloud agent's commits. Record the exact command and outcome instead of assuming parity with the V1 `/agent` flow.
- [ ] **Model selection for the agent / issue**: investigate the GitHub surface (assign-Copilot dialog, agent configuration) for any model picker exposed when assigning Copilot, and whether selecting a custom agent such as `blacksmith` overrides the model. Record the selection path and whether a choice persists per-repo or per-task.

## PK-066: authenticated MCP in cloud

After the basic lab, verify GitHub's current cloud-agent MCP configuration and Agents-secret documentation, including the `COPILOT_MCP_` naming contract. Choose a non-destructive tool and a temporary, least-privilege credential. Configure only the intended cloud agent/server, verify an allowed call and the failure without the credential, then revoke it. Do not copy secret values into the repository, Actions secrets, prompts, or recorded evidence. Local CLI environment variables and Actions secrets are separate mechanisms.

### Results

- Documentation and configuration surface verified:
- Server/tool and permission scope (no secret values):
- Successful call / missing-credential test:
- Credential revoked:
