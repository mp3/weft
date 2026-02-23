'use client'

import { useEffect, useRef } from 'react'
import { helpSections } from './helpContent'

interface HelpDialogProps {
  readonly open: boolean
  readonly onClose: () => void
}

export function HelpDialog({ open, onClose }: HelpDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onClose()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      data-testid="help-dialog"
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-0 shadow-lg backdrop:bg-black/40 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Syntax Reference</h2>
          <button
            type="button"
            data-testid="help-close"
            onClick={onClose}
            className="rounded p-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {helpSections.map((section) => (
            <section key={section.title}>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.syntax} className="flex items-baseline gap-3 text-sm">
                    <code className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      {item.syntax}
                    </code>
                    <span className="text-zinc-600 dark:text-zinc-400">{item.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </dialog>
  )
}
