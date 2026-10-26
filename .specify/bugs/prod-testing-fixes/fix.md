# Bug Fix: Feedback y Correcciones de Pruebas en Producción

- **Slug**: prod-testing-fixes
- **Fixed**: 2026-10-26
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Se corrigieron los 4 defectos detectados en pruebas de producción: superposición del teclado en formularios mediante `KeyboardAwareScrollView`, unificación del modal de compartir estadísticas eliminando el guardado directo fallido en galería, soporte de minutos y segundos en estadísticas de jugadores (resultado directo y edición de partido), y resolución de duplicación de equipos y navegación errónea al eliminar.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/page/ClubManage.tsx` | modified | Eliminadas llamadas duplicadas a `TeamController` en alta, edición y baja de equipos |
| `src/components/ClubList.tsx` | modified | Reestructurado `TeamCard` separando el área táctil de selección de los botones de acción para prevenir navegación involuntaria al pulsar eliminar |
| `src/components/GameForm.tsx` | modified | Envuelto el formulario en `KeyboardAwareScrollView` con `enableOnAndroid` y `extraScrollHeight` |
| `src/components/PlayerForm.tsx` | modified | Envuelto el formulario en `KeyboardAwareScrollView` y añadido botón de Cancelar cuando se proporciona `onCancel` |
| `src/features/match-detail/components/MatchShareModal.tsx` | modified | Eliminado el botón redundante de guardar en galería y unificado a un único botón de ancho completo "Compartir Estadísticas" |
| `src/db/schema.ts` | modified | Añadida columna `seconds: integer("seconds").default(0)` a `playerStats` |
| `src/db/index.ts` | modified | Añadida columna `seconds` al DDL y migración `ALTER TABLE player_stats ADD COLUMN seconds` |
| `src/features/direct-result/types/index.ts` | modified | Añadido campo `seconds?: number` a `PlayerStatInput` |
| `src/features/direct-result/components/PlayerStatsSection.tsx` | modified | Añadido input numérico para segundos (`Seg`) junto al de minutos (`Min`) |
| `src/features/direct-result/components/DirectResultModal.tsx` | modified | Inicialización y validación/clamping de segundos (0-59) |
| `src/page/GameList.tsx` | modified | Persistencia de segundos al guardar resultado directo |
| `src/features/match-detail/types/index.ts` | modified | Soporte de `seconds` en `PlayerRosterItem` y `MatchEditBuffer` |
| `src/features/match-detail/types/share.ts` | modified | Soporte de `seconds` en `FormattedPlayerBoxScore` |
| `src/features/match-detail/components/MatchEditModal.tsx` | modified | Inicialización e inputs de minutos y segundos en la fila de estadísticas de cada jugador |
| `src/features/match-detail/store/useMatchDetailStore.ts` | modified | Mapeo y persistencia de segundos en el roster del partido |
| `src/features/match-detail/components/RosterValuationList.tsx` | modified | Formateo del tiempo jugado en `MM:SS min` cuando hay segundos |
| `src/features/match-detail/components/PlayerDetailModal.tsx` | modified | Formateo del tiempo jugado en `MM:SS min` en el modal de detalle del jugador |
| `src/features/match-detail/components/MatchStatsGraphic.tsx` | modified | Formateo de columna Min a `MM:SS` cuando hay segundos |
| `src/features/match-detail/utils/shareDataFormatter.ts` | modified | Extracción de segundos para el formateador de imagen compartida |
| `src/__tests__/mocks/expo-sqlite.js` | modified | Añadida columna `seconds` en la tabla en memoria para tests |
| `src/__tests__/components/ClubManage.test.tsx` | modified | Añadidos tests unitarios para verificar la no-duplicación de equipos y aislamiento del evento eliminar |
| `src/features/match-detail/__tests__/components/MatchShareModal.test.tsx` | modified | Actualizado test de contrato para verificar acción única de compartir |
| `src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx` | modified | Añadido test unitario para actualización de segundos |
| `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx` | modified | Añadido test para captura y guardado de segundos en el buffer de edición |

## Diff Highlights (optional)

```diff
// ClubManage.tsx
- if (TeamController?.add) {
-   await TeamController.add(data.name);
- }
  await createTeam({ name: data.name, category: data.category });

// ClubList.tsx
- <TouchableOpacity onPress={() => onSelect(team)}>
+ <View testID={`team-card-container-${team.id}`}>
+   <TouchableOpacity onPress={() => onSelect(team)} testID={`team-card-${team.id}`}>
      ...
+   </TouchableOpacity>
+   <View>
      <TouchableOpacity onPress={() => onDelete(team)}>
```

## Tests Added or Updated

- `src/__tests__/components/ClubManage.test.tsx` — Verifica que `handleAddClub` sólo inserta un único equipo con categoría y que pulsar eliminar no dispara `onSelect`.
- `src/features/match-detail/__tests__/components/MatchShareModal.test.tsx` — Verifica el contrato del botón único de "Compartir Estadísticas".
- `src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx` — Verifica el soporte y despacho de actualización de segundos.
- `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx` — Verifica la inicialización y persistencia de segundos en el buffer de edición.

## Local Verification

- Commands run: `npm test` → 95 test suites passed, 556 tests passed (0 failures).

## Deviations from Assessment

None. Todas las remediaciones preferidas descritas en el assessment fueron aplicadas rigurosamente.

## Follow-ups

- Probar en dispositivo físico Android e iOS las pantallas de partido y jugadores para validar la suavidad del desplazamiento con el teclado nativo.
