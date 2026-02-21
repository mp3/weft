export interface ParsedTask {
  readonly line: number
  readonly text: string
  readonly completed: boolean
  readonly description: string
  readonly tags: readonly string[]
  readonly due: string | null
}

export interface ParsedDocument {
  readonly tasks: readonly ParsedTask[]
  readonly allTags: readonly string[]
}
