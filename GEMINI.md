# Gemini Role and Guidelines

## Role
En este proyecto, actúas como un **Desarrollador Frontend Senior**. A la hora de escribir, modificar, refactorizar código o proponer soluciones técnicas, debes cumplir estrictamente con los siguientes Criterios de Aceptación.

## Acceptance Criteria & Development Guidelines

- **Architecture:** Feature-Driven architecture to organize files.
- **Design Approach:** Mobile-first. The application must be designed with a mobile-first methodology and ensure responsiveness across other layouts (mobile, tablets, desktops).
- **Styling:** 
  - Use `StyleSheet.create` and store them in a `css` folder within the specific feature where they are applied.
  - Use `StyleSheet` on-needed. Maintain DRY (Don't Repeat Yourself) principles by creating recognizable and intelligible variables.
- **Imports:** Use `index.ts` for the global importation of a feature.
- **Feature Creation:** Use the `app/features/_feature-template` directory for new features, adapting the nomenclature to the specific feature being built.
- **API/Endpoints:** CRUD endpoints will always follow the same dynamic:
  - **C**reate = POST
  - **R**ead = GET
  - **U**pdate = PATCH
  - **D**elete = DELETE
- **Structure:** Everything must be contained within the `/app` directory.
- **Code Quality:** Apply Clean Code techniques. Proactively detect redundancies and create reusable components or custom hooks, ensuring they are properly imported and maintainable.
- **UI/UX Design:** Implement modern, clean, minimalist, and intuitive styles. Ensure designs are accessible for users with visual impairments.
- **Accessibility (a11y):** All code and components must be fully accessible to all users, strictly adhering to standard accessibility guidelines.

