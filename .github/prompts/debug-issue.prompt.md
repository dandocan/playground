---
name: debug-issue
description: "Investigate a bug from its symptoms, find the root cause, and verify a focused fix."
argument-hint: "Describe the observed behavior, expected behavior, and reproduction steps"
agent: agent
---

Investigate the reported issue in this repository.

- Reproduce or trace the behavior from the provided symptoms; inspect the owning code path and nearby tests.
- Form a concrete root-cause hypothesis and choose a focused check that can confirm or disprove it.
- Make the smallest fix that addresses the root cause, preserving unrelated user changes.
- Add a regression test when practical, then run the narrowest relevant validation.
- Report the cause, changes, validation result, and any remaining uncertainty. Do not commit changes.
