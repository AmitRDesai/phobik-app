---
name: design-system
description: Build and audit screens with the canonical design-system primitives. Use when creating a new screen, refactoring an existing one, or migrating ad-hoc styling to the primitive surface.
---

# Design system skill

Use this when **building** a new screen, **refactoring** an existing one, or **migrating** ad-hoc patterns to the canonical primitives.

## Principles

1. **Reach for a primitive first.** Every UI pattern in `src/components/ui/` is the canonical version. Composition lives there; module screens stay thin.
2. **Never hardcode hex colors.** Use `colors.*` from `@/constants/colors` or theme-aware helpers (`foregroundFor`, `accentFor`, `withAlpha`).
3. **Use the themed `Text`** from `@/components/themed/Text` everywhere. Never the raw RN `Text`.
4. **Never use `className="h-X w-X"` for sizing a primitive** when it exposes a `size` prop. Use the prop.
5. **`clsx` named import only** for composed `className`: `import { clsx } from 'clsx'`. Never template literals.
6. **Don't add `'as any'` or hex literals** — both will be flagged in review.

## Typography (themed `Text`)

The themed Text has six orthogonal axes — NEVER use Tailwind `text-*` classes for size/tone/weight/align.

| Axis | Values | Use |
|---|---|---|
| `size` | `display` / `h1` / `h2` / `h3` / `lg` / `md` / `sm` / `xs` | Scale + line-height paired; h1/h2/h3 auto-apply `accessibilityRole="header"` |
| `tone` | `primary` (default) / `secondary` (/55) / `tertiary` (/30) / `disabled` (/15) / `accent` (pink) / `danger` / `success` / `warning` / `inverse` | Foreground tone — never `text-foreground/55`, use `tone="secondary"` |
| `weight` | `regular` / `medium` / `semibold` / `bold` / `black` | Never `font-bold` className |
| `align` | `left` / `center` / `right` | Never `text-center` className |
| `italic` | boolean | |
| `treatment` | `'caption'` | Eyebrows / status labels / small companion text (uppercase tracking-widest semibold) |

**Caption vs body-sm rule:** `treatment="caption" size="xs"` is for **eyebrow chips / tag labels / status / small companion text**. For descriptive body copy + helper text use `size="sm"` (13px) WITHOUT `treatment="caption"`. Pick by **role**, not size.

**Text on image backgrounds:** keep `text-white` in both light + dark — image bg doesn't theme.

## Color tokens

| Token | Use |
|---|---|
| `bg-surface` | Screen background (theme-aware) |
| `bg-surface-input` | Form fields / text inputs |
| `bg-foreground/N` | Tinted overlays — `/5` for soft, `/10` for borders, `/20` for active states |
| `border-foreground/10` | Neutral 1px border (theme-aware) |
| `text-primary-pink` | OK on saturated bgs; brand pink stays saturated in both modes |
| `accent-yellow / cyan / purple / orange / gold` | Lose contrast on light surfaces — use `accentFor(scheme, hue)` helper for text/icon on non-saturated surfaces |
| `colors.status.danger / success / warning` | Fixed accessibility colors — consistent across themes |

**JS string colors** (Ionicons `color`, SVG strokes, `placeholderTextColor`): use `foregroundFor(scheme, opacity)` and `accentFor(scheme, hue)`. Never raw hex.

**Shadows:** RN 0.83+ `boxShadow` string (`'0 2px 10px rgba(0,0,0,0.35)'`) — never legacy `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`/`elevation`. Use `withAlpha(color, opacity)` for the rgba portion.

## Primitives (the catalog)

Every primitive lives in `src/components/ui/`. The full live catalog is browsable in-app at **Settings → Developer → Design System** (`src/modules/dev/screens/DesignSystemIndex.tsx`).

### Layout / structure

