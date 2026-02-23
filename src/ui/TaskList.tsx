'use client'

import type { ParsedTask } from '@/parser/types'

interface TaskListProps {
  readonly tasks: readonly ParsedTask[]
  readonly onToggle: (lineIndex: number) => void
}

export function TaskList({ tasks, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No open tasks</p>
  }

  return (
    <ul className="space-y-1">
      {tasks.map((task) => (
        <li key={task.line} className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.line)}
            className="mt-0.5 shrink-0"
            data-testid={`task-checkbox-${task.line}`}
          />
          <span className={task.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}>
            {task.description}
          </span>
        </li>
      ))}
    </ul>
  )
}
