# Feature Specification: Mocked Basketball Team, Roster & Match Dataset

**Feature Branch**: `010-mock-team-data`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "The task is to create a Mock data with a 1 team with , at least, 12 players AND 10 match where the half of it are played and finished (Must have a roaster defined, players with data that match and link with the match score. What To Do: Team Setup: Define a mock team entity with basic metadata (Team ID, Name, Logo/Color, etc.). Roster Generation: Create a roster of at least 12 players assigned to the team. Each player must include required attributes (Player ID, Name, Position, and baseline stats). Match Schedule Creation: Generate a total of 10 mock matches associated with the team. Match State & Results: Set 5 matches to a 'Finished' status with realistic final scores. Set the remaining 5 matches to an 'Upcoming' or 'Unplayed' status. Player-Match Data Linking: For the 5 finished matches, link player participation and performance data (e.g., minutes played, goals, assists, or ratings) that correctly map to the team roster and match scores. Data Integration: Seed or store the mock dataset in the appropriate format (JSON, mock API endpoints, or database seeders) for frontend/backend consumption. Acceptance Criteria: Team & Roster: A mock team exists containing 12 or more unique players with complete profile data (ID, name, position). Match Count: Exactly 10 matches are created and linked to the team. Match Status Distribution: Exactly 5 matches are marked as completed/finished, and 5 matches are marked as upcoming. Scores & Results: All 5 finished matches have valid final scores and match outcomes. Player Data Association: Finished matches include linked player performance/stats data. Data Integrity: All player IDs referenced in match statistics exist in the team roster, and match scores align with player contributions where applicable."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Team Setup & 12+ Player Roster Initialization (Priority: P1)

As a team manager or coach opening the application for the first time, I want to explore a realistic basketball team populated with a complete roster of at least 12 distinct players, so that I can immediately experience and evaluate roster management, player profiles, and team dashboards without having to manually key in test records.

**Why this priority**: Roster data is the foundation of the entire application. Without a fully configured team and realistic player profiles, match preparation, line-ups, and statistical tracking cannot function.

**Independent Test**: Can be tested independently by loading the team view or roster screen and verifying that a primary team exists and lists at least 12 unique players, each displaying valid names, jersey numbers, and designated tactical positions.

**Acceptance Scenarios**:

1. **Given** a freshly initialized application environment, **When** the team overview is accessed, **Then** a primary basketball team entity is available with realistic club metadata (name, division/category, branding color/metadata).
2. **Given** the initialized team, **When** reviewing the team roster, **Then** exactly 12 or more unique players are displayed.
3. **Given** any player in the team roster, **When** inspecting their individual profile details, **Then** the player possesses a unique identifier, first name, last name, unique jersey number, assigned basketball position (e.g., Point Guard, Shooting Guard, Small Forward, Power Forward, Center), and baseline player notes.

---

### User Story 2 - Complete 10-Match Schedule with Finished & Upcoming States (Priority: P1)

As a coach or club administrator, I want to view a full 10-match season schedule showing an equal split between played games and upcoming fixtures, so that I can review past outcomes while planning future game preparations.

**Why this priority**: A realistic calendar schedule allows validation of match list screens, chronological sorting, and visual status differentiators between completed and scheduled encounters.

**Independent Test**: Can be tested independently by navigating to the schedule/matches view and confirming that exactly 10 matches exist for the team, exactly 5 have a "Finished" status with final scores, and exactly 5 have an "Upcoming" / "Pending" status with scheduled dates.

**Acceptance Scenarios**:

1. **Given** the loaded mock dataset, **When** the match schedule is viewed, **Then** exactly 10 matches associated with the primary team are listed.
2. **Given** the 10 scheduled matches, **When** filtering or inspecting by game status, **Then** exactly 5 matches are marked as "Finished" and exactly 5 matches are marked as "Upcoming" / "Pending".
3. **Given** any of the 5 finished matches, **When** viewed in the schedule, **Then** it presents valid chronological past dates, designated opponent names, competition rounds, and realistic final team and opponent scores.
4. **Given** any of the 5 upcoming matches, **When** viewed in the schedule, **Then** it presents scheduled future or pending calendar dates, designated opponent names, and competition rounds with unplayed/zero score states.

