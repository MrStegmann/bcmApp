---
title: "Landing Page"
status: DRAFT # DRAFT | APPROVED | IMPLEMENTED
author: "Patrick.JS"
---

## Resources
- **Team Data Structure:** [Team](resources/TeamClass.ts)
- **Team Controller Structure:** [TeamController](resources/TeamController.ts)
- **Database Connection:** [AppDataSource](resources/Database.ts)

## Overview
As a user using the app, I MUST see a list of teams I have created. I MUST be able to select a team and navigate to the Manager Page.

## Components Structure
* **Landing Page (Team List selector):**
    * *Header:* Align top-center with h1 text "Select Your Team to Manage"
    * *Body:* Flex-1, Flatlist with vertical scroll of TeamCard items. Margin bottom 10px.
        - *Loading State:* Display ActivityIndicator spinner while `isLoading` is true.
        - *Error State:* Display error message banner with "Retry" button if fetching fails.
        - *Empty State:* Display text "No teams created" when team list is empty.
        - *TeamCard:* border-1, rounded-lg. Two-column grid. OnClick function -> navigate to TeamManagerPage Component
            * Column 1: 
                - Row 1: Team Name with h2 text.
                - Row 2: W-full, flex-row, justify-between.
                    * Left: Win/Lost record in paragraph.
                    * Right: Total players.
            * Column 2:
                - Row 1: Edit Team Button with Pencil Icon. OnClick function -> navigate to TeamForm component with prop Team={team}
                - Row 2: Delete Team Button with Trash Icon. OnClick function -> Open DeleteModal Component
    * *Footer:* Floating Add New Team Button with Plus Icon. Rounded-full. OnClick function -> navigate to TeamForm component without Team prop.

* **TeamForm Component:**
    * *Props*: 
        - team: `Team | null`
    * *Header:* Align top-center with h1 text ("Add New Team" or "Edit Team")
    * *Body:* flex-1, flex-col, justify-between. 
        * Input text field with label text ("Team Name").
        * Validation error feedback text under the input field.
    * *Footer:* 
        * Cancel Button with text ("Cancel"). OnClick function -> navigate back to Landing Page
        * Submit Button with text ("Save" or "Create"). Disabled during async submission. OnClick function -> validate via Zod schema, save/create team, invalidate cache/refresh state, and navigate back to Landing Page.

* **DeleteModal Component:**
    * *Props*: 
        - title: `string`
        - deleteFunction: `() => Promise<void>`
    * *Header:* Align top-center with h2 text `${title}`
    * *Body:* flex-1, flex-col, justify-between. 
        * Text paragraph with text `This action cannot be undone. Are you sure?`
    * *Footer:* 
        * Cancel Button with text ("Cancel"). OnClick function -> close the modal
        * Delete Button with text ("Delete"). Disabled during async execution. OnClick function -> trigger `deleteFunction`, refresh list state, and close modal.

## Behavior
- **Given** user opens app and is on landing page, **When** teams are loading, **Then** user should see a loading spinner.
- **Given** user opens app and is on landing page, **When** fetching teams fails, **Then** user should see an error state with a retry option.
- **Given** user opens app and is on landing page, **When** there are no teams created, **Then** user should see a message `No teams created`.
- **Given** user opens app and is on landing page, **When** there are teams created, **Then** user should see an alphabetically sorted list of teams.
- **Given** user is on landing page, **When** user clicks on a team card, **Then** user should navigate to the Manager Page with the selected team.
- **Given** user is on landing page, **When** user clicks on the edit button, **Then** user should navigate to the TeamForm component with the selected team.
- **Given** user is on landing page, **When** user clicks on the delete button, **Then** user should open the DeleteModal component.
- **Given** user with DeleteModal open, **When** user clicks on the cancel button, **Then** user should close the modal.
- **Given** user with DeleteModal open, **When** user clicks on the delete button, **Then** user should delete the team, refresh the list state, and close the modal.

## Use Cases
- **UC-001:** User creates a new team.
- **UC-002:** User edits an existing team.
- **UC-003:** User deletes a team.
- **UC-004:** User views the list of teams.
- **UC-005:** User navigates to the Manager Page with the selected team.

## Schema Validation Rules (Zod)
Domain and form validations are enforced via Zod (`src/schemas/team.schema.ts`):

```typescript
import { z } from 'zod';

export const TeamSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Team name must be at least 3 characters long." })
    .max(20, { message: "Team name must be at most 20 characters long." }),
});

export type TeamInput = z.infer<typeof TeamSchema>;

```

## Error Handling

