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
- `tests/unit/` - Vitest unit tests
- `tests/e2e/` - Playwright E2E tests

## Conventions

- `@/*` path alias maps to `src/*`
- Immutable data patterns (no mutation)
- All parser/query functions are pure (no side effects)
- TDD: write tests first, then implement
- Biome for formatting and linting
