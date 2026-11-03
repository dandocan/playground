---
name: test-design
description: "Design, add, or improve automated tests for behavior changes, bug fixes, and edge cases. Use when creating tests or deciding what a test suite should cover."
---

# Test Design

Create tests that make important behavior observable and failures diagnosable.

## Procedure

1. Read the implementation, its callers, and neighboring tests to understand the public behavior and local test conventions.
2. Identify the normal case, meaningful boundaries, invalid inputs, and relevant failure paths. Prioritize cases that could expose a regression.
3. Test externally observable outcomes rather than private implementation details. Use the smallest useful fixtures and avoid unnecessary mocking.
4. Follow the existing runner: Vitest in `apps/api` and Node's built-in test runner in `apps/web`.
5. Run the focused test first, then the package-level test command when practical. Report what was run and any remaining coverage gap.

Do not broaden the change into unrelated test cleanup.
