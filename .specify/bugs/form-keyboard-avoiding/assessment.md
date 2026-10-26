# Bug Assessment: El teclado se superpone al formulario en features de Match

- **Slug**: form-keyboard-avoiding
- **Created**: 2026-10-26
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
* Cuando se introduce información, el teclado se superpone al formulario. **Solución:** Mover el formulario hacia arriba para crear espacio entre el teclado y el formulario.
TODOS los formularios DEBEN tener esta solución integrada.
Actualmente, Match features NO tienen esto implementado.
```

## Symptom

Al enfocar cualquier campo de entrada de texto (`TextInput`) en formularios de la aplicación, el teclado virtual del sistema operativo (en particular en Android y dispositivos con pantallas reducidas) se despliega y cubre visualmente los campos del formulario ubicados en la mitad o tercio inferior de la pantalla.

El usuario no puede ver lo que escribe ni confirmar los valores ingresados sin cerrar manualmente el teclado.

Mientras que formularios como `PlayerForm`, `GameForm` y `ClubManage` (creación y edición de equipos) cuentan con `KeyboardAwareScrollView` para desplazar el contenido hacia arriba (`extraScrollHeight`), los formularios pertenecientes a las **Match features** (`MatchEditModal`, `PeriodScoresSection` y `PlayerStatsSection` dentro de `DirectResultModal`) no tienen implementada esta solución y utilizan `ScrollView` estándar de React Native sin desplazamiento por teclado.

## Reproduction

### Escenario 1: Edición de Partido (`MatchEditModal`)
1. Abrir la aplicación y entrar en un equipo con partidos finalizados.
2. Navegar a `GameList` y seleccionar un partido finalizado para abrir `MatchDetailView`.
3. Pulsar en el botón del encabezado "Editar" para desplegar `MatchEditModal`.
4. En la pestaña "Puntuaciones por Cuarto", hacer scroll hacia los cuartos 3, 4 o Prórroga y pulsar sobre cualquiera de los campos de "Puntos" o "Faltas" del Rival.
   - **Observado**: El teclado virtual de Android/iOS se abre sobre el modal y tapa totalmente la fila del periodo enfocado y los botones de acción inferior. La vista no se mueve hacia arriba.
   - **Esperado**: El formulario debe desplazarse automáticamente hacia arriba dejando un espacio (`extraScrollHeight >= 100`) entre la parte superior del teclado y el campo activo.
5. Cambiar a la pestaña "Estadísticas de Jugadores" y seleccionar un jugador en la parte inferior de la lista. Pulsar sobre las casillas de tiros (T2M, T3M, FALT).
   - **Observado**: El teclado cubre por completo las entradas de estadísticas.

### Escenario 2: Resultado Directo de Partido (`DirectResultModal`)
1. En `GameList`, en un partido con estado pendiente, pulsar sobre la opción de "Resultado Directo" (`DirectResultModal`).
2. En la pestaña "Cuartos y Marcador" (`PeriodScoresSection`), hacer tap en los campos de puntos o faltas de los periodos Q3, Q4 o Tiempo Extra.
   - **Observado**: El teclado se superpone al bloque del cuarto y los botones "Cancelar" y "Guardar y Finalizar" quedan inaccesibles sin ocultar el teclado.
3. En la pestaña "Estadísticas" (`PlayerStatsSection`), desplegar un jugador situado abajo en la lista y tocar los campos de "Robos", "Pérdidas" o "Faltas".
   - **Observado**: El teclado tapa las entradas numéricas sin desplazar el formulario hacia arriba.

## Suspected Code Paths

- `src/features/match-detail/components/MatchEditModal.tsx:243-247`:
  - Utiliza `<ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>` estándar. No gestiona eventos del teclado ni calcula márgenes de holgura cuando el foco está en un `TextInput`.
- `src/features/direct-result/components/PeriodScoresSection.tsx:132-136`:
  - Utiliza `<ScrollView className="flex-1 w-full px-4" showsVerticalScrollIndicator={true}>` estándar sin integración con teclado virtual.
- `src/features/direct-result/components/PlayerStatsSection.tsx:185-189, 309`:
  - Utiliza `<ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={true}>` estándar, ocultando las tarjetas de jugadores y sus inputs al desplegar el teclado numérico.
- `src/components/ClubForm.tsx:56-91`:
  - Es un `<View>` plano; aunque en `ClubManage.tsx` está envuelto en `KeyboardAwareScrollView`, si se invoca o renderiza en otro contexto carece de autogestión de teclado.
- `src/components/PlayerForm.tsx:84-90` (Referencia de patrón correcto):
  - Utiliza correctamente `KeyboardAwareScrollView` con `enableOnAndroid={true}`, `extraScrollHeight={100}`, `keyboardShouldPersistTaps="handled"`, `contentContainerStyle={{ flexGrow: 1 }}`.
- `src/components/GameForm.tsx:82-88` (Referencia de patrón correcto):
  - Utiliza correctamente `KeyboardAwareScrollView` con `enableOnAndroid={true}`, `extraScrollHeight={100}`, `keyboardShouldPersistTaps="handled"`, `contentContainerStyle={{ flexGrow: 1 }}`.

## Root Cause Hypothesis

Los formularios de las funcionalidades de partidos (`src/features/match-detail` y `src/features/direct-result`) fueron implementados empleando el componente primitivo `ScrollView` de `react-native`.

En entornos móviles (especialmente Android con teclados virtuales flotantes o de altura variable), `ScrollView` no ajusta dinámicamente el scroll offset para situar el `TextInput` enfocado por encima de la ventana del teclado. 

El proyecto ya cuenta con la dependencia instalada `react-native-keyboard-aware-scroll-view` (^0.9.5) y un patrón establecido en `PlayerForm` y `GameForm`, pero dicho patrón no fue trasladado a los formularios de partidos desarrollados recientemente.

Confidence: high.

## Proposed Remediation

**Preferred**:
1. **Actualizar `MatchEditModal.tsx`**:
   - Reemplazar el contenedor `<ScrollView>` por `<KeyboardAwareScrollView>` de `react-native-keyboard-aware-scroll-view`.
   - Añadir las propiedades estandarizadas del proyecto:
     - `enableOnAndroid={true}`
     - `extraScrollHeight={120}`
     - `keyboardShouldPersistTaps="handled"`
     - `contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}`
2. **Actualizar `PeriodScoresSection.tsx`**:
   - Reemplazar `<ScrollView>` por `<KeyboardAwareScrollView>` de `react-native-keyboard-aware-scroll-view`.
   - Propiedades:
     - `enableOnAndroid={true}`
     - `extraScrollHeight={100}`
     - `keyboardShouldPersistTaps="handled"`
     - `contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}`
3. **Actualizar `PlayerStatsSection.tsx`**:
   - Reemplazar `<ScrollView>` por `<KeyboardAwareScrollView>` de `react-native-keyboard-aware-scroll-view`.
   - Propiedades:
     - `enableOnAndroid={true}`
     - `extraScrollHeight={100}`
     - `keyboardShouldPersistTaps="handled"`
     - `contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}`
4. **Verificación global de formularios**:
   - Auditar que todos los formularios de la app (`PlayerForm`, `GameForm`, `ClubForm`/`ClubManage`, `MatchEditModal`, `PeriodScoresSection`, `PlayerStatsSection`) cuenten con `KeyboardAwareScrollView` configurado uniformemente.

**Alternatives**:
- Utilizar `KeyboardAvoidingView` nativo de React Native con `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`.
  - *Desventaja*: Requiere cálculos manuales de offset en Android y suele comportarse de manera inconsistente con modales a pantalla completa y listas largas comparado con `react-native-keyboard-aware-scroll-view` que ya está integrado y probado en el proyecto.

**Files likely to change**:
- `src/features/match-detail/components/MatchEditModal.tsx`
- `src/features/direct-result/components/PeriodScoresSection.tsx`
- `src/features/direct-result/components/PlayerStatsSection.tsx`
- `src/features/match-detail/__tests__/components/MatchEditModal.test.tsx`
- `src/features/direct-result/__tests__/components/PeriodScoresSection.test.tsx`
- `src/features/direct-result/__tests__/components/PlayerStatsSection.test.tsx`

**Tests to add or update**:
- Actualizar y ampliar las suites de pruebas unitarias para `MatchEditModal`, `PeriodScoresSection` y `PlayerStatsSection` comprobando que los formularios montan `KeyboardAwareScrollView` con las propiedades requeridas (`enableOnAndroid`, `extraScrollHeight`, `keyboardShouldPersistTaps`) y mantienen intacta toda la funcionalidad de edición y guardado.

## Risks & Considerations

- Envoltorios de `KeyboardAwareScrollView` anidados dentro de otros `ScrollView` pueden causar conflictos de gestos táctiles. Dado que cada formulario (`MatchEditModal`, `PeriodScoresSection`, `PlayerStatsSection`) es el contenedor principal de scroll de su respectivo contenido, debe sustituir al `ScrollView` existente sin anidar scrollables redundantes.
- En pruebas Jest en entorno Node, `KeyboardAwareScrollView` debe renderizarse o mapearse sin lanzar errores de dependencias nativas (ya verificado en el paso de validación actual).

## Open Questions

- Ninguna. El requerimiento es explícito: todos los formularios de la aplicación deben mover el formulario hacia arriba cuando se abre el teclado, corrigiendo específicamente las Match features que carecían de ello.
