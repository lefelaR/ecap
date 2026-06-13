---
name: commit-message
description: >-
  Generates ECAP commit messages in the required format: task type, issue number,
  branch name, and change details. Use when the user asks to commit, write a
  commit message, or draft a message for staged or unstaged changes.
---

# ECAP Commit Message

## Format

Every commit message **subject line** must follow:

```
{taskType}#{number}-{branchName}-{details}
```

| Part | Values | Source |
|------|--------|--------|
| `taskType` | `issue`, `feature`, or `enhancement` | Infer from the change (see below) |
| `number` | Issue/ticket number | Branch name or user input |
| `branchName` | Current git branch | `git branch --show-current` |
| `details` | Short summary of what changed | `git diff` / staged changes |

- Use lowercase for `taskType`.
- Keep `details` concise: what was fixed, added, or improved (not file lists).
- Subject line only — no multi-paragraph body unless the user asks for one.

## Task type

| Type | Use when |
|------|----------|
| `issue` | Bug fix, regression, broken behavior corrected |
| `feature` | New capability or user-facing functionality |
| `enhancement` | Improvement to existing behavior without a new feature |

If unclear, ask the user which type applies.

## Workflow

When generating or applying a commit message:

1. Run in parallel:
   - `git branch --show-current`
   - `git status --short`
   - `git diff` (staged if committing; otherwise staged + unstaged)
2. Extract `number` from the branch (e.g. `7-mapbox` → `7`) or ask if missing.
3. Classify `taskType` from the diff.
4. Write `details` from the actual changes (one clear phrase).
5. Assemble: `{taskType}#{number}-{branchName}-{details}`

Do **not** commit unless the user explicitly asks.

## Examples

See [examples.md](examples.md).
