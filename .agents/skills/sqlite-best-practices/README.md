# SQLite Best Practices Skill

A comprehensive guide for optimizing SQLite databases, focusing on performance, data integrity, and production-ready configurations.

## Install

```bash
npx skills add erayack/sqlite-best-practices
```
## Overview

This skill provides specific rules and patterns for:
- **Configuration:** Tuning PRAGMAs for concurrency (WAL mode) and safety.
- **Query Performance:** Effective indexing strategies and query planning.
- **Schema Design:** Using `STRICT` tables, correct storage classes, and generated columns.
- **Data Access:** Atomic operations (Upserts) and transaction management.
- **Advanced Features:** JSON/JSONB optimization and Full-Text Search (FTS5).

## Structure

- `SKILL.md`: Main entry point and category overview.
- `AGENTS.md`: Detailed navigation guide for specific rules.
- `references/`: Atomic markdown files for each best practice with "Correct vs. Incorrect" examples.

## Usage

Reference this skill when designing schemas, reviewing SQL code, or troubleshooting performance issues in SQLite environments.
