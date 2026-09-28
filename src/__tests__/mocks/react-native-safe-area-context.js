// Mock for react-native-safe-area-context
// Returns zero insets so components fall back to their minimum padding values.
module.exports = {
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }) => children,
  SafeAreaProvider: ({ children }) => children,
};
