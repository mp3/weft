'use client'

import { useCallback, useState } from 'react'
import { exportAsTextFile } from '@/storage/exportFile'
import { Editor } from '@/ui/Editor'
import { HelpDialog } from '@/ui/HelpDialog'
import { Sidebar } from '@/ui/Sidebar'
import { useWeftEditor } from '@/ui/useWeftEditor'

export default function Home() {
  const { editorRef, parsed, toggleTask, getDocText } = useWeftEditor()
  const [helpOpen, setHelpOpen] = useState(false)

  const handleExport = () => {
    const text = getDocText()
    if (text) exportAsTextFile(text)
  }

  const handleCloseHelp = useCallback(() => setHelpOpen(false), [])

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-2">
        <h1 className="text-lg font-bold">Weft</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="rounded border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
            data-testid="help-button"
          >
            ?
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded bg-zinc-900 px-3 py-1 text-sm text-white transition-colors hover:bg-zinc-700"
            data-testid="export-button"
          >
            Export .txt
          </button>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Editor editorRef={editorRef} />
        </div>
        <Sidebar parsed={parsed} onToggle={toggleTask} />
      </main>
      <HelpDialog open={helpOpen} onClose={handleCloseHelp} />
    </div>
  )
}
