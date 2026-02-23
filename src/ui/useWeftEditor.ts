'use client'

import { Compartment, EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { vim } from '@replit/codemirror-vim'
import { basicSetup } from 'codemirror'
import { useCallback, useEffect, useRef, useState } from 'react'
import { moveLineInDocument } from '@/parser/moveLine'
import { parseDocument } from '@/parser/parseDocument'
import { toggleTaskLine } from '@/parser/toggleTask'
import type { ParsedDocument } from '@/parser/types'
import { SAMPLE_TEXT } from '@/sampleText'
import { loadDocument, saveDocument } from '@/storage/localStorage'
import { loadVimEnabled, saveVimEnabled } from '@/storage/vimStorage'
import type { ResolvedTheme } from './useTheme'
import { useTheme } from './useTheme'

const SAVE_DEBOUNCE_MS = 500

function getInitialDocument(): string {
  return loadDocument() ?? SAMPLE_TEXT
}

function getInitialParsed(): ParsedDocument {
  return parseDocument(getInitialDocument())
}

function getThemeExtension(resolved: ResolvedTheme) {
  return resolved === 'dark' ? EditorView.theme({}, { dark: true }) : []
}

export function useWeftEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const themeCompartment = useRef(new Compartment())
  const vimCompartment = useRef(new Compartment())
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [parsed, setParsed] = useState<ParsedDocument>(getInitialParsed)
  const [vimEnabled, setVimEnabled] = useState(loadVimEnabled)
  const { resolved } = useTheme()

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: editor must only be created once on mount; theme updates are handled by the separate reconfigure effect below
  useEffect(() => {
    if (!editorRef.current) return

    const initialDoc = getInitialDocument()

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        vimCompartment.current.of(vimEnabled ? vim() : []),
        basicSetup,
        themeCompartment.current.of(getThemeExtension(resolved)),
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    view.dispatch({
      effects: themeCompartment.current.reconfigure(getThemeExtension(resolved)),
    })
  }, [resolved])

  useEffect(() => {
    const view = viewRef.current
    if (!view) return

    view.dispatch({
      effects: vimCompartment.current.reconfigure(vimEnabled ? vim() : []),
    })
  }, [vimEnabled])

  const toggleVim = useCallback(() => {
    setVimEnabled((prev) => {
      const next = !prev
      saveVimEnabled(next)
      return next
    })
  }, [])

  const moveTask = useCallback((fromLineIndex: number, toLineIndex: number) => {
    const view = viewRef.current
    if (!view) return
    if (fromLineIndex === toLineIndex) return

    const currentText = view.state.doc.toString()
    const newText = moveLineInDocument(currentText, fromLineIndex, toLineIndex)
    if (newText === currentText) return

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newText },
    })
  }, [])

  return { editorRef, parsed, toggleTask, moveTask, getDocText, vimEnabled, toggleVim }
}
