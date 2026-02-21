import type { ParsedDocument } from './types'
import { parseLine } from './parseLine'

export function parseDocument(doc: string): ParsedDocument {
  const lines = doc.split('\n')
  const tasks = lines
    .map((line, index) => parseLine(line, index))
    .filter((task): task is NonNullable<typeof task> => task !== null)

  const tagSet = new Set<string>()
  for (const task of tasks) {
    for (const tag of task.tags) {
      tagSet.add(tag)
    }
  }

  return {
    tasks,
    allTags: [...tagSet],
  }
}
