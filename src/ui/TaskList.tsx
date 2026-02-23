'use client'

import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCallback } from 'react'
import type { ParsedTask } from '@/parser/types'
import { SortableTaskItem } from './SortableTaskItem'

interface TaskListProps {
  readonly tasks: readonly ParsedTask[]
  readonly onToggle: (lineIndex: number) => void
  readonly onMoveTask: (fromLineIndex: number, toLineIndex: number) => void
}

export function TaskList({ tasks, onToggle, onMoveTask }: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      onMoveTask(active.id as number, over.id as number)
    },
    [onMoveTask],
  )

  if (tasks.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No open tasks</p>
  }

  const taskIds = tasks.map((t) => t.line)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <ul className="space-y-1">
          {tasks.map((task) => (
            <SortableTaskItem key={task.line} task={task} onToggle={onToggle} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
