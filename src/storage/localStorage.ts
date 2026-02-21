const STORAGE_KEY = 'weft-doc'

export function loadDocument(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveDocument(doc: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(STORAGE_KEY, doc)
    return true
  } catch {
    return false
  }
}