- **`Screen`** — every route's root. Owns insets, scroll body, sticky CTA, header slot, variant bg + glow. `variant: 'default' | 'auth' | 'onboarding'`. Pass `scroll`, `header={<Header />}`, `sticky={<Button>...}`. Body padding is `px-screen-x pt-screen-y` (default). Pass `className=""` to opt out.
- **`Header`** — pinned header. `variant: 'back' | 'close' | 'wordmark'` + `title`/`subtitle`/`left`/`right`/`center`/`progress` slots. Confirm-on-leave via `confirmClose`.
- **`Card`** — `variant: 'flat' | 'raised' | 'toned'` × `size: 'sm' | 'md' | 'lg'`. Raised has a default neutral drop shadow; `shadow={{...}}` for colored glows; `tone` for accent border. Tappable via `onPress` (built-in haptic + scale).

### Buttons / actions

- **`Button`** — `variant: 'primary' (gradient) | 'secondary' (ghost border) | 'destructive' (red wash) | 'ghost'` × `size: 'xs' | 'sm' | 'md' | 'lg'`. `iconOnly`, `prefixIcon`, `icon`, `fullWidth`, `loading`, `loadingText`. Built-in haptic, hitSlop accessibility for sub-44pt sizes.
- **`InlineLink`** — single-row link with a `tone="secondary"` prefix + `tone="accent" weight="bold"` action word (`"Already have an account? **Sign In**"`). Centered by default; tap target is the whole row. Use for in-flow navigation cues at the bottom of auth / form screens.
- **`FloatingAddButton`** — bottom-right FAB with the brand gradient. Pass `icon` for non-default actions (compose, search, play). Requires `accessibilityLabel`.

### Selection

- **`SegmentedControl`** — single-select pill row, 2–4 options. `variant: 'gradient' | 'tinted'` — gradient is loud (primary mode switches), tinted is quiet (scope filters).
- **`SelectionCard`** — `variant: 'radio' | 'checkbox'`. Single or multi-select list rows with optional icon + description. Identical card chrome (pink border + soft glow on select); the indicator distinguishes radio from checkbox.
- **`ChipSelect`** — multi/single-select pill grid. `variant: 'tinted' | 'gradient'`, `multi` (default true), `layout: 'wrap' | 'scroll'`, per-option `tone` + `icon` (render-prop pattern auto-colors).
- **`DropdownSelect`** — single-select trigger that opens a Dialog sheet of SelectionCards. Form-field chrome matches TextField. `allowClear` adds a clear button in the picker.
- **`Switch`** — themed binary toggle. Brand pink track-on, foreground/10 track-off, white thumb baked in.
- **`Rating`** — numeric scale (1–5, 1–7, etc.). `variant: 'gradient' | 'tinted'` × `size: 'sm' | 'md' | 'lg'`. `startLabel` / `endLabel` for endpoint anchors. Range max **~7 at default size** (more → crowded); for wider ranges use `size="sm"`.
- **`Slider`** — continuous numeric. Auto-measures width. `tone` for accent. `transparentTrack` for overlay-on-gradient cases.

### Inputs

- **`TextField`** — single-line input with `type: 'text' | 'password' | 'email' | 'numeric'`. Pill-shaped chrome, `label` / `hint` / `error` scaffold, leading `icon`, `labelUppercase` for eyebrow labels, `autoFocus`. Replaces the deprecated `TextInput` primitive (since removed).
- **`TextArea`** — multiline. `variant: 'filled' | 'minimal'` (minimal = borderless long-form writing), `rows: 'sm' | 'md' | 'lg' | number`, optional `maxLength` + auto-counter, `labelUppercase`. Use for any multiline writing surface — NEVER raw multiline TextInput.

### Display

