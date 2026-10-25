---
title: Index Columns for Filtering and Sorting
impact: CRITICAL
impactDescription: 100x+ faster lookups vs full table scans
tags: indexes, performance, b-tree
---

## Index Columns for Filtering and Sorting

Without an index, SQLite must scan every row in the table (O(n)). Indexes allow O(log n) lookups.

**Incorrect (Full Table Scan):**

```sql
-- No index on email
SELECT * FROM users WHERE email = 'user@example.com';
-- Scan users: searches 1,000,000 rows
```

**Correct (Index Lookup):**

```sql
CREATE INDEX idx_users_email ON users(email);

SELECT * FROM users WHERE email = 'user@example.com';
-- Search using index idx_users_email: searches ~3-4 steps
```

**Rules for Composite Indexes:**
1.  **Left-to-Right:** `(a, b)` can be used for `a` or `a AND b`, but not just `b`.
2.  **Stop at Range:** `a = 1 AND b > 5` uses both parts. `a > 1 AND b = 5` only uses `a`.

Reference: [Query Planning](https://www.sqlite.org/optoverview.html)
