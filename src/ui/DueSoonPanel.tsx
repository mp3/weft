'use client'

import type { ParsedTask } from '@/parser/types'

interface DueSoonPanelProps {
  readonly tasks: readonly ParsedTask[]
  readonly onToggle: (lineIndex: number) => void
}

export function DueSoonPanel({ tasks, onToggle }: DueSoonPanelProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No upcoming due items</p>
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
            data-testid={`due-checkbox-${task.line}`}
          />
          <span className="flex-1">{task.description}</span>
          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            {task.due}
          </span>
        </li>
      ))}
    </ul>
  )
}
