# Quickstart & Verification Guide: Matches & New Match Workflow (Date-Only Mask & Roster Management)

## Prerequisites & Setup

1. Run the existing test suite to confirm all baseline tests pass:
   ```bash
   npm test
   ```
2. Launch the app in Expo development mode:
   ```bash
   npm start
   ```

---

## Verification Scenarios

### Scenario 1: Date-Only Interface, Numeric Restriction & Auto-Formatting Mask
1. Navigate to **Partidos** (Games tab).
2. Tap **Añadir Partido** (`header-add-game` or top menu).
3. Observe the date field:
   - Label is **Fecha** (no hour/minute references).
   - Placeholder is **`dd/mm/aaaa`**.
4. Test **Numeric-Only Restriction**:
   - Attempt to type letters (e.g., `abc`), punctuation, or spaces.
   - **Expected**: No letters or symbols appear in the input; all non-digits are blocked/stripped.
5. Test **Automatic Formatting Mask**:
   - Type `23102026` continuously.
   - **Expected**: Field automatically formats and displays `23/10/2026` without needing to type slashes.
   - Press backspace: slashes and digits delete cleanly without cursor jumps or stuck characters.

---

### Scenario 2: Validation of Empty, Incomplete, and Invalid Calendar Dates
1. Clear the date field and tap **Añadir Partido / Guardar**.
   - **Expected**: Validation error displays: `"Debe introducir la fecha del partido"`.
2. Type an incomplete date (e.g. `23/10`) and tap submit.
   - **Expected**: Validation error displays: `"Formato de fecha inválido. Utilice dd/mm/aaaa"`.
3. Type an impossible calendar date (e.g. `31/02/2026` or `31/04/2026`).
   - **Expected**: Validation error displays: `"Formato de fecha inválido. Utilice dd/mm/aaaa"`.
4. Type a leap year date (e.g. `29/02/2025` - non-leap year).
   - **Expected**: Validation fails.
5. Type a valid leap year date (e.g. `29/02/2024` or `23/10/2026`).
   - **Expected**: Field is marked valid and error message clears.

---

### Scenario 3: Form Submission, Optional Roster Prompt & List Placement
1. In the Match Creation form, enter valid values:
   - Opponent: `CB Cornellà`
   - Round: `Jornada 4`
   - Date: `23/10/2026`
2. Tap **Añadir Partido**.
3. **Expected**: Roster selection prompt modal appears with a "Skip" / "Omitir" option.
4. Tap **Omitir / Skip**.
5. **Expected**:
   - The user returns to the matches list.
   - The newly created match appears at the **very top** of the list with a `Pendiente` badge.
   - Displayed date shows `23/10/2026` without unwanted timezone shifts or trailing time values.

---

### Scenario 4: Mandatory Roster Enforcement on Match Start
1. From the matches list, tap the newly created match (which has no roster assigned).
2. **Expected**: The **Mandatory Roster Modal** appears, blocking direct entry into the live game.
3. Observe:
   - There is NO skip button.
   - The "Confirmar Convocatoria" button is disabled until at least 1 player is selected.
4. Select 5 players from the team squad.
5. Tap **Confirmar Convocatoria**.
6. **Expected**: The modal dismisses and the app navigates immediately to the live match play view (`PlayMatch`).

---

### Scenario 5: Chronograph Start & Match Lifecycle Transitions
1. In `PlayMatch`, verify initial status badge is `pending`.
2. Tap **Iniciar Cronómetro (Start Chrono)**.
3. **Expected**:
   - Chronograph timer starts counting.
   - Match status immediately updates from `pending` to `inProgress` and persists to SQLite.
4. Record score actions (e.g. 2pt basket, fouls).
5. Tap **Finalizar Partido (Save & Finish)** and confirm the alert.
6. **Expected**:
   - Match status transitions to `finished`.
   - User is returned to the matches list where the match card now displays the `Finalizado` badge.

---

### Scenario 6: Dedicated Roster Selection Button Visibility & Interaction on Upcoming Matches
1. In the Matches list, locate any upcoming match (badge: `Pendiente`).
2. Observe the action buttons on the right side of the card:
   - A dedicated roster button is visible (icon: Feather `users`).
   - The button has an accessible touch target (min 40x40) with active styling.
3. Tap the roster button on the upcoming match.
4. **Expected**:
   - The Roster Selection Modal opens immediately without launching the game.
   - If players were previously assigned to this match, their checkboxes/cards are pre-selected.
   - Modal title indicates roster modification (`Modificar Convocatoria` or `Declarar Convocatoria`).
   - The "Omitir" button is hidden.

---

### Scenario 7: Repeated Roster Modifications, Deselection, and Persistence
1. With the roster modal open for an upcoming match, select 3 new players and deselect 1 existing player.
2. Tap **Confirmar Convocatoria**.
3. **Expected**:
   - The modal closes and changes are saved immediately to SQLite.
4. Tap the roster button on that same match again.
5. **Expected**:
   - The modal re-opens displaying the exact updated roster just saved.
6. Deselect all players so 0 players are selected, then tap **Confirmar Convocatoria**.
7. **Expected**:
   - Saving an empty roster succeeds.
   - Tapping the body of the match card now triggers the mandatory roster modal (Scenario 4) before allowing game entry.

---

### Scenario 8: Disabled / Restricted Roster Button on Live and Finished Matches
1. Locate a match with status `inProgress` (badge: `En Juego`) or `finished` (badge: `Finalizado`).
2. Observe the roster button on the match card:
   - The button is visually dimmed (opacity ~30%, muted color).
   - The button is disabled (`disabled={true}`).
3. Tap the dimmed roster button repeatedly.
4. **Expected**:
   - The button does not respond to taps and no modal opens.
   - Active/archived match rosters remain locked and untouched.
