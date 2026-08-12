---
title: Use FTS5 for Search (Not LIKE)
impact: HIGH
impactDescription: Orders of magnitude faster for text search
tags: search, fts5, full-text-search, performance
---

## Use FTS5 for Search (Not LIKE)

The `LIKE` operator with leading wildcards (e.g., `'%term%'`) cannot use standard indexes and requires a full table scan. Use the FTS5 extension (built-in to modern SQLite) for efficient text search.

**Incorrect (Slow LIKE scan):**

```sql
SELECT * FROM articles WHERE content LIKE '%sqlite%';
-- Scans every byte of every article. Slow.
```

**Correct (FTS5 Virtual Table):**

```sql
-- Create a virtual table for search
CREATE VIRTUAL TABLE articles_fts USING fts5(title, content);

-- Populate it (often via triggers from main table)
INSERT INTO articles_fts(title, content) VALUES ('SQLite Guide', 'SQLite is fast...');

-- Fast, indexed search (BM25 ranking support)
SELECT * FROM articles_fts WHERE articles_fts MATCH 'sqlite';
```

**Maintenance:** You usually keep a standard table for data and an FTS table for the search index, using Triggers to keep them in sync.

Reference: [FTS5 Extension](https://www.sqlite.org/fts5.html)
