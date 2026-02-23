# Weft

Dynamic plaintext editor where a single plaintext document is the source of truth.

## Tech Stack

- **Runtime**: Node.js 22 LTS (via mise)
- **Framework**: Next.js 16 (App Router)
- **Editor**: CodeMirror 6 with Vim keybindings
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest (unit), Playwright (E2E)
- **Formatting**: Biome
- **Deploy**: Cloudflare Workers via @opennextjs/cloudflare

## Architecture

- `app/` - Next.js App Router pages
- `src/parser/` - Pure functions: parseLine, parseDocument, toggleTask
- `src/query/` - Pure functions: openTasks, dueSoon, tagCounts
- `src/storage/` - localStorage persistence, text file export
- `src/ui/` - React components and CodeMirror hook
- `src/**/*.test.ts` - Vitest unit/integration tests (jsdom environment)
- `src/**/*.ssr.test.ts` - Vitest SSR tests (node environment)
- `e2e/*.spec.ts` - Playwright E2E tests

## Conventions

- `@/*` path alias maps to `src/*`
- Immutable data patterns (no mutation)
- All parser/query functions are pure (no side effects)
- TDD: write tests first, then implement
- Biome for formatting and linting

## Development Commands

- `pnpm dev` — Start dev server
- `pnpm verify` — Run all CI checks locally (lint + typecheck + format + test)
- `pnpm e2e` — Run E2E tests (requires dev server)
- `pnpm test:coverage` — Run unit tests with coverage report

## Before Committing

ALWAYS run `pnpm verify` before creating a commit. Do not commit if any check fails.
Fix all errors before committing. This prevents CI failures.

## Testing

- Unit/integration tests: `src/**/*.test.ts` (Vitest, jsdom environment)
- SSR tests: `src/**/*.ssr.test.ts` (Vitest, node environment)
- E2E tests: `e2e/*.spec.ts` (Playwright)
- Coverage threshold: 95% (statements, branches, functions, lines)
