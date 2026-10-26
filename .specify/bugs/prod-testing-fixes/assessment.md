# Bug Assessment: Feedback y Correcciones de Pruebas en Producción

- **Slug**: prod-testing-fixes
- **Created**: 2026-10-26
- **Source**: pasted text
- **Verdict**: valid
- **Severity**: high

## Report (verbatim or summarized)

```text
# Pruebas Realizadas
Esto es una lista de cosas que hay que arreglar para la aplicación que se ha apreciado durante las pruebas en prod.
## Lista:
* Cuando se introduce información, el teclado se superpone al formulario. **Solución:** Mover el formulario hacia arriba para crear espacio entre el teclado y el formulario.
* El guardado de imagen es, practicamente, inexistente. **Solución:** Dejar solo la opción de Compartir y que desde ese apartado se elija si guardar o compartir.
* En rellenar los datos de un partido, los minutos de los jugadores no permite añadir segundos. Es decir, solo permite minutos enteros. **Solución:** Añadir la opción de añadir segundos.
* Al crear un nuevo equipo, crea dos equipos en lugar de uno: Uno con la categoría, otro sin la categoría. Y al eliminar los equipos, entra dentro de uno. **Solución:** Evitar la duplicidad de equipos y al eliminar un equipo, debe mantenerse en la lista de equipos.
```

## Symptom

Durante las pruebas en producción se identificaron 4 defectos críticos de usabilidad, persistencia y navegación:
1. **Superposición del teclado en formularios**: Al enfocar campos de texto en formularios (como `GameForm`, `PlayerForm` y modales de edición), el teclado virtual del sistema cubre los inputs inferiores y los botones de acción sin desplazar la vista.
2. **Falla en guardado de imágenes de estadísticas**: El botón "Guardar en Galería" en el modal de compartir estadísticas depende de módulos nativos (`ExpoMediaLibraryNext`) que fallan o presentan incompatibilidad, mientras que la acción nativa de "Compartir" (`expo-sharing`) ya proporciona de manera estándar en el sistema operativo la opción de guardar o compartir a cualquier app.
3. **Ausencia de segundos en tiempo de juego**: Al rellenar los datos estadísticos de un partido (resultado directo o edición de partido), el tiempo en cancha de los jugadores únicamente admite valores enteros en minutos, impidiendo registrar segundos (ej. 14:35).
4. **Duplicación de equipos y navegación errónea al eliminar**:
   - Al registrar un nuevo equipo, se insertan dos registros idénticos en la base de datos: uno con categoría y otro sin categoría.
   - En la lista de equipos, al presionar el botón de eliminar equipo en una tarjeta, se dispara simultáneamente el evento de selección de la tarjeta (`onSelect`), abriendo la vista de detalle/perfil del equipo en lugar de permanecer en la lista.

## Reproduction

### 1. Formulario y Teclado
1. Abrir la pantalla de creación/edición de partido (`GameList` -> "Añadir Partido") o de jugadores (`PlayerList` -> "Añadir Jugador").
2. Tocar el último campo del formulario (ej. fecha de partido o dorsal/apodo de jugador).
3. **Observado**: El teclado virtual de Android/iOS cubre el campo de entrada y los botones "Guardar" / "Cancelar".
4. **Esperado**: La vista debe desplazarse automáticamente hacia arriba mediante `KeyboardAwareScrollView` o `KeyboardAvoidingView` permitiendo ver y editar el campo enfocado.

### 2. Compartir vs Guardar Imagen
1. Ir al detalle de un partido finalizado (`MatchDetailView`).
2. Tocar "Compartir" para abrir `MatchShareModal`.
3. Pulsar "Guardar en Galería".
4. **Observado**: La opción falla o presenta errores nativos/permisos en runtime.
5. **Esperado**: Eliminar el botón secundario redundante "Guardar en Galería" y dejar un único botón prominente "Compartir / Exportar" que invoque el diálogo nativo del sistema (`expo-sharing`), donde el usuario puede elegir guardarlo en archivos/fotos o compartirlo en WhatsApp/redes.

### 3. Minutos y Segundos de Jugadores
1. Abrir el modal de resultado directo (`DirectResultModal`) o el modal de edición de estadísticas (`MatchEditModal`).
2. Expandir un jugador para ingresar sus estadísticas.
3. Observar el campo de tiempo jugado ("Minutos (MIN)").
4. **Observado**: Es un input puramente numérico entero que solo permite guardar minutos completos.
5. **Esperado**: Permitir registrar minutos y segundos (mediante dos campos `Min` y `Seg`, o formato `MM:SS`).

