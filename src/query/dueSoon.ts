import type { ParsedTask } from '@/parser/types'

export function dueSoon(
  tasks: readonly ParsedTask[],
  referenceDate: string = new Date().toISOString().slice(0, 10),
  windowDays: number = 7,
): readonly ParsedTask[] {
  const ref = new Date(referenceDate)
  const end = new Date(ref)
  end.setDate(end.getDate() + windowDays)

  return tasks
    .filter((task) => {
      if (task.completed || !task.due) return false
      const dueDate = new Date(task.due)
      return dueDate >= ref && dueDate <= end
    })
    .toSorted((a, b) => a.due!.localeCompare(b.due!))
}
