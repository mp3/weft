'use client'

import { useState } from 'react'
import type { ParsedDocument } from '@/parser/types'
import { dueSoon } from '@/query/dueSoon'
import { openTasks } from '@/query/openTasks'
import { tagCounts } from '@/query/tagCounts'
import { DueSoonPanel } from './DueSoonPanel'
import { TagCloud } from './TagCloud'
import { TaskList } from './TaskList'

type Tab = 'tasks' | 'due' | 'tags'

const TABS: readonly { readonly id: Tab; readonly label: string }[] = [
  { id: 'tasks', label: 'Open Tasks' },
  { id: 'due', label: 'Due Soon' },
  { id: 'tags', label: 'Tags' },
]

interface SidebarProps {
  readonly parsed: ParsedDocument
  readonly onToggle: (lineIndex: number) => void
  readonly open: boolean
  readonly onClose: () => void
}

export function Sidebar({ parsed, onToggle, open, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tasks')

  const openTaskList = openTasks(parsed.tasks)
  const due = dueSoon(parsed.tasks)
  const tags = tagCounts(parsed.tasks)

  return (
    <>
      {open && (
        <button
          type="button"
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          data-testid="sidebar-backdrop"
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-80 shrink-0 flex-col border-l border-zinc-200 bg-white transition-transform duration-200 ease-in-out dark:border-zinc-700 dark:bg-zinc-900 md:static md:z-auto md:translate-x-0 md:transition-none ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="sidebar"
      >
        <nav className="flex border-b border-zinc-200 dark:border-zinc-700">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
              {tab.id === 'tasks' && openTaskList.length > 0 && (
                <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">
                  ({openTaskList.length})
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="flex-1 overflow-auto p-4" data-testid="sidebar-content">
          {activeTab === 'tasks' && <TaskList tasks={openTaskList} onToggle={onToggle} />}
          {activeTab === 'due' && <DueSoonPanel tasks={due} onToggle={onToggle} />}
          {activeTab === 'tags' && <TagCloud tags={tags} />}
        </div>
      </aside>
    </>
  )
}
