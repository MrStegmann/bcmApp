const store = new Map();

module.exports = {
  setItemAsync: jest.fn(async (key, value) => {
    store.set(key, String(value));
  }),
  getItemAsync: jest.fn(async (key) => {
    return store.has(key) ? store.get(key) : null;
  }),
  deleteItemAsync: jest.fn(async (key) => {
    store.delete(key);
  }),
  isAvailableAsync: jest.fn(async () => true),
  // Helper for test resets
  __resetMockStore: () => {
    store.clear();
  },
  __getRawStore: () => store,
};

