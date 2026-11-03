---
name: open-pull-request
description: "Prepare or open a pull request from the current branch. Use when asked to create, open, submit, or get a branch ready for a PR, including reviewing its diff, checks, base branch, and remote changes."
---

# Open Pull Request

Prepare a reviewable pull request that contains only the intended work and accurately describes its validation.

## Procedure

1. Inspect the repository state, current branch, intended base branch, and available GitHub or repository tooling. Identify uncommitted changes and commits not yet in the base branch.
2. Review the complete branch diff against the intended base. Check that it is scoped to the request and that generated files, secrets, and unrelated changes are not included.
3. Run relevant focused checks when practical. Record the exact checks and results; do not imply a check passed if it was not run.
4. Draft a concise title and description based on the actual diff. Include motivation, key changes, tests, and material risks or configuration notes. Omit irrelevant boilerplate.
5. Only push a branch or create a remote pull request when explicitly requested. Before publishing, verify that the branch and commits contain only intended work; do not commit, amend, rebase, or discard user changes without explicit direction.
6. Use the repository's configured integration or available GitHub CLI. Do not guess the base branch or repository when they are unclear; ask for the missing detail. If authentication or tooling blocks creation, provide the prepared title and description and explain the blocker.
7. After creation, report the PR URL, base and head branches, and checks performed. Clearly state any checks that remain outstanding.
