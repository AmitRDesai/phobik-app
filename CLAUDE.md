# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Phobik is an Expo mobile app built with React Native, using Expo Router for navigation and NativeWind (Tailwind CSS) for styling. The app uses an **offline-first architecture** via PowerSync for user-scoped data. It targets iOS, Android, and web platforms with the New Architecture enabled.

## Development Commands

```bash
# Build and run (REQUIRED for PowerSync — Expo Go does NOT work)
npx expo run:ios
npx expo run:android

# Start development server (only for non-PowerSync features)
npx expo start

# Install dependencies (IMPORTANT: Always use expo install, not npm install)
npx expo install <package-name>

# Linting
npm run lint
```

## Architecture

### Data Layer — Offline-First with PowerSync

The app uses a **dual data layer**:

1. **PowerSync + Kysely + TanStack Query** (`src/lib/powersync/`) — Offline-first local SQLite with sync to Postgres
   - Reads: `useQuery()` from `@powersync/tanstack-react-query` with Kysely query builders — type-safe, reactive watched queries that auto-update on any table change
   - Writes: Kysely `db.insertInto()` / `db.updateTable()` / `db.deleteFrom()` via standard TanStack `useMutation` — no manual query invalidation needed (watched queries auto-update)
   - Kysely wrapper: `src/lib/powersync/database.ts` — `wrapPowerSyncWithKysely<Database>(powersync)`
   - Schema: `src/lib/powersync/schema.ts` — 10 synced tables (includes user_affirmation)
   - Connector: `src/lib/powersync/connector.ts` — routes writes to oRPC procedures
   - Provider: `PowerSyncContext.Provider` + `PersistQueryClientProvider` in `_layout.tsx`
   - Connected/disconnected in `useAppInitializer.ts` based on auth state

   **Offline-first modules** (use PowerSync + Kysely + TanStack):
   - Journal (entries, tags, stats)
   - Gentle Letter
   - Empathy Challenge
   - Mystery Challenge
   - Self Check-Ins
   - Calendar Preferences
   - Affirmations (daily selection + history)
   - Profile writes (saveProfile, onboarding answers, completeOnboarding)

2. **React Query + oRPC** — Online-only server state
   - Configured in `src/utils/query-client.ts`
   - Integrated with NetInfo for offline detection
   - Used via `orpc.*` query/mutation options from `src/lib/orpc.ts`

   **Online-only modules** (use React Query):
   - Auth (Better Auth)
   - AI Coach (streaming)
   - Community (social feed)
   - Profile status + onboarding (navigation guard)

### PowerSync Hook Patterns

**Reading data (Kysely + TanStack watched query):**
```typescript
import { useQuery } from '@powersync/tanstack-react-query';
import { db } from '@/lib/powersync/database';
import { toCamel } from '@/lib/powersync/utils';

// Kysely query builder — type-safe, auto-updates when table changes
const ENTRY_JSON = { tags: true };
const { data, isLoading } = useQuery({
  queryKey: ['journal-entries', userId, date],
  query: db.selectFrom('journal_entry').selectAll().where('user_id', '=', userId).where('entry_date', '=', date),
  enabled: !!userId,
});
// toCamel converts snake_case → camelCase and parses JSON columns
const entries = data?.map(r => toCamel(r, ENTRY_JSON));
```

**Writing data (Kysely + TanStack useMutation):**
```typescript
import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useMutation } from '@tanstack/react-query';

// Standard TanStack useMutation — no manual invalidation needed
// PowerSync's watched queries auto-update when the table changes
return useMutation({
  mutationFn: async (input) => {
    await db.insertInto('journal_entry').values({ id: uuid(), ...input }).execute();
  },
});
```

