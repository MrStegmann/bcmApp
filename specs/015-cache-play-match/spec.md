# Feature Specification: Caching the Play Match

**Feature Branch**: `015-cache-play-match`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "The task is to implement in background a caching method for the Play Match View to avoid losing the advances, stats or any data during the match so the user can restore without problems if any time the app stops or crashing or closes unexpectedly. The caching must be silently and the user must not notice this caching. When the match ends and the user save and finish it, the caching data must be erase."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Silent Background Preservation of Live Match State (Priority: P1)

As a scorekeeper, coach, or team manager actively recording an ongoing basketball match, I want all game events, score updates, foul counts, player statistics, substitutions, timeouts, and running timer states to be saved silently in the background without any visible indicators or UI sluggishness, so that my recorded match progress is consistently safe against unexpected device power-offs, app crashes, or accidental closures.

**Why this priority**: Live basketball games are fast-paced and continuous. Any lost data during a match requires frustrating manual reconstruction, and any visible saving indicators or input lag can cause scorekeepers to miss real-time game actions.

**Independent Test**: Can be tested independently by creating an active match session, recording a series of points, fouls, and substitutions, immediately force-terminating the application, and confirming that the latest captured game data exists in local persistence without ever having displayed a visual saving prompt or banner.

**Acceptance Scenarios**:

1. **Given** a match session is in progress, **When** the scorekeeper records scoring points, fouls, player substitutions, or timeout events, **Then** the updated match state is persisted in the background transparently without any visible spinners, toasts, or UI interruptions.
2. **Given** rapid scoring activity occurs within a brief window of time, **When** multiple stats or events are input in quick succession, **Then** user interactions remain immediate and fluid with zero noticeable touch delay or screen stutter.
3. **Given** the match timer is actively running, **When** game clock ticks or period transitions occur, **Then** the current time remaining and active period are maintained in the background session record.

---

### User Story 2 - Seamless Crash and Session Recovery (Priority: P1)

As a scorekeeper reopening the app or navigating to the Play Match view following an abrupt crash, operating system termination, or accidental closure, I want the active match session to be restored automatically and accurately to its exact pre-crash state, so that I can resume tracking the game immediately without data loss.

**Why this priority**: A crash or OS suspension during a live game is critical; fast and complete restoration of scores, period, clock, and individual player stats is essential to keeping the game on schedule.

**Independent Test**: Can be tested independently by simulating an unexpected app termination mid-match, relaunching the app, opening the Play Match view, and verifying that the game scores, roster status, fouls, period, and timer immediately display the exact values from before the crash.

**Acceptance Scenarios**:

1. **Given** the app was unexpectedly closed during an in-progress match, **When** the user reopens the app and accesses the match view, **Then** the session state is seamlessly rehydrated with the exact scores, fouls, player stats, active line-up, and game period intact.
2. **Given** a recovered match session is loaded, **When** the scorekeeper resumes scoring, **Then** all subsequent stats and actions append seamlessly to the recovered game state.
3. **Given** an uncompleted match session exists from a previous app run, **When** the user decides to abandon or reset the unfinished session to start fresh, **Then** the system provides a clear confirmation flow to discard the cached session and initialize a new match cleanly.

---

### User Story 3 - Automatic Cache Purging on Match Finalization (Priority: P2)

As a scorekeeper who has completed a match and triggered the "Save & Finish" action, I want all temporary cached match session data to be completely erased from local storage, so that no residual state bleeds into future matches and device storage is kept clean.

**Why this priority**: Ensuring that finished matches do not linger in the temporary cache guarantees that future games always start from a fresh slate and prevents obsolete session recovery prompts.

**Independent Test**: Can be tested independently by completing a match, executing "Save & Finish", verifying successful permanent match storage, and confirming that local temporary session cache entries are completely purged and no recovery prompt occurs on subsequent launches.

**Acceptance Scenarios**:

1. **Given** a live match is finished, **When** the user selects "Save & Finish" and the match is permanently committed to history, **Then** all associated temporary match cache entries are immediately and entirely purged.
2. **Given** temporary match cache has been purged upon finalization, **When** the user launches a new match, **Then** the new match opens with a fresh, blank state with no remnant data from prior matches.
3. **Given** a user explicitly cancels or discards an ongoing match session via an exit/discard confirmation, **When** the discard action is confirmed, **Then** the temporary cached data for that match is completely erased.

---

### User Story 4 - Resilient Fallback on Corrupted or Incompatible Session Cache (Priority: P3)

As a user launching the app when a cached match session payload has become corrupted, truncated, or incompatible with the current app version, I want the system to safely detect and discard the damaged cache without crashing, so that I can proceed to use the app and record matches reliably.

**Why this priority**: Storage corruption or schema alterations between updates should never lock the user out of the application or cause unhandled crashes on startup.

