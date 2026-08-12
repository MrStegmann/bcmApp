---
title: Use Covering Indexes to Skip Table Lookups
impact: HIGH
impactDescription: 2x faster queries by avoiding rowid lookups
tags: indexes, covering-index, performance
---

## Use Covering Indexes to Skip Table Lookups

A "Covering Index" contains *all* columns required by a query. SQLite can answer the query directly from the index B-Tree without looking up the main table row.

**Incorrect (Index + Table Lookup):**

```sql
CREATE INDEX idx_users_name ON users(last_name);

-- Index helps find the row, but we must fetch 'first_name' from the table
SELECT first_name FROM users WHERE last_name = 'Smith';
```

**Correct (Covering Index):**

```sql
-- Include the selected column in the index
CREATE INDEX idx_users_name_full ON users(last_name, first_name);

-- SQLite reads 'first_name' directly from the index leaf node
SELECT first_name FROM users WHERE last_name = 'Smith';
```

**Note:** Use sparingly. Don't make massive indexes just to cover `SELECT *`.

Reference: [Covering Indices](https://www.sqlite.org/queryplanner.html#covering_indices)
