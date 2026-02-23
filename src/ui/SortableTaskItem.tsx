'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ParsedTask } from '@/parser/types'

interface SortableTaskItemProps {
  readonly task: ParsedTask
  readonly onToggle: (lineIndex: number) => void
}

export function SortableTaskItem({ task, onToggle }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.line,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 text-sm"
      data-testid={`task-item-${task.line}`}
    >
      <button
        type="button"
        className="mt-0.5 shrink-0 cursor-grab touch-none text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        &#x2807;
      </button>
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
  )
}
