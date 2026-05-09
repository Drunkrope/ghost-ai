# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 04: Project Dialogs & Editor Home — complete

## Current Goal

- Implement editor home screen, project CRUD dialogs, sidebar project items with rename/delete actions, and mobile backdrop (feature 04).

## Completed

- 01-design-system: shadcn/ui (base-nova preset, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components, lucide-react, lib/utils.ts cn() helper, globals.css dark theme variables.
- 02-editor-chrome: `components/editor/editor-navbar.tsx` (fixed top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose, dark bg + bottom border), `components/editor/project-sidebar.tsx` (floating overlay, slides in from left, isOpen prop, Projects header + close button, My Projects / Shared tabs with empty states, New Project button). Dialog pattern is ready for use via existing `components/ui/dialog.tsx` which consumes globals.css color tokens.
- 03-auth: `proxy.ts` (protected-first Clerk middleware, public routes from env vars), `ClerkProvider` wrapping root layout with `dark` theme and CSS variable appearance overrides, `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` (two-panel layout: left logo/tagline/features on large screens, Clerk form right/full on mobile), root `app/page.tsx` redirects authenticated → `/editor`, unauthenticated → `/sign-in`, `UserButton` in editor navbar right section.
- 04-project-dialogs: `types/project.ts` (Project interface), `lib/mock-projects.ts` (3 mock projects, 2 owned + 1 shared), `hooks/use-project-dialogs.ts` (dialog/form/loading state, slug derivation, mock async submit), `components/editor/editor-context.tsx` (React context exposing `openCreate` to children), `components/editor/project-dialogs.tsx` (Create with live slug preview, Rename with prefill + auto-focus + Enter submit, Delete with destructive button), updated `components/editor/project-sidebar.tsx` (project list in My Projects/Shared tabs, owned-only hover-reveal Rename/Trash actions, mobile backdrop scrim, New Project footer wired), updated `components/editor/editor-shell.tsx` (provides EditorContext, mounts ProjectDialogs), updated `app/editor/page.tsx` (editor home: heading + description + New Project button wired to Create dialog via context).

## In Progress

- None.

## Next Up

- Feature 05 (TBD).

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui uses the "base-nova" preset (Base UI primitives, not Radix). Detected Tailwind v4 automatically — no tailwind.config.js needed.
- Dark-only: `:root` holds all dark values; no `.dark` class toggle needed. shadcn `dark:` variants are inert but harmless.
- Both shadcn semantic tokens (`--background`, `--primary`, etc.) and project design tokens (`--bg-base`, `--accent-primary`, etc.) live in `:root`. `@theme inline` exposes both as Tailwind utilities.
- Tailwind utility aliases: `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.
- Dialog state managed in `EditorShell` via `useProjectDialogs` hook; exposed to child routes through `EditorContext`. This keeps dialog logic out of the layout and away from RSC boundaries.

## Session Notes

- Add context needed to resume work in the next session.
