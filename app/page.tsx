'use client'

import { useCallback, useMemo, useState } from 'react'
import { exportAsTextFile } from '@/storage/exportFile'
import { saveDocument } from '@/storage/localStorage'
import { Editor } from '@/ui/Editor'
import { HelpDialog } from '@/ui/HelpDialog'
import { Sidebar } from '@/ui/Sidebar'
import { ThemeToggle } from '@/ui/ThemeToggle'
import type { ShortcutActions } from '@/ui/useKeyboardShortcuts'
import { useKeyboardShortcuts } from '@/ui/useKeyboardShortcuts'
import { useWeftEditor } from '@/ui/useWeftEditor'

export default function Home() {
  const { editorRef, parsed, toggleTask, moveTask, getDocText, toggleVim } = useWeftEditor()
  const [helpOpen, setHelpOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const handleExport = useCallback(() => {
    const text = getDocText()
    if (text) exportAsTextFile(text)
  }, [getDocText])

  const handleSave = useCallback(() => {
    const text = getDocText()
    if (text) saveDocument(text)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 1500)
  }, [getDocText])

  const handleToggleHelp = useCallback(() => setHelpOpen((prev) => !prev), [])
  const handleCloseHelp = useCallback(() => setHelpOpen(false), [])
  const handleToggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), [])

  const shortcutActions: ShortcutActions = useMemo(
    () => ({
      onExport: handleExport,
      onSave: handleSave,
      onToggleHelp: handleToggleHelp,
      onToggleSidebar: handleToggleSidebar,
      onToggleVim: toggleVim,
    }),
    [handleExport, handleSave, handleToggleHelp, handleToggleSidebar, toggleVim],
  )

  useKeyboardShortcuts(shortcutActions, { helpOpen })

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-700">
        <h1 className="text-lg font-bold">Weft</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="rounded border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            data-testid="sidebar-toggle"
          >
            {sidebarOpen ? '\u2715' : '\u2630'}
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={handleToggleHelp}
            className="rounded border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            data-testid="help-button"
          >
            ?
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded bg-zinc-900 px-3 py-1 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            data-testid="export-button"
          >
            Export .txt
          </button>
        </div>
      </header>
      <main className="relative flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Editor editorRef={editorRef} />
        </div>
        <Sidebar
          parsed={parsed}
          onToggle={toggleTask}
          onMoveTask={moveTask}
          open={sidebarOpen}
          onClose={handleCloseSidebar}
        />
      </main>
      <HelpDialog open={helpOpen} onClose={handleCloseHelp} />
      {toastVisible && (
        <div
          data-testid="save-toast"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded bg-zinc-800 px-4 py-2 text-sm text-white shadow-lg dark:bg-zinc-200 dark:text-zinc-900"
        >
          Saved
        </div>
      )}
    </div>
  )
}
