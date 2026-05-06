# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 01: Design System — complete

## Current Goal

- Define the immediate implementation goal here.

## Completed

- 01-design-system: shadcn/ui (base-nova preset, Tailwind v4), Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea components, lucide-react, lib/utils.ts cn() helper, globals.css dark theme variables.

## In Progress

- None yet.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui uses the "base-nova" preset (Base UI primitives, not Radix). Detected Tailwind v4 automatically — no tailwind.config.js needed.
- Dark-only: `:root` holds all dark values; no `.dark` class toggle needed. shadcn `dark:` variants are inert but harmless.
- Both shadcn semantic tokens (`--background`, `--primary`, etc.) and project design tokens (`--bg-base`, `--accent-primary`, etc.) live in `:root`. `@theme inline` exposes both as Tailwind utilities.
- Tailwind utility aliases: `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, etc.

## Session Notes

- Add context needed to resume work in the next session.
