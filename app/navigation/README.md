# navigation

Configuracion de navegacion de la app.

## Ejemplos

- `AppStackNavigator.tsx`
- `types.ts`
- `screens/HomeScreen.tsx`

## Plantilla

Usa `navigation/_template/` para nuevas pilas o grupos de rutas.

## Politica actual de rutas

- Publica: `Login`.
- Privadas: el resto de rutas (actualmente `Home`).

El stack verifica `auth.token` del store para decidir si muestra rutas publicas o privadas.
