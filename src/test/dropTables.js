export async function dropAllTables(db) {
  const results = await db.getAllAsync(
    `SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
    []
  );
  const dropStatements = [];
  for (let i = 0; i < results.length; i++) {
    const tableName = results[i].name;
    dropStatements.push(`DROP TABLE IF EXISTS "${tableName}";`);
  }
  for (const sqlStatment of dropStatements) {
    await db.execAsync(sqlStatment);
  }
}
