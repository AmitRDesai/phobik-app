# Phobik Design System Spec

> Locked decisions from the design-system planning session on 2026-05-05.
> This document is the durable artifact for this multi-session refactor — future sessions load this instead of re-deriving decisions.

## Approach

Phased rollout, direct commits to `main`, single working branch with daily integration. No per-module PR review gate.

| Phase | Work |
|---|---|
| **0** | Folder + route restructure (piecemeal, one module at a time) |
| **1** | Theme tokens + themed `View`/`Text` wrappers + variant tokens |
| **2** | Build primitives (`Screen`, `Header`, `Button`, `Card`, controls) |
| **3** | Per-module migration in defined order |
| **4** | Routing fixes (folded into Phase 3 per-module) |

Light mode is **P1** — tokens land in Phase 1; visual polish/QA happens after dark mode is solid.

---

## 1. Theme system

### Layers (orthogonal)
- **Theme** = `light | dark` (global, app-wide)
- **Variant** = `default | auth | onboarding` (per-screen)

Theme is global; variant tints inside the theme.

### Theme switching
- Setting in **Settings → Preferences**: Light / Dark / System
- System mode uses `useColorScheme()` from React Native
- StatusBar adapts via `expo-status-bar`

### Light-mode token mapping (proposed defaults)

| Token | Dark | Light |
|---|---|---|
| `bg-background` | `#050505` | `#FAFAFA` |
| `text-foreground` | `white/95` | `black/90` |
| `text-foreground-muted` | `white/55` | `black/55` |
| `border-default` | `white/10` | `black/10` |

Light mode: variants get **no glow** — tinted bg only. Dark mode: variants get the radial glow.

### Themed primitives — `src/components/themed/`
- `View` — transparent default
- `Text` — `text-foreground` default + typography variant prop
- `Pressable` — feedback styling defaults
- `ScrollView` — transparent

ESLint rule blocks importing `View`/`Text` from `react-native` directly.

---

## 2. Background variants

Each variant bundles `{ bg, glow, card, fade, shadow, accent }`. Children read variant via `useVariant()` context (set by `<Screen>`).

| Variant | Used by | Bg (dark) | Glow (dark) | Card (dark) |
|---|---|---|---|---|
| `default` | home, settings, lists, detail screens, practice menus | `#050505` | none / soft pink low intensity | `#1a1318` |
| `auth` | sign-in, create-account, terms, privacy | `#050505` | center, pink → yellow, low | `#1a1318` |
| `onboarding` | onboarding, account-creation, daily-flow, morning-reset, guided practice sessions | `#1a0b12` | top-25%, orange → pink, soft | `#2D152D` |

Light mode: same names, tinted off-white bgs, no glow.

Per-module mapping is the default; individual screens can override via `<Screen variant="...">`.

---

## 3. SafeArea + scroll fade rules

`<Screen>` owns this; screens never do safe-area math.

- Top + bottom safe-area inset = **variant.bg.color** (no dark stripe)
- Scroll padding = `safeAreaBottom + fadeHeight + (stickyCtaHeight ?? 0)`, computed automatically
- Scroll fade gradient ends in **variant.fade.color** (matches bg)
- **Tab screens**: skip bottom safe area (auto-detected via `useSegments()` for `(tabs)`)
- **Modal screens** (`presentation="modal"`): skip bottom safe area
- Android edge-to-edge stays enabled; bottom gesture inset honored
- **Keyboard open**: sticky CTA rises with `KeyboardStickyView`; fade hides

---

## 4. `<Screen>` API

```tsx
<Screen
  variant="onboarding"
  scroll
  keyboard
  header={<Header variant="back" title="Sign in" />}
  sticky={<Button variant="primary">Continue</Button>}
  fade                          // default true if scroll
  insetTop                      // default true
  insetBottom                   // default !inTabs && !modal
  presentation="modal"          // optional
  className="..."               // body padding/layout (default: px-screen-x pt-screen-y)
  contentClassName="..."        // ScrollView contentContainer (when scroll)
>
  {body}
</Screen>
```

