# Weft

A dynamic plaintext editor with structured sidebar views. Write tasks in plain text — Weft parses them in real time and displays open tasks, upcoming deadlines, and tag clouds in a sidebar.

## Features

- **Plaintext-first** — the document is the single source of truth
- **Real-time parsing** — sidebar updates as you type
- **Three sidebar views** — Open Tasks, Due Soon (7 days), Tag Cloud
- **Vim keybindings** — full Vim support via CodeMirror
- **Mobile responsive** — slide-in sidebar on small screens
- **Auto-save** — persisted to localStorage on every change
- **Export** — download as `.txt`
- **Syntax reference** — built-in help dialog
- **Dark mode** — system-aware with manual toggle (light / dark / system)
- **Keyboard shortcuts** — Mod+E export, Mod+S save, Mod+B sidebar, Mod+/ help
- **Search & filter** — text search, tag filter, show-completed toggle
- **Drag & drop** — reorder tasks in the sidebar via @dnd-kit
- **PWA** — offline-capable via Service Worker
- **Cloudflare Workers** — deploy to the edge

## Syntax

```
- [ ] Open task
- [x] Completed task
- [ ] Tagged task #frontend #urgent
- [ ] Task with deadline due:2026-03-01
- [ ] Combined #backend due:2026-02-28

# Headings and plain text are ignored by the parser
```

| Element | Format | Example |
|---------|--------|---------|
| Open task | `- [ ] description` | `- [ ] Fix bug` |
| Done task | `- [x] description` | `- [x] Ship v1` |
| Tag | `#name` | `#frontend` |
| Due date | `due:YYYY-MM-DD` | `due:2026-03-01` |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm e2e` | Run E2E tests (Playwright) |
| `pnpm format` | Format code (Biome) |
| `pnpm format:check` | Check formatting |
| `pnpm deploy` | Deploy to Cloudflare Workers |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19 |
| Editor | CodeMirror 6 |
| Styling | Tailwind CSS 4 |
| Unit Tests | Vitest |
| E2E Tests | Playwright (Desktop Chrome + Mobile Pixel 7) |
| Linting / Formatting | Biome, ESLint |
| Validation | Zod |
| Deployment | Cloudflare Workers (OpenNext.js) |
| Package Manager | pnpm |

## Project Structure

```
app/
  layout.tsx            Root layout & viewport metadata
  page.tsx              Main page — editor + sidebar + header
src/
  parser/               Plaintext → structured data
    parseLine.ts        Parse a single task line
    parseDocument.ts    Parse full document
    toggleTask.ts       Toggle [ ] ↔ [x]
    moveLine.ts         Move a line within the document
    types.ts            ParsedTask, ParsedDocument
  query/                Filtering & aggregation
    openTasks.ts        Filter incomplete tasks
    dueSoon.ts          Tasks due within N days
    tagCounts.ts        Tag frequency counts
    filterTasks.ts      Text search, tag filter, show-completed
  storage/              Persistence
    localStorage.ts     Auto-save / load
    exportFile.ts       Download as .txt
    themeStorage.ts     Theme preference persistence
  ui/                   React components
    Editor.tsx          CodeMirror wrapper
    useWeftEditor.ts    Editor state hook
    Sidebar.tsx         Tabbed sidebar (responsive)
    TaskList.tsx        Open tasks list (drag & drop)
    SortableTaskItem.tsx  Draggable task item
    DueSoonPanel.tsx    Due soon panel
    TagCloud.tsx        Tag cloud
    SearchBar.tsx       Search and filter controls
    HelpDialog.tsx      Syntax reference modal
    ThemeToggle.tsx     Dark mode toggle
    ThemeProvider.tsx    Theme context provider
    useTheme.ts         Theme state hook
    useKeyboardShortcuts.ts  Global keyboard shortcuts
e2e/
  app.spec.ts           Desktop E2E tests
  mobile.spec.ts        Mobile E2E tests
  darkmode.spec.ts      Dark mode E2E tests
  pwa.spec.ts           PWA manifest tests
  shortcuts.spec.ts     Keyboard shortcut tests
  search-filter.spec.ts Search & filter tests
```

## License

MIT
