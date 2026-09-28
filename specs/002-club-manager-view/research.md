# Research: Refactor Club Manager View Page

**Feature**: Refactor Club Manager View Page (`specs/002-club-manager-view`)
**Date**: 2026-09-27

## Technical Research & Decisions

### Decision 1: State Management & Navigation Flow
- **Decision**: Use `useClubStore` for state management (`teamsList`, `currentTeam`, `fetchTeams`, `selectTeam`, `createTeam`, `deleteTeam`) and `useMenuStore` for top menu button actions.
- **Rationale**: `ClubStore` provides centralized, unit-testable Zustand store actions without React Context wrapping. Selecting a team sets `currentTeam` in `ClubStore`, triggering reactive UI state changes seamlessly.
- **Alternatives Considered**: Passing local `useState` callbacks through multiple component levels — rejected because state desynchronizes when returning to team management views.

### Decision 2: Team List & Empty State Rendering
- **Decision**: Render team list using `FlatList` with `keyExtractor={(item) => item.id.toString()}` and extract individual team item components (`ClubCard`/`ClubList`).
- **Rationale**: `FlatList` offers virtualized rendering for fast scrolling performance and built-in `ListEmptyComponent` support for clean empty-state UI when zero teams exist.
- **Alternatives Considered**: `ScrollView` mapping over array — rejected for potential memory overhead and lower performance when team count grows.

### Decision 3: Form Input Validation & Error Handling
- **Decision**: Validate team name input inline in `ClubForm` before dispatching `createTeam` or `updateTeam` actions. If a storage error occurs, log and dispatch user-facing feedback via `AlertStore`.
- **Rationale**: Prevents empty database entries and provides immediate feedback to the coach without unhandled runtime rejections.
- **Alternatives Considered**: Relying on SQLite database non-null constraint exceptions — rejected because database error stack traces are unhelpful to end users.

### Decision 4: Deletion & Safety Flow
- **Decision**: Use `DeleteModal` component with explicit team target state (`itemToDelete`) before calling `ClubStore.deleteTeam(teamId)`.
- **Rationale**: Deleting a team cascades deletions to players, games, trainings, and fees in SQLite. Explicit confirmation protects against accidental deletion.
- **Alternatives Considered**: Direct delete without modal — rejected for high risk of irreversible data loss.
