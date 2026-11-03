---
name: write-pr-description
description: "Draft or improve a pull request title and description based on the actual changes. Use when summarizing a branch or diff for reviewers."
argument-hint: "Provide the diff or branch context and any issue or motivation"
agent: agent
---

Write reviewer-oriented pull request text grounded in the requested work and the actual diff.

**PR Title Convention:** All PR titles must follow the format `[type]([app]): [change summary]`
- type: feat, fix, docs, refactor, chore, or other relevant types
- app: web, api, or other app in the workspace
- change summary: a normal descriptive summary

Example titles:
- `feat(web): add dark mode toggle to settings`
- `fix(api): resolve race condition in user authentication`
- `docs(web): update API integration guide`

**Instructions:**
- Inspect the branch diff against its target base and relevant conversation or issue context. Check for repository PR templates or established conventions before choosing a format.
- Identify the problem or motivation, the important implementation changes, and any user-visible or operational impact.
- Draft a clear, concise title and description that help reviewers understand what changed and why.
- Report tests and checks precisely. Distinguish automated checks that were run from manual verification, planned checks, or checks not run.
- Mention breaking changes, configuration or migration requirements, risks, and follow-up work when relevant. Omit sections that add no information.
- Do not invent motivation, behavior, test results, issue links, or compatibility claims. Flag missing context rather than filling gaps with assumptions.
- Unless asked to edit a remote PR, return the proposed title and Markdown body without publishing it.