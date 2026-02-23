export function moveLineInDocument(
  doc: string,
  fromLineIndex: number,
  toLineIndex: number,
): string {
  if (fromLineIndex === toLineIndex) return doc

  const lines = doc.split('\n')
  if (fromLineIndex < 0 || fromLineIndex >= lines.length) return doc
  if (toLineIndex < 0 || toLineIndex >= lines.length) return doc

  const result = [...lines]
  const [removed] = result.splice(fromLineIndex, 1)
  result.splice(toLineIndex, 0, removed)

  return result.join('\n')
}
