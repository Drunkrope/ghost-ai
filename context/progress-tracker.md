# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 07: Wire Editor Home — complete

## Current Goal

- None.

## Completed

- 01-design-system: shadcn/ui (base-nova preset, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components, lucide-react, lib/utils.ts cn() helper, globals.css dark theme variables.
- 02-editor-chrome: `components/editor/editor-navbar.tsx` (fixed top navbar, sidebar toggle with PanelLeftOpen/PanelLeftClose, dark bg + bottom border), `components/editor/project-sidebar.tsx` (floating overlay, slides in from left, isOpen prop, Projects header + close button, My Projects / Shared tabs with empty states, New Project button). Dialog pattern is ready for use via existing `components/ui/dialog.tsx` which consumes globals.css color tokens.
- 03-auth: `proxy.ts` (protected-first Clerk middleware, public routes from env vars), `ClerkProvider` wrapping root layout with `dark` theme and CSS variable appearance overrides, `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` (two-panel layout: left logo/tagline/features on large screens, Clerk form right/full on mobile), root `app/page.tsx` redirects authenticated → `/editor`, unauthenticated → `/sign-in`, `UserButton` in editor navbar right section.
- 04-project-dialogs: `types/project.ts` (Project interface), `lib/mock-projects.ts` (3 mock projects, 2 owned + 1 shared), `hooks/use-project-dialogs.ts` (dialog/form/loading state, slug derivation, mock async submit), `components/editor/editor-context.tsx` (React context exposing `openCreate` to children), `components/editor/project-dialogs.tsx` (Create with live slug preview, Rename with prefill + auto-focus + Enter submit, Delete with destructive button), updated `components/editor/project-sidebar.tsx` (project list in My Projects/Shared tabs, owned-only hover-reveal Rename/Trash actions, mobile backdrop scrim, New Project footer wired), updated `components/editor/editor-shell.tsx` (provides EditorContext, mounts ProjectDialogs), updated `app/editor/page.tsx` (editor home: heading + description + New Project button wired to Create dialog via context).
- 05-prisma: `prisma/models/project.prisma` (Project model with ownerId/name/description/status enum/canvasJsonPath/timestamps and indexes on ownerId+createdAt; ProjectCollaborator with cascade delete, unique projectId+email, indexes on email and projectId+createdAt), `lib/prisma.ts` (cached singleton branching on DATABASE_URL prefix: `prisma+postgres://` → Accelerate via `withAccelerate`, otherwise `@prisma/adapter-pg`; global cache for dev hot-reloads), migration `20260509235103_init_projects` applied, client generated to `app/generated/prisma`.
- 06-project-apis: `app/api/projects/route.ts` (GET lists owner's projects ordered by createdAt desc; POST creates with name defaulting to "Untitled Project"), `app/api/projects/[projectId]/route.ts` (PATCH renames — 401/403/404 enforced; DELETE — 401/403/404 enforced, returns 204). Fixed `lib/prisma.ts` union type issue by casting Accelerate-extended client to `PrismaClient` so route handlers resolve `findUnique` correctly.
- 07-wire-editor-home: `lib/projects.ts` (getOwnedProjects/getSharedProjects server helpers using auth()/currentUser()); `hooks/use-project-actions.ts` (replaces mock useProjectDialogs — manages dialog state, calls POST/PATCH/DELETE APIs, navigates to new workspace on create, refreshes or redirects on rename/delete, slug+suffix preview); `app/editor/layout.tsx` (async RSC, fetches both project lists, passes to EditorShell); `app/editor/page.tsx` (converted to RSC); `components/editor/new-project-button.tsx` (client sub-component for the CTA button); `components/editor/editor-shell.tsx` (accepts initialOwnedProjects/initialSharedProjects); `components/editor/project-sidebar.tsx` (accepts ownedProjects/sharedProjects separately); `types/project.ts` (simplified to {id, name}). Removed mock-projects.ts and use-project-dialogs.ts.

## In Progress

- None.

## Next Up

- Feature 08 (TBD).

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
