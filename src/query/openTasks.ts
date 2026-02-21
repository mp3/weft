import type { ParsedTask } from '@/parser/types'

export function openTasks(tasks: readonly ParsedTask[]): readonly ParsedTask[] {
  return tasks.filter((task) => !task.completed)
}