---

### User Story 3 - Detailed Match Box Scores & Player Stat Reconciliation (Priority: P2)

As a coach or statistical analyst, I want to drill into any of the 5 finished matches to inspect quarter breakdowns and individual player box scores, so that I can verify that player stats logically align with the team's final scores and fouls.

**Why this priority**: The integrity of analytics (valuation, period breakdowns, individual point distributions) depends on player performance metrics matching game totals.

**Independent Test**: Can be tested independently by selecting any of the 5 completed matches and verifying that all participant player records belong to the team roster, and the sum of player scoring contributions matches the team's recorded score for the game.

**Acceptance Scenarios**:

1. **Given** any of the 5 finished matches, **When** opening the match detail view, **Then** a breakdown of points and fouls per quarter (Period 1 through 4, plus extra time if tied at regulation) is present for both the home team and opponent.
2. **Given** any of the 5 finished matches, **When** inspecting player performance entries, **Then** each participating roster player has recorded minutes played, shot attempts and makes (free throws, 2-point, 3-point), offensive and defensive rebounds, assists, steals, turnovers, personal fouls, and overall valuation.
3. **Given** the player box score for a finished match, **When** summing all individual player points (1pt + 2pt + 3pt made), **Then** the total equals the team's recorded final game score.
4. **Given** player performance records for any match, **When** cross-referenced against the team roster, **Then** every referenced player ID corresponds to an active player belonging to the team.

---

### User Story 4 - Repeatable Mock Data Integration & Reset Capability (Priority: P2)

As a software tester or product reviewer, I want to be able to reliably ingest or reset this standard mock dataset on demand, so that the application can be restored to a known, pristine demo state at any time.

**Why this priority**: Deterministic testing, automated verification, and demonstration workflows require clean re-initialization without data corruption or leftover artifacts.

**Independent Test**: Can be tested independently by running the dataset initialization command or action, confirming all records populate correctly, running it again, and verifying that the dataset resets cleanly without orphaned records or duplicate entries.

**Acceptance Scenarios**:

1. **Given** an empty or previously altered database, **When** executing the mock data integration process, **Then** the dataset is cleanly seeded with the 1 team, 12+ players, and 10 matches (5 finished with stats, 5 upcoming).
2. **Given** an existing dataset, **When** re-running the integration or seeding workflow, **Then** previous data is cleared safely and replaced with the consistent mock dataset without duplication.

---

### Edge Cases

- **Did Not Play (DNP) Roster Members**: In actual basketball matches, not all 12 players necessarily enter the court. In finished matches, players with 0 minutes must have 0 points, 0 fouls, and 0 shot attempts, while remaining valid roster entries.
- **Overtime / Extra Time**: If a finished match has a tied score at the end of the fourth period (C4), an extra period must record additional points/fouls resolving the outcome, ensuring no finished game ends in an impossible basketball tie.
- **Opponent Statistics & Fouls**: Finished matches must include coherent opponent scores and quarter distributions even though opponent players are not individually tracked.
- **Re-seeding Idempotency**: Repeated seeding operations must not fail on unique constraint violations or produce disconnected foreign key references.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a mock team entity containing an identifier, team name, category/division, and branding metadata.
- **FR-002**: The system MUST provide a roster of at least 12 distinct mock players linked to the mock team.
- **FR-003**: Each player entity MUST include a unique identifier, first name, last name, jersey number, court position, and baseline profile information.
- **FR-004**: All jersey numbers for players on the same team MUST be unique within the squad.
- **FR-005**: The system MUST provide exactly 10 mock matches associated with the mock team against designated opponent clubs.
- **FR-006**: Exactly 5 of the mock matches MUST be configured in a "Finished" status with realistic past dates and finalized scores.
- **FR-007**: Exactly 5 of the mock matches MUST be configured in an "Upcoming" / "Pending" status with scheduled dates and unplayed/pending state.
- **FR-008**: For all 5 finished matches, the system MUST record period-by-period breakdowns (Quarters 1 through 4, and Extra time when applicable) for points and fouls for both the home team and the opponent.
- **FR-009**: For all 5 finished matches, the system MUST associate detailed individual player statistics (minutes played, 1pt made/attempted, 2pt made/attempted, 3pt made/attempted, offensive rebounds, defensive rebounds, assists, steals, turnovers, personal fouls, and valuation) for roster players.
- **FR-010**: The sum of points scored across all player statistics in a finished match MUST exactly equal the team's total points for that match.
- **FR-011**: Every player referenced in a match's player statistics MUST exist in the mock team's roster.
- **FR-012**: Finished matches MUST reflect realistic basketball scoring dynamics (e.g., typical final score ranges between 50 and 110 points).
- **FR-013**: The mock data MUST be consumable through an automated, repeatable data ingestion/seeder mechanism that supports clean re-population without manual data entry.

