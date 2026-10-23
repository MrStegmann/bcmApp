# Bug Assessment: Match Detail Layout and Data Presentation Errors

- **Slug**: match-detail-errors
- **Created**: 2026-10-23
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

```text
# Match Detail Errors
## Whats wrong
- Back and Edit buttons AND title "Detalles del Partido" shall ve in the shared header of the application, not inside the page view.
- The View shall show the desglose of each period and the total below, never show the total of desglose and total score.
- The list of the players shall be grid by 2 colums, except the MVP, that is ontop of the list and use full width.
- The polygon shall have the calculated value below the name of the vertex (e.g.: Posesiones 80, OER: 14.75, eFG%: 17.39)
- Below the polygon there is two columns with no data, remove those columns.
```

## Symptom

When opening a finished match in Match Detail view (`MatchDetailView.tsx`), the screen displays an internal navigation/action bar instead of binding to the global shared header (`Header.tsx` via `MenuStore`), duplicates total score metrics by showing both a separate scoreboard card and the period breakdown total row, renders all roster players in a single vertical list rather than a 2-column grid with an MVP banner, lacks calculated numeric values on the 8 polygon radar chart vertices, and renders two redundant cards/columns below the radar chart.

## Reproduction

1. Launch the app and select a team in `ClubManage`.
2. Navigate to the matches tab (`GameList.tsx`).
3. Select any finished match (`status === "finished"`).
4. Observe the header: The global application header at the top shows the parent title ("Gestión de Equipos" / "Partidos") without Back or Edit actions, while `MatchDetailView` renders its own internal header bar with "Volver", "Detalle del Partido", and "Editar".
5. Observe the scoreboard: The view renders both the large scoreboard card (Team total vs Opponent total) in `MatchSummaryHeader` and the `PeriodBreakdownTable` with a "Total" summary row at the bottom.
6. Observe the player roster list: All players are stacked vertically in a 1-column list with uniform row widths, rather than having the MVP on top full-width and the rest in a 2-column grid.
7. Observe the advanced analytics radar chart: The polygon chart vertices only show abbreviated axis names (POS, OER, etc.) without their calculated values underneath.
8. Observe the section below the radar chart: A 2-column grid of 8 cards is rendered below the chart, duplicating metrics or showing unconfigured data.

## Suspected Code Paths

- `src/features/match-detail/MatchDetailView.tsx:12-107` — Mounts `MatchSummaryHeader` internally and does not hook into `useMenuStore` (`setHeaderTitle`, `setHeaderBackAction`, `setHeaderAction`) to bind to the shared application header.
- `src/features/match-detail/components/MatchSummaryHeader.tsx:19-47` — Implements an in-view navigation bar with Back, "Detalle del Partido" title, and Edit buttons, and in lines 57-115 renders the duplicate full scoreboard card that clashes with the period breakdown total.
- `src/features/match-detail/components/PeriodBreakdownTable.tsx:12-104` — Renders period breakdowns and the total summary footer row.
- `src/features/match-detail/components/RosterValuationList.tsx:36-140` — Renders roster items inside a vertical 1-column container (`space-y-2`) where every player card has full width instead of an MVP full-width top item followed by a 2-column grid.
- `src/features/match-detail/components/PolygonRadarChart.tsx:81-104` — Renders only `{axis.label}` in `<SvgText>` without rendering the calculated metric value below the vertex label.
- `src/features/match-detail/components/TeamAdvancedAnalytics.tsx:93-136` — Renders a 2-column grid of 8 metric cards below `PolygonRadarChart`.

## Root Cause Hypothesis

`MatchDetailView` was originally built as a standalone page component without integrating into the application's global `MenuStore` header lifecycle (which `PlayMatch.tsx` uses). Additionally, UI styling decisions in `MatchSummaryHeader`, `RosterValuationList`, `PolygonRadarChart`, and `TeamAdvancedAnalytics` did not follow the required layout specifications: `MatchSummaryHeader` duplicated both navigation buttons and total scores, `RosterValuationList` utilized a 1-column stack, `PolygonRadarChart` omitted vertex calculated values, and `TeamAdvancedAnalytics` retained an extra 2-column card layout below the chart.

