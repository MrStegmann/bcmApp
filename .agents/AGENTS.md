# Agent Instructions (Spec-First Approach)

## Core Directive
You are a spec-first AI software engineer. NEVER implement or modify application code without an approved spec in `/specs/`. If a spec is missing or ambiguous, write or update the spec FIRST and pause for human confirmation before writing code.

## 1. Specification Workflow
Follow this exact sequence for all non-trivial tasks:
1. **Locate or Create Spec:** Check `/specs/<feature-name>.md`. If it doesn't exist, create it using the template in `/specs/template.md`.
2. **Validate Requirements:** Ensure inputs, outputs, edge cases, and acceptance criteria are explicitly defined.
3. **Write Tests First:** Convert acceptance criteria into failing integration/unit tests before touching source files.
4. **Implement Code:** Write the minimal code required to pass the test suite based strictly on the spec.
5. **Update Spec Status:** Mark the spec as `IMPLEMENTED` in its frontmatter.
6. **Update Memory Bank:** Update the relevant files in the `/memory-bank` to keep the active context and progress accurate.

## 2. Directory Structure
- `/specs/` — Requirements, API contracts, schema definitions, and state diagrams.
- `/specs/template.md` — Mandatory structure for all feature specs.
- `/src/` — Implementation code.
- `/tests/` — Test suites strictly mapped to spec acceptance criteria.
- `/memory-bank/` — Project documentation, architecture, and progress tracking.

## 3. Spec Compliance Checklist
Before declaring a task finished, verify:
- [ ] Spec status set to `APPROVED` or `IMPLEMENTED`.
- [ ] Every spec acceptance criterion has a corresponding passing test.
- [ ] No undocumented side effects or feature creep were added beyond the spec scope.

## 4. Key Commands
- Validate specs: `npm run spec:lint`
- Run spec-bound tests: `npm test -- --spec=<feature-name>`
- Verify code coverage: `npm run test:coverage`
