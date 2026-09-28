module.exports = {
  openDatabaseSync: () => ({
    execSync: () => {},
    runSync: () => ({ lastInsertRowId: 1, changes: 1 }),
    getFirstSync: () => null,
    getAllSync: () => [],
  }),
};
