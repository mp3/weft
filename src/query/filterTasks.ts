import type { ParsedTask } from '@/parser/types'

export interface TaskFilter {
  readonly query: string
  readonly tag: string | null
  readonly showCompleted: boolean
}

export const EMPTY_FILTER: TaskFilter = {
  query: '',
  tag: null,
  showCompleted: false,
}

export function filterTasks(
  tasks: readonly ParsedTask[],
  filter: TaskFilter,
): readonly ParsedTask[] {
  const lowerQuery = filter.query.toLowerCase()

  return tasks.filter((task) => {
    if (!filter.showCompleted && task.completed) return false
    if (filter.tag !== null && !task.tags.includes(filter.tag)) return false
    if (lowerQuery !== '' && !task.description.toLowerCase().includes(lowerQuery)) return false
    return true
  })
}
