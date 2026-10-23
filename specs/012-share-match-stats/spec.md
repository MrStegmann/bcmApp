# Feature Specification: Share Match Stats Graphic & Export

**Feature Branch**: `012-share-match-stats`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "The task is to create a new button inside Math Detail View Page to share the data from the selected match. It shall create a PNG image with a list of the players as a registre, and each column is the individual player stats, also the date, team and rival name, the result by period and total and the advanced stats (use image as a reference). This image can be saved or shared by whatsapp."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Match Summary PNG Graphic Generation (Priority: P1)

As a coach, team manager, or statistician, I want to generate a structured, high-resolution PNG image containing complete match data formatted as a box score sheet matching the reference graphic, so that I have a clean visual summary ready to archive and share with the team.

**Why this priority**: The core value of this feature is producing the visual summary graphic containing the match metadata, player roster statistics, period breakdowns, and advanced efficiency metrics.

**Independent Test**: Can be tested independently by taking a completed match with recorded player statistics, triggering the generation utility, and validating that the resulting PNG graphic contains all required data points, correct calculations, clean alignment, and zero visual overlapping.

**Acceptance Scenarios**:

1. **Given** a finished match with recorded player and team data, **When** the image generation is triggered, **Then** a high-resolution PNG image is produced containing:
   - **Header Bar**:
     - Home team name ("Equipo")
     - Rival team name ("Rival")
     - Match round and date ("Jornada y Fecha")
   - **Player Statistics Table**:
     - One row per rostered player with columns: Jersey Number (`Núm.`), Player Name (`Nombre`), Minutes (`Min`), Points (`Pts`), 2-point makes (`T2A`), 2-point attempts (`T2I`), 2-point percentage (`T2%`), 3-point makes (`T3A`), 3-point attempts (`T3I`), 3-point percentage (`T3%`), 1-point free throw makes (`T1A`), 1-point free throw attempts (`T1I`), free throw percentage (`T1%`), Defensive Rebounds (`DReb`), Offensive Rebounds (`OReb`), Total Rebounds (`TReb`), Assists (`Asis`), Steals (`Rec`), Turnovers (`Per`), Blocks in favor (`TapF`), Blocks against (`TapC`), Personal Fouls committed (`Falt`), Fouls received (`FaltR`), and Valuation (`Val`).
   - **Team Totals Row ("EQUIPO")**:
     - Aggregated team sum for every column, including calculated collective shooting percentages and total valuation.
   - **Advanced Stats Section (lower-left block)**:
     - Table listing: `Posesiones`, `OER`, `DER*`, `eFG%`, `ORB%*`, `AST%`, `TOV%`, and `TLR%` (Free Throw Rate).
   - **Period Score Breakdown ("Parciales" lower-center/right block)**:
     - Three-column table with headers: `Equipo`, Period label, `Rival`.
     - Individual rows for `C1`, `C2`, `C3`, `C4`, `Extra` (if applicable), and `Final` with cumulative final scores for both teams.
2. **Given** any shooting stat with zero attempts (e.g., 0/0 for 3-pointers or free throws), **When** computing percentage columns (`T2%`, `T3%`, `T1%`), **Then** the graphic renders `0%` or `-` without generating `NaN` or unhandled errors.
3. **Given** a player who did not play or has 0 minutes, **When** rendered in the player table, **Then** all numeric values display as `0` and their entry is cleanly formatted without breaking table grid lines.

---

### User Story 2 - Match Detail View Action Integration (Priority: P1)

As a user inspecting a completed match in the Match Detail View, I want to see an accessible "Share Stats" button in the view header or action bar, so that I can easily initiate the export flow without leaving the match details screen.

**Why this priority**: Users need an intuitive and consistent entry point inside the existing Match Detail View to invoke the sharing process.

**Independent Test**: Can be tested independently by navigating to the Match Detail View for a finished match, verifying that the Share Stats button is visible with an appropriate icon and label, and tapping it to observe the export workflow initiation.

**Acceptance Scenarios**:

1. **Given** a user is viewing a finished match on the Match Detail View, **When** the page renders, **Then** a visible "Share Stats" action button with a share icon is positioned in the view header or primary action bar.
2. **Given** the user taps the "Share Stats" button, **When** processing begins, **Then** an immediate visual progress/loading state informs the user that the image graphic is being generated.
3. **Given** a match in progress or pending status, **When** viewed, **Then** the Share Stats button is either hidden or disabled until the match has been marked as finished.

