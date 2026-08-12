---
title: Use WITHOUT ROWID for Non-Integer Primary Keys
impact: MEDIUM
impactDescription: Reduces storage by 50% and eliminates one B-Tree lookup
tags: schema, without-rowid, performance, primary-key
---

## Use WITHOUT ROWID for Non-Integer Primary Keys

By default, SQLite tables are B-Trees keyed by a hidden `rowid` (integer). If you define a Primary Key (e.g., UUID or Text), SQLite creates *two* B-Trees: one for the Primary Key (mapping to `rowid`) and one for the table data (keyed by `rowid`). `WITHOUT ROWID` creates a single B-Tree keyed by your Primary Key.

**Incorrect (Double B-Tree for UUIDs):**

```sql
CREATE TABLE users (
  uuid TEXT PRIMARY KEY,
  username TEXT
);
-- Lookup by UUID: 
-- 1. Search PK B-Tree -> find rowid
-- 2. Search Table B-Tree via rowid -> find data
```

**Correct (Clustered Index):**

```sql
CREATE TABLE users (
  uuid TEXT PRIMARY KEY,
  username TEXT
) WITHOUT ROWID;
-- Lookup by UUID:
-- 1. Search Table B-Tree via UUID -> find data immediately
```

**Use When:** The Primary Key is *not* an Integer (e.g., UUID, Text, Composite Key) and the row is not massive.

Reference: [WITHOUT ROWID Optimization](https://www.sqlite.org/withoutrowid.html)
