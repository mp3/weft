'use client'

import type { RefObject } from 'react'

interface EditorProps {
  readonly editorRef: RefObject<HTMLDivElement | null>
}

export function Editor({ editorRef }: EditorProps) {
  return <div ref={editorRef} className="h-full overflow-auto" data-testid="editor" />
}