Internal flow:
1. Wraps body in `<VariantContext.Provider value={variant}>`
2. Renders `GlowBg` with the variant's glow config
3. Top + bottom safe-area inset = variant bg color
4. If `keyboard`, wraps in `KeyboardAvoidingView` from `react-native-keyboard-controller`
5. If `scroll`, wraps body in `ScrollView` with auto-calculated `paddingBottom`
6. If `fade`, overlays gradient ending in `variant.fade.color`
7. If `sticky`, renders inside `KeyboardStickyView`, measures height to feed back into scroll padding
8. If `header`, renders pinned above the body (below top safe area)

`Container.tsx` is **deprecated** — replaced by `Screen` everywhere; deleted at end of migration.

---

## 5. `<Header>` API

Single component; one `variant` prop covers all use cases.

```tsx
<Header
  title="Settings"
  subtitle="..."
  left={<BackButton />}                  // default: BackButton if canGoBack
  right={<UserAvatar />}                 // default: null
  progress={{ current: 3, total: 7 }}
  variant="back"                         // | "close" | "wordmark"
  confirmClose                           // opt-in dismiss confirmation dialog
/>
```

- `variant="back"` — back button left, title center
- `variant="close"` — close (X) left, calls `router.dismissAll()`
- `variant="wordmark"` — animated brand wordmark center, no title (the existing `DailyFlowHeader` look)

Header is **always passed via `<Screen header={...} />`**, never rendered freely. Pinned (sticky).

---

## 6. Sticky CTA

- Slot accepts: single primary `<Button>` + optional secondary text link below
- Background: transparent, sits over the scroll fade
- **Always sticky** (absolute), even on non-scrolling screens
- Disabled state: dim opacity 0.4 (no separate grey style)
- Loading state: only the CTA disables — rest of screen interactive
- Keyboard-aware: rises with `KeyboardStickyView`

---

## 7. Form-control primitives

All variant-aware (read `useVariant()`); all theme-aware (NativeWind tokens).

| Primitive | Variants | Notes |
|---|---|---|
| `Button` | `primary` (gradient), `secondary` (outlined), `ghost` (text), `destructive` | `GradientButton` becomes `Button variant="primary"` |
| `TextField` | size `default`/`compact`; type `text`/`password`/`email`/`numeric` | Replaces `TextInput`. Built-in label, hint, error chrome |
| `Textarea` | — | multiline TextField |
| `Select` / `Dropdown` | — | new |
| `Switch` | — | new |
| `Checkbox` | — | new |
| `Radio` / `RadioGroup` | — | new for simple radios; `SelectionCard` kept for rich content |
| `SelectionCard` | — | keep |
| `Card` | `flat`, `elevated`, `bordered` | replaces `DashboardCard` + `AnxietyImpactCard` one-offs |
| `ListItem` | `default`, `nav` (chevron), `action` (right button) | replaces `SettingsMenuItem`-style rows |
| `Divider` | `default`, `inset` | new |
| `Section` / `SectionHeader` | — | groups list items |
| `Tag` / `Chip` | `default`, `selected`, `outline` | new |
| `Badge` | `default`, `success`, `danger`, `info` | replaces `NotificationBadge` specialization |
| `IconButton` | `default`, `subtle`, `prominent` | replaces 60+ inline circular buttons |

- **Icon API**: pass React node — `<Button icon={<Heart />}>` (not name strings)
- **Form layout**: opinionated — `<TextField label hint error />` handles its own chrome
- `Button.tsx` stub deleted; `GradientButton` renamed/refactored into new `Button`

---

## 8. Typography

Typeface: **system** (SF Pro on iOS, Roboto on Android). No custom fonts.

Themed `<Text>` API:
```tsx
<Text variant="h1">Welcome</Text>
<Text variant="body" muted>Subtitle</Text>
```

| Variant | Size | Weight | Use |
|---|---|---|---|
| `display` | 36 | 800 | Hero / landing |
| `h1` | 28 | 700 | Screen titles |
| `h2` | 22 | 700 | Section titles |
| `h3` | 18 | 600 | Card titles, list group headers |
| `body-lg` | 17 | 400 | Lead paragraphs, dialog body |
| `body` | 15 | 400 | Default body text |
| `body-sm` | 13 | 400 | Hints, secondary copy |
| `label` | 13 | 600 | Form labels, button labels |
| `caption` | 11 | 600 | Uppercase labels, tags, metadata |
| `mono` | 13 | 500 | Code, numbers, IDs |

Modifiers: `muted`, `inverse`.

Hardcoded `'serif'` (ebook chapter components) and `'Courier'` (coach `ChatBubble`) removed during migration.