* **TeamForm Error Handling:**
* Input team name < 3 characters: Display validation error "Team name must be at least 3 characters long."
* Input team name > 20 characters: Display validation error "Team name must be at most 20 characters long."
* Input team name already exists in database: Controller throws conflict exception, display "Team name already exists."
* Database write failure: Display banner error "Failed to save team. Please try again."


* **LandingPage Error Handling:**
* Fetch error on mount: Display banner error "Failed to load teams." with a "Retry" button.



## Structure & Architecture

* src/screens/
* LandingPage.tsx
* TeamManagerPage.tsx


* src/components/
* Team/
* TeamCard.tsx
* TeamForm.tsx


* DeleteModal.tsx


* src/controllers/
* TeamController.ts


* src/repositories/
* TeamRepository.ts


* src/models/
* Team.ts


* src/schemas/
* team.schema.ts


* src/utils/
* sorter.ts



## Diagram Workflow Legend

### Landing Page

* **View to Controller:** When `LandingPage.tsx` mounts (or receives navigation focus), it calls `TeamController.getTeams()`.
* **Controller Check:** `TeamController` ensures the database connection (`AppDataSource`) is active.
* **ORM Action:** The controller uses `TeamRepository` to execute a TypeORM fetch (`find()`).
* **SQL Translation:** TypeORM converts the call into SQLite SQL (`SELECT * FROM teams`).
* **Persistence Layer:** Native SQLite reads rows from `app.db`.
* **Entity Mapping:** TypeORM maps database rows back into `Team.ts` entities.
* **Data Return:** `Team[]` array is returned to the view.
* **UI Update:** View sets state, clearing loading spinners and re-rendering `FlatList`.

### TeamForm Page

* **Validation & View to Controller:** Form inputs are validated against `TeamSchema`. On success, `TeamForm` calls `TeamController.saveTeam()`.
* **Controller Check:** `TeamController` verifies `AppDataSource` status and checks for unique team name conflicts.
* **ORM Action:** Controller executes `TeamRepository.save()`.
* **SQL Translation:** TypeORM converts the operation to SQLite SQL (`INSERT` or `UPDATE`).
* **Persistence Layer:** Native SQLite writes to `app.db`.
* **Data Return & Refresh:** On successful response, navigation returns to `LandingPage` and triggers cache refresh/re-fetch.

### DeleteModal

* **View to Controller:** `DeleteModal` calls `TeamController.deleteTeam(id)`.
* **ORM Action:** Controller uses `TeamRepository.delete()`.
* **SQL Translation:** TypeORM converts to SQLite SQL (`DELETE FROM teams WHERE id = ?`).
* **Persistence Layer:** Native SQLite removes the record.
* **Data Return & Refresh:** Modal closes, and list state is refreshed on the parent view.

## Landing Page Functions

* **fetchTeams Function:**
* Sets `isLoading` state to `true`.
* Calls `TeamController.getTeams()`.
* Updates `teams` state and sets `isLoading` to `false`.
* Catches errors and updates `error` state.


* **create/update Teams Function:**
* Validates input with `TeamSchema`.
* Calls `TeamController.saveTeam()`.
* Refreshes list state upon completion.


* **deleteTeam Function:**
* Calls `TeamController.deleteTeam()`.
* Refreshes list state upon completion.



## Testing

* **Unit Tests (Controller & Model):** Run in pure Node using an in-memory SQLite database (`:memory:`). Tests SQL mapping, unique constraints, and controller logic.
* **Validation Tests:** Run isolated unit tests on `TeamSchema` against edge-case input strings.
* **Component Tests (View):** Run using React Native Testing Library. Mocks `TeamController` to test loading indicators, empty states, error banners, and form interaction behavior.

## Acceptance Criteria

* [ ] LandingPage
* [ ] Display loading spinner while fetching teams
* [ ] Display error message and retry button on fetch failure
* [ ] Display list of teams when data is present
* [ ] Display "No teams created" when there are no teams
* [ ] Display alphabetically sorted list of teams
* [ ] User can navigate to Team Manager Page with the selected team
* [ ] User can edit the selected team
* [ ] User can delete the selected team


* [ ] TeamForm
* [ ] Display form for creating/editing a team
* [ ] Validate team name length via Zod schema (3–20 chars)
* [ ] Display inline error message when team name validation fails
* [ ] Display error message when team name already exists
* [ ] User can save the team and trigger list refresh
* [ ] User can cancel the form


* [ ] DeleteModal
* [ ] Display confirmation message when deleting a team
* [ ] Disable buttons while deletion request is in-flight
* [ ] User can cancel deletion
* [ ] User can confirm deletion and trigger list refresh
