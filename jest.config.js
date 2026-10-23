module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/mocks/"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
    "^expo-sqlite$": "<rootDir>/src/__tests__/mocks/expo-sqlite.js",
    "^react-native-safe-area-context$": "<rootDir>/src/__tests__/mocks/react-native-safe-area-context.js",
    "^react-native-view-shot$": "<rootDir>/src/__tests__/mocks/react-native-view-shot.js",
    "^expo-sharing$": "<rootDir>/src/__tests__/mocks/expo-sharing.js",
    "^expo-media-library$": "<rootDir>/src/__tests__/mocks/expo-media-library.js",
    "^expo-file-system/legacy$": "<rootDir>/src/__tests__/mocks/expo-file-system.js",
    "^expo-file-system$": "<rootDir>/src/__tests__/mocks/expo-file-system.js",
    "^expo-modules-core$": "<rootDir>/src/__tests__/mocks/expo-modules-core.js",
  },
};

