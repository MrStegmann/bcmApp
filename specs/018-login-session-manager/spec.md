# Feature Specification: Login View & Session Manager

**Feature Branch**: `feature/login`

**Created**: 2026-11-02  
**Updated**: 2026-11-06  

**Status**: IMPLEMENTED

**Input**: User description:
> The task is to create a new feature that will be the new entry point of the app. This entrypoint will be the `Login` view page. This page MUST be always the first page of the application.
> The user must entry a `username` (string) & `password` (string, protected) that must be validated before send it via API `${.env.API_URI}/auth/login`. The api will returns
> ```json
> {
>     "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJQYXRyaWNrLkpTIiwidXNlcklkIjoxLCJpYXQiOjE3OTM2MjcyNzcsImV4cCI6MTc5MzcxMzY3N30.hq3ruUvojU-0UyOCgmLsZSd60y2pcWn1zjZsaE6f-36EDssgkbjaCXNMMjs0FsAp",
>     "tokenType": "Bearer",
>     "expiresIn": 86400,
>     "user": {
>         "id": 1,
>         "username": "Patrick.JS",
>         "status": "ACTIVE",
>         "createdAt": "2026-11-01T09:49:33.990499Z"
>     }
> }
> ```
> and the token must be saved in the sqlite as a cache. Each time the user enter the app, this cache must be check, if miss, then require authenticated.
> 
> **Update (Spec Revision 1 - Environment Config)**:
> - Add environment file and properly import for using in the app.
>
> **Update (Spec Revision 2 - Logout & Credential Persistence)**:
> - Login works properly and the user can login, validating the data correctly with the server. But, the user cannot logout. We need to implement in the ClubList a new button for logout in the header on the left side (use power icon).
> - Session Termination: Implement session cleanup logic in the authentication store/service to invalidate tokens, clear local user state, and reset auth context.
> - Header Component Update: Locate the `ClubList` header component and add a logout button positioned on the left side.
> - Icon Integration: Use the standard power icon for the logout button.
> - Navigation & Redirection: Wire the logout action to trigger session destruction and smoothly navigate the user back to the login screen.
> - Credential Persistence: Implement secure local storage (e.g., encrypted secure storage) to persist user credentials or session tokens when the "Remember me" option is selected.
> - Login UI Enhancements: Add a "Remember me" toggle or checkbox to the login screen.
> - Acceptance Criteria:
>   - UI Placement: The power icon logout button is visibly rendered on the left side of the `ClubList` header.
>   - Session Clearing: Tapping the logout button successfully invalidates and clears stored session tokens and user state.
>   - Redirection: Upon successful logout, the application immediately redirects the user to the login screen and prevents navigation back to protected views without re-authenticating.
>   - Remember Me: When enabled, user credentials/tokens are securely saved on the device for subsequent sessions.
>   - Fast-Login Execution: Successful biometric verification automatically authenticates the user and logs them into the app without requiring manual password entry.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Authentication & First-Launch Entry (Priority: P1)

As an unauthenticated user or a user opening the application for the first time, I want to be immediately presented with a clean and secure Login screen where I can enter my username and password, so that I can securely authenticate and access the basketball team management application.

**Why this priority**: Without authentication and a designated secure entry point, users cannot establish identity or safely interact with club data.

**Independent Test**: Can be tested independently on a fresh installation by launching the app, verifying the Login view is rendered as the initial screen, entering valid user credentials, submitting the form, verifying the authentication response is received and stored, and observing transition to the main application view.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user opening the application, **When** the app completes initialization, **Then** the Login view is displayed as the primary initial screen.
2. **Given** the Login view, **When** the user inspects the form, **Then** an editable username input, a protected (masked) password input, and a submit button are displayed.
3. **Given** valid credentials entered into username and password inputs, **When** the user taps the login trigger, **Then** an authentication request is dispatched to the `/auth/login` endpoint resolved dynamically from the application's imported environment configuration.
4. **Given** a successful authentication response containing token, token type, expiry duration, and user details, **When** the response is received, **Then** the session payload is persisted to local storage cache and the user is navigated into the main application.