**Independent Test**: Can be tested independently by injecting an invalid or corrupted cache payload, launching the app and opening Play Match, and verifying that the app loads gracefully with a safe fallback state and logs the incident without throwing an uncaught exception.

**Acceptance Scenarios**:

1. **Given** a cached match session contains corrupted or unparseable data, **When** the application attempts to read the cache on view mount, **Then** the error is handled gracefully, the corrupted cache is cleared, and the user is presented with a standard new match initialization.
2. **Given** cached data originated from an older incompatible data structure, **When** session rehydration is attempted, **Then** the system either migrates the supported fields or cleanly initializes a new session without crashing.

---

### Edge Cases

- **Immediate Power Loss or Kill During Event Dispatch**: When the device loses power or is killed in the exact millisecond of a user tap, the system recovers the latest state successfully flushed to the persistence layer, minimizing data loss to at most the single pending event.
- **Multiple Consecutive App Crashes**: If an unexpected crash occurs repeatedly during recovery, the system must not enter an infinite crash loop; it must provide a fail-safe mechanism to discard the problematic cached state.
- **Clock Drift Across App Inactivity**: If the timer was running when the app crashed or was suspended, upon recovery the game timer should either resume paused at the last recorded timestamp or prompt the scorekeeper to adjust the clock to align with the physical scoreboard.
- **Abandoned Old Sessions**: If an unfinished match session remains unaccessed for an extended period (e.g. over 48 hours), the system should detect the stale session and ask the user whether to resume or discard it upon opening the match interface.
- **Concurrent Device Storage Full**: If local device storage is full and writes fail, the app must continue running in memory without crashing the user interface, attempting persistence retries when possible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST continuously persist in-progress match state to local non-volatile storage in the background during active gameplay.
- **FR-002**: System MUST perform all background state persistence silently, without displaying progress spinners, blocking overlays, notification popups, or toast banners.
- **FR-003**: System MUST throttle or debounce frequent background write operations to prevent main UI thread contention and ensure high touch responsiveness during rapid scoring events.
- **FR-004**: System MUST capture the complete live match state in the persistent cache, including team scores, game period/quarter, running/paused clock state, elapsed time, individual player statistics, court positions, foul counts, and timeout counts.
- **FR-005**: System MUST check for an existing in-progress match cache upon mounting the Play Match view or during application launch.
- **FR-006**: System MUST rehydrate and restore the active match view to the exact state captured in the local cache when recovering from an abrupt application termination or force-close.
- **FR-007**: System MUST immediately and permanently purge the temporary match cache upon successful execution of the "Save & Finish" match lifecycle action.
- **FR-008**: System MUST purge the temporary match cache when the user explicitly confirms discarding or canceling an active match session.
- **FR-009**: System MUST validate the integrity and structure of cached session data before rehydration, safely discarding invalid or corrupted data without causing application crashes.
- **FR-010**: System MUST guarantee that initiating a new match after a finalized or discarded game begins with a clean slate, with zero cross-session data contamination.
- **FR-011**: System MUST safely handle background write errors (such as storage access limits) gracefully without displaying unhandled error popups to the user.
- **FR-012**: System MUST record the timestamp of the last successful cache write to evaluate session freshness and handle stale recovery scenarios.

### Key Entities *(include if feature involves data)*

- **Cached Match Session**: A temporary record holding the full in-flight state of an active match. Attributes include:
  - `sessionId`: Unique identifier of the cached game session.
  - `matchId`: Identifier of the match being played.
  - `lastUpdated`: Timestamp marking the most recent state sync.
  - `gameState`: Full snapshot of current score, period, clock status, and timeouts.
  - `rosterState`: Snapshot of active players, bench players, and on-court positioning.
  - `eventLog`: Ordered sequence of recorded actions (points, fouls, substitutions, turnovers).
  - `sessionStatus`: Lifecycle state indicating whether the session is active, recovering, or pending purge.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of recorded match events (points, fouls, substitutions, timeouts, period) are preserved and recovered following an abrupt application force-close or crash.
- **SC-002**: Background saving operations produce zero visible UI interruptions, zero modal delays, and maintain fluid touch interactions with no noticeable latency during rapid scoring entries.
- **SC-003**: Rehydration of an interrupted match session completes in under 1.0 second upon opening the match view.
- **SC-004**: 100% of temporary cache entries are purged immediately upon completing "Save & Finish", ensuring zero residual data remains on storage.
- **SC-005**: 100% of corrupted, truncated, or incompatible cache scenarios recover safely without unhandled application crashes or freeze screens.

## Assumptions

- The match state structure contains all necessary information required to fully re-render the Play Match view without needing remote network roundtrips.
- The device has standard local storage capabilities available to the application.
- The background caching is specific to the active scoring session and does not alter the finalized match history database until the user explicitly saves the game.
- If the game clock was running when the app crashed, the safest default upon rehydration is to present the timer in a paused state at the last persisted second, allowing the scorekeeper to sync with the referee/scoreboard before resuming.
