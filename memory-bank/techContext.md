# Tech Context

The Basket Club Manager is built using the following technologies:

- **Framework:** React Native with Expo (`expo`, `react-native`) for cross-platform mobile development (iOS/Android).
- **Styling:** Standard React Native `StyleSheet` (Tailwind CSS and NativeWind were explicitly removed; legacy UI components are marked as `@deprecated`).
- **Database:** Local SQLite database utilizing `expo-sqlite` for offline data persistence.
- **State Management:** 
  - Zustand (`zustand`) for lightweight global state management (alerts, menus).
  - Context API for providing database controllers to the component tree.
- **UI Components & Utilities:**
  - `react-native-safe-area-context`: Handling safe area insets.
  - `@react-native-picker/picker`: Native picker components.
  - `react-native-vector-icons`: Iconography.
  - `react-native-keyboard-aware-scroll-view`: Handling keyboard interactions smoothly.
