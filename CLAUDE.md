# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Phobik is an Expo mobile app built with React Native, using Expo Router for navigation and NativeWind (Tailwind CSS) for styling. The app targets iOS, Android, and web platforms with the New Architecture enabled.

## Development Commands

```bash
# Start development server (use Expo Go first - it supports most features)
npx expo start

# Build and run on native platforms (only needed for custom native modules)
npx expo run:ios
npx expo run:android

# Install dependencies (IMPORTANT: Always use expo install, not npm install)
npx expo install <package-name>

# Linting
npm run lint
```

## Architecture

### State Management

The app uses a **dual-state approach**:

1. **Jotai** (`src/store/`) - Client-side state with AsyncStorage persistence
   - `userTokenAtom`: Persisted authentication tokens
   - `userAtom`: Current user object (in-memory)
   - Storage configured in `src/utils/jotai.ts` with SSR-safe checks

2. **React Query** (`@tanstack/react-query`) - Server state and caching
   - Configured in `src/utils/query-client.ts`
   - 7-day cache with AsyncStorage persistence
   - Integrated with NetInfo for offline detection
   - Auto-focus management tied to AppState

### Navigation

- **Expo Router** with file-based routing in `src/app/`
- Root layout (`src/app/_layout.tsx`) wraps with `PersistQueryClientProvider`
- All Stack screens have `headerShown: false` by default
- Uses typed routes (`experiments.typedRoutes: true` in app.json)

### Styling

- **NativeWind v4** (Tailwind CSS for React Native)
- Global CSS: `global.css` imported in `_layout.tsx`
- Metro configured with NativeWind transformer
- Use `className` prop instead of inline styles where possible
- **⚠️ Do not hardcode colors** - Always use `tailwind.config.js` for Tailwind classes and `src/constants/colors.ts` for programmatic color access

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
├── components/       # SHARED: ui/, icons/, ErrorBoundary
│   ├── ui/          # Base UI components (Button, Container, etc.)
│   ├── icons/       # Shared icon components
│   └── ErrorBoundary.tsx
├── constants/        # SHARED: Static values (colors, query keys)
├── hooks/            # SHARED: Custom hooks
├── models/           # SHARED: TypeScript types/interfaces
├── store/            # SHARED: Jotai atoms (user.ts for auth state)
├── utils/            # SHARED: Utilities (query-client, jotai, env, session)
└── modules/          # Feature modules with colocated code
    ├── auth/
    │   ├── screens/      # SignIn.tsx, CreateAccount.tsx
    │   ├── components/   # Auth-specific components
    │   ├── hooks/        # Auth-specific hooks
    │   └── store/        # Auth-specific state
    ├── home/
    │   ├── screens/      # Home.tsx
    │   ├── components/
    │   ├── hooks/
    │   └── store/
    └── onboarding/
        ├── screens/      # Index.tsx, Second.tsx, etc.
        ├── components/   # ChakraFigure, NebulaBg, ProgressBar, etc.
        ├── hooks/
        └── store/        # onboarding.ts
```

### Modules Architecture

The app uses a **modules-based architecture** where feature-specific code is colocated:

- **`src/app/`** contains only thin re-export files and layouts for Expo Router
- **`src/modules/<feature>/`** contains all feature-specific code (screens, components, hooks, store)
- **`src/components/`, `src/store/`, etc.** contain only SHARED code used across multiple modules

**Re-export Pattern**: Route files in `src/app/` are one-liners that re-export from modules:
```typescript
// src/app/onboarding/index.tsx
export { default } from '@/modules/onboarding/screens/Index';
```

### Important Patterns

1. **Never co-locate non-route files in `src/app/`** - Only layouts and re-exports belong there
2. **Import conventions**:
   - Use `@/` path aliases for shared code (`@/components/ui/Button`, `@/constants/colors`)
   - Use relative imports within modules (`../components/NebulaBg`, `../store/onboarding`)
3. **SVG imports** - Custom type declarations in `custom.d.ts` allow importing SVGs as React components
4. **Environment access** - Use `env.get('API_ENDPOINT')` instead of direct `process.env` access
5. **New features** - Create a new module under `src/modules/<feature>/` with screens, components, hooks, and store subdirectories as needed

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

- Start with **Expo Go** for testing - custom builds only needed for native modules or Apple targets
- New Architecture is enabled - use modern APIs and patterns
- React 19 and React Native 0.81 are in use
- TypeScript strict mode is enabled