**Key rules:**
- Use `useQuery` from `@powersync/tanstack-react-query` for reads — NOT from `@tanstack/react-query` or `@powersync/react`
- Use `useMutation` from `@tanstack/react-query` for writes — standard TanStack API
- Use `db` from `@/lib/powersync/database` for Kysely query builders — NOT raw SQL strings
- Use `toCamel(row, jsonColumns?)` from `@/lib/powersync/utils` — Kysely returns snake_case, screens expect camelCase
- Use `uuid()` from `@/lib/crypto` — `crypto.randomUUID()` does NOT work in React Native
- No manual query invalidation needed for PowerSync data — watched queries auto-update on table changes
- Use `toJSON()` when writing JSONB columns, pass column name to `toCamel()` when reading
- Use `useUserId()` from `@/lib/powersync/useUserId` to get the current user ID for queries

### Client-Side State (Jotai)

Jotai is used only for **local UI state** — not for server/synced data:
- `isReturningUserAtom` — persisted flag for auth flow
- `biometricEnabledAtom`, `isSignedOutAtom` — auth module state
- `journalDraftAtom` — crash-recovery draft for journal entries
- `questionnaireAtom` — account creation form state
- Various module-specific UI state (selected date, filters, timer state)

### Navigation

- **Expo Router** with file-based routing in `src/app/`
- Root layout (`src/app/_layout.tsx`) wraps with `PowerSyncContext.Provider` and `PersistQueryClientProvider`
- All Stack screens have `headerShown: false` by default
- Uses typed routes (`experiments.typedRoutes: true` in app.json)

#### Routing rules

- `router.push()` for forward navigation in flows — back must always work
- `router.replace()` only for: post-auth redirects, sign-in ↔ sign-up swaps, completion → root
- `router.dismissAll()` to exit a multi-step flow back to its root
- `<Redirect>` allowed for state-driven routing — be aware it doesn't push history (back goes wherever the user came from, not the redirect source)
- **No `as never` / `as any` on route paths** — typed-routes works correctly when paths are right; a cast indicates a real bug to fix

#### Route conventions

- Always **kebab-case** (`daily-flow`, `self-check-ins`)
- **Plural** for collections (`/practices`, `/meditations`, `/movements`), **singular** for actions/flows (`/affirmation/...`, `/journal/entry/[id]`)
- **Max 3 levels of nesting** — flatten deeper paths
- URL segments for routing-relevant params (`/journal/entry/[id]`); query strings only for ephemeral hints (`?autoUnlock=1`)

### Styling

- **NativeWind v4** (Tailwind CSS for React Native)
- Global CSS: `global.css` imported in `_layout.tsx`
- Metro configured with NativeWind transformer
- **Do not hardcode colors** — Always use `tailwind.config.js` for Tailwind classes and `src/constants/colors.ts` for programmatic color access
- **Prefer `className` over inline `style`** — convert static styles to NativeWind classes:
  - Layout/spacing/sizing: `flex-1`, `items-center`, `px-8`, `h-14 w-14`, etc.
  - Colors/backgrounds: `bg-primary-pink`, `text-white/50`, `border-white/10`
  - Opacity with color: `bg-primary-pink/[0.15]`, `text-primary-muted/80`
  - Arbitrary values: `rounded-[140px]`, `top-[30px]`, `h-[280px]`
  - Platform modifiers: `android:p-0`, `ios:pt-16`
  - ScrollView layout: use `contentContainerClassName` for static layout classes, keep `contentContainerStyle` only for dynamic values (e.g., `paddingBottom: FADE_HEIGHT`)
