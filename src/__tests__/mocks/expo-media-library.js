module.exports = {
  requestPermissionsAsync: jest.fn().mockResolvedValue({
    status: "granted",
    granted: true,
    canAskAgain: true,
    expires: "never",
  }),
  getPermissionsAsync: jest.fn().mockResolvedValue({
    status: "granted",
    granted: true,
    canAskAgain: true,
    expires: "never",
  }),
  saveToLibraryAsync: jest.fn().mockResolvedValue(undefined),
  createAssetAsync: jest.fn().mockResolvedValue({ id: "mock-asset-id" }),
};
