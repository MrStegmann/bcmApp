module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/src/__tests__/mocks/"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "^expo-sqlite$": "<rootDir>/src/__tests__/mocks/expo-sqlite.js",
  },
};