---

### User Story 3 - Save Image to Device & Native Sharing / WhatsApp (Priority: P2)

As a coach or team representative, I want to save the generated match graphic directly to my device storage or dispatch it directly to WhatsApp and other communication apps via the system share sheet, so that team stakeholders receive game stats immediately after the game.

**Why this priority**: Generating an image is only useful if the user can effortlessly store it locally or distribute it via modern messaging channels like WhatsApp.

**Independent Test**: Can be tested independently by tapping the export options, verifying that saving to storage downloads/saves a valid PNG file to the device gallery or filesystem, and verifying that selecting share triggers the platform share dialog with the PNG file attached.

**Acceptance Scenarios**:

1. **Given** a successfully generated PNG graphic, **When** the user selects the "Save" action, **Then** the image file is saved to the device's local photo library or download directory, accompanied by a clear confirmation toast or alert.
2. **Given** a successfully generated PNG graphic, **When** the user selects the "Share" action, **Then** the platform's native share sheet is launched with the PNG file attached as the shared document.
3. **Given** WhatsApp is installed on the device, **When** the user selects WhatsApp from the native share sheet or taps a dedicated WhatsApp sharing trigger, **Then** WhatsApp opens with the PNG image pre-attached and ready to select recipients.
4. **Given** the user denies photo library or storage permissions during a save attempt, **When** the permission error occurs, **Then** the application displays a friendly notification explaining that storage permission is needed to save the image.

---

### Edge Cases

- **Long Team Names or Rival Names**: Extremely long team or rival names must scale or truncate cleanly within their designated header boxes without overlapping the round/date box.
- **Large Roster Sizes**: Teams with more than 12–15 players must have their rows dynamically sized or arranged so that the total sheet fits within the generated PNG dimensions without vertical clipping.
- **Overtime vs Regular Games**: If the match concluded in regular time (4 periods), the `Extra` row in `Parciales` displays `0` - `0` or only shows regular periods with `Final` totals, keeping the box compact and accurate.
- **Zero Possessions / Incomplete Stats**: If advanced stat formulas encounter zero denominators, all values gracefully display `0.0` or `0.0%` rather than crashing the rendering engine.
- **Untracked Statistical Columns**: Columns shown in the reference template that may not have active live tracking in current match records (such as `TapF`, `TapC`, `FaltR`) safely default to `0` or `-` to maintain exact template column alignment.
- **Offline Device Operation**: Generation and local saving must function without active internet connectivity.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a "Share Stats" button in the Match Detail View header or action bar for all finished matches.
- **FR-002**: System MUST render a visual loading indicator while the match summary graphic is being generated.
- **FR-003**: System MUST compile match metadata into the header section of the graphic:
  - Home Team Name (`Equipo`)
  - Rival Team Name (`Rival`)
  - Round and Date (`Jornada y Fecha`)
- **FR-004**: System MUST render a player registry table in the generated graphic displaying each called-up player on a separate row with columns matching the reference template:
  - `Núm.` (Jersey Number)
  - `Nombre` (First and Last Name)
  - `Min` (Minutes Played)
  - `Pts` (Total Points Scored)
  - `T2A` (2-Point Field Goals Made)
  - `T2I` (2-Point Field Goals Attempted)
  - `T2%` (2-Point Field Goal Percentage)
  - `T3A` (3-Point Field Goals Made)
  - `T3I` (3-Point Field Goals Attempted)
  - `T3%` (3-Point Field Goal Percentage)
  - `T1A` (Free Throws Made)
  - `T1I` (Free Throws Attempted)
  - `T1%` (Free Throw Percentage)
  - `DReb` (Defensive Rebounds)
  - `OReb` (Offensive Rebounds)
  - `TReb` (Total Rebounds = Defensive + Offensive)
  - `Asis` (Assists)
  - `Rec` (Steals)
  - `Per` (Turnovers / Ball Lost)
  - `TapF` (Blocks in Favor)
  - `TapC` (Blocks Against)
  - `Falt` (Personal Fouls Committed)
  - `FaltR` (Fouls Received)
  - `Val` (Player Valuation Score)
