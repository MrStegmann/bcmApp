---
title: Choose Appropriate Storage Classes
impact: HIGH
impactDescription: Efficient storage and accurate data representation
tags: schema, data-types, storage
---

## Choose Appropriate Storage Classes

SQLite has 5 storage classes: NULL, INTEGER, REAL, TEXT, BLOB. Boolean and Date/Time are not native types.

**Incorrect (misusing types):**

```sql
CREATE TABLE events (
  is_active VARCHAR(5),  -- String "true"/"false" is inefficient
  created_at TIMESTAMP   -- TIMESTAMP is not a native type (falls back to numeric/text)
);
```

**Correct (using native affinities):**

```sql
CREATE TABLE events (
  -- Store Booleans as INTEGER (0 or 1)
  is_active INTEGER CHECK (is_active IN (0, 1)),
  
  -- Store Dates as INTEGER (Unix Epoch) or TEXT (ISO8601)
  created_at INTEGER, -- Seconds/Milliseconds since epoch
  
  -- Use REAL for floating point, INTEGER for money (cents)
  price_cents INTEGER
) STRICT;
```

**Note:** For dates, stick to one format (e.g., ISO8601 strings or Unix timestamps) consistently across the app.

Reference: [Datatypes in SQLite](https://www.sqlite.org/datatype3.html)
