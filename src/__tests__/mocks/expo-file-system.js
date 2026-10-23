const copyAsync = jest.fn().mockResolvedValue(undefined);
const moveAsync = jest.fn().mockResolvedValue(undefined);
const deleteAsync = jest.fn().mockResolvedValue(undefined);
const getInfoAsync = jest.fn().mockResolvedValue({ exists: true, isDirectory: false });

module.exports = {
  cacheDirectory: "file:///mock/cache/",
  documentDirectory: "file:///mock/documents/",
  copyAsync,
  moveAsync,
  deleteAsync,
  getInfoAsync,
};
