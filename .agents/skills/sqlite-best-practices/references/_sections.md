# Section Definitions

This file defines the rule categories for SQLite best practices. Rules are automatically assigned to sections based on their filename prefix.

---

## 1. Configuration & Pragmas (config)
**Impact:** CRITICAL
**Description:** Runtime configuration using PRAGMA statements. Critical for concurrency (WAL mode), safety (foreign keys), and performance (memory, timeouts).

## 2. Query Performance (query)
**Impact:** CRITICAL
**Description:** Indexing strategies, query planning, and execution optimization. The most common source of performance issues.

## 3. Operations & Distributed (ops)
**Impact:** HIGH
**Description:** Production patterns for continuous backups and read replication strategies.

## 4. Schema Design (schema)
**Impact:** HIGH
**Description:** Table structure, data types, strict mode, and storage efficiency. Foundation for long-term data integrity and performance.

## 5. Data Access Patterns (data)
**Impact:** MEDIUM
**Description:** Transaction management, concurrency patterns, and efficient data manipulation (Upsert, Returning).

## 6. JSON & Advanced (json / fts / advanced)
**Impact:** LOW
**Description:** Working with JSON/JSONB data types, Full Text Search (FTS5), and Vector Search concepts.
