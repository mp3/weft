# Weft Overview

Weft is a web-based plaintext editor where a single plaintext document is the source of truth, and a dynamic sidebar extracts structured views (open tasks, due-soon items, tag counts) from that text.

## Core Concept

- The plaintext document is the single source of truth
- Structured data (tasks, tags, due dates) is parsed from the text
- Sidebar views are derived from parsed data
- Toggling a checkbox mutates the plaintext, and all views reactively update

## Text Format

Tasks are lines matching: `- [ ] description` or `- [x] description`
Tags are `#word` tokens. Due dates are `due:YYYY-MM-DD`.
