# Quickstart: Validating CourtVision Kinetic Design Application

This validation guide walks through verifying that the CourtVision Kinetic design system (`DESIGN.md`) is correctly configured and applied across the entire BasketApp (`bcmApp`) UI without functional regressions.

---

## 1. Prerequisites

- Node.js (v18+)
- Repository dependencies installed (`npm install`)
- Working Expo CLI (`npx expo`) or Android/iOS emulator/device

---

## 2. Automated Test Suite Validation

The first and most critical check is confirming that 100% of existing unit and component tests continue to pass after styling updates (Zero Functional Regressions).

```powershell
# Run the complete test suite
npm test
```

**Expected Outcome**:
- 87+ test suites pass (`PASS`).
- 503+ tests pass with zero failures.
- Zero assertion regressions in hooks, database queries, and component interactions.

---

## 3. Design Token Compilation Verification

Verify that NativeWind v4 compiles Tailwind design tokens without syntax errors:

```powershell
# Start Expo development server with cache cleared
npx expo start -c
```

**Expected Outcome**:
- Metro bundler starts cleanly with CSS interop and Tailwind presets loaded.
- Zero warning or error logs regarding unknown Tailwind utility classes.

---

## 4. End-to-End Visual Scenarios

### Scenario 1: Root Shell & Navigation
1. Launch the app on an emulator or device.
2. **Verify Root Background**: The app displays deep athletic slate canvas (`#0B1326`).
3. **Verify Header**: The header renders with a dark slate background, crisp `#334155` bottom border, and high-contrast white title.
4. **Verify Bottom Nav**: Active navigation icon highlights in court orange (`#F97316`), and inactive items appear in muted slate/outline tone (`#A78B7D`).

### Scenario 2: Club & Team Management
1. Navigate to **Club** (`ClubManage` / `ClubProfile`).
2. **Verify Containers**: Club cards appear in Level 1 elevated slate (`#1E293B`) framed by `#334155` borders.
3. **Verify Actions**: Primary save/edit buttons display vibrant court orange (`#F97316`) with `rounded-lg` corner curvature and minimum 48px height.

### Scenario 3: Player Roster & Stats Modal
1. Navigate to **Plantilla** (`PlayerList`).
2. **Verify Jersey Tags**: Compact jersey numbers render in `#334155` with bold white font (`#F8FAFC`).
3. Tap on a player card to open `PlayerStatsModal`.
4. **Verify Modal**: The dialog presents on `#171F33` with elevated borders, high-contrast stat numbers, and 48x48px quick-scoring action buttons.

### Scenario 4: Match History & Scoreboards
1. Navigate to **Partidos** (`GameList` / `GamesResults`).
2. **Verify Score Display**: Scores render with bold high-contrast numerals (`stat-display`).
3. **Verify Badges**: Win indicators display court green (`#10B981`) and loss indicators display subtle dark slate or muted outline tones.

### Scenario 5: Live Match Sideline Tracking
1. Navigate to or launch a live match (`PlayMatch`).
2. **Verify Starting Five & Subs**: `StartingFiveModal` and `SubstitutionPanel` present accessible, touch-friendly 48px player substitution slots.
3. **Verify Half Court**: Basketball court boundary and arc markings render in clean structural borders (`#334155`) with high-visibility shot markers.
4. Record scoring events and verify that tap feedback is responsive and all scores update as expected.