---

## 9. Spacing

Tailwind numeric scale (4/8/12/16/24/32/48/64) kept. Add 6 named layout tokens:

```ts
'screen-x': '24px',
'screen-y': '16px',
'section': '32px',
'card-x': '20px',
'card-y': '20px',
'control-y': '14px',
```

Self-documenting: `className="px-screen-x py-screen-y space-y-section"`.

---

## 10. Routing rules

To be enforced via `app/CLAUDE.md` + reviews.

- `router.push` for forward navigation in flows (back must always work)
- `router.replace` only for: post-auth redirects, sign-in ↔ sign-up swaps, completion → root
- `router.dismissAll()` to exit a multi-step flow back to the tab root
- `<Redirect>` allowed (rare cases) — document the back-stack caveat
- **No `as never` / `as any` on routes** — fix typed-routes config root cause if encountered

---

## 11. Folder + route conventions

### Module folder template

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

Empty subfolders are not created — only added when needed. Service-only modules (`calendar`, `purchases`) only need `lib/`/`hooks/`.

### Route conventions

1. Always **kebab-case**
2. **Plural** for collections (`/practices`, `/meditations`, `/movements`), **singular** for actions/flows (`/affirmation/...`, `/journal/entry/[id]`)
3. **Max 3 levels of nesting** — flatten deeper paths
4. URL segments for routing-relevant params; query strings only for ephemeral hints
5. No `as never` / `as any` on route paths

### Locked Phase 0d route decisions (2026-05-05)

- Meditation sessions: `/practices/body/meditation/<x>` → **flatten to top-level `/meditations/<x>`** (depth 1)
- Movement sessions: `/practices/body/movement/<x>` → **flatten to top-level `/movements/<x>`** (depth 1)
- Sound-studio: `/practices/emotion/sound-studio/...` → **promote to top-level `/sound-studio/...`** (max depth 3)
- `/affirmation/*` — stays singular (flow, not collection)
- `profile-setup` vs `account-creation` — status quo (route-level alias to shared screens; no module split)
- `/account-creation/second` — inspect screen contents and propose descriptive name during execution

### Phase 0 execution

- Step 1 (read-only): generate complete folder + route mapping; impact list (every importer); show user before any move.
- Step 2 (after approval): execute module-by-module. Update imports, route file in `src/app/`, every `router.push/replace`, `<Redirect>`, `<Link>`, `Stack.Screen name`.
- Step 3: `tsc --noEmit` after each module — typed-routes catches broken paths as compile errors.
- Step 4: smoke-test in simulator.

No backend deep-link coordination needed — backend doesn't reference app routes yet.

---

## 12. Loading / empty / error states

- `<Skeleton />` — animated shimmer for content that has shape
- `<Spinner size="sm|md|lg" />` — for in-flight actions
- `<LoadingScreen />` — full-screen takeover (existing component, themed)
- `<EmptyState icon title description action />`
- `<ErrorState icon title description onRetry />`
- `ErrorBoundary` themed; wraps each module
- Per-primitive: `<Card loading />`, `<ListItem loading />` show their own skeleton

---

## 13. Icons

- Functional/utility icons: standardize on **Lucide** (`lucide-react-native`)
- Branded/custom icons: keep in `src/components/icons/` as React SVG components
- Wrapper: `<Icon name="heart" size={20} color="..." />` accepts a Lucide name OR a custom-icon component
- Migration: ~100 `MaterialIcons` usages flip to Lucide during Phase 0/1

---

## 14. Haptics

- Centralized in `src/lib/haptics.ts`: `tap()`, `success()`, `warning()`, `error()`, `selection()`
- Each interactive primitive (`Button`, `IconButton`, `Switch`, `Checkbox`, `ListItem`) calls the appropriate one
- User setting: **Settings → Preferences → Haptic feedback: System / On / Off**
  - System mode honors iOS Settings → Sounds & Haptics → System Haptics
  - Manual override stored in user preferences (table TBD; simplest = new `user_preference` table)
- Helpers no-op when disabled

---

## 15. Accessibility

- `accessibilityLabel` / `accessibilityHint` / `accessibilityRole` on all interactive primitives (built-in)
- **Reduced motion**: `useReducedMotion()` from RN AccessibilityInfo; `EaseView`/Reanimated respect it (skip / shorten)
- **Dynamic type**: respect via `allowFontScaling` (default true on themed `Text`)
- **Light mode contrast**: AAA target on body text — audit when light mode QAs

