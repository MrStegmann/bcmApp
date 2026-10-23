# Research: Match Stats Graphic Export & Sharing

**Feature Branch**: `012-share-match-stats`
**Date**: 2026-10-23
**Feature Spec**: [spec.md](./spec.md)

## Unknowns & Decisions

### 1. Visual Graphic Rendering & PNG Generation Engine

- **Context**: The application must produce a high-resolution, uncompressed or high-quality PNG box score graphic containing header metadata, player statistics table (24 columns), team totals, advanced efficiency metrics, and period breakdown matching the reference design.
- **Decision**: Use `react-native-view-shot` (`captureRef`) targeting a structured React Native component (`MatchStatsGraphic`).
- **Rationale**:
  - `react-native-view-shot` captures a native view hierarchy with pixel-perfect fidelity, respecting NativeWind styling, custom font weights, borders, and column backgrounds.
  - Can render at fixed high-resolution canvas dimensions (e.g., width 1200px or 1280px with dynamic height based on roster size) to satisfy SC-003 without blurriness.
  - Supports offscreen / hidden rendering via `collapsable={false}` or preview within an export modal before dispatch.
  - Expo SDK 57 compatible.
- **Alternatives Considered**:
  - *Pure SVG via `react-native-svg`*: While installed, React Native SVG lacks a built-in native PNG rasterization pipeline to export directly to a PNG file without third-party webviews or native canvas, and SVG files cannot be attached directly to WhatsApp messages or saved to photo galleries as standard images.
  - *Headless WebView Canvas*: Requires `react-native-webview` (heavyweight dependency) and adds HTML/CSS bridge complexity.

---

### 2. Native File Sharing & WhatsApp Integration

- **Context**: The user must be able to dispatch the generated PNG graphic directly to WhatsApp or any other installed communication channel.
- **Decision**: Use `expo-sharing` (`Sharing.shareAsync`).
- **Rationale**:
  - `Sharing.shareAsync(localUri, { mimeType: 'image/png', dialogTitle: 'Compartir estadísticas', UTI: 'public.png' })` invokes the native operating system share sheet (iOS `UIActivityViewController` and Android `ACTION_SEND` Intent).
  - When WhatsApp is installed on the device, WhatsApp is automatically listed as a primary share target in the system share sheet, and selecting it opens WhatsApp with the image pre-attached.
  - Standard React Native `Share.share` only supports text on Android and cannot reliably send image binary attachments across both platforms.
  - Direct WhatsApp URL schemes (`whatsapp://send?text=...`) only support text and cannot attach local filesystem image paths.
- **Alternatives Considered**:
  - *React Native `Share.share`*: Incomplete Android file URI support; fails to attach PNG files on many Android versions.
  - *Third-party `react-native-share`*: Requires native link configuration, whereas `expo-sharing` is the standard Expo-managed module.

---

### 3. Local Device Gallery / Storage Saving

- **Context**: The user must be able to save the generated PNG directly to their photo library or device storage with clear confirmation and permission handling.
- **Decision**: Use `expo-media-library` (`MediaLibrary.saveToLibraryAsync`) with fallback notification and permission request flow.
- **Rationale**:
  - `MediaLibrary.saveToLibraryAsync(fileUri)` directly saves the PNG file into the user's camera roll / photos gallery on iOS and Android.
  - Includes permission request API (`MediaLibrary.requestPermissionsAsync()`), satisfying Acceptance Scenario 4 (handling granted vs denied states gracefully).
  - If permissions are permanently denied, the app notifies the user and provides the native share sheet ("Save Image") as an immediate fallback.
- **Alternatives Considered**:
  - *`expo-file-system` only*: Files stored in `FileSystem.documentDirectory` or cache are sandboxed and not visible in the user's Photos/Gallery app without MediaLibrary or SAF permissions.

---

### 4. Layout Architecture for the Box Score Graphic

- **Context**: The reference box score graphic has a dense, professional tabular layout:
  - Top header: Home Team (`Equipo`), Rival (`Rival`), Round & Date (`Jornada y Fecha`).
  - Middle: 24 columns for each player + `EQUIPO` summary row.
  - Bottom-left: Advanced efficiency metrics (`Posesiones`, `OER`, `DER*`, `eFG%`, `ORB%*`, `AST%`, `TOV%`, `TLR%`).
  - Bottom-right: Period breakdown (`Parciales`: `C1`, `C2`, `C3`, `C4`, `Extra`, `Final`).
- **Decision**: Build a dedicated component `MatchStatsGraphic` with fixed layout grid widths and high-contrast styling:
  - Canvas width: 1280px (provides crisp text rendering on retina and high-DPI screens).
  - Background: Crisp off-white / dark contrast theme matching the reference sheet.
  - Header cards: Prominent bold titles for teams, date, and round.
  - Table: Header row with dark fill, alternating subtle row shading, vertical column dividers, and distinct highlight shading on key columns (`Pts`, `TReb`, `Val`, and percentage columns).
  - Columns: `Núm.`, `Nombre`, `Min`, `Pts`, `T2A`, `T2I`, `T2%`, `T3A`, `T3I`, `T3%`, `T1A`, `T1I`, `T1%`, `DReb`, `OReb`, `TReb`, `Asis`, `Rec`, `Per`, `TapF`, `TapC`, `Falt`, `FaltR`, `Val`.
  - Untracked stats (`TapF`, `TapC`, `FaltR`): Default to `0` or `-` cleanly.
  - Bottom blocks: 2-column flexbox containing Advanced Stats on the left and `Parciales` table on the right.
- **Rationale**:
  - Guarantees 100% of data fits without horizontal or vertical clipping, regardless of device screen size, because it renders on a virtual fixed-width container before capture.

---

### 5. UI Integration & User Experience in Match Detail View

- **Context**: The user needs an intuitive way to trigger sharing from Match Detail View.
- **Decision**:
  - Place a prominent "Compartir Estadísticas" action button in `MatchSummaryHeader` (or header action bar) for finished matches.
  - Tapping opens `MatchShareModal`:
    - Shows interactive preview of the generated sheet.
    - Displays two primary actions:
      1. **"Compartir / WhatsApp"** (primary icon button) -> triggers `expo-sharing`.
      2. **"Guardar en Galería"** (secondary icon button) -> triggers `expo-media-library`.
    - Shows progress spinner during PNG capture (`captureRef`).
    - Handles toasts/alerts for success and failure.
- **Rationale**:
  - Gives immediate visual verification before dispatching.
  - Satisfies SC-001 (<3s response), FR-001, FR-002, FR-010, FR-011.

---

### 6. Calculation Safety & Division by Zero

- **Context**: Games with zero attempts, zero possessions, or incomplete statistics must not crash or display `NaN`.
- **Decision**: Reuse and extend existing calculation helpers from `src/features/match-detail/utils/calculations.ts`:
  - `t2%` = `t2i > 0 ? ((t2a / t2i) * 100).toFixed(0) + '%' : '0%'`
  - `t3%` = `t3i > 0 ? ((t3a / t3i) * 100).toFixed(0) + '%' : '0%'`
  - `t1%` = `t1i > 0 ? ((t1a / t1i) * 100).toFixed(0) + '%' : '0%'`
  - Advanced stats formulas (`Posesiones`, `OER`, `DER`, `eFG%`, `ORB%`, `AST%`, `TOV%`, `TLR%`) already enforce zero-denominator fallbacks in `calculateAdvancedStats()`.
