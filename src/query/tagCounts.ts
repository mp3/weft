import type { ParsedTask } from '@/parser/types'

export interface TagCount {
  readonly tag: string
  readonly count: number
}

export function tagCounts(tasks: readonly ParsedTask[]): readonly TagCount[] {
  const counts = new Map<string, number>()

  for (const task of tasks) {
    for (const tag of task.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .toSorted((a, b) => b.count - a.count)
}