---

### User Story 2 - Automatic Session State Restoration on Launch (Priority: P1)

As an authenticated user reopening the application, I want my active session to be automatically recognized from local storage cache, so that I am routed directly into the main application without having to repeatedly log in.

**Why this priority**: Repeatedly forcing active users to re-enter credentials degrades user retention and mobile usability.

**Independent Test**: Can be tested independently by establishing a valid cached session, terminating or restarting the app, and confirming the user immediately bypasses the Login view and lands on the main application home/dashboard screen.

**Acceptance Scenarios**:

1. **Given** an existing valid, unexpired session stored in the local cache, **When** the application is launched, **Then** the session check validates the cached credentials and routes the user directly to the main application view.
2. **Given** an automatic session bypass, **When** the user reaches the main application, **Then** the user's authenticated profile information is accessible to the app context.

---

### User Story 3 - Client-Side Credential Validation & Input Feedback (Priority: P2)

As a user interacting with the login form, I want immediate visual validation if I leave fields empty or provide malformed inputs, so that I can correct errors before unnecessary network requests are transmitted.

**Why this priority**: Prevents wasted network round-trips, protects server resources, and provides instant usability feedback.

**Independent Test**: Can be tested independently by attempting to submit with empty username, empty password, or whitespace-only values, confirming validation alerts appear and no network requests are dispatched.

**Acceptance Scenarios**:

1. **Given** the login form with an empty username or empty password, **When** the user triggers submission, **Then** client validation displays clear error feedback for the missing field(s) and submission is blocked.
2. **Given** an input containing only whitespace characters, **When** submission is attempted, **Then** validation treats the field as empty and prevents transmission.
3. **Given** an active validation error state, **When** the user types valid text into the flagged input, **Then** the validation error state clears.

---

### User Story 4 - Session Expiration & Cache Miss Handling (Priority: P2)

As an authenticated user whose session token has expired, I want the system to detect the expired status upon app launch, invalidate the stale session, and present the Login view, so that access to application data remains secure.

**Why this priority**: Enforces security policies and prevents stale or unauthorized access after session lifespan expiration.

**Independent Test**: Can be tested independently by simulating a cached session past its expiration timestamp, opening the app, and confirming the session is cleared and the Login view is presented.

**Acceptance Scenarios**:

1. **Given** a cached session whose expiration timestamp has passed, **When** the user launches the application, **Then** the session check identifies the session as expired, clears the local cache, and displays the Login view.
2. **Given** no session cache exists (first launch or post-logout), **When** the application launches, **Then** the user is strictly directed to the Login view.

---

### User Story 5 - Authentication Error Handling & Feedback (Priority: P3)

As a user submitting incorrect credentials or experiencing connectivity interruptions, I want to see clear, understandable error messages without app crashes, so that I understand why authentication failed and can retry.

**Why this priority**: Clear error communication ensures resilience against network blips and bad input without stranding the user in an ambiguous loading state.

**Independent Test**: Can be tested independently by triggering a 401 Unauthorized or network timeout during login submission, verifying that an informative error message is displayed, loading state is dismissed, and fields remain editable for retry.

**Acceptance Scenarios**:

1. **Given** incorrect credentials submitted to the authentication endpoint, **When** the server rejects the request (e.g. 401 Unauthorized), **Then** an error message indicating invalid credentials is displayed and the password field is ready for re-entry.
2. **Given** a network failure or unreachable server, **When** submission is attempted, **Then** a connectivity error message is displayed and the user is offered the ability to retry.
3. **Given** a submission currently in progress, **When** the user waits for the response, **Then** a visible loading state is presented and duplicate submission actions are prevented.

---

### User Story 6 - User-Initiated Logout from Club Management (Priority: P1)

