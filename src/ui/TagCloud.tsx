'use client'

import type { TagCount } from '@/query/tagCounts'

interface TagCloudProps {
  readonly tags: readonly TagCount[]
  readonly selectedTag?: string | null
  readonly onTagSelect?: (tag: string | null) => void
}

export function TagCloud({ tags, selectedTag, onTagSelect }: TagCloudProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No tags found</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => {
        const isSelected = selectedTag === tag
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onTagSelect?.(isSelected ? null : tag)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm transition-colors ${
              isSelected
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
            data-testid={`tag-${tag}`}
          >
            #{tag}
            <span
              className={`rounded-full px-1.5 text-xs ${
                isSelected
                  ? 'bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-700'
                  : 'bg-zinc-300 dark:bg-zinc-600'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
