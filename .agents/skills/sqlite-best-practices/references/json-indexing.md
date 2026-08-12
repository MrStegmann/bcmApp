---
title: Index Specific JSON Paths
impact: HIGH
impactDescription: Enables index lookups inside JSON blobs
tags: json, indexing, performance, generated-columns
---

## Index Specific JSON Paths

You cannot index a raw JSON text column directly. To optimize queries filtering on JSON fields, extract the field into a Generated Column (Virtual) and index that column.

**Incorrect (Scan JSON blob):**

```sql
CREATE TABLE events (body TEXT); -- '{"type": "login", "user": "alice"}'

-- Full table scan, parsing JSON for every row
SELECT * FROM events WHERE json_extract(body, '$.type') = 'login';
```

**Correct (Index Virtual Column):**

```sql
CREATE TABLE events (
  body TEXT,
  -- Extract 'type' virtually (no extra storage)
  event_type TEXT GENERATED ALWAYS AS (json_extract(body, '$.type')) VIRTUAL
);

-- Index the extracted value
CREATE INDEX idx_events_type ON events(event_type);

-- Query uses the index
SELECT * FROM events WHERE event_type = 'login';
```

**Alternative:** Functional Indexes (SQLite 3.9+) allow `CREATE INDEX idx ON events(json_extract(body, '$.type'))`, but generated columns are often cleaner to query.

Reference: [Generated Columns](https://www.sqlite.org/gencol.html)