As an authenticated user managing clubs, I want an easily accessible logout button with a power icon on the left side of the ClubList header, so that I can terminate my active session at any time and return safely to the Login screen.

**Why this priority**: Without an in-app logout mechanism, users cannot securely leave their session, hand off their device, or switch accounts.

**Independent Test**: Can be tested independently by logging in, navigating to the ClubList view, tapping the power icon button in the header's left action slot, verifying the session state and cached tokens are invalidated, and confirming immediate redirection to the Login screen with protected views blocked.

**Acceptance Scenarios**:

1. **Given** an authenticated user viewing the `ClubList` screen, **When** the screen header renders, **Then** an accessible logout action button displaying a standard power icon is visible on the left side of the header.
2. **Given** the logout button is pressed, **When** the logout action executes, **Then** the local session tokens and cached user state are wiped, the authentication status is set to unauthenticated, and the app transitions immediately to the Login screen.
3. **Given** a completed logout, **When** the user attempts back-navigation or deep-linking to protected screens, **Then** access is denied and the user is kept on the Login screen until re-authenticating.

---

### User Story 7 - "Remember Me" Credential Persistence & Biometric Fast-Login (Priority: P2)

As a returning user on a personal mobile device, I want a "Remember me" option on the Login screen and biometric fast-login verification, so that I do not need to manually type my password each time I access the application.

**Why this priority**: Re-typing credentials repeatedly on mobile creates high friction; biometric verification coupled with encrypted credential persistence delivers effortless, secure access.

**Independent Test**: Can be tested independently by checking "Remember me" during login, verifying credentials or persistent tokens are stored in encrypted secure storage, and triggering biometric verification upon subsequent app launches or logout return to fast-authenticate straight into the main application.

**Acceptance Scenarios**:

1. **Given** the Login view, **When** the user views the form, **Then** an interactive "Remember me" option (toggle or checkbox) is clearly displayed.
2. **Given** the user submits valid credentials with "Remember me" enabled, **When** authentication succeeds, **Then** user credentials or persistent authentication tokens are securely saved in encrypted device storage.
3. **Given** saved credentials in encrypted device storage and supported biometric hardware available, **When** the user opens the application or selects fast-login, **Then** the application triggers a biometric prompt (fingerprint or facial recognition).
4. **Given** successful biometric verification, **When** verification completes, **Then** the application automatically authenticates the user and routes them to the main application view without manual password entry.
5. **Given** biometric verification is unavailable, failed, or cancelled by the user, **When** dismissed, **Then** the application gracefully falls back to the standard Login view allowing manual credential entry.

---

### Edge Cases

