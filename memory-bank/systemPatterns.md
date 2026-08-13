# System Patterns

The application follows a modular architecture separating concerns into distinct layers:

## Architecture & Data Flow
- **Entry Point (`App.js`)**: Wraps the application with necessary providers, such as `SafeAreaView` and the central `DBProvider`.
- **Database Context (`src/context/DBProvider.jsx`)**: Acts as the centralized database manager. It initializes the SQLite database schema and exposes various controllers (e.g., `TeamController`, `PlayerController`) via the React Context API to the rest of the application.

## Data Layer
- **Models (`src/models/`)**: Encapsulates the logic for creating tables and executing raw SQL operations for each entity (e.g., `Team.js`, `Player.js`, `Game.js`).
- **Data Transfer Objects (`src/dtos/`)**: Handles complex queries that require joining multiple tables, shaping the data for the UI (e.g., `GamePlayerDTO.js`, `PlayersStatsDTO.js`).

## State Management
- **Local State**: Managed at the component level.
- **Global UI State (`src/store/`)**: Zustand stores are used to handle global transient UI state, such as alerts (`AlertStore.js`) and navigation/menu state (`MenuStore.js`).

## UI Layer
- **Pages (`src/page/`)**: Main screen components representing different feature views (e.g., `ClubManage.jsx`, `PlayerList.jsx`, `GameList.jsx`, `TrainingList.jsx`). Note: Many existing pages are currently marked as `@deprecated` due to styling refactoring.
- **Components (`src/components/`, `src/framework/`)**: Reusable UI components. Note: Legacy components relying on Tailwind are marked as `@deprecated`.