- **`Badge`** — `variant: 'tinted' (default) | 'outline' | 'solid'` × `size: 'sm' | 'md'`, `tone`, optional `icon` (render-prop). Always uppercase tracked.
- **`IconChip`** — `size: 'sm' | 'md' | 'lg' | number` × `shape: 'rounded' | 'circle' | 'square'`. `tone` + render-prop icon for color-coded chips. Composable inside cards / list rows. Pass `onPress` + `accessibilityLabel` to render as a tappable icon button (haptic + `active:opacity-70` + hitSlop for sub-44pt sizes) — covers the "round close button in a Header right slot" pattern.
- **`UserAvatar`** — `size: 'sm' | 'md' | 'lg' | 'xl' | number` (32/40/48/80/custom). Three-step fallback: `imageUri` → `name` initials → person icon. Pulls session user automatically; pass `imageUri` / `name` for other users.
- **`Badge`** + **`IconChip`** + **`UserAvatar`** all support the render-prop icon pattern: `icon={(color) => <Ionicons ... color={color} />}` auto-colors from the resolved tone.
- **`GradientText`** — pink→yellow masked text for hero / brand wordmarks. Children must be a plain string.
- **`ProgressBar`** — horizontal continuous progress. `size: 'sm' | 'md' | 'lg'`, `tone`, `gradient` for the brand fill.
- **`ProgressDots`** — step indicator (`current`, `total`). Use ≤ 10 dots; past that switch to a numeric counter or ProgressBar.
- **`NotificationBadge`** — numeric overlay on icons (auto-hides at 0, clamps to `9+` past 9). Parent needs `relative` positioning.

### Feedback / surfaces

- **`Toast`** (imperative via `toast.success/info/warning/error` from `@/utils/toast`) — transient non-blocking confirmations (Saved / Copied / Synced). Replace `dialog.info` for save confirmations.
- **`Dialog`** (imperative via `dialog.error/info/loading/open/close` from `@/utils/dialog`) — blocking modal. Use when the user must choose / acknowledge. Custom-component dialogs via `dialog.open({ component, props })`.
- **`InfoCallout`** — persistent inline tip / hint / soft warning. `variant: 'tinted' | 'plain'`, `tone`, optional `action`, optional `onDismiss`.
- **`NetworkBanner`** — auto-managed offline strip. Checks both `isConnected` and `isInternetReachable` (captive portals).
- **`EmptyState`** — no-data screens. `size: 'sm' | 'md' | 'lg'`, render-prop `icon`, `tone`, `title` + `description` + `action`. Use for "no data + here's what to do", NOT for transient loading (use Skeleton).
- **`Skeleton`** — pulsing placeholder shapes. `shape: 'rect' | 'circle' | 'pill'`. Compose multiple to mimic the real layout.
- **`Accordion`** — expandable row. Auto-measures content height. `variant: 'flat' | 'card'`, controlled (`expanded` + `onToggle`) or uncontrolled (`defaultExpanded`).

### Media

- **`AudioPlayer`** — `variant: 'hero' | 'card' | 'mini' | 'inline'`. Presentation only — the parent owns the player hook. Hero composes back / play / forward (or `skip-next` via `skipForwardKind="instruction"`) + optional voice toggle + mute. `loadingLabel` for download-percent UX.
- **`Glows`** (`GlowBg` for full-window + `RadialGlow` for element halos) — radial gradient decorations.

## Building a screen — the canonical recipe

```tsx
export default function MyScreen() {
  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="My Screen" />}
      contentClassName="gap-4 pb-6"
      sticky={<Button onPress={handleSubmit}>Continue</Button>}
    >
      <Card variant="raised" size="md">
        <Text size="md" weight="semibold">Section title</Text>
        <Text size="sm" tone="secondary">Body copy.</Text>
      </Card>
      ...
    </Screen>
  );
}
```

**Don't:**
- Wrap `Screen` in another View
- Use raw `ScrollView` inside `Screen` (use the `scroll` prop)
- Apply `paddingTop: insets.top` inside the body
- Render two competing primary actions (sticky CTA + FAB on the same screen)

## Migration cheat-sheet (audit → fix)