- **Expired Token at Cold Start**: The local cache contains a token, but the calculated expiry timestamp has elapsed. System must clear the cache and require fresh credentials.
- **Corrupted Cache State**: SQLite session record has null, malformed, or unparsable JSON payload. System must safely treat it as a cache miss, purge corrupted rows, and present the Login view.
- **Server Offline or Network Timeout**: If the authentication endpoint is unreachable, an appropriate offline/timeout error message must display without infinite spinner or crash.
- **Missing or Undefined Environment Configuration**: If the API base URI environment variable is undefined or unconfigured in the local environment, the system must fall back gracefully to a configured local development endpoint or provide a descriptive configuration warning instead of crashing.
- **Whitespace Credential Padding**: Credentials with accidental leading or trailing whitespace should be handled consistently (e.g. username trimmed, password preserved strictly as entered).
- **Concurrent Submissions**: Rapid repeated taps on the login button must be throttled or disabled while an active request is pending.
- **Device Clock Skew**: If the local device clock differs drastically, session validation should safely fall back to server-provided expiration relative durations.
- **Offline Logout**: When the user triggers logout while the device is offline, local session cache and in-memory authentication states must still be wiped immediately and redirection to the Login screen completed.
- **Biometric Hardware Unavailable or Unenrolled**: If a device lacks biometric sensors, biometrics are unconfigured in OS settings, or user denies biometric permissions, the application must hide the biometric prompt and fall back smoothly to manual password entry without errors.
- **Failed or Cancelled Biometrics**: Multiple failed biometric attempts or user cancellation must not lock the user out of the application; the form remains interactive for manual entry.
- **Disabling "Remember Me"**: If a user logs in with "Remember me" disabled after having previously enabled it, any existing persisted credentials in encrypted secure storage must be purged.
- **Concurrent In-Flight Requests on Logout**: If background synchronization or data fetch is executing when the user logs out, responses must be disregarded and must not rehydrate the authenticated state.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST configure the routing structure such that the Login view is the default entry point whenever an active authenticated session does not exist.
- **FR-002**: The Login view MUST provide an editable text input for `username` and a protected (masked/secure) text input for `password`.
- **FR-003**: The Login view MUST provide an action trigger to submit the login form.
- **FR-004**: The system MUST perform client-side validation on both username and password inputs before allowing submission, verifying that neither field is empty or composed exclusively of whitespace.
- **FR-005**: The system MUST prevent network submission and provide user-facing validation error indicators when input validation fails.
- **FR-006**: Upon valid form submission, the system MUST transmit credentials via `POST` to `/auth/login` using the base URL supplied by the application's environment configuration (`${API_URI}/auth/login`).
- **FR-007**: The system MUST present a loading indicator and disable duplicate submission triggers while the authentication request is in flight.
- **FR-008**: Upon successful authentication response, the system MUST persist the session data (`token`, `tokenType`, `expiresIn`, and `user` object containing `id`, `username`, `status`, `createdAt`) into local SQLite storage.
- **FR-009**: The local persistence MUST compute and store an absolute expiration timestamp based on the current timestamp plus `expiresIn` seconds.
- **FR-010**: During application launch lifecycle, the system MUST perform an initial session check against local SQLite storage.
- **FR-011**: If a valid, non-expired session exists in the local cache, the application MUST automatically bypass the Login view and route the user to the main application interface.
- **FR-012**: If the session cache is empty, corrupted, or expired, the application MUST clear any stale session records and route the user to the Login view.
- **FR-013**: The system MUST display an informative error notification and restore the interactive form state when the authentication service returns an error or when network failure occurs.
- **FR-014**: The project MUST provide an environment file (`.env` and accompanying `.env.example` template) defining runtime configuration values, including the backend API endpoint base URL (`API_URI` / `EXPO_PUBLIC_API_URI`).
- **FR-015**: The application MUST provide a centralized environment configuration module that safely reads, types, and exports environment variables for clean imports across application features and services.
- **FR-016**: The authentication service MUST import the API base URI strictly through the centralized environment configuration module rather than hardcoding host URLs or referencing scattered ad-hoc process lookups.
- **FR-017**: The application header in the `ClubList` view MUST render a logout action button on the left side featuring a standard power icon.
- **FR-018**: Triggering the logout button MUST invalidate the active session, clear stored session tokens and user state from local persistence, and immediately redirect the user to the Login view.
- **FR-019**: After logout, the application MUST restrict access, preventing navigation back into protected screens without re-authentication.
- **FR-020**: The Login view MUST provide an interactive "Remember me" toggle or checkbox allowing users to opt into credential persistence.
- **FR-021**: When "Remember me" is enabled, user credentials or session authentication tokens MUST be persisted in encrypted secure device storage.
- **FR-022**: When remembered credentials exist and supported biometric hardware is available, the application MUST support biometric verification to automatically authenticate and log in the user without manual password entry.
- **FR-023**: If biometric authentication is unavailable, denied, failed, or cancelled, the application MUST allow the user to authenticate manually using standard username and password inputs.
- **FR-024**: If the user submits login credentials with "Remember me" disabled, any previously saved credentials or biometric enrollment data in encrypted secure storage MUST be purged.

---

### Key Entities *(include if feature involves data)*

