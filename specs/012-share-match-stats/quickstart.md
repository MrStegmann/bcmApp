# Quickstart & Validation Guide: Match Stats Graphic Export & Sharing

**Feature Branch**: `012-share-match-stats`
**Date**: 2026-10-23
**Feature Spec**: [spec.md](./spec.md) | **Data Model**: [data-model.md](./data-model.md) | **Contracts**: [contracts/share-service-contract.ts](./contracts/share-service-contract.ts)

## Prerequisites

- Node.js v18+ and npm installed.
- Expo development environment set up (`npm start` running).
- Development packages:
  - `react-native-view-shot`
  - `expo-sharing`
  - `expo-media-library`

---

## Automated Verification Suite

Run the full automated test suite verifying unit tests, calculation edge cases, modal interactions, and service mocks:

```bash
# Run all match-detail and sharing test suites
npm test -- src/features/match-detail/
```

Expected output:
- 100% of tests passing.
- 0 failing assertions, 0 unhandled promise rejections.

---

## End-to-End Validation Scenarios

### Scenario 1: Generate & Preview Box Score Graphic

1. **Setup**: Seed the local database with sample matches if not already seeded:
   ```bash
   npx ts-node scripts/seed-db.ts
   ```
2. **Step 1**: Launch the app on mobile or simulator (`npm start`).
3. **Step 2**: Open a finished match from the Matches list (e.g. against "Real Betis Baloncesto" or "CB Unicaja").
4. **Step 3**: Locate the "Compartir Estadísticas" action button with the share icon in the match summary header card.
5. **Expected Outcome**:
   - Tapping the button opens `MatchShareModal`.
   - The graphic displays:
     - Header bar with team name, rival name, round, and formatted date (`DD/MM/AAAA`).
     - Player table with 24 columns for each called-up player, ordered deterministically.
     - Bottom `EQUIPO` summary row with totals and collective shooting percentages.
     - Lower-left box with the 8 advanced metrics (`Posesiones`, `OER`, `DER*`, `eFG%`, `ORB%*`, `AST%`, `TOV%`, `TLR%`).
     - Lower-right box with `Parciales` table (`C1`, `C2`, `C3`, `C4`, `Final`).
   - All text is sharp, aligned in cells, with zero horizontal or vertical clipping.

---

### Scenario 2: Native Sharing & WhatsApp

1. **Step 1**: In the open `MatchShareModal`, tap the primary **"Compartir / WhatsApp"** button.
2. **Step 2**: The app triggers `captureRef`, generating a temporary PNG file.
3. **Expected Outcome**:
   - The OS native share sheet appears.
   - On physical devices with WhatsApp installed, WhatsApp appears in the share options.
   - Selecting WhatsApp opens the contact selector with the generated PNG image pre-attached.

---

### Scenario 3: Save to Device Gallery

1. **Step 1**: In `MatchShareModal`, tap the secondary **"Guardar en Galería"** button.
2. **Step 2**: If prompted for permission, tap "Allow / Permitir".
3. **Expected Outcome**:
   - A success confirmation toast or alert displays: "Imagen guardada en la galería".
   - Open the device Photos/Gallery app: the full match box score PNG graphic is saved with high resolution (1280px width) and readable text.

---

### Scenario 4: Permission Denied Handling

1. **Step 1**: In `MatchShareModal`, tap "Guardar en Galería".
2. **Step 2**: When prompted for permission, tap "Don't Allow / Denegar".
3. **Expected Outcome**:
   - The application displays a user-friendly alert explaining that photo permissions are required to save directly to the gallery, and offers to open the system share sheet as a fallback.
   - The app does not crash or freeze.

---

### Scenario 5: Zero Attempts & Edge Case Statistics

1. **Step 1**: Open a match where a player has 0 minutes or 0/0 shooting attempts.
2. **Step 2**: Open `MatchShareModal`.
3. **Expected Outcome**:
   - Percentage columns (`T2%`, `T3%`, `T1%`) display `0%` or `-`.
   - No `NaN` or unhandled division errors appear anywhere on the sheet.
