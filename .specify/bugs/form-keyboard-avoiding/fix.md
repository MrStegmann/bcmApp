# Bug Fix: El teclado se superpone al formulario en features de Match

- **Slug**: form-keyboard-avoiding
- **Fixed**: 2026-10-26
- **Assessment**: ./assessment.md
- **Status**: applied

## Summary

Se reemplazaron los contenedores `ScrollView` estándar por `KeyboardAwareScrollView` en los componentes de formularios de Match (`MatchEditModal`, `PeriodScoresSection` y `PlayerStatsSection`), configurando márgenes de holgura y persistencia de pulsaciones para evitar que el teclado virtual cubra las entradas de datos en dispositivos móviles.

## Changes

| File | Change | Notes |
|------|--------|-------|
| `src/features/match-detail/components/MatchEditModal.tsx` | modified | Reemplazado `ScrollView` por `KeyboardAwareScrollView` con `extraScrollHeight={120}`, `enableOnAndroid={true}`, `keyboardShouldPersistTaps="handled"` |
| `src/features/direct-result/components/PeriodScoresSection.tsx` | modified | Reemplazado `ScrollView` por `KeyboardAwareScrollView` con `extraScrollHeight={100}`, `enableOnAndroid={true}`, `keyboardShouldPersistTaps="handled"` |
| `src/features/direct-result/components/PlayerStatsSection.tsx` | modified | Reemplazado `ScrollView` por `KeyboardAwareScrollView` con `extraScrollHeight={100}`, `enableOnAndroid={true}`, `keyboardShouldPersistTaps="handled"` |
| `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx` | modified | Añadida prueba unitaria que verifica la presencia y configuración obligatoria de `KeyboardAwareScrollView` |
| `src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx` | modified | Añadida prueba unitaria que verifica la presencia y configuración obligatoria de `KeyboardAwareScrollView` |
| `src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx` | modified | Añadida prueba unitaria que verifica la presencia y configuración obligatoria de `KeyboardAwareScrollView` |

## Diff Highlights (optional)

```tsx
// MatchEditModal.tsx, PeriodScoresSection.tsx, PlayerStatsSection.tsx
- import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
+ import { View, Text, TextInput, TouchableOpacity } from "react-native";
+ import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

- <ScrollView className="..." showsVerticalScrollIndicator={...}>
+ <KeyboardAwareScrollView
+   className="..."
+   enableOnAndroid={true}
+   extraScrollHeight={100} // (120 en MatchEditModal)
+   keyboardShouldPersistTaps="handled"
+   contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, paddingTop: 8 }}
+   showsVerticalScrollIndicator={true}
+ >
```

## Tests Added or Updated

- `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx::should enforce KeyboardAwareScrollView configuration with Android support and extra scroll height` — Asegura que el modal de edición de partido no regrese a un `ScrollView` plano y mantenga los parámetros de holgura.
- `src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx::should enforce KeyboardAwareScrollView configuration with extra scroll height` — Garantiza la integración de `KeyboardAwareScrollView` en el formulario de puntuaciones por cuartos.
- `src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx::should enforce KeyboardAwareScrollView configuration with extra scroll height` — Garantiza la integración de `KeyboardAwareScrollView` en el formulario de estadísticas individuales.

## Local Verification

- Commands run:
  - `npm test -- src/features/match-detail/__tests__/components/MatchEditModal.test.tsx src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx` → 3 passed, 15 tests passed.
  - `npm test` → 95 passed, 95 total test suites passed (561 passed, 0 failed).
- Manual checks:
  - Auditoría de todos los formularios de la app: se confirmó que `PlayerForm`, `GameForm`, `ClubManage` (que envuelve `ClubForm`), `MatchEditModal`, `PeriodScoresSection` y `PlayerStatsSection` utilizan de manera uniforme `KeyboardAwareScrollView`.

## Deviations from Assessment

None.

## Follow-ups

- Ejecutar `/speckit-bug-test slug=form-keyboard-avoiding` para generar el reporte de validación final.
