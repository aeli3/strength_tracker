# Strength Tracker Agents Guide

Purpose: build a simple, premium strength tracking app in React Native with Expo.
Optimize for UX, performance, clean architecture, and maintainability.

Keep this file current. When routes, feature folders, shared primitives, design tokens,
or data ownership change, update the relevant section in the same PR/change.

## Product Direction

Strength Tracker helps users browse exercises, log strength work, and understand
progression over time without clutter.

Design references: Apple Fitness, Things 3, Linear, Arc Browser, Notion Calendar.
The app should feel calm, fast, minimal, and polished.

Default UX questions before adding UI:

- Can this be simpler?
- Can one component, field, or button disappear?
- Is the primary action obvious without explaining the screen?

Prefer cards, bottom sheets, segmented controls, compact lists, floating action
buttons, and direct manipulation. Avoid huge forms, dense text, nested modals,
ugly tables, large dropdowns, and decorative UI that does not help the workout flow.

## Tech Stack

- Expo Router app rooted at `src/app`.
- Expo SDK 56. When using Expo APIs, check the versioned docs at
  `https://docs.expo.dev/versions/v56.0.0/`.
- React Native + TypeScript with strict mode.
- Metro uses `metro.config.js` to include SQLite's web WASM asset extension.
- Path aliases from `tsconfig.json`: use `@/*` for `src/*` and `@/assets/*` for assets.
- Theme tokens live in `src/constants/theme.ts`.
- Phone-local workout data uses Expo SQLite.
- App-level providers live in `src/providers`.
- Shared hooks live in `src/hooks`.
- Feature code lives in `src/features/<feature>`.

Useful scripts:

- `pnpm start`
- `pnpm ios`
- `pnpm android`
- `pnpm web`
- `pnpm lint`

## Current Source Map

- `src/app/_layout.tsx`: root Expo Router stack and app-level providers.
- `src/app/index.tsx`: exercise list home screen.
- `src/app/exercise/[id].tsx`: exercise detail route.
- `src/app/exercise-create.tsx`: full-screen custom exercise creation route.
- `src/app/exercise-edit.tsx`: full-screen exercise editing route.
- `src/app/log-create.tsx`: full-screen exercise log creation route.
- `src/app/log-edit.tsx`: full-screen exercise log editing route.
- `metro.config.js`: Expo Metro config with `wasm` assets enabled for Expo SQLite web.
- `src/providers/theme-provider.tsx`: theme preference, resolved color scheme, Expo theme bridge.
- `src/constants/theme.ts`: colors, exercise icon palettes, typography, fonts, spacing, content width, platform insets.
- `src/hooks/use-theme.ts`: current color palette access.
- `src/components/ui/animated-pressable.tsx`: shared press feedback with native ripple support and subtle scale/opacity animation.
- `src/components/ui/action-bottom-sheet.tsx`: shared hold-action bottom sheet for edit/delete choices.
- `src/components/ui/card.tsx`: shared themed card surface.
- `src/components/ui/chevron-icon.tsx`: shared cross-platform chevron icon using SF Symbols on iOS and a native drawn fallback elsewhere.
- `src/components/ui/theme-switch.tsx`: themed switch control.
- `src/features/settings/components/settings-modal.tsx`: settings bottom sheet.
- `src/features/exercises`: exercise browsing feature.
- `src/features/exercises/data/exercises.ts`: temporary static exercise catalog.
- `src/features/exercises/types/index.ts`: exercise and muscle group types.
- `src/features/exercises/hooks/use-exercise-filter.ts`: search and muscle filter state.
- `src/features/exercises/hooks/use-exercises.ts`: SQLite-backed exercise catalog loading, custom exercise creation, editing, and deletion.
- `src/features/exercises/hooks/use-exercise-home-stats.ts`: SQLite-backed home summary stats refresh on focus.
- `src/features/exercises/hooks/use-exercise-sessions.ts`: local exercise session loading, saving, editing, and deletion state.
- `src/features/exercises/services/exercise-session-store.ts`: Expo SQLite persistence for seeded/custom exercises, exercise sessions, sets, and derived home stats.
- `src/features/exercises/utils/session-stats.ts`: derived session stats and formatting helpers.
- `src/features/exercises/components`: exercise list, detail, full-screen create/edit forms, and log UI components.

