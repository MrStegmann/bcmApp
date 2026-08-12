---
title: Use RETURNING to Avoid Extra Selects
impact: MEDIUM
impactDescription: Reduces round-trips when generating IDs or defaults
tags: insert, update, delete, performance
---

## Use RETURNING to Avoid Extra Selects

When inserting or updating data that generates values (like auto-increment IDs or default timestamps), use the `RETURNING` clause to get the new data back immediately.

**Incorrect (Insert then Select):**

```sql
INSERT INTO users (name) VALUES ('Alice');
-- Now we need the ID...
SELECT * FROM users WHERE rowid = last_insert_rowid();
```

**Correct (Single Statement):**

```sql
INSERT INTO users (name) VALUES ('Alice')
RETURNING id, created_at;
-- Returns the generated ID and timestamp in the same response
```

**Note:** Works for `INSERT`, `UPDATE`, and `DELETE`. Useful for "pop-and-return" queue patterns with `DELETE ... RETURNING`.

Reference: [RETURNING Clause](https://www.sqlite.org/lang_returning.html)
