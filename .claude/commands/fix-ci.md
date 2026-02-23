---
description: Diagnose and fix CI failures. Checks GitHub Actions logs, identifies root cause, applies fix, and pushes.
---

# Fix CI

Diagnose and fix the latest CI failure on the current branch.

## Workflow

1. **Identify the failure**
   - Run `gh run list --branch $(git branch --show-current) --limit 5` to find recent runs
   - Run `gh run view <run-id> --log-failed` to get failure logs
   - If multiple jobs failed, check each one

2. **Diagnose the root cause**
   Common failure categories:
   - **Coverage threshold** — statements/branches/functions below minimum
   - **Type errors** — TypeScript compilation failures
   - **Test failures** — unit or E2E test assertions failing
   - **Lint/format errors** — Biome, ESLint, or Prettier violations
   - **Build errors** — Next.js or bundler failures
   - **Dependency issues** — missing or incompatible packages

3. **Fix the issue**
   Apply the minimal fix for the specific failure:
   - Coverage: add tests for uncovered files (check coverage report for lowest-covered files)
   - Type errors: fix the type issues directly
   - Test failures: investigate why the assertion fails, fix code or test
   - Lint/format: run the formatter, fix lint violations
   - Build: use the build-error-resolver pattern

4. **Verify locally**
   Run the same commands that CI runs before pushing:
   ```bash
   pnpm typecheck
   pnpm test
   pnpm format:check
   pnpm build
   ```
   Run only the relevant subset if the failure is isolated.

5. **Commit and push**
   - Use a descriptive commit message explaining what was fixed
   - Prefix with appropriate type: `fix:`, `test:`, `chore:`

6. **Confirm CI passes**
   - Run `gh run list --limit 1` to check the new run status
   - If still failing, repeat from step 1

## Rules

- Fix ONE issue at a time — don't bundle unrelated changes
- Never skip tests or lower thresholds to make CI pass
- If the failure is pre-existing (not caused by recent commits), inform the user
- If the fix requires architectural changes, stop and discuss with the user
