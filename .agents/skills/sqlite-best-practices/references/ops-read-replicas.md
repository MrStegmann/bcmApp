---
title: Use Local Read Replicas for Edge Performance
impact: HIGH
impactDescription: Microsecond read latency by moving data close to compute
tags: replication, distributed, edge, performance
---

## Use Local Read Replicas for Edge Performance

In distributed architectures, querying a centralized database adds significant network latency (often 50ms-200ms). For read-heavy applications, maintaining a synchronized local copy of the database allows for "embedded" reads with near-zero latency.

**Incorrect (Centralized Reads):**

```javascript
// Application running on the Edge (e.g., London)
// Database running in US-East
// Every SELECT query incurs network round-trip latency
const user = await db.query("SELECT * FROM users WHERE id = ?", [id]);
```

**Correct (Local Read Replica):**

*Concept:* The application maintains a local SQLite file that is a read-only replica of the primary database. Writes are forwarded to the primary, while reads hit the local file system.

```javascript
// Application reads from local file ("embedded" mode)
// Latency: Microseconds (disk I/O only)
const user = await localDb.query("SELECT * FROM users WHERE id = ?", [id]);

// Writes are sent over the network to the primary
await writeClient.execute("UPDATE users SET last_login = ? ...", [now]);
```

**Mechanism:**
1.  **Primary:** Receives all writes.
2.  **Replication:** Changes are pushed/pulled to edge nodes via WAL shipping or logical replication.
3.  **Replica:** Application reads from the local synchronized copy.

**Best Practice:** Ideal for feature flags, product catalogs, content sites, and user session data where read volume vastly exceeds write volume.

Reference: [SQLite Replication Methods](https://www.sqlite.org/walsupport.html)