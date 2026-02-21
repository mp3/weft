# Invariants

1. **Source of truth**: All state lives in plaintext. `[ ]`/`[x]` is the only representation of task status.
2. **Deterministic parsing**: Same text → same ParsedDocument. No randomness, no side effects.
3. **Non-destructive toggle**: Only the checkbox changes. Tags, due dates, and all other text on the line remain identical.
4. **Stable view ordering**: Open Tasks = document order, Due Soon = date ascending, Tags = count descending.
