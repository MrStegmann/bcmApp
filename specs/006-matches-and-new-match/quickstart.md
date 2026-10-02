# Quickstart & Verification Guide: Matches & New Match Workflow

## Prerequisites & Setup

1. Ensure the SQLite database is initialized with current migrations:
   ```bash
   npm test
   ```
2. Launch the app in Expo development mode:
   ```bash
   npm start
   ```

---

## Verification Scenarios

### Scenario 1: Mandatory Field Validation & Optional Roster Prompt
1. Navigate to **Partidos** (Games tab).
2. Tap **Añadir Partido** / `header-add-game`.
3. Try to submit without filling fields -> Verify error messages appear for `round`, `timeStamp`, and `rivalTeamName`.
4. Enter valid values:
   - Round: `Jornada 5`
   - Timestamp: `15/10/2026 - 19:30`
   - Rival Team: `CB Granollers`
5. Tap **Crear** -> Verify the Roster Selection modal appears with a "Skip" option.
6. Tap **Omitir / Skip** -> Verify user is redirected to the matches list, and the new match appears at the very top with `pending` badge.

---

### Scenario 2: Mandatory Roster Enforcement on Match Start
1. From the matches list, tap the newly created match (with no roster).
2. Verify the **Mandatory Roster Modal** appears, blocking direct entry into the game.
3. Verify the modal has NO skip option and the confirm button is disabled until at least 1 player is checked.
4. Select 5 players from the list and tap **Confirmar Convocatoria**.
5. Verify the app navigates immediately to `PlayMatch.tsx`.

---

### Scenario 3: Chronograph Start & State Transitions
1. In `PlayMatch.tsx`, observe initial match state is `pending`.
2. Tap **Iniciar Cronómetro (Start Chrono)**.
3. Verify the timer begins counting and the match status transitions from `pending` to `inProgress`.
4. Register points/fouls during the game.
5. Tap **Finalizar Partido (Save & Finish)**.
6. Confirm the finish prompt.
7. Verify the match status transitions to `finished` and the user is returned to the updated matches list.
