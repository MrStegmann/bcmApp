---
title: Use UPSERT for Insert-or-Update
impact: MEDIUM
impactDescription: Atomic, single-round-trip operations
tags: insert, update, atomic, upsert
---

## Use UPSERT for Insert-or-Update

Avoid "Check if exists, then Insert or Update" logic in application code. It causes race conditions and requires two round trips. SQLite supports `ON CONFLICT` clauses for atomic Upserts.

**Incorrect (Application logic):**

```javascript
// Race condition! Another process might insert between the select and insert.
const exists = db.get("SELECT * FROM counter WHERE key = 'hits'");
if (exists) {
  db.run("UPDATE counter SET value = value + 1 WHERE key = 'hits'");
} else {
  db.run("INSERT INTO counter (key, value) VALUES ('hits', 1)");
}
```

**Correct (Atomic UPSERT):**

```sql
INSERT INTO counter (key, value) 
VALUES ('hits', 1)
ON CONFLICT(key) 
DO UPDATE SET value = value + 1;
```

**Note:** You must specify the column causing the conflict (e.g., `key`).

Reference: [UPSERT](https://www.sqlite.org/lang_UPSERT.html)
