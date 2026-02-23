'use client'

import type { TaskFilter } from '@/query/filterTasks'

interface SearchBarProps {
  readonly filter: TaskFilter
  readonly onFilterChange: (filter: TaskFilter) => void
}

export function SearchBar({ filter, onFilterChange }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
      <input
        type="text"
        placeholder="Search tasks…"
        value={filter.query}
        onChange={(e) => onFilterChange({ ...filter, query: e.target.value })}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400"
        data-testid="search-input"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={filter.showCompleted}
            onChange={(e) => onFilterChange({ ...filter, showCompleted: e.target.checked })}
            className="rounded"
            data-testid="show-completed-toggle"
          />
          Show completed
        </label>
        {filter.tag !== null && (
          <button
            type="button"
            onClick={() => onFilterChange({ ...filter, tag: null })}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900"
            data-testid="active-tag-filter"
          >
            #{filter.tag}
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
    </div>
  )
}
