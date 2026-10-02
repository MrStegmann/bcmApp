let idCounter = 1;

const createMockStatement = () => ({
  executeSync: (params) => ({
    changes: 1,
    lastInsertRowId: idCounter++,
    getFirstSync: () => ({ id: idCounter, name: "Team Mock", category: "Category Mock" }),
    getAllSync: () => [{ id: idCounter, name: "Team Mock", category: "Category Mock" }],
  }),
  executeForRawResultSync: (params) => ({
    getAllSync: () => [[idCounter++, "Team Mock", "Category Mock"]],
  }),
  finalizeSync: () => {},
});

module.exports = {
  openDatabaseSync: () => ({
    execSync: () => {},
    runSync: () => ({ lastInsertRowId: idCounter++, changes: 1 }),
    getFirstSync: () => null,
    getAllSync: () => [],
    prepareSync: () => createMockStatement(),
  }),
};
