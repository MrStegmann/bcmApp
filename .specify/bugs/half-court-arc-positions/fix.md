# Bug Fix: Half-Court 3-Point Arc Alignment and Radial Position Calibration

- **Slug**: half-court-arc-positions
- **Fixed**: 2026-10-25
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Corrected the horizontal offset collision and calibrated radial coordinates for the 5 court player slots so that Center, Wings, and Corners sit along the outer perimeter of the 3-point arc with exact horizontal alignment, bilateral symmetry across the hoop/paint axis, and identical adjacent Euclidean spacing ($D = \sqrt{9760} \approx 98.79\text{dp}$).

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/play-match/utils/courtArcPositions.ts` | modified | Calibrated `COURT_ARC_POSITIONS` to outer perimeter geometry: Center $(0, 224)$, Wings $(\pm 92, 188)$, Corners $(\pm 128, 96)$ with strict adjacent Euclidean spacing $D = \sqrt{9760}$ |
| `src/features/play-match/components/HalfCourtCanvas.tsx` | modified | Replaced conflicting `left: "50%"` and negative `marginLeft` with parent `items-center` centering and `transform: [{ translateX: pos.xOffset }]`; anchored vertical placement directly to `top: pos.y - 35`; eliminated padding and `relative` positioning conflicts |
| `src/features/play-match/__tests__/utils/courtArcPositions.test.ts` | modified | Updated adjacent Euclidean distance assertion to $\sqrt{9760} \approx 98.79$ and verified touch target clearance ($> 15\text{dp}$) |
| `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx` | modified | Updated adjacent Euclidean distance assertion to $\sqrt{9760} \approx 98.79$ |

## Diff Highlights (optional)

```tsx
// Calibrated geometric anchors in src/features/play-match/utils/courtArcPositions.ts
export const ARC_RADIUS = 112;
export const ARC_CENTER_Y = 84;

export const COURT_ARC_POSITIONS: CourtArcPosition[] = [
  { index: 0, role: "center", name: "Center", angleDeg: 90, xOffset: 0, y: 224 },
  { index: 1, role: "left-wing", name: "Left Wing", angleDeg: 135, xOffset: -92, y: 188 },
  { index: 2, role: "right-wing", name: "Right Wing", angleDeg: 45, xOffset: 92, y: 188 },
  { index: 3, role: "left-corner", name: "Left Corner", angleDeg: 180, xOffset: -128, y: 96 },
  { index: 4, role: "right-corner", name: "Right Corner", angleDeg: 0, xOffset: 128, y: 96 },
];
```

```tsx
// Robust horizontal centering and direct vertical anchoring in HalfCourtCanvas.tsx
const pos = COURT_ARC_POSITIONS.find((p) => p.index === index) || COURT_ARC_POSITIONS[index];
const positionStyle = {
  position: "absolute" as const,
  top: pos.y - 35,
  transform: [{ translateX: pos.xOffset }],
};
```

## Tests Added or Updated

- `src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx::should ensure identical Euclidean distances between adjacent arc positions (Corner-Wing-Center)` — Verifies all 4 adjacent intervals are strictly equal to $\sqrt{9760}$
- `src/features/play-match/__tests__/utils/courtArcPositions.test.ts::should guarantee identical Euclidean distances for all adjacent arc pairs (Corner-Wing-Center)` — Confirms exact distance equality across intervals
- `src/features/play-match/__tests__/utils/courtArcPositions.test.ts::should guarantee sufficient clearance between slot circles to prevent touch collisions` — Confirms edge-to-edge gap > 15dp between circles ($28.79\text{dp}$)

## Local Verification

- Commands run:
  - `npm test -- src/features/play-match` → 15 suites passed, 82 tests passed (1.25s)
  - `npm test` → 69 suites passed, 431 tests passed
- Direct emulator verification (`emulator-5554`):
  - Uiautomator inspection on live match screen confirmed horizontal center of Center slot (#44) at $X = 541\text{px}$ (matching hoop, key, and canvas center at $X = 540\text{px}$).
  - Bilateral symmetry verified: Left/Right Wings centered at $X = 264\text{px}$ and $X = 816\text{px}$ (equidistant from center: $\Delta X = 276\text{px}$); Left/Right Corners centered at $X = 156\text{px}$ and $X = 924\text{px}$ (equidistant from center: $\Delta X = 384\text{px}$).
  - Outer arc placement: Slots are positioned radially along the perimeter of the 3-point line without obscuring key paint elements.

## Deviations from Assessment

The assessment initially assumed coordinates on a $256 \times 224$ coordinate space. After factoring in NativeWind rem scaling and positioning requirements along the outer perimeter of the 3-point arc line, coordinates were calibrated to Center $(0, 224)$, Wings $(\pm 92, 188)$, and Corners $(\pm 128, 96)$. This achieves identical adjacent Euclidean spacing ($D = \sqrt{9760} \approx 98.79\text{dp}$) and guaranteed touch clearance ($28.79\text{dp} > 15\text{dp}$).

## Follow-ups

- None
