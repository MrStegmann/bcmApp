<!--
CONSTITUTION SYNC IMPACT REPORT
Version change: Initial Template -> 1.0.0
Modified principles:
- Formalized Principle I: Test-Driven Development First (Jest)
- Formalized Principle II: Feature-Based Architecture Pattern
- Formalized Principle III: Type-Safe Local Persistence (Drizzle ORM & expo-sqlite)
- Formalized Principle IV: Predictable State Management (Zustand)
- Formalized Principle V: Utility-First Mobile Styling (NativeWind)
- Formalized Principle VI: Strict TypeScript & Type Safety
Added sections:
- Tech Stack & Architectural Standards
- Development & Quality Workflow
- Governance
Removed sections: None (Replaced template placeholders)
Follow-up TODOs: None
-->

# BasketApp (bcmApp) Constitution

## Core Principles

### I. Test-Driven Development First (NON-NEGOTIABLE)
All business logic, state store transitions, database operations, and core UI components MUST be developed using Test-Driven Development (TDD). Tests MUST be written using **Jest** (and React Native Testing Library for UI components) prior to implementation code.
- **Red-Green-Refactor Cycle**: Write a failing test asserting the expected behavior, implement the minimal code required to pass the test, and then refactor safely.
- **Test Coverage & Quality**: Code submissions without corresponding tests asserting both happy paths and edge cases will be rejected.
- **Rationale**: TDD enforces clear interface boundaries, reduces runtime regression risks across iOS and Android environments, and guarantees long-term maintainability.

### II. Feature-Based Architecture Pattern
The application codebase MUST be organized by self-contained domain features (`src/features/<feature-name>/`) rather than technical role folders.
- **Encapsulation**: Each feature directory contains its own UI components, hooks, Zustand stores, Drizzle schemas, and test suites.
- **Explicit Exports**: Features expose their public interface via `index.ts` barrel exports. Cross-feature internal imports are prohibited.
- **Shared Infrastructure**: Common utilities, shared primitive UI components, and global base configs reside in `src/core/` or `src/shared/`.
- **Rationale**: Feature-based modularity isolates changes, prevents spaghetti dependencies, and enables parallel development.

### III. Type-Safe Local Persistence with Drizzle ORM & Expo SQLite
Local relational database persistence MUST use **Drizzle ORM** paired with **expo-sqlite** on the Expo React Native runtime.
- **Type Safety**: All database schemas, relations, queries, and mutations MUST leverage Drizzle type inference (`$inferSelect`, `$inferInsert`, `$type<>`). Raw untyped SQL strings are forbidden.
- **Integrity & Migrations**: Schema alterations MUST be executed through managed Drizzle Kit migrations. Foreign key constraints and SQLite WAL pragmas must be explicitly configured.
- **Rationale**: Eliminates runtime database errors, protects data integrity, and yields optimal query execution speeds on mobile devices.

### IV. Predictable State Management with Zustand
Client-side global state and transient UI states MUST be managed via focused **Zustand** stores.
- **Store Cohesion**: Create small, domain-specific stores per feature rather than a monolithic global store.
- **Immutability & Testing**: Store state transitions must be immutable, side-effect free in selectors, and straightforwardly unit-testable in isolation without React Context wrappers.
- **Rationale**: Zustand provides minimal boilerplate, atomic component re-renders, and fast, synchronous state testability.

### V. Utility-First Mobile Styling with NativeWind
All component layout and styling MUST use **NativeWind** (Tailwind CSS for React Native) utility classes via `className` props.
- **Consistency**: Styling must rely on centralized design tokens defined in `tailwind.config.js`.
- **Restricted Stylesheets**: Use of React Native `StyleSheet.create` or inline `style={{ ... }}` objects is forbidden unless required for dynamic runtime animations or unsupported third-party component interfaces.
- **Rationale**: Keeps visual aesthetics unified, speeds up mobile UI iteration, and ensures responsive cross-device consistency.

### VI. Strict TypeScript & Type Safety
The codebase strictly requires **TypeScript** with strict mode enabled (`noImplicitAny`, `strictNullChecks`, `exactOptionalPropertyTypes`).
- **No Implicit `any`**: Explicitly specify types for all props, functions, data models, and API/DB responses. The `any` type is strictly disallowed unless third-party library constraints make it impossible.
- **Rationale**: Catches type errors at build time, unlocks superior IDE autocomplete, and enforces strict contracts across team workflows.

## Tech Stack & Architectural Standards

- **Runtime & Mobile Platform**: React Native (v0.86+) & Expo (v57+) managed workflow.
- **Persistence Engine**: Expo SQLite (`expo-sqlite`) with Drizzle ORM (`drizzle-orm`).
- **State Layer**: Zustand for predictable, store-based state management.
- **Styling Framework**: NativeWind CSS utility engine.
- **Testing Engine**: Jest test runner with React Native Testing Library.
- **Language**: TypeScript with strict compiler options.

## Development & Quality Workflow

1. **Feature Specification**: Define feature scope, specs, and tasks prior to writing code.
2. **TDD Implementation**:
   - Write unit tests in `__tests__` or `*.test.ts(x)` co-located with the feature.
   - Run Jest to confirm test failure (`RED`).
   - Implement implementation logic until tests pass (`GREEN`).
   - Refactor code and schemas for readability and performance (`REFACTOR`).
3. **Code Review & Quality Gates**: All code changes must pass TypeScript checks (`tsc --noEmit`), linting rules, and 100% of Jest test suites before merge.

## Governance

- **Supremacy**: This Constitution supersedes all informal team habits, unwritten rules, and ad-hoc practices.
- **Amendments**: Amendments require explicit proposal, rationale review, version incrementing, and unanimous approval by the engineering team.
- **Versioning Policy**:
  - **MAJOR**: Breaking changes to architectural rules, removing principles, or introducing incompatible frameworks.
  - **MINOR**: Adding new principles, tech stack expansions, or non-breaking workflow shifts.
  - **PATCH**: Wording improvements, clarification of rules, or documentation adjustments.
- **Compliance**: PRs and automated CI checks must verify adherence to TDD, TypeScript strictness, NativeWind styling, and feature encapsulation.

**Version**: 1.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-09-27
