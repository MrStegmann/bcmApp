---
title: Run PRAGMA optimize Periodically
impact: HIGH
impactDescription: Updates query planner statistics for better indexes choices
tags: pragma, maintenance, performance, query-planner
---

## Run PRAGMA optimize Periodically

SQLite does not have a background process to update table statistics (`sqlite_stat1`). Without up-to-date statistics, the query planner may make poor index choices. `PRAGMA optimize` is a lightweight check that runs `ANALYZE` only when necessary.

**Incorrect (Never updating stats):**

```sql
-- Statistics become stale as data grows
-- Query planner might scan a large table instead of using an index
-- because it thinks the table is still small.
```

**Correct (Running optimize):**

```sql
-- Run this typically just before closing the database connection
-- or periodically (e.g., every few hours) in a long-running process.
PRAGMA optimize;
```

**Note:** Unlike `ANALYZE` (which scans everything and is slow), `PRAGMA optimize` is fast and usually a no-op. It limits its analysis to tables that have changed significantly.

Reference: [PRAGMA optimize](https://www.sqlite.org/pragma.html#pragma_optimize)
