'use client'

import { useWeftEditor } from '@/ui/useWeftEditor'
import { Editor } from '@/ui/Editor'
import { Sidebar } from '@/ui/Sidebar'
import { exportAsTextFile } from '@/storage/exportFile'

export default function Home() {
  const { editorRef, parsed, toggleTask, getDocText } = useWeftEditor()

  const handleExport = () => {
    const text = getDocText()
    if (text) exportAsTextFile(text)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-2">
        <h1 className="text-lg font-bold">Weft</h1>
        <button
          type="button"
          onClick={handleExport}
          className="rounded bg-zinc-900 px-3 py-1 text-sm text-white transition-colors hover:bg-zinc-700"
          data-testid="export-button"
        >
          Export .txt
        </button>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Editor editorRef={editorRef} />
        </div>
        <Sidebar parsed={parsed} onToggle={toggleTask} />
      </main>
    </div>
  )
}
