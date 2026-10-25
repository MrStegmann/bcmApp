---
title: Use IMMEDIATE Transactions for Writes
impact: HIGH
impactDescription: Prevents deadlocks and "database is locked" errors
tags: transactions, locking, concurrency
---

## Use IMMEDIATE Transactions for Writes

By default (`DEFERRED`), a transaction starts as a reader and upgrades to a writer only when a write occurs. This can cause deadlocks if two connections read and then try to write. `IMMEDIATE` acquires the write lock upfront.

**Incorrect (Deferred Transaction):**

```sql
BEGIN; -- Defaults to DEFERRED
SELECT * FROM users WHERE id = 1; -- Shared Lock
-- ... app logic ...
UPDATE users SET age = 20 WHERE id = 1; -- Tries to upgrade to Reserved/Exclusive Lock
-- FAILURE: If another connection also read and wrote, this upgrade fails (Deadlock/Busy)
```

**Correct (Immediate Transaction):**

```sql
BEGIN IMMEDIATE; -- Acquires Reserved Lock immediately
-- If we get here, we are guaranteed to be able to write
SELECT * FROM users WHERE id = 1;
UPDATE users SET age = 20 WHERE id = 1;
COMMIT;
```

**Rule:** If a transaction will *ever* write, start it with `BEGIN IMMEDIATE`.

Reference: [BEGIN TRANSACTION](https://www.sqlite.org/lang_transaction.html)
