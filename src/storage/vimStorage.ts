const VIM_KEY = 'weft-vim'

export function loadVimEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(VIM_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveVimEnabled(enabled: boolean): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(VIM_KEY, String(enabled))
    return true
  } catch {
    return false
  }
}
