---
title: Use Generated Columns for Derived Data
impact: MEDIUM
impactDescription: consistent data, indexable expressions
tags: schema, generated-columns, virtual, stored
---

## Use Generated Columns for Derived Data

Instead of calculating values in your application (like `full_name` from `first` + `last`) or storing redundant data, use Generated Columns.

**Incorrect (Redundant storage or Application logic):**

```sql
CREATE TABLE items (
  price INTEGER,
  quantity INTEGER,
  total INTEGER -- Must be manually updated. Risk of getting out of sync.
);
```

**Correct (Generated Column):**

```sql
CREATE TABLE items (
  price INTEGER,
  quantity INTEGER,
  -- Always correct, calculated on read (VIRTUAL) or write (STORED)
  total INTEGER GENERATED ALWAYS AS (price * quantity) VIRTUAL
);
```

*   **VIRTUAL:** Calculated on the fly (saves space).
*   **STORED:** Calculated on write (saves CPU on read).

Reference: [Generated Columns](https://www.sqlite.org/gencol.html)
