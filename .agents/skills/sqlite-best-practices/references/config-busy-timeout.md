---
title: Set a Busy Timeout
impact: CRITICAL
impactDescription: Prevents "database is locked" errors during contention
tags: pragma, timeout, locking, concurrency
---

## Set a Busy Timeout

By default, if the database is locked, SQLite immediately throws an error. Setting a busy timeout allows the connection to wait (sleep) for a specified time before giving up.

**Incorrect (immediate failure):**

```sql
-- Default is 0
PRAGMA busy_timeout; -- 0

-- If DB is locked by a writer, any other write attempt immediately fails:
-- Error: database is locked
```

**Correct (wait for lock):**

```sql
-- Wait up to 5000 milliseconds (5 seconds)
PRAGMA busy_timeout = 5000;

-- If DB is locked, SQLite will retry until the timeout expires
-- Drastically reduces application-level errors
```

**Note:** This is a *connection* setting, not a persistent database setting. It must be set for every new connection.

Reference: [PRAGMA busy_timeout](https://www.sqlite.org/pragma.html#pragma_busy_timeout)
