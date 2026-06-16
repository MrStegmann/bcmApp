# Login Feature

Primera feature basada en dominio para autenticacion por email y password.

## Estructura

- `components/LoginForm.tsx`: formulario con validaciones.
- `screens/LoginScreen.tsx`: pantalla contenedora de login.
- `store/authStore.ts`: estado persistente de auth (nombre, email, token JWT).
- `utils/validation.ts`: reglas de validacion de campos.
- `types.ts`: contratos TypeScript de la feature.
- `index.ts`: API publica de la feature.

## Validaciones incluidas

- Email vacio.
- Email invalido.
- Password vacio.

## Persistencia de auth

Si `onLogin` devuelve `{ name, email, token }`, `LoginScreen` guarda esos datos en el store de auth.

## Uso rapido

```tsx
import { LoginScreen } from "./app/features/login";
```
