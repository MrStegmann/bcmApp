# Quickstart & Verification Guide: Feature 005

**Feature**: Navbar Icons, Go Back Button & Residual Cleanup
**Date**: 2026-09-28
**Branch**: `005-navbar-icons-and-back-button`

## 1. Prerequisites

- Node.js installed (v20+)
- Dependencies installed via `npm install`
- SQLite database configured for local tests

---

## 2. Automated Test Execution

Run the complete test suite to verify all unit tests and TypeScript definitions:

```bash
# 1. Type-check validation (0 errors expected)
npx tsc --noEmit

# 2. Run Jest test suite across all feature stores, components, and DB contracts
npx jest
```

---

## 3. Manual Scenario Verification

### Scenario A: Navbar Visual Cleanliness & Ordering
1. Open the application and select any Club / Team.
2. Verify the bottom navbar:
   - **Order**: Home (`home`), Players (`users`), Matches (`basketball-hoop-outline`), Sessions (`clipboard-notes`), Exit (`door-open`).
   - **Visuals**: Only icons are displayed with no text below them.
3. Tap on the **Players** icon, then tap the **Home** icon on the far left.
4. **Expected**: The app navigates smoothly to the main Team overview screen.

### Scenario B: Straight-Edged Header
1. Inspect the Header on any screen (Main overview, Players list, Games list, Trainings list).
2. **Expected**: The header has straight horizontal bottom edges (no rounded corners) and the top padding properly handles status bar safe area insets.

### Scenario C: Form "Go Back" Navigation
1. Navigate to **Players** list. Tap the "+" (Add) button in the top-right header.
2. Verify the player creation form opens.
3. Observe the top-left of the header: a "Go Back" button (`<`) is displayed.
4. Tap the "Go Back" button in the header.
5. **Expected**: The form cancels and the view smoothly returns to the Players list. The header's left back button disappears and the right "+" button reappears.
6. Repeat for Match and Training creation forms.

### Scenario D: Detail View "Go Back" Navigation
1. From the **Players** list, tap any player card to open `PlayerDetail`.
2. Observe the top-left of the header: a "Go Back" button (`<`) is displayed.
3. Tap the "Go Back" button in the header.
4. **Expected**: The player detail view closes and the view returns to the Players list.
5. Repeat for Match and Training detail views.

### Scenario E: Clean Residuals Verification
1. Search the repository for `Calendar.tsx`, `FeesStore.ts`, or mentions of `fees` in `schema.ts`.
2. **Expected**: 0 residual files or tables. Database cascades and seeding execute flawlessly.
