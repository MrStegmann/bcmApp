---
title: Clear, Action-Oriented Title (e.g., "Enable WAL Mode for Concurrency")
impact: CRITICAL
impactDescription: High concurrency, non-blocking readers
tags: pragma, configuration, performance
---

## [Rule Title]

[1-2 sentence explanation of the problem and why it matters.]

**Incorrect (describe the problem):**

```sql
-- Comment explaining what makes this slow/problematic
PRAGMA journal_mode = DELETE; -- Default rollback mode
-- Readers block writers, writers block readers
```

**Correct (describe the solution):**

```sql
-- Comment explaining why this is better
PRAGMA journal_mode = WAL;
-- Readers do not block writers, writers do not block readers
```

[Optional: Additional context, edge cases, or trade-offs]

Reference: [SQLite Docs](https://www.sqlite.org/docs.html)
