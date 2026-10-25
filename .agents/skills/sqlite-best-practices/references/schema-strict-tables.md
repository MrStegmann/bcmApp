---
title: Use STRICT Tables
impact: HIGH
impactDescription: Enforces data types, prevents type confusion bugs
tags: schema, strict, types, integrity
---

## Use STRICT Tables

By default, SQLite uses "flexible typing" (any data in any column). `STRICT` tables enforce data types at the column level, behaving like traditional SQL databases.

**Incorrect (flexible typing):**

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  age INTEGER
);

-- SQLite happily accepts text in an integer column
INSERT INTO users (age) VALUES ('twenty'); -- Succeeds!
```

**Correct (strict typing):**

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  age INTEGER
) STRICT;

INSERT INTO users (age) VALUES ('twenty');
-- Error: cannot store TEXT value in INTEGER column users.age
```

**Supported Types in STRICT:** `INT`, `INTEGER`, `REAL`, `TEXT`, `BLOB`, `ANY`.

Reference: [STRICT Tables](https://www.sqlite.org/stricttables.html)
