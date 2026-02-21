# Text Format Specification

## Task Lines

```
- [ ] Task description          (open task)
- [x] Task description          (completed task)
```

## Tags

Tags are `#word` tokens within any line: `#backend`, `#devops`, `#testing`

Allowed characters: `[a-zA-Z0-9_-]`

## Due Dates

Due dates are `due:YYYY-MM-DD` tokens within task lines.

Example: `- [ ] Deploy to staging #devops due:2026-03-01`
