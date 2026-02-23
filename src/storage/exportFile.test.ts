import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportAsTextFile } from './exportFile'

describe('exportAsTextFile', () => {
  const mockClick = vi.fn()
  let createdElements: HTMLAnchorElement[] = []

  beforeEach(() => {
    createdElements = []
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = {
        tagName: tag,
        href: '',
        download: '',
        click: mockClick,
      } as unknown as HTMLAnchorElement
      createdElements.push(el)
      return el
    })
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a download link and clicks it', () => {
    exportAsTextFile('hello world')
    expect(createdElements).toHaveLength(1)
    expect(createdElements[0].href).toBe('blob:mock-url')
    expect(createdElements[0].download).toBe('weft-export.txt')
    expect(mockClick).toHaveBeenCalledOnce()
  })

  it('uses custom filename when provided', () => {
    exportAsTextFile('content', 'custom.txt')
    expect(createdElements[0].download).toBe('custom.txt')
  })

  it('revokes the object URL after download', () => {
    exportAsTextFile('content')
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})
