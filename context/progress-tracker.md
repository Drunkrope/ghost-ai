# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 03: Auth — complete

## Current Goal

- Implement Clerk authentication: provider, auth pages, redirects, route protection, and user menu (feature 03).

## Completed

- 01-design-system: shadcn/ui (base-nova preset, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components, lucide-react, lib/utils.ts cn() helper, globals.css dark theme variables.
- 02-editor-chrome: `components/editor/editor-navbar.tsx` (fixed top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose, dark bg + bottom border), `components/editor/project-sidebar.tsx` (floating overlay, slides in from left, isOpen prop, Projects header + close button, My Projects / Shared tabs with empty states, New Project button). Dialog pattern is ready for use via existing `components/ui/dialog.tsx` which consumes globals.css color tokens.
- 03-auth: `proxy.ts` (protected-first Clerk middleware, public routes from env vars), `ClerkProvider` wrapping root layout with `dark` theme and CSS variable appearance overrides, `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` (two-panel layout: left logo/tagline/features on large screens, Clerk form right/full on mobile), root `app/page.tsx` redirects authenticated → `/editor`, unauthenticated → `/sign-in`, `UserButton` in editor navbar right section.

## In Progress

- None.

## Next Up

- Feature 04 (TBD).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui uses the "base-nova" preset (Base UI primitives, not Radix). Detected Tailwind v4 automatically — no tailwind.config.js needed.
- Dark-only: `:root` holds all dark values; no `.dark` class toggle needed. shadcn `dark:` variants are inert but harmless.
- Both shadcn semantic tokens (`--background`, `--primary`, etc.) and project design tokens (`--bg-base`, `--accent-primary`, etc.) live in `:root`. `@theme inline` exposes both as Tailwind utilities.
- Tailwind utility aliases: `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.

## Session Notes

- Add context needed to resume work in the next session.
