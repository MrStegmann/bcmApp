# Bug Assessment: Match Detail Edit Modal Stuck and Non-Roster Players Displayed

- **Slug**: match-detail-roster-bugs
- **Created**: 2026-10-26T13:30:00.000Z
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

> When a user open the Match Detail and tap over edit button, the modal does not cover the completly view, it's "stuck" bottom letting the user only to see the tab "Marcador y Faltas" and "Jugadores (12)".
> When the user share the match stats, the image exported includes players that are not in the roster. The stats SHALL include ONLY the ROSTER.
> When the user watch the Match Detail,, in the "Roster por Valoración", appears players that ARE NOT in the roster. NEVER SHALL HAPPEN THAT. Only the ROSTER MUST appears.

## Symptom

1. **MatchEditModal collapsed/stuck at bottom**: Tapping the "Editar" button in Match Detail displays a modal anchored to the bottom where the inner content collapses, rendering only the header and tabs ("Marcador y Faltas" and "Jugadores (12)"), while the scrollable form fields and action buttons are not visible or usable. The modal does not cover the complete view.
2. **Exported shared graphic includes non-roster players**: When opening the share modal and generating the WhatsApp/image export, players belonging to the team who were not called up or included in the match roster are rendered in the 24-column box score table.
3. **Roster por Valoración list displays non-roster players**: Viewing Match Detail displays all players belonging to the team (e.g. 12 players) in the valuation ranking grid rather than strictly restricting the list to the match roster.

## Reproduction

1. Have a team with 12 players in the database.
2. Create or play a match where only a subset (e.g. 8 players) are called up in the match roster (`player_stats` table entries for that `game_id`).
3. Navigate to **Partidos** and open the finished match's **Detalles del Partido** view:
   - Observe the **Roster por Valoración** section: all 12 players appear instead of only the 8 called-up players.
4. Tap **Compartir Estadísticas**:
   - Observe the preview and generated share graphic: all 12 players appear in the box score table instead of only the 8 roster players.
5. Tap **Editar** (header action):
   - Observe that the modal does not expand to cover the view; it sits at the bottom showing only the title and tabs "Marcador y Faltas" and "Jugadores (12)", with the scrollable body collapsed.

## Suspected Code Paths

- `src/features/match-detail/components/MatchEditModal.tsx:174-245` — Outer container uses `flex-1 bg-black/85 justify-end` and inner sheet uses `max-h-[90%]` without fixed height or `flex-1`. In React Native Flexbox, `KeyboardAwareScrollView` (`flex-1`) inside an unconstrained height parent collapses to height 0, hiding all form inputs and footer actions.
- `src/features/match-detail/store/useMatchDetailStore.ts:141-210` — `initializeMatch` retrieves all `teamPlayers` matching `match.teamId` and maps every player to `PlayerRosterItem` without filtering by `statsRows` (`playerStats.gameId == match.id`).
- `src/features/match-detail/components/RosterValuationList.tsx:6-38` — Renders `players` directly from the store; because store has all team players, all 12 players render.
- `src/features/match-detail/utils/shareDataFormatter.ts:125-171` — Formats `players` for the graphic table; because store passes all 12 players, all 12 players render in the exported graphic.

## Root Cause Hypothesis

There are two primary root causes:
1. **Modal Flexbox Collapse**: In `MatchEditModal.tsx`, the root modal is configured as a bottom sheet using `justify-end` with a child sheet styled with `max-h-[90%] overflow-hidden`. Because `maxHeight` does not establish an explicit height or a flex basis in React Native, the child `<KeyboardAwareScrollView className="p-4 flex-1">` collapses to 0 height. The only elements with intrinsic heights are the fixed-height Header and Tab bar, causing the modal to appear stuck at the bottom. Additionally, the user expects the modal to fully cover the view rather than being a bottom sheet.
2. **Missing Roster Filtering in Store Initialization**: In `useMatchDetailStore.ts:initializeMatch`, the code queries `teams`, `players` (all players in the team), and `playerStats` (roster/stats for the game). However, `teamPlayers` is mapped unconditionally rather than filtered to only those players who exist in `playerStats` for that match (matching the pattern used in `src/features/play-match/utils/roster.ts:buildMatchRoster`). As a consequence, non-roster players with 0 stats are propagated to `players` in the store, appearing in "Roster por Valoración", the share image export, and the edit modal.

Confidence: High.

## Proposed Remediation

**Preferred**:
1. **Update `MatchEditModal.tsx` layout**:
   - Change the modal structure from a collapsed bottom sheet to a full-screen view (or `presentationStyle="fullScreen"` / `presentationStyle="pageSheet"`) using `<SafeAreaView className="flex-1 bg-surface-container">` (or `View className="flex-1 bg-surface-container"`).
   - Ensure Header, Tabs, and Footer remain pinned while `<KeyboardAwareScrollView className="flex-1">` occupies the remaining viewport height properly so all input fields and footer actions are fully visible and accessible.
2. **Filter Roster in `useMatchDetailStore.ts`**:
   - In `initializeMatch`, when `statsRows` is non-empty (`statsRows.length > 0`), filter `teamPlayers` to include only those whose IDs exist in `statsRows` (`statsByPlayerId.has(player.id)`).
   - For legacy or unconfigured games where `statsRows` is empty, maintain safe fallback to `teamPlayers`.
   - In `saveMatchEdits`, ensure any new stats or updates only affect players in the match roster.
3. **Defense-in-depth in `shareDataFormatter.ts`**:
   - Ensure `formatMatchShareData` only includes players from the active roster.

**Files likely to change**:
- `src/features/match-detail/components/MatchEditModal.tsx`
- `src/features/match-detail/store/useMatchDetailStore.ts`
- `src/features/match-detail/utils/shareDataFormatter.ts` (if needed for safety)
- `src/features/match-detail/__tests__/useMatchDetailStore.test.ts`
- `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx`
- `src/features/match-detail/__tests__/utils/shareDataFormatter.test.ts`

**Tests to add or update**:
- Test that `useMatchDetailStore.initializeMatch` filters out team players that are not present in `playerStats` when `playerStats` exist for the game.
- Test that `MatchEditModal` renders full-screen with visible scroll area and proper flex properties.
- Test that `formatMatchShareData` only produces box score rows for the match roster.

## Risks & Considerations

- **Legacy Matches**: Games created before roster enforcement was added might have 0 rows in `playerStats`. The fallback when `statsRows.length === 0` must preserve displaying team players so legacy matches do not render an empty roster.
- **Keyboard Handling on Android**: When making `MatchEditModal` full-screen, verify that `KeyboardAwareScrollView` and input fields remain smooth on Android when the software keyboard opens.

## Open Questions

- None. The requirements are clearly stated and verified against current code implementations across `src/features/match-detail/`.
