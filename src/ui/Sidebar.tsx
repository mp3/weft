'use client'

import { useState } from 'react'
import type { ParsedDocument } from '@/parser/types'
import { openTasks } from '@/query/openTasks'
import { dueSoon } from '@/query/dueSoon'
import { tagCounts } from '@/query/tagCounts'
import { TaskList } from './TaskList'
import { DueSoonPanel } from './DueSoonPanel'
import { TagCloud } from './TagCloud'

type Tab = 'tasks' | 'due' | 'tags'

const TABS: readonly { readonly id: Tab; readonly label: string }[] = [
  { id: 'tasks', label: 'Open Tasks' },
  { id: 'due', label: 'Due Soon' },
  { id: 'tags', label: 'Tags' },
]

interface SidebarProps {
  readonly parsed: ParsedDocument
  readonly onToggle: (lineIndex: number) => void
}

export function Sidebar({ parsed, onToggle }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tasks')

  const open = openTasks(parsed.tasks)
  const due = dueSoon(parsed.tasks)
  const tags = tagCounts(parsed.tasks)

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-zinc-200">
      <nav className="flex border-b border-zinc-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-zinc-900 text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label}
            {tab.id === 'tasks' && open.length > 0 && (
              <span className="ml-1 text-xs text-zinc-400">({open.length})</span>
            )}
          </button>
        ))}
      </nav>
      <div className="flex-1 overflow-auto p-4" data-testid="sidebar-content">
        {activeTab === 'tasks' && <TaskList tasks={open} onToggle={onToggle} />}
        {activeTab === 'due' && <DueSoonPanel tasks={due} onToggle={onToggle} />}
        {activeTab === 'tags' && <TagCloud tags={tags} />}
      </div>
    </aside>
  )
}
