export interface HelpItem {
  readonly syntax: string
  readonly description: string
}

export interface HelpSection {
  readonly title: string
  readonly items: readonly HelpItem[]
}

export const helpSections: readonly HelpSection[] = [
  {
    title: 'Tasks',
    items: [
      { syntax: '- [ ] description', description: 'Open task' },
      { syntax: '- [x] description', description: 'Completed task' },
    ],
  },
  {
    title: 'Tags',
    items: [
      {
        syntax: '#tagname',
        description: 'Inline tag (alphanumeric, hyphens, underscores)',
      },
    ],
  },
  {
    title: 'Due Dates',
    items: [{ syntax: 'due:YYYY-MM-DD', description: 'Due date within a task line' }],
  },
  {
    title: 'Example',
    items: [
      {
        syntax: '- [ ] Fix bug #frontend due:2026-03-01',
        description: 'Task with tag and due date',
      },
    ],
  },
  {
    title: 'Other',
    items: [
      { syntax: '# Heading', description: 'Section heading (ignored by parser)' },
      { syntax: 'plain text', description: 'Plain text (ignored by parser)' },
    ],
  },
  {
    title: 'Keyboard Shortcuts',
    items: [
      { syntax: '\u2318E / Ctrl+E', description: 'Export as .txt' },
      { syntax: '\u2318S / Ctrl+S', description: 'Save now' },
      { syntax: '\u2318/ / Ctrl+/', description: 'Toggle help' },
      { syntax: '\u2318B / Ctrl+B', description: 'Toggle sidebar' },
      { syntax: '\u2325\u21e7V / Alt+Shift+V', description: 'Toggle vim mode' },
    ],
  },
] as const
