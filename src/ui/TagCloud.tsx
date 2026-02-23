'use client'

import type { TagCount } from '@/query/tagCounts'

interface TagCloudProps {
  readonly tags: readonly TagCount[]
}

export function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">No tags found</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          #{tag}
          <span className="rounded-full bg-zinc-300 px-1.5 text-xs dark:bg-zinc-600">{count}</span>
        </span>
      ))}
    </div>
  )
}
