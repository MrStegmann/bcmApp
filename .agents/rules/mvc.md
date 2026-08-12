# MVC Architecture Rule

## Core Directive
All new features and refactoring tasks in this project must strictly adhere to the Model-View-Controller (MVC) architectural pattern as adapted for our React Native application. Do not mix business logic, database queries, and UI rendering in the same file.

## 1. Models (`/src/models/` & `/src/dtos/`)
- **Responsibility:** Data access, schema definition, and raw SQL queries.
- **Rule:** Models must be the *only* place where `expo-sqlite` queries (e.g., `SELECT`, `INSERT`, `UPDATE`, `DELETE`) are executed.
- **Rule:** Do not import UI components or React hooks (like `useState`, `useEffect`) into models.
- **DTOs (`/src/dtos/`):** Use Data Transfer Objects when a View requires data aggregated from multiple Models. DTOs should handle complex SQL `JOIN` operations.

## 2. Views (`/src/page/` and `/src/components/`)
- **Responsibility:** UI rendering and capturing user interactions.
- **Rule:** Views must remain "dumb" regarding data persistence. They should not contain direct SQLite queries.
- **Rule:** Views must interact with Models exclusively through Controllers provided via Context or hooks.
- **Rule:** Transient UI state (e.g., loading spinners, alerts, active tabs) should be handled via local state or Zustand (`/src/store/`).

## 3. Controllers (`/src/controllers/` or via Context `DBProvider.jsx`)
- **Responsibility:** Business logic, orchestrating Models, and providing data to Views.
- **Rule:** Controllers act as the bridge between Views and Models. They should handle complex business operations, error handling, and state transformations before passing data to the UI.
- **Rule:** Views should call Controller methods (e.g., `TeamController.add(name)`) instead of interacting with `TeamModel` directly.

## Enforcement Checklist
Before completing a task, verify:
- [ ] No SQL queries exist in the `/src/page/` or `/src/components/` directories.
- [ ] Complex business logic has been extracted from UI components into Controllers.
- [ ] Database interactions are strictly contained within `/src/models/` and `/src/dtos/`.