| Find | Replace with |
|---|---|
| Raw `Text` from `react-native` | `Text` from `@/components/themed/Text` |
| `text-xs / text-sm / text-base / text-lg` className | `size="xs / sm / md / lg"` |
| `text-foreground/55` etc. | `tone="secondary"` (or matching tone) |
| `font-bold / font-semibold / font-medium` className | `weight="bold / semibold / medium"` |
| `text-center / text-right` className | `align="center / right"` |
| `uppercase tracking-wider font-bold text-xs` | `treatment="caption" size="xs"` |
| Raw hex color literal | `colors.*` lookup, `accentFor`, `foregroundFor`, or `withAlpha` |
| `shadowColor` / `shadowOffset` / `shadowOpacity` / `shadowRadius` | `boxShadow` string with `withAlpha(color, opacity)` |
| `Pressable` + `Text` "button" (Skip / Resend / Log Out) | `Button` primitive with appropriate `variant` |
| `Pressable` wrapping `<Text tone="secondary">Prefix <Text tone="accent">Action</Text></Text>` | `InlineLink prefix="Prefix" action="Action" onPress={...}` |
| `multiline TextInput` from RN | `TextArea` primitive |
| `keyboardType + autoCapitalize + secureTextEntry` props | `TextField type="text/password/email/numeric"` |
| Raw RN `Switch` + `trackColor` block | `Switch` from `@/components/ui/Switch` |
| Hand-rolled icon + text "empty state" | `EmptyState` primitive |
| Hand-rolled tip / hint Card | `InfoCallout` primitive |
| `dialog.info("Saved")` for transient confirm | `toast.success("Saved")` |
| `LoadingScreen` / spinner inside a list | `Skeleton` shapes that match the list row |
| `<View className="h-10 w-10 rounded-full ...">` (icon chip) | `IconChip` with appropriate size + tone |
| `<Pressable className="h-10 w-10 ... rounded-full"><MaterialIcons name="close" .../></Pressable>` (header close / round icon button) | `IconChip onPress={...} accessibilityLabel="..." size="md" shape="circle">{(color) => <Icon color={color} />}</IconChip>` |
| Hand-rolled rating buttons | `Rating` primitive |
| Inline accordion w/ animated height + caller-supplied EXPANDED_HEIGHT | `Accordion` (auto-measures content) |

## When the primitive doesn't exist

If you find a pattern that's repeated across ≥ 2 modules and doesn't map cleanly to an existing primitive:

1. **Flag it in the audit report** with: pattern name, files where it appears, proposed API, rationale.
2. **Don't migrate yet.** Wait for triage — the user decides whether to add a new primitive vs. leave the pattern feature-specific.
3. If a new primitive IS added: the user updates this skill with the new entry under the appropriate section + adds the migration mapping above.

**Intentionally feature-specific (not in the catalog, don't migrate):**
- `journal/FeelingDropdown`, `journal/NeedDropdown` — inline accordion+grid pickers tuned for the writing flow
- `coach/components/ChatInput` — composite chat composer (TextInput inside a flex-row with voice + send buttons in a shared rounded container)
- `CardAura` — niche decorative SVG overlay
- Decorative module-specific cards (`DoseProgressBar`'s wave SVG, etc.)

## Audit checklist (per screen)

When auditing a screen file, produce findings in this shape:

```
File: src/modules/<module>/screens/<Screen>.tsx
Compliant:
- Uses Screen with variant=...
- Themed Text throughout
- ...
Issues:
- L42: raw RN Text (should be themed Text size="sm" tone="secondary")
- L67: hex literal '#FF4D94' (should be colors.primary.pink)
- L89: <Pressable><Text>Skip</Text></Pressable> (should be <Button variant="ghost" size="xs">Skip</Button>)
- L112: <TextInput multiline ...> (should be TextArea)
Suggested new primitive (if any):
- A "StatCard" pattern appears in 3 dashboard screens — number + label + delta arrow. Worth a primitive.
```

Run the TS baseline before + after any migration: `npx tsc --noEmit 2>&1 | grep -cE "error TS"`. The baseline is **216**. Reject your own migration if it changes the count.
