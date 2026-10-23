# Bug Assessment: Player Jersey Number and Jersey Name Must Both Be Displayed in Play Match

- **Slug**: play-match-jersey-name
- **Created**: 2026-10-24
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
The jersey name AND NUMBER must be both showed. The number above the jersey Name.

Context:
The Jersey Name of the player is not showed in the quintet nor bench. It MUST show the Jersey Name of the player, and if is not exist the Jersey Name, it MUST show the First Letter of the firstname of the player and the lastname (e.g.: G. Sanchez, P. Stegmann, L. Crevits, etc)
```

## Symptom

In the Play Match view (`PlayMatch`), both the starting quintet on court (`HalfCourtCanvas`) and the substitute bench (`TeamManagementPanel`) currently display only the player's name identifier (e.g. `SANCHEZ` or `G. Sanchez`), omitting the player's jersey number (`#number`). 

Expected behavior: Player representation circles in both starting quintet and bench MUST display **both** the player's jersey number and the player's jersey name, arranged with the **jersey number above the jersey name**, followed by the divisor line and the player's statistics (`${min}min / ${pts}pts`). If `jerseyName` does not exist or is empty, the name portion must fall back to the first letter of the first name followed by a dot and the last name (e.g., `G. Sanchez`, `P. Stegmann`, `L. Crevits`).

## Reproduction

1. Open the application and create or edit a player profile with a jersey number and jersey name (e.g., `number: "7"`, `jerseyName: "SANCHEZ"`, `firstName: "Gorka"`, `lastName: "Sanchez"`).
2. Start or navigate to a match in the Play Match view (`src/features/play-match/PlayMatch.tsx`).
3. Inspect the player's circular representation card in the starting quintet (`HalfCourtCanvas`) or on the bench (`TeamManagementPanel`).
4. **Observed**: The circle only shows `SANCHEZ` (or `G. Sanchez`), and the jersey number `#7` is completely absent.
5. **Expected**: The circle shows `#7` on top, `SANCHEZ` directly below the number (above the divisor line), and `0min / 0pts` below the divisor line.

## Suspected Code Paths

- `src/features/play-match/components/HalfCourtCanvas.tsx:67-80`: Renders the player circle contents on court. Currently only renders `{identifier}` without `#${player.number}` above it.
- `src/features/play-match/components/TeamManagementPanel.tsx:197-210`: Renders the player circle contents on the bench. Currently only renders `{identifier}` without `#${player.number}` above it.
- `src/features/play-match/utils/formatPlayerIdentifier.ts:10-44`: Utility that formats the name portion (`jerseyName` or `[First Initial]. [Last Name]`). Must ensure it returns clean name strings for placement below the number.
- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx`: Component tests asserting player identification rendering on court.
- `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx`: Component tests asserting player identification rendering on bench.

## Root Cause Hypothesis

During the previous iteration to support `jerseyName`, the two-line header structure (`#jerseyNumber` on line 1 and `playerName` on line 2) was replaced by a single line displaying `identifier` (`jerseyName` or name fallback). Consequently, the jersey number was dropped entirely from the UI representation circles.

Confidence: High.

## Proposed Remediation

**Preferred**:
1. **Update `HalfCourtCanvas.tsx`**:
   - Inside the player circle view above the divisor line, render:
     - Jersey Number on top: `<Text className="text-amber-400 font-black text-sm leading-tight">#{player.number ?? "-"}</Text>`
     - Jersey Name / Fallback Name directly below the number: `<Text className="text-slate-200 font-semibold text-[8px] leading-tight text-center" numberOfLines={1}>{identifier}</Text>`
     - Retain divisor line `<View className="w-10 h-px bg-slate-700 my-0.5" />`
     - Retain stats display below divisor `<Text className="text-emerald-400 font-mono font-bold text-[8px] leading-tight">{min}min / {pts}pts</Text>`
2. **Update `TeamManagementPanel.tsx`**:
   - Apply the matching layout in bench player circles:
     - Jersey Number on top: `<Text className="text-amber-400 font-black text-sm leading-tight">#{player.number ?? "-"}</Text>`
     - Jersey Name / Fallback Name below the number: `<Text className="text-slate-200 font-semibold text-[8px] leading-tight text-center" numberOfLines={1}>{identifier}</Text>`
     - Divisor line and stats display.
3. **Verify `formatPlayerIdentifier.ts`**:
   - Ensure `formatPlayerIdentifier` consistently produces the name string (`jerseyName` -> `[First Initial]. [Last Name]` -> single name -> `"Jugador"`).
4. **Update Test Suites**:
   - Update `HalfCourtCanvas.test.tsx` to assert that both the jersey number (e.g., `#7`) and the jersey name (e.g., `SANCHEZ` or `G. Sanchez`) are rendered in court player circles.
   - Update `TeamManagementPanel.test.tsx` to assert that both the jersey number and jersey name/fallback are rendered in bench player circles.

**Files likely to change**:
- `src/features/play-match/components/HalfCourtCanvas.tsx`
- `src/features/play-match/components/TeamManagementPanel.tsx`
- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx`
- `src/features/play-match/__tests__/components/TeamManagementPanel.test.tsx`

**Tests to add or update**:
- `HalfCourtCanvas.test.tsx`: Verify player circle renders `#{player.number}` and `jerseyName` when present, or `#{player.number}` and `[First Initial]. [Last Name]` when `jerseyName` is absent.
- `TeamManagementPanel.test.tsx`: Verify bench player circle renders `#{player.number}` and `jerseyName` when present, or `#{player.number}` and `[First Initial]. [Last Name]` when `jerseyName` is absent.

## Risks & Considerations

- **Badge layout space (80x80 circle)**: The circle diameter is 80px (`w-20 h-20`). Stacking the number (e.g. `text-sm`, line height tight), the name (e.g. `text-[8px]`, line height tight, `numberOfLines={1}`), the divisor line (`my-0.5`), and the stats (`text-[8px]`) fits comfortably within the circle without clipping.

## Open Questions

- None. Requirements are clear and explicit: show both number and jersey name, with number above the jersey name.
