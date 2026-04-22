# Style Architecture Guide

## Goals
- Keep styles reusable across projects.
- Centralize design decisions through tokens and theme maps.
- Separate shared primitives from page-specific styling.

## SCSS Structure
All global styles live under `src/assets/scss`:

- `tokens/`: spacing, typography, radius, shadow, z-index, neutral color scales.
- `themes/`: build-time theme maps (`_default.scss`, `_project-a.scss`) and active selector (`_current.scss`).
- `tools/`: shared functions and mixins (`theme()`, `space()`, `radius()`, `focus-ring`, etc.).
- `base/`: root/global base styles and background helpers.
- `utilities/`: small reusable helper classes.
- `components/`: reusable UI primitives (`buttons`, `cards`, `forms`, `tables`, `badges`).
- `layout/`: shared structural classes (`shell`, `header`, `sidebar`, `grid`).
- `pages/`: page-level shared hooks only.
- `main.scss`: layered entrypoint import order.

## Import Order
`main.scss` keeps deterministic layering:
1. vendors
2. tokens
3. themes
4. tools
5. base
6. utilities
7. components
8. layout
9. pages

## Theme Switching (Build-Time)
1. Open `src/assets/scss/themes/_current.scss`.
2. Change:
   - `@forward 'default';`
   - to `@forward 'project-a';` (or another theme file).
3. Rebuild application.

All shared primitives should read colors from `theme(<key>)` in `tools/_functions.scss` rather than hardcoded project colors.

## Authoring Rules
- Use token/functions for spacing/radius/shadow/typography whenever possible.
- Shared, reusable styles go into `components/` or `utilities/`.
- App-shell structure belongs in `layout/`.
- Keep `src/app/**/.component.scss` minimal and feature-local; avoid duplicating primitives already in shared layers.
- Avoid hardcoding brand colors outside `themes/`.

## Existing Shared Primitives
- Buttons: `src/assets/scss/components/_buttons.scss`
- Forms: `src/assets/scss/components/_forms.scss`
- Cards: `src/assets/scss/components/_cards.scss`
- Tables: `src/assets/scss/components/_tables.scss`
- Badges: `src/assets/scss/components/_badges.scss`
