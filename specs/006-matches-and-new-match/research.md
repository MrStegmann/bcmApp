# Technical Research: Matches & New Match Workflow

## Decision 1: Match Schema & State Machine Representation

- **Decision**: Update the `games` table schema with explicit fields: `status` (`'pending' | 'inProgress' | 'finished'`), `round` (text to support alphanumeric rounds like "Jornada 1", "Round 3"), `rivalTeamName` (aliased with/replacing `opponent`), `timeStamp` (formatted string `dd/mm/aaaa - hh:mm`), and `createdAt` (ISO timestamp for recency sorting).
- **Rationale**: 
  - Standardizing status as `'pending' | 'inProgress' | 'finished'` matches the exact state machine defined in the specification.
  - Alphanumeric `round` strings provide flexibility for tournament play (e.g., "Cuartos", "Final", "Jornada 12").
  - `createdAt` ensures accurate recency sorting when timestamp dates match or for newly scheduled fixtures.
- **Alternatives considered**:
  - Derived status computed from scores or clock: Rejected because a match can have zero scores while in progress, and explicit status guarantees predictable transitions and queryability.

## Decision 2: Roster Modal Flow and Enforcement Architecture

- **Decision**: Create a reusable `RosterSelectionModal` component used in two contexts:
  1. *Creation flow (Optional)*: Allows selecting players from the current team squad or skipping with a "Skip" / "Omitir" button.
  2. *Start match flow (Mandatory / Blocking)*: Triggers when tapping a pending match with zero declared roster players; disables confirmation until at least one player is selected and omits any skip button.
- **Rationale**:
  - Reusing the roster selection component ensures UI/UX consistency (player list cards, selection toggle, squad limit checks).
  - Clean separation of modal modes (`optional` vs `mandatory`) fulfills both User Story 1 and User Story 2.
- **Alternatives considered**:
  - Forcing roster selection inside the create form itself: Rejected because the user requirements explicitly demand an optional modal step that can be skipped on creation and enforced on match start.

## Decision 3: Chronograph & State Transition in `PlayMatch.tsx`

- **Decision**: Create `src/page/PlayMatch.tsx` featuring a dedicated chronograph/game clock with Start/Pause controls, quarter/period tracker, score counters, and a "Save & Finish" action.
  - Starting the chronograph triggers state transition: `pending` -> `inProgress` (persisted to SQLite via `useGameStore`).
  - Tapping "Save & Finish" prompts a confirmation and updates state to `finished`.
- **Rationale**:
  - Isolating the active match gameplay experience into `PlayMatch.tsx` keeps `GameList.tsx` clean and modular.
  - Real-time stopwatch/chronograph logic integrated with state persistence prevents accidental loss of game progress.
- **Alternatives considered**:
  - Reusing `GameDetail.tsx` directly: Rejected because `GameDetail.tsx` is an edit/stats inspection table without live chronograph timing controls or strict state lifecycle transitions. `PlayMatch.tsx` provides a dedicated live match scoring interface.

## Decision 4: Date & Time Validation Pattern

- **Decision**: Implement strict regex and date semantic validation for `dd/mm/aaaa - hh:mm` format:
  - Regex: `^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2})$`
  - Validates day (1-31), month (1-12), year (>2000), hour (0-23), minute (0-59).
- **Rationale**: Guarantees data integrity before database insertion and provides instant feedback if format or values are invalid.
