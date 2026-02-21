'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'
import { parseDocument } from '@/parser/parseDocument'
import { toggleTaskLine } from '@/parser/toggleTask'
import { loadDocument, saveDocument } from '@/storage/localStorage'
import { SAMPLE_TEXT } from '@/sampleText'
import type { ParsedDocument } from '@/parser/types'

const SAVE_DEBOUNCE_MS = 500

function getInitialDocument(): string {
  return loadDocument() ?? SAMPLE_TEXT
}

function getInitialParsed(): ParsedDocument {
  return parseDocument(getInitialDocument())
}

export function useWeftEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [parsed, setParsed] = useState<ParsedDocument>(getInitialParsed)

  const getDocText = useCallback((): string => {
    return viewRef.current?.state.doc.toString() ?? ''
  }, [])

  const toggleTask = useCallback((lineIndex: number) => {
    const view = viewRef.current
    if (!view) return

    const doc = view.state.doc
    const lineInfo = doc.line(lineIndex + 1)
    const newLineText = toggleTaskLine(lineInfo.text)
    if (newLineText === lineInfo.text) return

    view.dispatch({
      changes: { from: lineInfo.from, to: lineInfo.to, insert: newLineText },
    })
  }, [])

  useEffect(() => {
    if (!editorRef.current) return

    const initialDoc = getInitialDocument()

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        vim(),
        basicSetup,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return
          const text = update.state.doc.toString()
          setParsed(parseDocument(text))

          if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
          saveTimerRef.current = setTimeout(() => {
            saveDocument(text)
          }, SAVE_DEBOUNCE_MS)
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      view.destroy()
    }
  }, [])

  return { editorRef, parsed, toggleTask, getDocText }
}
