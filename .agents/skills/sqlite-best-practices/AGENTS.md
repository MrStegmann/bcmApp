# sqlite-best-practices

> **Note:** `CLAUDE.md` is a symlink to this file.

## Overview

SQLite performance optimization and best practices. Use this skill when writing, reviewing, or optimizing SQLite queries, schema designs, or database configurations.

## Structure

```
sqlite-best-practices/
  SKILL.md       # Main skill file - read this first
  AGENTS.md      # This navigation guide
  references/    # Detailed reference files
```

## Usage

1. Read `SKILL.md` for the main skill instructions
2. Browse `references/` for detailed documentation on specific topics
3. Reference files are loaded on-demand - read only what you need

## Reference Categories

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Configuration & Pragmas | CRITICAL | `config-` |
| 2 | Query Performance | CRITICAL | `query-` |
| 3 | Operations & Distributed | HIGH | `ops-` |
| 4 | Schema Design | HIGH | `schema-` |
| 5 | Data Access Patterns | MEDIUM | `data-` |
| 6 | JSON & Advanced | LOW | `json-` / `fts-` / `advanced-` |

## Available References

**Configuration & Pragmas** (`config-`):
- `references/config-wal-mode.md` (Write-Ahead Logging)
- `references/config-busy-timeout.md` (Handling Locks)
- `references/config-foreign-keys.md` (Enforcing Integrity)
- `references/config-optimize.md` (Query Planner Stats)

**Query Performance** (`query-`):
- `references/query-indexes.md` (Basic Indexing)
- `references/query-covering-indexes.md` (Index-Only Scans)
- `references/query-partial-indexes.md` (Filtered Indexes)
- `references/query-without-rowid.md` (Clustered Index Optimization)

**Operations & Distributed** (`ops-`):
- `references/ops-continuous-wal.md` (Streaming Backups/DR)
- `references/ops-read-replicas.md` (Local Edge Replication)

**Schema Design** (`schema-`):
- `references/schema-strict-tables.md` (Type Safety)
- `references/schema-data-types.md` (Storage Classes)
- `references/schema-generated-columns.md` (Virtual/Stored Columns)

**Data Access Patterns** (`data-`):
- `references/data-transactions.md` (Immediate vs Deferred)
- `references/data-upsert.md` (Atomic Insert/Update)
- `references/data-returning.md` (Return modified data)

**JSON & Advanced** (`json-` / `fts-` / `advanced-`):
- `references/json-jsonb.md` (Binary JSON)
- `references/json-indexing.md` (Indexing JSON fields)
- `references/fts-usage.md` (Full Text Search)
- `references/advanced-vector-search.md` (Vector/AI Search)