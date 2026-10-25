# Bug Assessment: Half-Court Player Slots Positioned Outside 3-Point Arc

- **Slug**: half-court-arc-positions
- **Created**: 2026-10-25
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: medium

## Report (verbatim or summarized)

> "The 5 positions are perfectly setted over the 3-points line. No there need to be outside the 3-points arcs."

## Symptom

On the Play Match half-court canvas ([HalfCourtCanvas.tsx](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/components/HalfCourtCanvas.tsx)), the 5 court player slots currently have their centers anchored directly along the 3-point line arc ($R = 112\text{dp}$, $Y_{\text{center}} = 84\text{dp}$, apex $y = 196\text{dp}$). Consequently, the player slot circles straddle and obscure the 3-point line, whereas tactical basketball conventions and user requirements require the perimeter players to be stationed clearly outside the 3-point arc in 3-point territory.

## Reproduction

1. Launch the app on an Android device or emulator (`emulator-5554`) and navigate to the live match screen (`/match/:id/play`).
2. Populate the 5 court player slots on the half-court canvas.
3. Observe the placement of the 5 player slot circles relative to the visual 3-point arc line:
   - Center slot (#44) sits centered directly on top of the 3-point arc apex ($y = 196\text{dp}$), with half of the circular badge penetrating into the 2-point paint/key zone.
   - Left Wing and Right Wing slots sit centered directly along the diagonal curve of the 3-point line ($x = \pm 79\text{dp}, y = 163\text{dp}$).
   - Left Corner and Right Corner slots sit directly over the sideline 3-point vertical lines ($x = \pm 112\text{dp}, y = 84\text{dp}$).
   - All 5 player badges intersect and cover the 3-point boundary line rather than being positioned outside it.

## Suspected Code Paths

- [courtArcPositions.ts:10-54](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/utils/courtArcPositions.ts#L10-L54) — Defines `ARC_RADIUS = 112`, `ARC_CENTER_Y = 84`, and `COURT_ARC_POSITIONS` with exact coordinates placing slot centers on the 3-point line (Center at $(0, 196)$, Wings at $(\pm 79, 163)$, Corners at $(\pm 112, 84)$).
- [HalfCourtCanvas.tsx:41-45](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/components/HalfCourtCanvas.tsx#L41-L45) — Defines slot layout styling using `top: pos.y - 35` and `transform: [{ translateX: pos.xOffset }]`.
- [HalfCourtCanvas.tsx:131-135](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/components/HalfCourtCanvas.tsx#L131-L135) — Defines the visual 3-point arc dimension (`w-64 h-56 rounded-b-full border-2 border-slate-800/80`) inside a container of height `h-72`.
- [courtArcPositions.test.ts:63-86](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/__tests__/utils/courtArcPositions.test.ts#L63-L86) — Asserts Euclidean distance between adjacent arc pairs matches $\sqrt{7330}$.
- [HalfCourtCanvas.test.tsx:168-195](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx#L168-L195) — Asserts adjacent slot distance equality to $\sqrt{7330}$.

## Root Cause Hypothesis

The existing slot positions in `courtArcPositions.ts` were intentionally calibrated to align slot centers directly on top of the visual 3-point arc curve ($R = 112\text{dp}$). Because player slot badges are 80x80dp circles (radius $\approx 40\text{dp}$), placing the slot center at $R = 112\text{dp}$ causes the inner $40\text{dp}$ of each circle to sit inside the 3-point line. To place the badges outside the 3-point arc, slot radial distances must be adjusted outward beyond the 3-point boundary (or the visual 3-point arc slightly proportioned relative to the canvas boundary) so that player badges reside in outer 3-point space without crossing the line.

Confidence: high.

## Proposed Remediation

**Preferred**:
1. Recalibrate `COURT_ARC_POSITIONS` in `src/features/play-match/utils/courtArcPositions.ts` with an outward radial offset relative to the 3-point arc:
   - For a 3-point arc with radius $R_{\text{arc}} \approx 100\text{--}112\text{dp}$, position the slot anchors at an expanded radius (or adjust both the visual arc and slot coordinates) so slot centers sit outside the 3-point line:
     - **Center**: $x = 0$, $y$ positioned beyond the arc apex (e.g. $y \approx 220\text{--}235\text{dp}$, providing clear separation between the bottom of the 3-point arc and the top of the key).
     - **Left & Right Wings**: $x = \pm 88\text{--}96\text{dp}$, $y \approx 175\text{--}185\text{dp}$ (radially outside the curved arc).
     - **Left & Right Corners**: $x = \pm 124\text{--}130\text{dp}$, $y \approx 84\text{--}96\text{dp}$ (outside the vertical baseline straight lines).
2. If necessary, adjust the visual arc in `HalfCourtCanvas.tsx` (e.g., from `w-64 h-56` to `w-56 h-48` or `w-60 h-50`) so that the visual 3-point line has comfortable breathing room inside the canvas, allowing the player slots to be stationed entirely outside the arc without clipping against the outer canvas boundaries (`h-72`).
3. Maintain:
   - Strict bilateral symmetry across the vertical hoop axis ($X_{\text{left}} = -X_{\text{right}}$).
   - Uniform adjacent Euclidean spacing between consecutive slots (Corner-to-Wing == Wing-to-Center == Center-to-Wing == Wing-to-Corner).
   - Minimum edge-to-edge touch target clearance (> 15dp) between adjacent slots.
4. Update unit test assertions in `courtArcPositions.test.ts` and `HalfCourtCanvas.test.tsx` to match the newly calibrated distance and confirm that all positions reside outside the arc line.

**Alternatives**:
- Keep the visual arc at `w-64 h-56` and expand the canvas container to `h-80` to accommodate outer positioning below $y = 224\text{dp}$. However, this may alter screen proportions on smaller mobile displays; slightly compacting the court markings within the existing `h-72` canvas is less disruptive.

**Files likely to change**:
- [courtArcPositions.ts](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/utils/courtArcPositions.ts)
- [HalfCourtCanvas.tsx](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/components/HalfCourtCanvas.tsx)
- [courtArcPositions.test.ts](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/__tests__/utils/courtArcPositions.test.ts)
- [HalfCourtCanvas.test.tsx](file:///j:/GitHub/BasketApp/bcmApp/src/features/play-match/__tests__/components/HalfCourtCanvas.test.tsx)

**Tests to add or update**:
- `courtArcPositions.test.ts`: Update adjacent Euclidean distance assertion and verify touch clearance.
- `courtArcPositions.test.ts`: Verify that Center, Wings, and Corners have radial/orthogonal distances strictly greater than the 3-point arc boundary.
- `HalfCourtCanvas.test.tsx`: Update adjacent Euclidean distance assertion and slot ordering tests.

## Risks & Considerations

- **Canvas Boundary Clipping**: Moving slots outward risks clipping at the canvas sides ($X = \pm 140\text{dp}$) or bottom ($Y > 260\text{dp}$). Calibration must balance being clearly outside the 3-point line while remaining comfortably inside the canvas viewport.
- **Adjacent Slot Touch Overlap**: Expanding radially naturally increases circumference and adjacent distance, which actually improves touch target clearance between circles.

## Open Questions

- None. The requirement is unambiguous: move the 5 positions from straddling the 3-point line to sitting outside the 3-point arc.