- **Keep inline `style` only when required:**
  - `LinearGradient` styles (NativeWind doesn't apply to gradient containers)
  - Shadow props (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`) — limited NativeWind support on native
  - Dynamic computed values (e.g., `width: \`${percent}%\``)
  - SVG component props (no className support)

### Animations

- **Prefer `react-native-ease` (`EaseView`)** for all new animations. It supports: opacity, translateX, translateY, scale, scaleX, scaleY, rotate, rotateX, rotateY, borderRadius, backgroundColor.
- **Fall back to `react-native-reanimated`** only when `EaseView` cannot handle the animation:
  - Gesture-driven animations (`Gesture.Pan`, `Gesture.Pinch`, etc.)
  - Scroll-driven animations (`useAnimatedScrollHandler`)
  - Animation sequencing (`withSequence`)
  - Complex interpolation (`interpolate` with >2 values, `interpolateColor`)
  - SVG animated props (`useAnimatedProps`)
  - Worklet-based animations (`runOnUI`, `'worklet'` directive)
  - Unsupported properties (height, width, etc.)
- **NativeWind integration**: `import 'react-native-ease/nativewind'` is added in `_layout.tsx` — this enables `className` on `EaseView`

### Key Configuration

- **Path aliases**: `@/*` maps to `src/*` (tsconfig.json)
- **New Architecture enabled**: `newArchEnabled: true` in app.json
- **React Compiler enabled**: `experiments.reactCompiler: true`
- **SVG support**: Metro configured with `react-native-svg-transformer`
- **Environment variables**: Access via `src/utils/env.ts` helper
  - `EXPO_PUBLIC_ENV`: development | preview | production
  - `EXPO_PUBLIC_API_ENDPOINT`: API base URL

### Project Structure

```
src/
├── app/              # Expo Router routes (thin re-exports + layouts ONLY)
├��─ components/       # SHARED: ui/, icons/, ErrorBoundary
│   ├── ui/          # Base UI components (Button, Container, etc.)
│   ├── icons/       # Shared icon components
│   └── ErrorBoundary.tsx
├── constants/        # SHARED: Static values (colors, query keys)
├── hooks/            # SHARED: Custom hooks
├── lib/              # SHARED: Libraries and integrations
│   ├── auth.ts      # Better Auth client
│   ├── orpc.ts      # oRPC React Query utils (online-only)
│   ├── rpc.ts       # oRPC client with auth cookies
│   ├── crypto.ts    # UUID generation (expo-crypto)
│   └── powersync/   # PowerSync offline-first layer
│       ├── schema.ts       # 10 synced table definitions + Database type
│       ├── database.ts     # Kysely-wrapped PowerSync instance (db)
│       ├── connector.ts    # uploadData routes writes to oRPC
│       ├── index.ts        # PowerSync instance + connect/disconnect
│       ├── useUserId.ts    # Current user ID from Better Auth session
│       └── utils.ts        # toCamel, parseJSON, toJSON
├── models/           # SHARED: TypeScript types/interfaces
├── store/            # SHARED: Jotai atoms (UI state only)
├── utils/            # SHARED: Utilities (query-client, jotai, env, session)
└── modules/          # Feature modules with colocated code
    ├── auth/         # Auth screens + components (hooks moved to src/hooks/auth)
    ├── journal/      # Journal CRUD (offline — PowerSync)
    ├── gentle-letter/    # Letter writing (offline — PowerSync)
    ├── empathy-challenge/ # 7-day challenge (offline — PowerSync)
    ├── courage/      # Mystery challenges (offline — PowerSync)
    ├── self-check-ins/   # Assessments (offline — PowerSync)
    ├── calendar/     # Calendar prefs — service-only, no screens
    ├── purchases/    # RevenueCat integration — service-only, no screens
    ├── coach/        # AI chat (online — custom fetch)
    ├── community/    # Social feed (online — React Query)
    ├── home/         # Dashboard
    ├── onboarding/   # Onboarding flow (online — React Query)
    └── ...           # practices, insights, ebook, meditation, movement, sound-studio, etc.
```

> **Notable shared layer additions (Phase 0):** `src/hooks/auth/` (auth/session hooks), `src/lib/biometrics/` (health/sleep readers), `src/store/auth.ts` (auth/biometric atoms), `src/store/onboarding.ts` (questionnaire atoms).

### Modules Architecture

The app uses a **modules-based architecture** where feature-specific code is colocated:

- **`src/app/`** contains only thin re-export files and layouts for Expo Router
- **`src/modules/<feature>/`** contains all feature-specific code (screens, components, hooks, store)
- **`src/components/`, `src/store/`, etc.** contain only SHARED code used across multiple modules
- **Layering rule:** the shared layer (`src/lib/`, `src/hooks/`, `src/components/`, `src/store/`) MUST NOT import from feature modules. Cross-module imports between feature modules are tolerable but should fade as the design-system migration progresses.

#### Canonical module folder template

```
src/modules/<feature>/
├── screens/      # screen components (one file per route)
├── components/   # module-private components
├── hooks/        # module-private hooks
├── data/         # static data, constants
├── store/        # Jotai atoms (UI state only)
├── types/        # module-private types
├── lib/          # module-private utils/helpers
└── index.ts      # public surface (rare; usually empty)
```

Empty subfolders are not created — only added when needed. Service-only modules (`calendar`, `purchases`) have no `screens/`.

### Design system overhaul (in progress)

A multi-phase design-system + navigation refactor is underway. **Source of truth: `app/docs/design-system-spec.md`**. Future code changes should adhere to:

- 3 background variants (`default`, `auth`, `onboarding`) defined as token bundles
- Theme-aware (light + dark) — light is P1
- New primitives `Screen`, `Header`, `Button`, `TextField`, `Card`, etc. (Phase 2)
- Per-module migration order in spec sec 18
- Phase 0 (folder + route restructure) is complete

**Re-export Pattern**: Route files in `src/app/` are one-liners that re-export from modules:

```typescript
// src/app/account-creation/index.tsx
export { default } from '@/modules/account-creation/screens/Index';
```

### Important Patterns

1. **Never co-locate non-route files in `src/app/`** - Only layouts and re-exports belong there
2. **Import conventions**:
   - Use `@/` path aliases for shared code (`@/components/ui/Button`, `@/constants/colors`)
   - Use relative imports within modules (`../components/GlowBg`, `../store/account-creation`)
3. **SVG imports** - Custom type declarations in `custom.d.ts` allow importing SVGs as React components
4. **Environment access** - Use `env.get('API_ENDPOINT')` instead of direct `process.env` access
5. **New features** - Create a new module under `src/modules/<feature>/` with screens, components, hooks, and store subdirectories as needed
6. **Dialogs** - Use `dialog` from `@/utils/dialog` instead of `Alert.alert()`. Provides a themed bottom-sheet modal with async/await support:
   ```typescript
   import { dialog } from '@/utils/dialog';
   const result = await dialog.error({ title: 'Oops', message: 'Something failed.' });
   const result = await dialog.info({ title: 'Tip', message: 'Swipe to dismiss.' });
   const close = dialog.loading({ message: 'Saving...' });
   await dialog.open({ component: MyForm, props: { userId } });
   ```
7. **Design HTML references** - When design references include HTML code (`code.html`), extract exact colors, spacing, border-radius, and font sizes from the HTML/CSS rather than guessing. Map HTML colors to existing Tailwind/colors.ts values where possible; add new color tokens when no match exists.
8. **Keyboard handling** - Always use `react-native-keyboard-controller` instead of React Native's built-in `KeyboardAvoidingView`. The `KeyboardProvider` is already set up in `_layout.tsx`. Use:
   - `KeyboardAwareScrollView` for screens with text inputs inside scroll views
   - `KeyboardAvoidingView` from `react-native-keyboard-controller` (not from `react-native`) for non-scroll layouts

## Platform Support

- **iOS**: Supports tablets, bundle ID `com.phobik.app`
- **Android**: Edge-to-edge enabled, predictive back gesture disabled

## Visual Verification

After making any visual/UI changes, **always take a simulator screenshot and compare** against the design reference before considering the task done.

```bash
# Take screenshot from running iOS simulator
xcrun simctl io booted screenshot /tmp/claude/screenshot.png
```

- Design references live in `../design/` (e.g., `../design/phobik_landing_page_1/screen.png`)
- Read the screenshot with the Read tool to view it, then compare side-by-side with the design reference
- If the simulator is running but the screen needs navigating, inform the user

## Development Notes

- **Dev builds required** — PowerSync uses native modules (`@op-engineering/op-sqlite`), Expo Go will not work
- New Architecture is enabled - use modern APIs and patterns
- React 19 and React Native 0.81 are in use
- TypeScript strict mode is enabled
