---
title: "TeamListPage (LandingPage)"
status: IMPLEMENTED # DRAFT | APPROVED | IMPLEMENTED
author: "Patrick.JS"
---

## Resources
- **Team Model:** [Team](src/models/Team.ts)
- **Database Connection:** [AppDataSource](src/utils/Database.ts)

## Overview
As a user using the app, I MUST see a list of teams I have created. I MUST be able to select a team and navigate to the Manager Page.

## Components Structure
* **TeamListPage (Landing Page):**
    * *Header:* Align top-center with h1 text "Select Your Team to Manage"
    * *Body:* Flex-1, Flatlist with vertical scroll of TeamCard items. Margin bottom 10px.
        - *Loading State:* Display ActivityIndicator spinner while `isLoading` is true.
        - *Error State:* Display error message banner with "Retry" button if fetching fails.
        - *Empty State:* Display text "No teams created" when team list is empty.
        - *TeamCard:* border-1, rounded-lg. Two-column grid. OnClick function -> navigate to TeamManagerPage Component with prop `teamId={team.id}`
            * Column 1: 
                - Row 1: Team Name with h2 text.
                - Row 2: W-full, flex-row, justify-between.
                    * Left: Win/Lost record formatted as `${wins}W - ${losses}L` in paragraph.
                    * Right: Total players formatted as `${totalPlayers} Players`.
            * Column 2:
                - Row 1: Edit Team Button with Pencil Icon. OnClick function -> navigate to TeamForm component with prop `team={team}`
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

* **DeleteModal (React Native Modal Component):**
    * *Props*: 
        - title: `string`
        - deleteFunction: `(teamId: string) => Promise<void>`
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
- **Given** user opens app and is on landing page, **When** there are teams created, **Then** user should see an alphabetically sorted list of teams (ordered alphabetically by `name` via repository query).
- **Given** user is on landing page, **When** user clicks on a team card, **Then** user should navigate to the Manager Page passing the `teamId`.
- **Given** user is on landing page, **When** user clicks on the edit button, **Then** user should navigate to the TeamForm component with the selected team object.
- **Given** user is on landing page, **When** user clicks on the delete button, **Then** user should open the DeleteModal component.
- **Given** user with DeleteModal open, **When** user clicks on the cancel button, **Then** user should close the modal.
- **Given** user with DeleteModal open, **When** user clicks on the delete button, **Then** user should delete the team, refresh the list state, and close the modal.

## Use Cases
- **UC-001:** User creates a new team.
- **UC-002:** User edits an existing team.
- **UC-003:** User deletes a team.
- **UC-004:** User views the list of teams.
- **UC-005:** User navigates to the Manager Page with the selected team ID.

## Schema Validation Rules (Zod)
Domain and form validations are enforced via Zod (`src/schemas/team.schema.ts`):

```typescript
import { z } from 'zod';

export const TeamSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .trim()
    .min(3, { message: "Team name must be at least 3 characters long." })
    .max(20, { message: "Team name must be at most 20 characters long." }),
  wins: z.number().int().nonnegative().default(0),
  losses: z.number().int().nonnegative().default(0),
  totalPlayers: z.number().int().nonnegative().default(0),
});

export type TeamInput = z.infer<typeof TeamSchema>;

```

## Controllers and Repositories.
* **TeamRepository:**
    * `getAllTeams(): Promise<Team[]>`
    * `getTeamById(id: string): Promise<Team | null>`
    * `createTeam(team: Team): Promise<Team>`
    * `updateTeam(team: Team): Promise<Team>`
    * `deleteTeam(id: string): Promise<void>`
* **TeamService:**
    * `getAllTeams(): Promise<Team[]>`
    * `getTeamById(id: string): Promise<Team | null>`
    * `createTeam(team: Team): Promise<Team>`
    * `updateTeam(team: Team): Promise<Team>`
    * `deleteTeam(id: string): Promise<void>`



## Routing and Navigation
Creat at RootStack navigation in `src/routes/AppRoute.tsx` and import it into `App.tsx`
- All screens component must have `headerShown: false` in options.

* **Example:**
    ```typescript
    import {createStaticNavigation} from '@react-navigation/native';
    import {createNativeStackNavigator} from '@react-navigation/native-stack';

    const RootStack = createNativeStackNavigator({
        screens: {
            TeamListPage: { screen: TeamListPage, options: { headerShown: false } },
            TeamForm: { screen: TeamForm, options: { headerShown: false } },
            TeamManagerPage: { screen: TeamManagerPage, options: { headerShown: false } },
        },
    });

    export const Navigation = createStaticNavigation(RootStack);

    ```

## Data Workflow & State Pipeline
* **TeamListPage Mount:**
  1. Component triggers `loadTeams()` on mount.
  2. Call `TeamService.getAllTeams()`.
  3. Service invokes `TeamRepository.find({ order: { name: 'ASC' } })`.
  4. On Success: Update `teams` state.
  5. On Error: Set `error` state and render Error Banner with retry option.

* **TeamForm Submit:**
  1. Validate payload using `TeamSchema.parse(formData)`.
  2. If `id` exists: Call `TeamService.updateTeam(id, data)`.
  3. If `id` is missing: Call `TeamService.createTeam(data)`.
  4. Service persists via `TeamRepository.save()`.
  5. On Success: Navigate back to `TeamListPage` and trigger list refresh.

* **DeleteModal `deleteTeamById(teamId: string)`:**
  1. Call `teamService.deleteTeam(teamId)`.
  2. Service invokes `teamRepository.delete(teamId)`.
  3. On Success (void/boolean resolved): Close modal and trigger teams state update
  4. On Error: Display error and keep modal open.

## Database Setup with TypeORM and SQLite
### 1. Database Connection Module (`database.ts`)

Create a dedicated connection module that initializes `AppDataSource` and exports a utility function to ensure the database connects safely before any queries run.

```typescript
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Team } from "./models/Team"; // Import your entity models here

export const AppDataSource = new DataSource({
  type: "react-native",
  database: "app.db",
  location: "default",
  synchronize: true, // Automatically creates/updates tables in dev mode
  logging: true,
  entities: [Team],  // Add all TypeORM models here
});

// Singleton initializer to prevent multi-connection race conditions
let isInitializing = false;

export const initializeDatabase = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (!isInitializing) {
    isInitializing = true;
    try {
      await AppDataSource.initialize();
      console.log("SQLite Database initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize SQLite Database:", error);
      throw error;
    } finally {
      isInitializing = false;
    }
  }

  return AppDataSource;
};

```

---

### 2. App Bootstrapping (`App.tsx`)

Block rendering of the application until SQLite finishes setting up tables and connections.

```tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { initializeDatabase } from "./database";
import { Navigation } from "./src/routes/AppRoute";

export default function App() {
  const [dbReady, setDbReady] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        setInitError("Failed to initialize storage.");
      }
    };

    setup();
  }, []);

  if (initError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{initError}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing Database...</Text>
      </View>
    );
  }

  return <Navigation />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { color: "red", fontSize: 16 },
});

```

### Key Rules for React Native SQLite Setup

* **App Entry Gate:** Always initialize the database before loading the main navigation or views to avoid running queries on an uninitialized driver.
* **Dev vs. Production:** Keep `synchronize: true` for development. In production, switch to database **Migrations** (`synchronize: false`) so user data isn't lost during app updates.
* **Entities Array:** Every model (`User`, `Post`, etc.) must be listed in `entities: [...]` inside your `DataSource` config so TypeORM creates the underlying SQLite tables.