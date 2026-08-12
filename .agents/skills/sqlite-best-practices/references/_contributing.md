# Writing Guidelines for SQLite References

This document provides guidelines for creating effective SQLite best
practice references that work well with AI agents and LLMs.

## Key Principles

### 1. Concrete Transformation Patterns

Show exact SQL/Pragma rewrites. Avoid philosophical advice.

**Good:** "Use `PRAGMA journal_mode = WAL;`"
**Bad:** "Configure journaling for performance"

### 2. Error-First Structure

Always show the problematic pattern first, then the solution.

```markdown
**Incorrect (default rollback journal):** [bad example]

**Correct (WAL mode):** [good example]
```

### 3. Quantified Impact

Include specific metrics or concurrency implications.

**Good:** "10x+ higher concurrency", "Non-blocking readers"
**Bad:** "Better", "Faster"

### 4. Self-Contained Examples

Examples should be complete.

```sql
-- Create table first
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
-- Then show the index
CREATE INDEX idx_users_name ON users(name);
```

---

## Code Example Standards

### SQL Formatting

```sql
-- Use lowercase keywords (optional but preferred for consistency), clear formatting
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL
) STRICT;
```

### Comments

- Explain _why_, not _what_
- Highlight performance implications

---

## Impact Level Guidelines

| Level | Improvement | Use When |
|-------|-------------|----------|
| **CRITICAL** | 10-100x / Concurrency | WAL Mode, Missing Indexes, Busy Timeouts |
| **HIGH** | 5-20x / Integrity | Strict Tables, Foreign Keys, Covering Indexes |
| **MEDIUM** | 2-5x | Partial Indexes, Upserts, Transactions |
| **LOW** | Incremental | Specific JSON optimizations |