- **User Credentials**:
  - `username`: Text string identifying the user account.
  - `password`: Secret string used for identity verification (never persisted in plain text in unencrypted storage).

- **Authentication Session Cache**:
  - `token`: Unique authorization token string issued by the authentication service.
  - `tokenType`: Token scheme (e.g., `"Bearer"`).
  - `expiresIn`: Granted validity lifespan in seconds.
  - `expiresAt`: Computed absolute timestamp indicating when the session expires.
  - `createdAt`: Timestamp recording when the session was created locally.

- **User Profile**:
  - `id`: Unique user identifier (integer).
  - `username`: Account username handle (string).
  - `status`: Account operational status (e.g., `"ACTIVE"`).
  - `createdAt`: Account registration timestamp.

- **Environment Configuration**:
  - `API_URI`: Base URL string pointing to the backend authentication and API server.
  - `isProduction`: Boolean indicator identifying whether the application is running in production mode.

- **Credential Persistence & Biometric State**:
  - `rememberMe`: Boolean indicator specifying if the user chose to persist credentials on the device.
  - `secureCredentials`: Encrypted payload stored in hardware-backed secure storage.
  - `biometricStatus`: Availability status of device biometric sensors (enrolled, supported, unavailable).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unauthenticated application launches open directly to the Login view page without exposing protected routes.
- **SC-002**: Users with valid cached sessions navigate to the main application screen in under 1.5 seconds on cold launch, with 0 intermediate interactive login prompts.
- **SC-003**: 100% of invalid or empty submission attempts provide visible inline validation feedback within 200ms and dispatch 0 network calls.
- **SC-004**: 100% of expired or corrupted cached sessions are safely invalidated and prompt the user to re-authenticate.
- **SC-005**: Successful authentication and session caching to local persistence completes navigation to the main application within 1 second after API response delivery.
- **SC-006**: 95% of users with valid credentials successfully complete login on their first attempt without confusion or unexpected errors.
- **SC-007**: 100% of external authentication and API requests resolve their target destination from the centralized, imported environment configuration module with 0 hardcoded hosts in service code.
- **SC-008**: 100% of logout actions destroy the local session and navigate the user back to the Login screen in under 500 milliseconds.
- **SC-009**: 100% of logout operations block back-navigation into protected application views until a new authentication succeeds.
- **SC-010**: Users with "Remember me" and biometric verification enabled can complete authentication and land on the main screen in under 2 seconds without manually typing credentials.
- **SC-011**: 100% of stored "Remember me" credentials and tokens are kept strictly in encrypted secure storage, with 0 unencrypted plain text passwords stored in local SQLite or file system.
- **SC-012**: 100% of biometric failures, cancellations, or device incompatibilities gracefully fall back to the standard manual login form without application exceptions or user lockouts.

---

## Assumptions

- The API endpoint base URL is configured in the `.env` file (e.g. `API_URI=http://localhost:3000` or `EXPO_PUBLIC_API_URI=...`) and exposed via a centralized config module.
- A template `.env.example` file is tracked in version control to document required environment variables for all developers.
- The authentication API adheres strictly to the provided response structure containing `token`, `tokenType`, `expiresIn`, and `user`.
- Passwords are masked by default using standard platform password input controls (`secureTextEntry`).
- A single active session exists per application installation (logging in overwrites or replaces any prior session record).
- Session expiration is calculated locally as `current_time + (expiresIn * 1000)`.
- When an expired session is detected, automatic cleanup safely wipes the session data so future checks do not encounter stale tokens.
- The left side of the header in the `ClubList` view provides the logout action button with a standard power icon, while maintaining consistency with existing header layouts.
- Credential persistence ("Remember me") uses device-encrypted secure storage (such as `expo-secure-store`) rather than plain SQLite tables.
- Biometric verification uses platform biometric APIs (such as `expo-local-authentication`), prompting only when hardware is available and enrolled.
