# Phase 0 Research: Update Player Contract, Form, and Details

## Overview

This research document resolves technical choices, patterns, and architectural decisions for feature `013-update-player-details`.

The feature consists of three core components:
1. Modernizing the player contract and persistence schema: Removing obsolete fields `notes` and `position`, while adding an optional string field `jerseyName` (`jersey_name`).
2. Updating the player creation and edit forms to include `jerseyName` and omit `position`/`notes`.
3. Enhancing the Player Detail view to display a chronological list of played matches underneath the global statistics card, each showing the opponent (rival) name, round, and an action button to navigate directly to the `MatchDetailView`, returning smoothly upon back navigation.

---

## Research Items & Decisions

### 1. Database Schema & Migration for SQLite & Drizzle ORM

- **Context**: The application uses Expo SQLite with Drizzle ORM (`src/db/schema.ts` and `src/db/index.ts`). SQLite has limited native support for `ALTER TABLE DROP COLUMN` across older SQLite versions, though modern SQLite supports `DROP COLUMN`. However, `initDatabase()` in `src/db/index.ts` creates tables with `CREATE TABLE IF NOT EXISTS` and executes seed scripts during fresh runs/tests.
- **Decision**:
  - Update Drizzle schema (`src/db/schema.ts`) on the `players` table:
    - Remove `position: text("position")`
    - Remove `notes: text("notes")`
    - Add `jerseyName: text("jersey_name")` (nullable/optional)
  - Update `src/db/index.ts` table creation DDL:
    - In `CREATE TABLE IF NOT EXISTS players`: remove `position TEXT`, `notes TEXT`, and add `jersey_name TEXT`.
    - Provide a safe migration step in `initDatabase()` using `ALTER TABLE players ADD COLUMN jersey_name TEXT` if the column doesn't exist yet on existing SQLite databases.
  - Update `src/types/database.ts` and `src/types/mockData.ts`:
    - In `MockPlayerConfig`, remove `position` and `notes`, and add `jerseyName?: string`.
    - `Player` and `NewPlayer` in `src/types/database.ts` automatically infer the new shape via `InferSelectModel` and `InferInsertModel`.
  - Update `scripts/seed-db.ts` and `src/db/mock/mockTeamData.ts` to reflect the updated player structure with optional `jerseyName` where appropriate and removing `position`/`notes`.
- **Rationale**:
  - Aligns with Principle III (Type-Safe Local Persistence with Drizzle ORM & Expo SQLite).
  - Keeps schema, TypeScript types, and database tables strictly synchronized.
- **Alternatives Considered**:
  - *Keep `position` and `notes` as optional legacy columns*: Rejected. The user specification explicitly mandates: "remove `notes` and `position` entries and add new string entry `jerseyName` (optional)".
  - *Use full table recreation on migration*: SQLite `ALTER TABLE ADD COLUMN` is completely safe and backwards compatible for existing local dev databases.

---

### 2. Player Form Design & Validation

- **Context**: `PlayerForm` (`src/components/PlayerForm.tsx`) allows creating and editing players. Currently, it includes fields for `firstName`, `lastName`, and `number`.
- **Decision**:
  - Add `jerseyName` input field to `PlayerForm`:
    - Label / placeholder: "Nombre en camiseta (opcional)" or "Nombre Camiseta" (clean text matching app language in Spanish).
    - Optional field: leaving it blank must be valid and must not block submission.
    - Trim whitespace on submit; store as `null` or undefined / empty string if blank.
    - Max length: standard 30 characters constraint suitable for jerseys and profile displays.
  - Ensure zero input fields or UI traces of `position` or `notes` exist in `PlayerForm`.
  - Populate `jerseyName` from `playerData` on edit mode.
  - Submit payload includes: `{ teamId, firstName, lastName, number, jerseyName, id }`.
- **Rationale**:
  - Satisfies FR-001, FR-002, FR-003, FR-004, FR-005, SC-001, SC-002.
  - Retains existing NativeWind utility styling and `Input`/`Button` framework components.
- **Alternatives Considered**:
  - *Auto-generating jersey name from last name*: Rejected. The field is an optional override customized by the coach/manager. If omitted, the app displays the player's full name.

---

### 3. Played Matches Querying & Player Detail View Architecture

