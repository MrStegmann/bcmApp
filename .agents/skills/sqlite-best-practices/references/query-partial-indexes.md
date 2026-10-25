---
title: Use Partial Indexes for Subsets
impact: MEDIUM
impactDescription: Smaller indexes, faster writes, optimized subset queries
tags: indexes, partial-index, storage
---

## Use Partial Indexes for Subsets

Partial indexes cover only a subset of rows (defined by a `WHERE` clause). They are smaller and faster than full indexes.

**Incorrect (indexing everything):**

```sql
-- Index on all orders, even completed ones (which we rarely query)
CREATE INDEX idx_orders_status ON orders(status);
```

**Correct (indexing active subset):**

```sql
-- We mostly query 'pending' orders
CREATE INDEX idx_orders_pending ON orders(created_at) WHERE status = 'pending';

-- This query uses the small, fast partial index
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;
```

**Use Case:** Soft deletes (`WHERE deleted_at IS NULL`), status flags, or rare types (`WHERE is_vip = 1`).

Reference: [Partial Indexes](https://www.sqlite.org/partialindex.html)
