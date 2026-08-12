---
title: Enable Foreign Key Constraints
impact: HIGH
impactDescription: Ensures data integrity and referential consistency
tags: pragma, foreign-keys, integrity
---

## Enable Foreign Key Constraints

By default, SQLite parses foreign key definitions but *does not enforce* them. You must explicitly enable enforcement.

**Incorrect (constraints ignored):**

```sql
-- Default is OFF (0) for historical compatibility
PRAGMA foreign_keys; -- 0

-- You can insert a child row with a non-existent parent_id
INSERT INTO child (parent_id) VALUES (999); -- Succeeds even if parent 999 doesn't exist!
```

**Correct (constraints enforced):**

```sql
-- Enable enforcement (Connection setting)
PRAGMA foreign_keys = ON;

-- Now invalid inserts are blocked
INSERT INTO child (parent_id) VALUES (999);
-- Error: FOREIGN KEY constraint failed
```

**Note:** This is a *connection* setting (unless using specific compile-time options). Set it on every connection.

Reference: [Foreign Keys](https://www.sqlite.org/foreignkeys.html)
