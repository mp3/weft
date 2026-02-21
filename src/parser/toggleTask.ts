export function toggleTaskLine(line: string): string {
  if (line.startsWith('- [ ] ')) {
    return `- [x] ${line.slice(6)}`
  }
  if (line.startsWith('- [x] ')) {
    return `- [ ] ${line.slice(6)}`
  }
  return line
}

export function toggleTaskInDocument(doc: string, lineIndex: number): string {
  const lines = doc.split('\n')
  if (lineIndex < 0 || lineIndex >= lines.length) return doc

  return lines.map((line, i) => (i === lineIndex ? toggleTaskLine(line) : line)).join('\n')
}
