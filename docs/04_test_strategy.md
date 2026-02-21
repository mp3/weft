# Test Strategy

## Unit Tests (Vitest)

- **Parser**: parseLine, parseDocument, toggleTask
- **Query**: openTasks, dueSoon, tagCounts
- **Storage**: localStorage save/load roundtrip
- Coverage target: 80%+ on src/parser, src/query, src/storage

## E2E Tests (Playwright)

- App loads with sample text
- Task creation and sidebar display
- Checkbox toggle updates sidebar
- Tab switching (Open Tasks, Due Soon, Tags)
- localStorage persistence across reload