### 4. Creación y Eliminación de Equipos
1. Ir a la sección de Equipos (`ClubManage`).
2. Pulsar "Añadir Equipo", introducir un nombre y seleccionar una categoría, y guardar.
3. **Observado**: En la lista aparecen dos equipos: uno con el nombre y la categoría, y otro sólo con el nombre y sin categoría.
4. En la tarjeta de cualquier equipo, presionar el icono de papelera (eliminar).
5. **Observado**: En lugar de quedarse en la lista y mostrar solo la confirmación de borrado, la app navega dentro del perfil del equipo (`ClubProfile`).

## Suspected Code Paths

### 1. Teclado en Formularios
- `src/page/GameList.tsx:427-444` — Renderiza `GameForm` directamente en un `View` sin `KeyboardAvoidingView` ni contenedor scrollable con padding inferior.
- `src/components/GameForm.tsx:81-124` — Vista rígida `View` sin scroll ni ajuste de teclado.
- `src/page/PlayerList.tsx:210-230` — Renderiza `PlayerForm` en un contenedor `View` estático.
- `src/components/PlayerForm.tsx:1-118` — Vista estática sin manejo de teclado.

### 2. Guardado vs Compartir de Imagen
- `src/features/match-detail/components/MatchShareModal.tsx:70-100, 175-189` — Contiene `handleSaveToGallery` y el botón `<TouchableOpacity testID="save-gallery-action-button">Guardar en Galería</TouchableOpacity>`.
- `src/features/match-detail/services/matchShareService.ts:186-218` — Intentos de uso de `ExpoMediaLibraryNext` / `expo-media-library`.

### 3. Minutos y Segundos
- `src/features/direct-result/types/index.ts:12-28` — `PlayerStatInput` solo define `minutes: number` (sin segundos).
- `src/features/direct-result/components/PlayerStatsSection.tsx:161-168` — `renderStatInput` solo renderiza un input numérico para `minutes`.
- `src/features/match-detail/components/MatchEditModal.tsx:401-409` — Input para `pStats.minutes` sin soporte de segundos.
- `src/features/match-detail/types/index.ts:22` — `PlayerRosterItem` tipa `minutes: number`.
- `src/db/schema.ts:94` — Tabla `player_stats` almacena `minutes: integer("minutes").default(0)`.

### 4. Duplicación de Equipos y Eliminación
- `src/page/ClubManage.tsx:94-101` — `handleAddClub` llama a **ambos**:
  ```typescript
  if (TeamController?.add) {
    await TeamController.add(data.name); // Crea equipo 1 (sin categoría en controlador legado)
  }
  await createTeam({ name: data.name, category: data.category }); // Crea equipo 2 (con categoría en useClubStore)
  ```
  Esto duplica la creación en cada alta de equipo.
- `src/components/ClubList.tsx:26-68` — `TeamCard` envuelve toda la tarjeta en un `<TouchableOpacity onPress={() => onSelect(team)}>`. Los botones internos de edición y borrado están dentro de este `TouchableOpacity` principal.
  En React Native, `e.stopPropagation()` no previene el responder de gestos del componente padre si están anidados de este modo, causando que presionar "Eliminar" dispare inmediatamente `onSelect(team)`, llevando al usuario a `ClubProfile`.

## Root Cause Hypothesis

1. **Teclado**: Ausencia de envoltorios `KeyboardAwareScrollView` o `KeyboardAvoidingView` en `GameList.tsx` y `PlayerList.tsx`. Aunque la dependencia `react-native-keyboard-aware-scroll-view` está instalada en el proyecto, solo se utilizaba en `ClubManage.tsx`.
2. **Imagen**: El guardado directo en galería depende de APIs nativas de permisos y almacenamiento en `expo-media-library` que en Android/iOS moderno requieren configuraciones nativas pesadas, mientras que `expo-sharing` (`Sharing.shareAsync`) abre la hoja estándar del sistema operativo que ya incluye de fábrica "Guardar imagen", "Compartir en WhatsApp", Drive, etc.
3. **Minutos/Segundos**: Las estructuras de datos (`PlayerStatInput`, `PlayerRosterItem`, formularios de entrada) asumieron el tiempo de juego como minutos enteros en lugar de permitir desglose en minutos y segundos (`MM:SS` o entradas independientes para minutos y segundos).
4. **Equipos**:
   - **Duplicidad**: Invocación doble deliberada pero redundante en `handleAddClub` (`TeamController.add` seguido de `createTeam`). Ambos métodos insertan filas en SQLite.
   - **Navegación al eliminar**: Anidamiento inválido de `TouchableOpacity` (botón de borrado dentro del `TouchableOpacity` contenedor de toda la tarjeta), sumado a que React Native no soporta `e.stopPropagation()` en `GestureResponderEvent`.