- **FR-005**: System MUST compute and render a bottom `EQUIPO` summary row aggregating all player statistics and computing overall team shooting percentages.
- **FR-006**: System MUST render an Advanced Statistics summary box in the lower-left section of the graphic displaying the 8 team metrics:
  - `Posesiones`
  - `OER`
  - `DER*`
  - `eFG%`
  - `ORB%*`
  - `AST%`
  - `TOV%`
  - `TLR%`
- **FR-007**: System MUST render a `Parciales` summary box in the lower section displaying quarter-by-quarter points for both teams (`C1`, `C2`, `C3`, `C4`, `Extra` when played, and `Final` total).
- **FR-008**: System MUST style the generated graphic with a crisp, high-contrast theme featuring distinct table headers, subtle row borders, and shaded highlight columns (e.g., shaded `Pts`, `TReb`, `Val`, and percentage columns) matching the reference design layout.
- **FR-009**: System MUST output the graphic as a standard, uncompressed or high-quality PNG image file.
- **FR-010**: System MUST provide an action to save the generated PNG image directly to the user's local device storage or photo gallery.
- **FR-011**: System MUST provide an action to open the platform's native share sheet with the generated PNG file attached, enabling direct sharing to WhatsApp and other messaging applications.
- **FR-012**: System MUST display informative user feedback upon successful save or share completion, as well as clear error messaging if generation or sharing fails.
- **FR-013**: System MUST protect all division calculations (percentages and advanced efficiency ratios) against zero denominators, defaulting safely to `0%` or `0.0`.

### Key Entities

- **Match Share Graphic**: Represents the compiled visual document containing the match header, player table, totals row, advanced stats table, and period breakdown table ready for PNG export.
- **Player Box Score Row**: Data entity containing the individual player's jersey number, display name, minutes, shooting breakdown (1pt, 2pt, 3pt makes and attempts), rebounds (offensive, defensive, total), assists, steals, turnovers, blocks, fouls (committed and received), and valuation.
- **Team Aggregate Box Score**: Calculated summary entity representing the sum of all individual player counts and collective team shooting percentages for the match.
- **Period Breakdown Entity**: Data entity containing the score pairs for each quarter (`C1` through `C4`, optional `Extra`, and `Final`) for both the home team and the rival team.
- **Advanced Efficiency Metrics Entity**: Calculated entity comprising the 8 advanced team efficiency ratings (`Posesiones`, `OER`, `DER*`, `eFG%`, `ORB%*`, `AST%`, `TOV%`, `TLR%`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Image generation completes and prepares the PNG file within 3 seconds of the user tapping "Share Stats".
- **SC-002**: 100% of data values in the generated PNG image (scores, player counts, totals, period breakdowns, and advanced metrics) strictly match the recorded match data in the application.
- **SC-003**: The exported PNG image has a minimum resolution sufficient for sharp text legibility on mobile and desktop displays without blurriness or compression artifacts (minimum width 1200px or 2x device scale).
- **SC-004**: 100% of players on the match roster are listed with zero text clipping, overlapping columns, or row truncation.
- **SC-005**: Users can complete saving the image to device storage or opening the share dialog in a single tap from the export prompt.
- **SC-006**: 0% application crashes or unhandled exceptions when generating graphics for games with zero stats or missing optional metrics.

## Assumptions

- The visual design of the generated PNG graphic strictly mirrors the tabular spreadsheet layout provided in the reference image (headers at top, player matrix in middle, team totals row, advanced stats block on bottom-left, and `Parciales` period block on bottom-right).
- For statistical columns present in the reference graphic template that are not actively tracked during live match play (such as `TapF`, `TapC`, and `FaltR`), the system will display default values of `0` or `-` to maintain complete structural symmetry with the template.
- `TLR%` in the advanced stats box corresponds to the Free Throw Rate (`FTR` = `100 * (T1A / (T2I + T3I))`).
- The date display format matches the application standard `"dd/mm/aaaa"`.
- Native sharing relies on standard OS sharing capabilities (iOS Share Sheet / Android Intent / Web Share API where supported), which includes WhatsApp when the app is installed on the user's device.
- Local saving requests user approval for photo/storage access if required by the operating system.
