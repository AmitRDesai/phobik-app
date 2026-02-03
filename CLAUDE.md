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
├── app/              # Expo Router routes (file-based routing)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Container)
│   └── ErrorBoundary.tsx
├── constants/        # Static values (colors, query keys)
├── models/          # TypeScript types/interfaces
├── store/           # Jotai atoms
└── utils/           # Shared utilities (query-client, jotai, env, session)
```

### Important Patterns

1. **Never co-locate non-route files in `src/app/`** - Components, types, and utilities belong in their respective directories
2. **Always use path aliases** - Import with `@/` instead of relative paths
3. **SVG imports** - Custom type declarations in `custom.d.ts` allow importing SVGs as React components
4. **Environment access** - Use `env.get('API_ENDPOINT')` instead of direct `process.env` access

## Platform Support

- **iOS**: Supports tablets, bundle ID `com.phobik.app`
- **Android**: Edge-to-edge enabled, predictive back gesture disabled

## Development Notes

- Start with **Expo Go** for testing - custom builds only needed for native modules or Apple targets
- New Architecture is enabled - use modern APIs and patterns
- React 19 and React Native 0.81 are in use
- TypeScript strict mode is enabled