- **Context**: In `src/components/PlayerDetail.tsx`, the view shows the jersey number, player name, games played counter (`stats.length`), and the `PlayerCard` containing aggregated global stats. Below this, we must render the list of matches the player participated in.
- **Decision**:
  - Query strategy:
    - In `PlayerController` or `useDB`: implement `loadPlayerPlayedMatches(playerId: number)` (or enhance `PlayerStatsController.loadByPlayer` / `usePlayerStore`).
    - Join `player_stats` with `games` table:
      ```ts
      db.select({
        gameId: games.id,
        opponent: games.opponent,
        round: games.round,
        date: games.date,
        status: games.status,
        resultC1: games.resultC1,
        // ... game details needed for display and navigation
      })
      .from(playerStats)
      .innerJoin(games, eq(playerStats.gameId, games.id))
      .where(eq(playerStats.playerId, playerId))
      .orderBy(desc(games.id)); // reverse chronological
      ```
    - Since `player_stats` records are created for games where players played/were rostered with minutes or box score stats, this returns all matches played by the player.
  - UI Component Design:
    - Render a "Partidos Jugados" (Played Matches) section directly below the global player statistics card.
    - Each match card displays:
      - Opponent name ("vs {rival}")
      - Match round (e.g. "Jornada {round}" or "Ronda {round}")
      - Date of the fixture
      - Action button / icon (e.g. "Ver Partido" or arrow/eye button) with `testID="match-detail-btn-{gameId}"`.
    - Empty State: When a player has 0 played matches, render a clear fallback message: "Este jugador aún no ha participado en ningún partido." (FR-009).
    - Scrollability: Wrap the content in a `ScrollView` with appropriate padding to ensure smooth vertical scrolling without clipping (Edge case).
- **Rationale**:
  - Fast, single indexed join query in SQLite.
  - Direct display of opponent and round as required by FR-006, FR-007, FR-009.
- **Alternatives Considered**:
  - *Fetch all games and filter in memory*: Suboptimal performance when games scale. The relational join query is efficient and clean.

---

### 4. Direct Navigation to Match Detail View & Return Flow

- **Context**: When the user taps the action button on a played match item, the app should navigate to the `MatchDetailView` for that game, and allow returning back to `PlayerDetail`.
- **Decision**:
  - `MatchDetailView` is exported from `src/features/match-detail` and accepts `{ match: Game, onReturn: () => void, onMatchUpdated?: (updated: Game) => void }`.
  - In `PlayerDetail` (or orchestrated in `PlayerList`):
    - Maintain local state `selectedMatch: Game | null = null`.
    - When the action button is pressed on a played match, fetch the full `Game` record (or use the joined game data) and set `selectedMatch`.
    - If `selectedMatch` is active, render `<MatchDetailView match={selectedMatch} onReturn={() => setSelectedMatch(null)} />`.
    - When user taps back (`onReturn`), set `selectedMatch(null)`, smoothly restoring `PlayerDetail` without lost player state.
- **Rationale**:
  - Mirrors existing navigation patterns used in `GameList.tsx` and `ClubProfile.tsx`.
  - Zero route-stack pollution and immediate response (< 1s as required by SC-004).
  - Fully testable in Jest and React Native Testing Library without external navigation mocks.
- **Alternatives Considered**:
  - *Global navigation dispatch*: The existing codebase uses stateful view transitions (`onReturn`, selected item states) across `GameList`, `ClubProfile`, and `PlayerList`. Adhering to this established pattern preserves architectural consistency.

---

### 5. Backward Compatibility & Test Suite Maintenance

- **Context**: Multiple existing tests instantiate mock players with `position: "Base"` or similar fields.
- **Decision**:
  - Update mock player definitions across test files to remove `position` and `notes`, and optionally provide `jerseyName`.
  - Remove tests specifically asserting `position` validation or presence (e.g., in `mockData.test.ts`, `mockDataValidator.test.ts`, `seed.test.ts`).
  - Add comprehensive new unit and component tests verifying:
    1. Schema and store persistence with `jerseyName` and without `position`/`notes`.
    2. PlayerForm rendering with optional `jerseyName` input and omission of `position`/`notes`.
    3. PlayerDetail rendering played matches list with opponent name, round, empty state, and action button.
    4. Navigation transition to `MatchDetailView` and returning to `PlayerDetail`.
- **Rationale**:
  - Upholds Principle I (Test-Driven Development First). All 62 test suites must remain green.
