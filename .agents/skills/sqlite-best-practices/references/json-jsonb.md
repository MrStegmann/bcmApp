---
title: Use JSONB for Efficient Processing
impact: MEDIUM
impactDescription: Faster reads/writes, reduced parsing overhead
tags: json, jsonb, binary, performance
---

## Use JSONB for Efficient Processing

SQLite supports standard text `JSON` and a binary format `JSONB`. `JSONB` is faster to process because it doesn't need to be parsed from text every time.

**Incorrect (Repeated Text Parsing):**

```sql
-- Stored as text. Every function call parses the string.
SELECT json_extract(data, '$.name') FROM users;
```

**Correct (Binary Format):**

```sql
-- Convert to JSONB when storing
INSERT INTO users (data) VALUES (jsonb('{"name": "Alice", "age": 30}'));

-- Processing is faster (no parsing needed)
SELECT json_extract(data, '$.name') FROM users;
```

**Note:** `JSONB` is an internal binary format. It is slightly larger on disk than minified JSON text but significantly faster to read/modify.

Reference: [JSONB](https://www.sqlite.org/json1.html#jsonb)
