# Bug Assessment: Player Jersey Name Fallback "F. Lastname" and Rival Control Points/Faults Removal

- **Slug**: play-match-fallback-rival-fix
- **Created**: 2026-10-24
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
In the Play Match View Page, the players does not appears with the fallback name it shall. IF NO JERSAY NAME, IT SHOW THE FALLBACK OPTION OF "F. Lastname" ALWAYS. THIS IS MANDATORY. 
Also, the Points and Faults IN THE RIVAL CONTROL SECTION still existing. It MUST not be ANY POINT or Fault in the RIVAL PANEL CONTROL SECTION.
```

## Symptom

1. **Player Name / Fallback in Play Match View**:
   - In the Play Match view (`PlayMatch`), court player circles (`HalfCourtCanvas`) and bench player circles (`TeamManagementPanel`) do not display the player's name with the required fallback when `jerseyName` is absent.
   - Currently, `formatPlayerIdentifier` prioritizes `player.number` and completely ignores `player.jerseyName`, causing player circles to display only the jersey number (e.g. `#7` or `#77`), while omitting the player's name entirely.
   - **Expected behavior**: If `jerseyName` is present and non-empty, display the jersey name. If no jersey name is provided (null, undefined, empty, or whitespace), it MUST show the fallback option of `F. Lastname` (First initial dot Lastname, e.g. `G. Sanchez`, `P. Stegmann`, `L. Crevits`, `A. Delgado`) ALWAYS. The player circle must display the jersey number on top (line 1), the jersey name / fallback name below the number (line 2), followed by the divisor line and match stats (minutes/points).

2. **Points and Faults in Rival Control Section**:
   - In the bottom Rival Control panel (`RivalPanelControl`), the left-hand text summary still displays the rival's period score and period fouls (`{rivalPeriodScore} pts ({activePeriod}) • {rivalPeriodFouls} faltas`).
   - **Expected behavior**: The user explicitly requires that there MUST NOT be ANY point or fault displayed in the Rival Control Section. All current points and fouls are already prominently tracked and displayed in the main scoreboard (`TimeScoreFoulsController`). The Rival Control Section at the bottom must strictly function as an action control pad (with label/badge and the adjustment buttons `-1`, `+1`, `+2`, `+3` for score, and `-F`, `+1 Falta` for fouls), without rendering any points or fouls counters or values.

## Reproduction

### Issue 1: Player Name Fallback
1. Create or load a match with players having a jersey number and names (e.g., `number: "7"`, `firstName: "Gorka"`, `lastName: "Sanchez"`, and no `jerseyName`).
2. Navigate to the Play Match screen (`src/features/play-match/PlayMatch.tsx`).
3. Observe the player circles on the half-court canvas (`HalfCourtCanvas`) and substitute bench (`TeamManagementPanel`).
4. **Observed**: The circle shows `#7` in the name slot; the name `G. Sanchez` is nowhere to be found. If a player has a `jerseyName` (e.g. `SANCHEZ`), it is also ignored and `#7` is rendered.
5. **Expected**: The circle shows `#7` on top, and directly below it displays `G. Sanchez` (or `SANCHEZ` if `jerseyName` is present).

### Issue 2: Points and Faults in Rival Control Section
1. Navigate to the Play Match screen.
2. Scroll or view the bottom Rival Control section (`RivalPanelControl`).
3. Observe the left side of the Rival Control panel.
4. **Observed**: It displays `{rivalPeriodScore} pts ({activePeriod}) • {rivalPeriodFouls} faltas`.
5. **Expected**: No points or faults numbers/text should exist in the Rival Control section. Only the section header/label and action buttons should be visible.

## Suspected Code Paths

- `src/features/play-match/utils/formatPlayerIdentifier.ts:11-40`:
  - `formatPlayerIdentifier` currently returns `#[number]` whenever `number` is present and does not reference `jerseyName` at all.
  - Needs to prioritize `jerseyName` (trimmed, non-empty), and when absent, return `F. Lastname` (`${initial}. ${capitalize(lastName)}`).
- `src/features/play-match/components/HalfCourtCanvas.tsx:75-92`:
  - Renders court player circle. Currently renders only `{identifier}` (which was evaluated to `#number`).
  - Must render both: jersey number on top (`#{player.number ?? "-"}`), and the identifier name (`jerseyName` or `F. Lastname`) below it.
- `src/features/play-match/components/TeamManagementPanel.tsx:180-210`:
  - Renders bench player circle. Currently renders only `{identifier}`.
  - Must render both: jersey number on top (`#{player.number ?? "-"}`), and the identifier name (`jerseyName` or `F. Lastname`) below it.
- `src/features/play-match/components/RivalPanelControl.tsx:15-33`:
  - Renders the summary text containing `{rivalPeriodScore} pts ({activePeriod}) • {rivalPeriodFouls} faltas`.
  - Must remove the points and faults display completely, leaving only the header/section title and the control buttons.
- `src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts`:
  - Test suite asserting obsolete `#number` exclusive priority that needs updating to reflect `jerseyName` priority and `F. Lastname` fallback.
- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx`:
  - Component tests verifying court player circle layout (number on top, name below).
- `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx`:
  - Component tests verifying bench player circle layout (number on top, name below).
- `src/features/play-match/__tests__/components/RivalPanelControl.test.tsx`:
  - Component tests verifying that no points or faults text elements exist in `RivalPanelControl`.

## Root Cause Hypothesis

1. **Player Name Fallback**:
   - In a recent refactoring task, `formatPlayerIdentifier` was altered to return `#number` whenever `number` was present, under the assumption that jersey numbers should exclusively replace names on player circles. Furthermore, `jerseyName` was stripped from the function's logic. As a result, any player with a number never displays their name, and `jerseyName` is completely unused.
   - Confidence: High.

2. **Points and Faults in Rival Control Section**:
   - When duplicate total score was removed from `RivalPanelControl`, the period points (`{rivalPeriodScore} pts`) and period fouls (`{rivalPeriodFouls} faltas`) were left behind in the summary container. The user's specification requires that no points or fouls be displayed anywhere inside the Rival Control panel, as the scoreboard at the top already displays them.
   - Confidence: High.

## Proposed Remediation

**Preferred**:

1. **Refactor `formatPlayerIdentifier.ts`**:
   - Restore priority:
     1. If `player.jerseyName` is present, trimmed, and non-empty, return `trimmedJersey`.
     2. If `player.jerseyName` is missing/empty, return `F. Lastname` (`${initial}. ${capitalize(trimmedLast)}`).
     3. Edge cases: if only `lastName` exists, return `capitalize(trimmedLast)`; if only `firstName` exists, return `capitalize(trimmedFirst)`; if neither exists, return `"Jugador"`.
     4. Remove number formatting from `formatPlayerIdentifier` — numbers are rendered explicitly in the number component slot above the name.

2. **Update Player Circle Layout in `HalfCourtCanvas.tsx` & `TeamManagementPanel.tsx`**:
   - Display two separate lines above the divisor:
     - Top line: `<Text className="text-amber-400 font-black text-sm leading-tight text-center">#{player.number ?? "-"}</Text>`
     - Second line: `<Text className="text-slate-200 font-semibold text-[8px] leading-tight text-center" numberOfLines={1}>{identifier}</Text>`
     - Divisor line: `<View className="w-10 h-px bg-slate-700 my-0.5" />`
     - Bottom line: `${stintMin}min / ${pts}pts` (court) or `${min}min / ${pts}pts` (bench).

3. **Update `RivalPanelControl.tsx`**:
   - Remove lines 23-32 (`{rivalPeriodScore} pts ... {rivalPeriodFouls} faltas`).
   - Retain the left-side section title:
     ```tsx
     <View className="flex-1 mr-2">
       <View className="flex-row items-center space-x-1.5">
         <View className="w-2 h-2 rounded-full bg-sky-400" />
         <Text className="text-sky-400 font-extrabold text-xs tracking-wider uppercase">
           Rival ({activePeriod.toUpperCase()})
         </Text>
       </View>
     </View>
     ```
   - Retain the score adjustment buttons (`-1`, `+1`, `+2`, `+3`) and foul adjustment buttons (`-F`, `+1 Falta`).

4. **Update Test Suites**:
   - `formatPlayerIdentifier.test.ts`: Test that `jerseyName` is returned when present, and fallback `F. Lastname` is ALWAYS returned when `jerseyName` is absent (with or without `number`).
   - `HalfCourtCanvas.test.tsx` & `TeamManagementPanel.test.tsx`: Verify both jersey number and name identifier are rendered.
   - `RivalPanelControl.test.tsx`: Verify that neither points nor fouls counters are rendered in `RivalPanelControl`.

**Files likely to change**:
- `src/features/play-match/utils/formatPlayerIdentifier.ts`
- `src/features/play-match/components/HalfCourtCanvas.tsx`
- `src/features/play-match/components/TeamManagementPanel.tsx`
- `src/features/play-match/components/RivalPanelControl.tsx`
- `src/features/play-match/__tests__/utils/formatPlayerIdentifier.test.ts`
- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx`
- `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx`
- `src/features/play-match/__tests__/components/RivalPanelControl.test.tsx`

**Tests to add or update**:
- Unit tests in `formatPlayerIdentifier.test.ts` verifying `jerseyName` priority and `F. Lastname` fallback under all conditions.
- Component layout assertions in `HalfCourtCanvas.test.tsx` and `TeamManagementPanel.test.tsx` checking for `#number` and `{identifier}`.
- Component assertions in `RivalPanelControl.test.tsx` ensuring `pts` and `faltas` texts are absent from `RivalPanelControl`.

## Risks & Considerations

- **Badge Layout Constraint**: The player circle is 80x80 px (`w-20 h-20`). The combined layout (Number at `text-sm`, Name at `text-[8px]`, divisor line, and Stats at `text-[8px]`) fits within the 80px container without overflowing when using `leading-tight`.
- **Rival Panel Alignment**: Removing the score and foul text numbers from the left side of `RivalPanelControl` leaves the panel title clean, vertically centered, and leaves more room for the control buttons on smaller mobile viewports.

## Open Questions

- None. Both requirements are explicit and mandatory.
