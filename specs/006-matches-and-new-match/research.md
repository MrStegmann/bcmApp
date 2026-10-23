# Technical Research: Matches & New Match Workflow (Date-Only Mask & Roster Enforcement)

## Decision 1: Date-Only Format and Removal of Time Component

- **Decision**: Transition the match date input from `"dd/mm/aaaa - hh:mm"` to a date-only string `"dd/mm/aaaa"` across the UI, validation layer, and creation payloads.
- **Rationale**:
  - Match scheduling in the app focuses on the match calendar fixture date and round; coaches and scorers do not require time-of-day precision.
  - Eliminating time picker or hour/minute strings prevents timezone discrepancies, simplifies data entry on mobile keyboards, and drastically reduces creation time (under 5 seconds for date entry).
- **Alternatives considered**:
  - Native DateTimePicker with date mode: Rejected because native iOS/Android date pickers require modals or platform-specific dialogs that disrupt quick inline number typing and don't provide continuous numeric entry.
  - ISO date strings (`YYYY-MM-DD`): Rejected because user specification explicitly requires the European standard display and entry pattern `dd/mm/aaaa`.

---

## Decision 2: Numeric Restriction & Automatic Formatting Mask in React Native

- **Decision**: 
  1. Set `keyboardType="number-pad"` (or `"numeric"`) on the date `TextInput` to open a numeric keypad on mobile devices.
  2. Implement an input sanitization and auto-masking handler in `Input.tsx` (when `type="date"`) and/or `GameForm.tsx`:
     - Strip all non-digit characters (`text.replace(/\D/g, "")`).
     - Limit input to at most 8 numeric digits.
     - Automatically insert slashes:
       - 1-2 digits: `dd`
       - 3-4 digits: `dd/mm`
       - 5-8 digits: `dd/mm/aaaa`
     - Provide a smooth editing experience where typing `23102026` formats immediately to `23/10/2026`.
     - Support natural backspace deletion without getting trapped behind slashes.
- **Rationale**:
  - Completely prevents invalid characters (letters, punctuation, special symbols) from ever appearing in the field.
  - Eliminates the need for users to type delimiters (`/`), preventing syntax errors and providing immediate visual feedback.
- **Alternatives considered**:
  - External masking libraries (e.g., `react-native-mask-input`, `react-native-masked-text`): Rejected to avoid unnecessary third-party dependencies. A lightweight 10-line pure regex/string transformation function in TypeScript is zero-dependency, zero-overhead, and 100% testable in Jest.

---

## Decision 3: Calendar & Leap Year Validation Pattern

- **Decision**: Update `src/utils/dateValidation.ts` with dedicated validation functions for `dd/mm/aaaa`:
  - `parseMatchDate(value: string): Date | null`
  - `isValidMatchDate(value: string): boolean`
  - `validateMatchDate(value: string): DateValidationResult`
  - Validation steps:
    1. Check regex pattern: `/^(\d{2})\/(\d{2})\/(\d{4})$/` (exactly 8 digits formatted with 2 slashes).
    2. Extract numeric day, month, year.
    3. Verify month range: `1 <= month <= 12`.
    4. Compute max days in month using `new Date(year, month, 0).getDate()`:
       - Handles 30 vs 31 days (e.g. April 31 is invalid).
       - Handles February in leap years: `29/02/2024` is valid, `29/02/2025` is invalid.
    5. Return localized error messages:
       - Empty field: `"Debe introducir la fecha del partido"`
       - Incomplete/invalid format: `"Formato de fecha inválido. Utilice dd/mm/aaaa"`
- **Rationale**: Ensures that invalid calendar dates (such as `31/02/2026`) are rejected at the form level before hitting storage, while providing immediate helpful feedback.
- **Alternatives considered**:
  - Using `date-fns` or `dayjs`: Rejected because standard JavaScript `Date` constructor and basic arithmetic handle leap years and month lengths reliably without external library weight.

---

## Decision 4: Backward Compatibility & Match Sorting

- **Decision**:
  - In `src/utils/dateValidation.ts`:
    - Keep `parseMatchTimestamp(value: string)` capable of parsing legacy `"dd/mm/aaaa - hh:mm"` timestamps while also supporting new `"dd/mm/aaaa"` date-only strings.
    - If a string matches `"dd/mm/aaaa"`, parse it as midnight local time (`new Date(year, month - 1, day, 0, 0)`).
  - In `src/features/home-view/utils/matchDateHelper.ts`:
    - `parseMatchDate(dateStr)` will cleanly resolve epoch timestamps from both date-only (`"dd/mm/aaaa"`) and legacy timestamp strings (`"dd/mm/aaaa - hh:mm"`).
    - Preserves existing sorting behavior (pending matches sorted earliest first, finished matches sorted most recent first).
  - In `src/db/schema.ts`:
    - The SQLite column `date` is `text("date")`, which natively accepts `"dd/mm/aaaa"`. No SQLite schema migration or alteration is needed.
- **Rationale**: Existing mock data and previously recorded games continue to display and sort correctly without requiring complex database migrations.

---

## Decision 5: Form State & Payloads in `GameForm.tsx`

- **Decision**:
  - Change input label from `"Fecha y Hora"` to `"Fecha"`.
  - Change placeholder from `"dd/mm/aaaa - hh:mm"` to `"dd/mm/aaaa"`.
  - Pass `type="date"` and `keyboardType="numeric"` (or `"number-pad"`).
  - Validation error message uses `validateMatchDate`.
  - Form submission payload emits:
    ```ts
    {
      round: round.trim(),
      date: date.trim(), // "dd/mm/aaaa"
      timeStamp: date.trim(), // for backwards compatibility with any consumers expecting timeStamp
      rivalTeamName: rivalTeamName.trim(),
      opponent: rivalTeamName.trim(),
      teamId: club?.id || 1,
    }
    ```
- **Rationale**: Keeps form clean, removes all time-of-day references, satisfies acceptance criteria, and maintains full compatibility with `GameList.tsx` and `GameCards.tsx`.

---

## Decision 6: Roster Modal Flow and Match State Lifecycle (Preserved)

- **Decision**: Retain the existing, proven implementation:
  1. *Creation flow (Optional)*: `RosterSelectionModal` displayed with a skip option after valid form submission.
  2. *Start match flow (Mandatory / Blocking)*: Tapping a pending match with zero roster players opens `RosterSelectionModal` in mandatory mode (no skip button, confirmation disabled until >= 1 player selected).
  3. *Match Lifecycle*: `pending` -> `inProgress` (triggered when starting chronograph in `PlayMatch.tsx`) -> `finished` (triggered on "Save & Finish").
- **Rationale**: Fulfills US1, US2, and US3 while isolating the date changes to form input, masking, and validation.