## Architecture Rules

Use feature-based folders. A feature should own its data access, state hooks, types,
and components unless the code is clearly reusable across multiple features.

Recommended feature shape:

```text
src/features/<feature>/
  components/
  data/
  hooks/
  services/
  types/
  utils/
```

Only create folders that are needed. Do not add empty architecture.

Route files in `src/app` should compose screens and navigation. Keep domain logic in
`src/features/*`. Shared visual primitives belong in `src/components`, but feature-
specific UI stays inside the feature folder.

Do not leave styled modals, sheets, switches, cards, list rows, or multi-part controls
inline inside route files. Extract them into named components once they have their own
styles, state wiring, or product meaning. Routes should read like screen composition.

When adding future strength tracking work:

- `src/features/workouts`: workout/session creation and active workout flow.
- `src/features/sets`: set entry, validation, and history.
- `src/features/progress`: charts, PRs, trends, and progression summaries.
- `src/features/exercises`: catalog, exercise metadata, and exercise detail content.

Prefer small typed hooks over global state. Add shared state only when prop flow becomes
awkward across routes or features.

## UI System

Use `src/constants/theme.ts` before inventing values.

Color discipline:

- Dark mode is strict black/white with subtle neutral surfaces only.
- Light mode is strict white/blue with soft blue-tinted surfaces only.
- Buttons, chips, switches, and selected states must use `Colors.*.accent`,
  `accentText`, or the switch tokens rather than hardcoded local colors.

Current spacing tokens:

- `Spacing.one = 4`
- `Spacing.two = 8`
- `Spacing.three = 16`
- `Spacing.four = 24`
- `Spacing.five = 32`
- `Spacing.six = 64`

Desired scale for future token cleanup: `4, 8, 12, 16, 24, 32, 48, 64`.
If `12` or `48` are needed repeatedly, add named tokens once instead of scattering
magic numbers.

Typography: use `Typography` from `src/constants/theme.ts` for headings, labels,
section labels, sheet titles, and body text. Prefer Inter where loaded, otherwise
platform system fonts via `Fonts`. Avoid giant headings, random weights, negative
letter spacing, and inconsistent vertical rhythm.

Visual style:

- Lots of whitespace.
- Soft rounded corners.
- Subtle shadows or elevation only when they clarify layering.
- Calm colors.
- No harsh borders.
- Smooth transitions around 150-250ms, ease-out, and subtle.

Lists should feel native and fast. Use `SectionList`/`FlatList` for long collections,
stable keys, memoized derived data, and avoid heavy render work inside list items.

## Code Style

- TypeScript first. Keep props and domain models explicit.
- Prefer named exports for feature components and hooks.
- Use `StyleSheet.create` for React Native styles unless an existing pattern changes.
- Keep route components thin and readable.
- Use `useMemo` only for meaningful derived work, not decorative optimization.
- Use platform-specific files only when behavior truly differs.
- Use ASCII text in source unless the file already needs Unicode. Watch for mojibake
  in fallback symbols.
- Keep comments rare and useful.

## Data Direction

The static catalog in `src/features/exercises/data/exercises.ts` is seed data. Expo SQLite
owns the runtime exercise list, with seed exercises inserted via `INSERT OR IGNORE` and
custom exercises stored in the same `exercises` table.

Keep separate:

- catalog exercise definitions
- user-created exercises
- workout sessions
- sets/reps/weight records
- derived progress stats

Do not mix persisted user logs or custom exercises into the static catalog module.

## Definition Of Done

Before finishing a code change:

- Run `pnpm lint` when practical.
- Verify TypeScript errors for touched files.
- For UI changes, check both light and dark mode assumptions.
- Confirm mobile layouts do not overlap or require explanation text.
- Update this file if the source map, architecture, scripts, or ownership changed.
