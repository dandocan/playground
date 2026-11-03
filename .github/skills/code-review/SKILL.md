---
name: code-review
description: "Review code changes for bugs, regressions, security and reliability risks, and missing tests. Use when asked to review a diff, pull request, implementation, or patch."
---

# Code Review

Review the requested change as a reviewer. Do not edit files unless asked to fix findings.

## Procedure

1. Identify the change under review and inspect the relevant diff plus nearby implementation and tests.
2. Trace changed behavior through its callers and boundaries. Check error paths, input validation, state changes, compatibility, and security-sensitive handling where relevant.
3. Look for regressions and missing tests; avoid reporting style preferences or speculative concerns as defects.
4. Report actionable findings first, ordered by severity. For each, include the affected file and line, the condition that triggers the issue, and its concrete impact.
5. If there are no findings, say so explicitly and mention meaningful test gaps or residual risks.

Keep the review concise. Separate findings from assumptions and any brief summary.
