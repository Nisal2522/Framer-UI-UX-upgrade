# Security Audit Notes

## Scope

Audit scope covers `src/app` for:

- XSS-prone sinks (`innerHTML`, direct DOM writes, trust-bypass APIs)
- HTTP client security configuration (XSRF/XSSI support)
- CSP and Trusted Types alignment for local development

## Findings

1. No `bypassSecurityTrust*` usage detected in application code.
2. No `[innerHTML]` bindings detected in templates.
3. `ElementRef` is used for UI interaction and map hosting; no unsafe HTML injection paths were found in those usages.
4. `window.alert` existed in login actions and was replaced with app notification service messages.
5. `HttpClient` security wiring was missing and has been added in `AppModule` with explicit XSRF token/header names.

## Mitigations Applied

- Enabled Angular security options in `angular.json`:
  - `security.autoCsp: true`
  - `security.allowedHosts`: localhost defaults
- Added dev-server CSP and Trusted Types header for local enforcement.
- Added XSRF client protection via `HttpClientXsrfModule.withOptions` in `AppModule`.
- Added repository security baseline and contributor rules in `SECURITY.md`.

## Outstanding Infrastructure Tasks

These must be completed in deployment infrastructure:

1. Enforce CSP with per-request nonce in production headers.
2. Enforce Trusted Types in production headers, including any required Angular policies.
3. Ensure backend validates XSRF cookie/header pair on mutating requests.
4. Define production/staging host allowlists for `security.allowedHosts`.