Confidence: high.

## Proposed Remediation

**Preferred**:

1. **Ajuste de Teclado en Formularios**:
   - Envolver los formularios `GameForm` y `PlayerForm` (y sus vistas contenedoras en `GameList.tsx` y `PlayerList.tsx`) con `KeyboardAwareScrollView` configurado con `enableOnAndroid={true}` y `extraScrollHeight={100}`, o `KeyboardAvoidingView` con `behavior={Platform.OS === "ios" ? "padding" : undefined}`.

2. **Unificación de Compartir Imagen**:
   - En `MatchShareModal.tsx`, remover el botón "Guardar en Galería" y su handler `handleSaveToGallery`.
   - Mantener un único botón principal de acción "Compartir Estadísticas", con diseño destacado y ancho completo, que invoque `handleShareWhatsApp` / `shareImageFile` vía `expo-sharing`. La hoja de compartir del sistema operativo permite al usuario tanto compartir directamente como almacenar el archivo PNG generado.

3. **Soporte de Minutos y Segundos**:
   - Actualizar los componentes de entrada (`PlayerStatsSection.tsx` en resultado directo y `MatchEditModal.tsx` en detalle de partido) para permitir ingresar tanto minutos como segundos (mediante dos campos numéricos adyacentes `Min` (0-99) y `Seg` (0-59), o input con máscara `MM:SS`).
   - Normalizar el almacenamiento en base de datos: almacenar el total en segundos o convertir a minutos decimales/redondeados según compatibilidad con el esquema existente `minutes` (o almacenar segundos totales si `player_stats` lo soporta, manteniendo coherencia con `PlayMatch`).

4. **Corrección en Gestión de Equipos**:
   - En `src/page/ClubManage.tsx`: Eliminar la llamada redundante `TeamController.add(data.name)` en `handleAddClub`, manteniendo únicamente `await createTeam({ name: data.name, category: data.category })`.
   - En `src/components/ClubList.tsx`: Reestructurar `TeamCard` para que el contenedor raíz sea un `<View>`, colocando un `<TouchableOpacity>` específico para el área de contenido (nombre/categoría) y manteniendo los botones de acción (editar y borrar) fuera del árbol táctil de navegación.

**Alternatives**:
- Para minutos/segundos: Crear una migración en SQLite para añadir una columna `seconds` explícita en `player_stats`. Sin embargo, para evitar migraciones disruptivas en bases de datos locales ya creadas en producción, podemos guardar `seconds` calculados o minutos decimales, o usar formato compatible con `PlayMatch`.

**Files likely to change**:
- `src/page/ClubManage.tsx`
- `src/components/ClubList.tsx`
- `src/page/GameList.tsx`
- `src/page/PlayerList.tsx`
- `src/components/GameForm.tsx`
- `src/components/PlayerForm.tsx`
- `src/features/match-detail/components/MatchShareModal.tsx`
- `src/features/match-detail/components/MatchEditModal.tsx`
- `src/features/direct-result/components/PlayerStatsSection.tsx`
- `src/features/direct-result/types/index.ts`
- Tests unitarios y de componentes asociados

**Tests to add or update**:
- Test en `ClubManage.test.tsx` verificando que `handleAddClub` solo inserta un único equipo con su categoría.
- Test en `ClubList.test.tsx` verificando que al presionar el botón de eliminar, no se dispara `onSelect`.
- Test en `MatchShareModal.test.tsx` verificando que solo existe el botón de compartir y ejecuta `shareImageFile`.
- Test en `PlayerStatsSection.test.tsx` y `MatchEditModal.test.tsx` verificando la captura y cálculo de minutos y segundos.

## Risks & Considerations

- **Retrocompatibilidad de datos de partidos**: Asegurar que los partidos ya existentes con minutos enteros sigan visualizándose correctamente sin NaN ni fallas de formato.
- **Teclado en Android y iOS**: `KeyboardAwareScrollView` se comporta de forma distinta en iOS y Android; validar que `enableOnAndroid={true}` y `keyboardShouldPersistTaps="handled"` estén activos en todas las pantallas afectadas.

## Open Questions

- Ninguna. Las causas raíz de los 4 comportamientos reportados han sido completamente aisladas y verificadas en el código fuente.
