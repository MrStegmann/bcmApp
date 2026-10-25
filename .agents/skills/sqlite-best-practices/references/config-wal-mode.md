---
title: Enable WAL Mode for Concurrency
impact: CRITICAL
impactDescription: 10x-100x higher throughput, non-blocking readers
tags: pragma, wal, concurrency, performance
---

## Enable WAL Mode for Concurrency

The default rollback journal mode allows only one reader *or* one writer at a time. Write-Ahead Logging (WAL) allows many readers to operate concurrently with one writer.

**Incorrect (default rollback journal):**

```sql
-- Default mode (DELETE)
PRAGMA journal_mode; -- Returns 'delete'

-- Readers block writers, writers block readers
-- High contention, low throughput
```

**Correct (WAL mode):**

```sql
-- Enable WAL mode (Persistent setting)
PRAGMA journal_mode = WAL;

-- Readers do not block writers
-- Writers do not block readers
-- Significantly higher concurrency
```

**Note:** This is a persistent setting. Once set, it stays enabled for the database file.

Reference: [Write-Ahead Logging](https://www.sqlite.org/wal.html)