---

## 16. Motion

`src/constants/motion.ts`:

```ts
export const motion = {
  durations: { fast: 120, base: 200, slow: 320 },
  easings: { standard: 'easeOut', emphasized: 'spring(damping=15,stiffness=300)' },
  presets: {
    fadeIn: { from: { opacity: 0 }, to: { opacity: 1 }, duration: 200 },
    slideUp: { from: { translateY: 20, opacity: 0 }, to: { translateY: 0, opacity: 1 }, duration: 240 },
    scaleIn: { from: { scale: 0.95, opacity: 0 }, to: { scale: 1, opacity: 1 }, duration: 200 },
    pressedScale: { scale: 0.95 },
  },
};
```

`EaseView` + Reanimated both consume these. Stack screen transitions: keep Expo Router defaults (slide on iOS, fade on Android). Modals: `slide_from_bottom` (already configured).

---

## 17. className-only policy

During migration, every file gets an inline-style audit.

- **Confident → convert** to className
- **Not confident → leave a `// TODO: style→className` comment** with a one-line reason

Per existing `app/CLAUDE.md`, these stay as inline `style`:
- `LinearGradient` props
- Shadow props (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`)
- Dynamic computed values (`width: \`${pct}%\``)
- SVG component props

---

## 18. Migration order

Per-module, one at a time. Direct commits to main, single working branch.

1. `auth` (5 screens) — pattern-setter
2. `onboarding` (9)
3. `account-creation` (7)
4. `home` (4)
5. `settings` (7)
6. `journal` (3) — proves PowerSync + new primitives
7. `daily-flow` (14) — `Header` replaces `DailyFlowHeader`
8. `morning-reset` (8) — same; deletes `MorningResetHeader`
9. `empathy-challenge` (5) — fixes routing on completion
10. `gentle-letter` (4)
11. `courage` (7)
12. `self-check-ins` (9)
13. `practices` (22)
14. `meditation` (10) + `movement` (14) — parallel
15. `sound-studio` (8) — `design-to-screen` for unimplemented designs
16. `ebook` (28) — biggest, last
17. `insights` (4)
18. `community` (2)
19. `characters` (4)
20. `coach`, `notifications`, `micro-challenges`, `daily-check-in`, residual home extras

Service-only (no migration): `calendar`, `purchases`.

### Per-module migration checklist

1. Replace `<Container>` / `<SafeAreaView>+<KeyboardAvoidingView>+<ScrollView>` with `<Screen>`
2. Pick variant per screen (`default` for list/detail, `onboarding` for guided flows)
3. Replace inline back/close buttons with `<Header />`
4. Replace bottom CTA placement with `sticky` prop
5. Audit `router.push/replace/back` usage; apply Topic 10 rules
6. Convert hardcoded hex colors → tokens
7. Inline-style → className audit (Topic 17)
8. **Run `react-doctor` skill** to catch issues introduced by the refactor
9. **Run `simplify` skill** to flag duplication/overengineering
10. Visual diff: simulator screenshot, compare to design reference if one exists
11. Mark migrated module in tracking doc

---

## 19. Scope notes

- Stub modules — `coach`, `notifications`, `micro-challenges` already finished (workspace/app `CLAUDE.md` is out of date); migrate as regular modules
- `calendar`, `purchases` — service-only modules, no migration
- Designs in `design/` — generated by Stitch, inconsistent. Use as **inspiration only**, not strict 1:1
- `app/CLAUDE.md` gets refreshed during this work (currently out of date)

---

## 20. Files to touch

- `app/CLAUDE.md` — add routing rules, folder conventions, primitive list
- `app/tailwind.config.js` — add light-mode tokens, named spacing tokens, typography variants
- `app/src/constants/colors.ts` — add light-mode counterparts
- `app/src/constants/motion.ts` — new file
- `app/src/components/themed/index.tsx` — new dir, themed wrappers
- `app/.eslintrc` — block `View`/`Text` from `react-native` direct imports; block `as never`/`as any` on routes
- `app/src/lib/haptics.ts` — new file
- `app/src/components/ui/` — extend existing primitives, add new ones, delete `Button.tsx` stub
- `app/src/components/ui/Container.tsx` — delete at end of migration
