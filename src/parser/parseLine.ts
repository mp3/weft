import type { ParsedTask } from './types'

const TASK_RE = /^-\s\[([x ])\]\s(.+)$/
const TAG_RE = /#([a-zA-Z0-9_-]+)/g
const DUE_RE = /due:(\d{4}-\d{2}-\d{2})/

export function parseLine(line: string, lineIndex: number): ParsedTask | null {
  const match = TASK_RE.exec(line)
  if (!match) return null

  const completed = match[1] === 'x'
  const description = match[2]
  const tags = [...description.matchAll(TAG_RE)].map((m) => m[1])
  const dueMatch = DUE_RE.exec(description)
  const due = dueMatch ? dueMatch[1] : null

  return {
    line: lineIndex,
    text: line,
    completed,
    description,
    tags,
    due,
  }
}
