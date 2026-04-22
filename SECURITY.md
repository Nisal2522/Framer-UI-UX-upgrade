# Angular Security Hardening

This project follows Angular security guidance for XSS, CSP, Trusted Types, and HTTP-level protections.

## Runtime baseline

- Angular AOT builds are used for production.
- CSP is enabled for local development through `angular.json` dev-server headers.
- Trusted Types are enabled with Angular policies:
  - `angular`
  - `angular#bundler`
- Build-time security options are enabled in `angular.json`:
  - `security.autoCsp: true`
  - `security.allowedHosts` configured for local hosts.
- XSRF support is enabled in `AppModule` via `HttpClientXsrfModule.withOptions`.

## Security rules for contributors

1. Do not generate templates from user input.
2. Avoid direct DOM writes. Prefer Angular template bindings.
3. Do not use `bypassSecurityTrust*` unless a security review is documented in the PR.
4. Treat values bound to URLs/HTML/styles as untrusted unless explicitly validated.
5. Keep request-mutating APIs protected by XSRF token validation on backend and client.

## Audit checklist

Run these checks before merge:

```bash
npm run build
npm run test -- --watch=false
npm run lint
```

Then audit risky patterns:

- `innerHTML` and `[innerHTML]`
- `bypassSecurityTrust*`
- `document.` / `window.` direct sink usage
- direct `ElementRef.nativeElement` writes

## Security exceptions register

Any exception must include:

- File path and line-level context
- Why the safe Angular pattern is not possible
- Input validation performed
- Threat analysis for XSS/CSRF impact
- Reviewer sign-off
