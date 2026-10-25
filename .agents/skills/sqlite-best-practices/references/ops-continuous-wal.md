---
title: Implement Continuous WAL Archiving
impact: CRITICAL
impactDescription: Near-zero data loss (RPO), continuous backup off-site
tags: backup, disaster-recovery, ops, wal
---

## Implement Continuous WAL Archiving

Standard cron-based backups (snapshotting) leave a window of potential data loss between backup intervals. Streaming the Write-Ahead Log (WAL) to durable storage allows for point-in-time recovery and significantly reduces the Recovery Point Objective (RPO).

**Incorrect (Periodic snapshots):**

```bash
# Cron job running every hour
0 * * * * sqlite3 production.db ".backup backup.db"
# If the server fails at minute 59, you lose 59 minutes of data.
```

**Correct (Continuous WAL Streaming):**

*Concept:* Use a background process or sidecar to monitor the SQLite WAL file. As pages are written to the WAL, immediately ship them to object storage (like S3) or a separate backup volume.

```text
[SQLite] writes -> [WAL File] -> [Streaming Tool] -> [Object Storage]
```

**Benefits:**
1.  **RPO ~1 second:** Data is backed up almost instantly.
2.  **Point-in-Time Recovery:** Restore the database to any specific transaction timestamp.
3.  **Low Overhead:** Reads from the WAL are generally lightweight compared to full database locks.

**Note:** This requires specialized tooling (external to SQLite) that can parse and ship WAL frames.

Reference: [SQLite WAL Documentation](https://www.sqlite.org/wal.html)