Confidence: **high**

## Proposed Remediation

**Preferred**:
1. **Shared Header Integration**:
   - In `MatchDetailView.tsx`, use `useMenuStore` to set:
     - `setHeaderTitle("Detalles del Partido")`
     - `setHeaderBackAction({ label: "Volver", iconName: "arrow-left", iconFamily: "Feather", onPress: onReturn, testID: "header-back-button" })`
     - `setHeaderAction({ label: "Editar", iconName: "edit-2", iconFamily: "Feather", onPress: openEditModal, testID: "header-action-button" })`
   - Clean up `setHeaderTitle`, `setHeaderBackAction(null)`, and `setHeaderAction(null)` upon unmounting.
   - In `MatchSummaryHeader.tsx`, remove the internal navigation bar (`Back`, `Title`, `Edit`).
2. **De-duplicate Scoreboard & Breakdown**:
   - Keep `PeriodBreakdownTable` with its period breakdown rows and total row below it as the single source for scores.
   - In `MatchSummaryHeader.tsx`, remove the duplicate total scoreboard card (leaving match metadata such as teams and date if desired, or replacing the card so total score is only presented once in the breakdown table).
3. **Player Roster 2-Column Grid with MVP Full-Width**:
   - In `RosterValuationList.tsx`, separate the top performer (`players[0]`, MVP) from the remaining roster (`players.slice(1)`).
   - Render the MVP item at the top with full width (`w-full`).
   - Render the remaining players in a 2-column grid (`flex-row flex-wrap`, each item `w-1/2` or `flex-1` min-w-[48%]) with compact card styling.
4. **Polygon Vertex Calculated Values**:
   - In `PolygonRadarChart.tsx` (and `radarGeometry.ts` if needed), update the axis labels to display the calculated value below the vertex name:
     - Line 1: Vertex name/label (e.g. `Posesiones`, `OER`, `eFG%`).
     - Line 2: Formatted calculated value (e.g. `80`, `14.75`, `17.39%`).
5. **Remove Columns Below Polygon**:
   - In `TeamAdvancedAnalytics.tsx`, remove the 2-column metric cards container (`flex-row flex-wrap -mx-1.5` mapping `METRIC_DEFS`) below `PolygonRadarChart`.

**Alternatives**:
- Retain a simplified team banner (teams and date) above the period breakdown table while removing the large numerical scores from it.

**Files likely to change**:
- `src/features/match-detail/MatchDetailView.tsx`
- `src/features/match-detail/components/MatchSummaryHeader.tsx`
- `src/features/match-detail/components/RosterValuationList.tsx`
- `src/features/match-detail/components/PolygonRadarChart.tsx`
- `src/features/match-detail/components/TeamAdvancedAnalytics.tsx`
- `src/features/match-detail/types/index.ts` (if props or geometry types are updated)
- `src/features/match-detail/utils/radarGeometry.ts` (for vertex label formatting)
- `src/features/match-detail/__tests__/...` (associated component and integration test updates)

**Tests to add or update**:
- `MatchDetailView.test.tsx`: Verify `useMenuStore` header title and actions are configured on mount and cleared on unmount.
- `MatchSummaryHeader.test.tsx`: Update tests reflecting removal of internal navigation/duplicate scoreboard.
- `RosterValuationList.test.tsx`: Verify MVP card renders full-width on top and remaining players render in 2-column grid.
- `PolygonRadarChart.test.tsx`: Verify calculated values are rendered alongside vertex labels.
- `TeamAdvancedAnalytics.test.tsx`: Verify removal of 2-column metric cards below the polygon chart.

## Risks & Considerations

- **Global Header State Leak**: Must ensure `useMenuStore` state is cleanly restored when leaving `MatchDetailView` so parent screens (`GameList`) don't retain stale actions.
- **SVG Label Overflow on Small Devices**: Multi-line SVG text for vertex labels and values must respect radial bounds and viewBox padding to avoid clipping.
- **Roster Layout Compactness**: 2-column player cards must accommodate long player names and stat numbers on narrow mobile screens without text wrapping distortion.

## Open Questions

- None. All 5 requested adjustments are well-defined UI and architecture refactors.