### Key Entities

- **Team**: Represents the primary basketball club entity. Attributes include unique identifier, team name, competitive category/division, creation timestamp, and optional branding assets.
- **Player**: Represents an individual athlete rostered to a team. Attributes include unique identifier, associated team reference, first name, last name, jersey number, tactical court position, and profile notes.
- **Match / Game**: Represents a competitive fixture between the primary team and an opponent club. Attributes include unique identifier, associated team reference, opponent name, competition round, date, match status (`finished` or `pending`), quarter scores (`C1` through `C4`, `extra`), opponent quarter scores, team quarter fouls, and opponent quarter fouls.
- **Player Match Stat / Performance**: Represents the individual box score recorded by a player in a specific finished match. Attributes include unique identifier, associated match reference, associated player reference, minutes played, free-throw attempts/makes (`t1i`/`t1a`), two-point attempts/makes (`t2i`/`t2a`), three-point attempts/makes (`t3i`/`t3a`), offensive rebounds (`oreb`), defensive rebounds (`dreb`), assists (`asis`), steals (`rec`), turnovers (`per`), fouls committed (`falt`), and valuation score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the required data volume is generated upon ingestion: exactly 1 mock team, at least 12 unique players, and exactly 10 matches (5 finished, 5 upcoming).
- **SC-002**: 100% mathematical consistency across all 5 completed matches: the sum of individual player points equals the team's recorded total points with zero discrepancies.
- **SC-003**: 100% relational integrity: zero orphaned player statistics and 100% of player IDs referenced in match statistics map to existing players on the team roster.
- **SC-004**: The complete mock dataset initializes and populates in under 3 seconds in standard application execution.
- **SC-005**: 100% of finished matches display complete quarter distributions (Points and Fouls for C1, C2, C3, C4, and Extra if tied in regulation) without null or missing values.

## Assumptions

- **Basketball Rules & Structure**: Standard basketball match format consists of 4 quarters of regulation play, with tie games at the end of regulation proceeding to an extra period (overtime) so that all finished matches conclude with a decisive winner.
- **Court Positions**: Player positions are drawn from standard basketball roles: Base (Point Guard / PG), Escolta (Shooting Guard / SG), Alero (Small Forward / SF), Ala-Pívot (Power Forward / PF), and Pívot (Center / C).
- **Roster Participation**: All 12 rostered players are eligible for selection; in each finished match, 9-11 players participate with active minutes while 1-3 players may be listed as non-participating (0 minutes / DNP) to simulate realistic rotation dynamics.
- **Score Ranges**: Realistic basketball scores range from 50 to 110 points per team per match.
- **Storage & Seeding Format**: The mock dataset will integrate into the application's existing persistence and seeding infrastructure, allowing developers to execute a clean seed or reset command before running UI tests or demonstrations.
