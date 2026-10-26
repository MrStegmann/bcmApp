# Bug Assessment: Bloqueo de Interacción al Crear Equipo y Salto Indeseado al Eliminar Equipo

- **Slug**: club-list-team-bugs
- **Created**: 2026-10-26
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
# ClubList Bugs
When the user creates a new team, in some moment, the app freeze and dont let interact with any element.
When the user DELETES a Team, the view changes to the first team. This shall NOT HAPPEN. When a team is deleted, is shall return to the clublist MANDATORY.
```

## Symptom

1. **Bloqueo/Congelamiento tras crear equipo**: Al crear un nuevo equipo en `ClubManage`, la aplicación se congela y deja de responder a cualquier interacción táctil (no permite hacer scroll, pulsar botones ni navegar).
2. **Navegación indeseada al eliminar equipo**: Al pulsar "Eliminar" en la tarjeta de un equipo en `ClubList` y confirmar el borrado, la pantalla navega automáticamente al perfil (`ClubProfile`) del primer equipo de la lista en lugar de permanecer obligatoriamente en la lista de equipos (`ClubList`).

## Reproduction

### Defecto 1: Congelamiento al Crear Equipo
1. Abrir la aplicación e ir a la sección de Equipos (`ClubManage`).
2. Pulsar "Añadir Equipo" para abrir el formulario `ClubForm`.
3. Tocar el campo de nombre (el teclado virtual del dispositivo se despliega).
4. Introducir un nombre (ej. "Unicaja") y categoría (ej. "Junior").
5. Pulsar "Crear Equipo".
6. **Observado**: Mientras el teclado se cierra, la vista transiciona forzadamente al perfil del nuevo equipo (`ClubProfile` / `HomeView`), pero el contenedor exterior `KeyboardAwareScrollView` que envuelve toda la página entra en conflicto de gestos con los `ScrollView` interiores (y su `RefreshControl`), bloqueando el despachador de eventos táctiles. Ningún botón ni elemento de la pantalla responde.
7. **Esperado**: Al crear un equipo, la aplicación debe permanecer en la lista de equipos (`ClubList`) mostrando el nuevo club en la lista, permitiendo interacción normal sin bloqueos ni congelamientos.

### Defecto 2: Navegación al Primer Equipo al Eliminar
1. Ir a la pantalla de Equipos (`ClubManage`), teniendo 2 o más equipos en la lista.
2. En la tarjeta de cualquiera de los equipos, pulsar el icono de papelera ("Eliminar").
3. En el modal de confirmación `DeleteModal`, pulsar "Eliminar".
4. **Observado**: El equipo se borra de la base de datos, pero la vista salta automáticamente a mostrar el perfil (`ClubProfile` / `HomeView`) del primer equipo que queda en la lista (`teamsList[0]`).
5. **Esperado**: Tras eliminar un equipo, la vista debe permanecer obligatoriamente en `ClubList` con `club: null`.

## Suspected Code Paths

- `src/store/ClubStore.ts:94-112`:
  - En `deleteTeam`:
    ```typescript
    const nextTeam = updatedList.length > 0 ? updatedList[0] : null;
    set({
      teamsList: updatedList,
      clubs: updatedList,
      currentTeam: nextTeam,
      club: nextTeam, // <-- Asigna el primer equipo en lugar de null
      isLoading: false,
    });
    ```
    Al asignar `club: nextTeam`, el estado `club` deja de ser `null`, lo que dispara en `ClubManage.tsx` el renderizado de `<ClubProfile />` en vez de `<ClubList />`.
- `src/store/ClubStore.ts:51-68`:
  - En `createTeam`:
    ```typescript
    set({
      teamsList: updatedList,
      clubs: updatedList,
      currentTeam: newTeam,
      club: newTeam, // <-- Asigna el equipo recién creado a club
      isLoading: false,
    });
    ```
    Al asignar `club: newTeam`, `ClubManage` transiciona a `ClubProfile` inmediatamente en lugar de volver a `ClubList`, a pesar de que `handleAddClub` llama a `setCreateMode(false)`.
- `src/page/ClubManage.tsx:126-178`:
  - Toda la jerarquía de `ClubManage` está envuelta en un único `<KeyboardAwareScrollView>`:
    ```tsx
    <KeyboardAwareScrollView ...>
      {club ? (
        <ClubProfile ... /> // Contiene HomeView con su propio ScrollView + RefreshControl
      ) : (
        createMode ? <ClubForm /> : <ClubList /> // ClubList tiene su propio ScrollView
      )}
    </KeyboardAwareScrollView>
    ```
    Tener `ScrollView` anidados con el mismo sentido y controles de refresco (`RefreshControl`) dentro de `KeyboardAwareScrollView` provoca bloqueo de `PanResponder` y descarte permanente de eventos táctiles en React Native / Android cuando el teclado se oculta durante la transición de estado.
- `src/components/Alerts.tsx:9-20`:
  - El componente renderiza un `<View className="w-full absolute top-28 z-50 flex justify-center items-center">` sin `pointerEvents="box-none"`, interceptando potencialmente eventos táctiles en la zona superior de la pantalla.

## Root Cause Hypothesis

1. **Transición indeseada al primer equipo en eliminación**: En `src/store/ClubStore.ts`, la acción `deleteTeam` calculaba explícitamente `nextTeam = updatedList[0]` y actualizaba `club: nextTeam` en el store. Como `ClubManage.tsx` renderiza condicionalmente `club ? <ClubProfile /> : <ClubList />`, cualquier valor no nulo en `club` fuerza la navegación a `ClubProfile`, impidiendo que el usuario permanezca en la lista de clubes.
2. **Congelamiento tras creación de equipo**: Se debe a una doble causa:
   - En `ClubStore.ts`, `createTeam` asignaba `club: newTeam`, forzando el montaje inmediato de `ClubProfile` al mismo tiempo que `handleAddClub` ejecutaba `setCreateMode(false)` y se cerraba el teclado virtual.
   - En `ClubManage.tsx`, `KeyboardAwareScrollView` envolvía incorrectamente tanto a `ClubProfile` (que monta `HomeView` con su propio `ScrollView` y `RefreshControl`) como a `ClubList` (que tiene otro `ScrollView`). Al cambiar de vista mientras el teclado se cerraba, el pan responder de `react-native-keyboard-aware-scroll-view` capturaba los gestos y quedaba bloqueado, volviendo la aplicación inerte e inaccesible al tacto.

Confidence: high.

## Proposed Remediation

**Preferred**:
1. **Corregir `ClubStore.ts`**:
   - En `deleteTeam`: No seleccionar el primer equipo restante. Establecer `club: null` y `currentTeam: null`. Esto garantiza que tras eliminar cualquier equipo la vista permanezca en `ClubList`.
   - En `createTeam`: Mantener `club: null` (no cambiar `club` a `newTeam`). Solo actualizar `teamsList` y `clubs` con el nuevo registro.
2. **Reestructurar contenedores de scroll en `ClubManage.tsx`**:
   - Eliminar el envoltorio global `<KeyboardAwareScrollView>` de `ClubManage.tsx` que abarcaba a `ClubProfile` y `ClubList`.
   - Envolver en `<KeyboardAwareScrollView>` **únicamente** la vista del formulario (`createMode || editingTeam`), de forma idéntica a cómo se gestiona en `PlayerForm.tsx` y `GameForm.tsx`.
   - Dejar a `ClubProfile` y `ClubList` como vistas directas dentro de `<View className="flex-1 w-full ...">`, permitiendo que sus respectivos `ScrollView` manejen los gestos nativos sin interferencias ni bloqueos.
   - En `handleDeleteClub`: Reafirmar `setClub(null)` para máxima consistencia defensiva.
   - En `handleAddClub`: Mantener `setCreateMode(false)` y asegurar que `club` permanece en `null` para mostrar inmediatamente el equipo recién creado en `ClubList`.
3. **Proteger `Alerts.tsx` contra intercepciones táctiles**:
   - Si `alerts.length === 0`, retornar `null`.
   - Añadir `pointerEvents="box-none"` al contenedor exterior.

**Alternatives**:
- Dejar la lógica de `ClubStore` intacta y sobreescribir `setClub(null)` únicamente en `ClubManage.tsx`.
  *Desventaja*: Es propenso a regresiones; cualquier otro componente o flujo que invoque `deleteTeam` o `createTeam` seguiría recibiendo un estado inconsistente en `club`.

**Files likely to change**:
- `src/store/ClubStore.ts`
- `src/page/ClubManage.tsx`
- `src/components/Alerts.tsx`
- `src/__tests__/components/ClubManage.test.tsx`

**Tests to add or update**:
- Test unitario en `src/__tests__/components/ClubManage.test.tsx` verificando que `deleteTeam` resulta en `club: null` y `currentTeam: null`.
- Test unitario verificando que `createTeam` añade el equipo a la lista sin sobreescribir `club` con `newTeam` (permitiendo mantenerse en `ClubList`).
- Test de integración/componente validando que tras eliminar o crear un equipo, `ClubManage` permanece mostrando `ClubList`.

## Risks & Considerations

- **Compatibilidad con vistas existentes**: Verificar que los componentes de formulario (`ClubForm`) sigan desplazándose adecuadamente sobre el teclado cuando `KeyboardAwareScrollView` se restrinja al formulario.
- **Flujo de selección manual**: Comprobar que la selección explícita de un equipo desde `ClubList` (`handleSelectTeam` -> `setClub(team)`) continúe navegando correctamente a `ClubProfile`.

## Open Questions

- Ninguna. Los requisitos son claros y específicos: al eliminar equipo debe volver a `ClubList` obligatoriamente, y al crear equipo no debe congelarse la pantalla y debe permanecer en `ClubList`.
