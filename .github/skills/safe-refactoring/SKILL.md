---
name: safe-refactoring
description: "Refactor existing code while preserving behavior and public contracts. Use when simplifying, extracting, reorganizing, or improving maintainability without an intended behavior change."
---

# Safe Refactoring

Make structural improvements without changing what users or callers observe.

## Procedure

1. Establish the behavior and relevant contracts from implementation, callers, tests, and documentation.
2. State the intended structural improvement and identify the narrowest useful validation before editing.
3. Make one small, behavior-preserving change at a time. Keep public APIs, configuration, and error behavior stable unless the request explicitly changes them.
4. Run focused tests or checks immediately after the change. Add a regression test if the refactor exposes an untested contract.
5. Inspect the final diff for accidental behavior changes and unrelated edits.

If the desired improvement requires a behavior change, call that out rather than hiding it inside the refactor.
