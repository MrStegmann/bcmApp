---
title: Use Vector Search Extensions
impact: MEDIUM
impactDescription: Enable AI/Similarity search within SQLite
tags: vector, ai, embeddings, extensions
---

## Use Vector Search Extensions

Standard SQLite does not support vector math (cosine distance, dot product) required for AI/Embeddings search. To implement this without external vector databases, use SQLite extensions or forks that support vector data types.

**Incorrect (Storing vectors as text/blob without search):**

```sql
-- Storing embeddings as blobs is possible, but you cannot search them efficiently
CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  embedding BLOB -- Just a binary blob, no indexing
);
-- Querying requires fetching ALL rows and calculating distance in application code.
-- Very slow (O(n)) and memory intensive.
```

**Correct (Using Vector Extensions):**

*Concept:* Load a vector search extension (e.g., `sqlite-vss` or similar) to enable vector indexing (HNSW or similar) and distance functions.

```sql
-- Virtual table provided by extension
CREATE VIRTUAL TABLE vss_items USING vss0(
  embedding(1536) -- Define dimension
);

-- Efficient approximate nearest neighbor search
SELECT rowid, distance
FROM vss_items
WHERE vss_search(embedding, ?)
LIMIT 10;
```

**Benefits:**
1.  **Simplified Stack:** No need to manage a separate vector database (Pinecone, Milvus, etc.).
2.  **ACID compliance:** Vector data lives alongside relational data.
3.  **Joins:** You can join vector search results directly with other SQL tables in a single query.

Reference: [Loadable Extensions](https://www.sqlite.org/loadext.html)