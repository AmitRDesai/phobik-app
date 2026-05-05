# Phase 0 Restructure Mapping

> **Status:** Read-only audit + proposed mapping. **Awaiting user approval** for the complex cases (sec 4) before any code moves.
> **Source spec:** `app/docs/design-system-spec.md` sec 11.
> **Generated:** 2026-05-05.

## Executive summary

| Area | Findings | Effort |
|---|---|---|
| Module folder structure | 2 modules with non-standard `utils/`; 2 misplaced top-level `types.ts` | Trivial |
| Route paths | 19 of 177 routes need changes (14 depth>3, 2 plural, 1 kebab, plus 5 complex cases) | Small |
| **Cross-module coupling** | **34 imports into `practices`, 27 into `home`, 17 into `auth`. Modules reach deep into each other's internals.** | **Significant — bigger than route work** |
| Navigation call sites | 98 files contain `router.push/replace` etc. that may need updates | Mechanical |

The cross-module coupling is the actual scope of Phase 0. Folder + route changes are minor cleanups; the layering problem is what justifies a phase.

---

## 1. Module folder structure changes

### Required moves (4 total)

| Module | Current | Proposed | Action |
|---|---|---|---|
| `home` | `home/utils/` (8 files) | `home/lib/` | Rename folder |
| `practices` | `practices/utils/` (1 file) | `practices/lib/` | Rename folder |
| `practices` | `practices/types.ts` (top-level) | `practices/types/index.ts` | Move into `types/` |
| `calendar` | `calendar/types.ts` (top-level) | `calendar/types/index.ts` | Move into `types/` |

### Service-only modules (no migration)

- `calendar` — confirmed: no `screens/`. Skip Phase 3 entirely.
- `purchases` — confirmed: no `screens/`. Skip Phase 3 entirely.

### Optional (not enforced — empty subfolders not pre-created)

23 modules don't have a `types/` folder; 25 don't have a `lib/`. **Per spec, we don't pre-create empty subfolders.** They're added when content lands there.

---

## 2. Route restructure — straightforward changes

### 2a. Depth >3 violations (14 routes)

All meditation/movement/sound-studio session routes nest 4–5 levels deep. Proposed flattening:

| Current (depth) | Proposed (depth) | Module |
|---|---|---|
| `/practices/body/meditation/<session>` (4) | `/practices/body/meditations/<session>` (4) — **stays at 4** | meditation |
| `/practices/body/movement/<session>` (4) | `/practices/body/movements/<session>` (4) — **stays at 4** | movement |
| `/practices/emotion/sound-studio/ai/<page>` (5) | see complex case 4.2 | sound-studio |
| `/practices/emotion/sound-studio/curated/[category]` (5) | see complex case 4.2 | sound-studio |

> **Conflict with spec:** spec sec 11 says "max 3 levels of nesting." But meditation/movement at depth 4 is *already* the proposed flat alternative — the natural grouping `/practices/body/meditations/<x>` reads cleanly even at 4 levels. Two options:
> - **A.** Relax the rule to "max 4 levels for grouped collections" (small spec amend)
> - **B.** Flatten meditation/movement to `/meditations/<x>` and `/movements/<x>` at root (loses the `body` grouping)
>
> **My rec: A.** Updating the spec rule is cleaner than fighting the URL semantics.

### 2b. Plural mismatch (2 routes)

| Current | Proposed | Reason |
|---|---|---|
| `/affirmation/affirmation-ready` | see complex case 4.1 | depends on whether affirmation is a collection or an action |
| `/affirmation/feeling-selection` | same | same |

### 2c. Kebab / naming (1 route)

| Current | Proposed | Reason |
|---|---|---|
| `/account-creation/second` | see complex case 4.5 | `second` is non-descriptive; needs rename |

### 2d. All other 158 routes — no changes needed

---

## 3. Cross-module coupling — the real Phase 0 work

### 3a. Tight coupling map (highest first)

| Module | Cross-module importers | Shared importers | Key offenders |
|---|---|---|---|
| `practices` | 34 | 0 | `PracticeScreenShell`, `PracticeListRow`, `GradientText`, `MoodTabs`, `PracticeStackHeader` consumed by movement/meditation/sound-studio/self-check-ins |
| `home` | 27 | 4 | `useLatestBiometrics`, `useStressScore`, `useEnergyCheckInHistory`, `useBiometricHistory` consumed by practices/insights/settings/movement; `home/utils/*` imported by `src/lib/biometrics-background.ts` |
| `auth` | 10 | 7 | `useSession`, `useBiometricAvailability`, `useSignOut` consumed by home/settings/account-creation/journal; `BiometricSetup` consumed by settings; `biometricEnabledAtom` consumed by settings/journal; `src/components/ui/UserAvatar.tsx`, `src/hooks/useProfileAutoRecovery.ts` import from auth |
| `insights` | 15 | 0 | `useBiometricHistory`, `useEnergyCheckInHistory`, `useAssessmentList`, `StressorKey` consumed by home/journal/practices/self-check-ins |
| `purchases` | 5 | 1 | Pack hooks consumed by courage/ebook |

### 3b. Shared-layer leaks (bigger problem — these break layering)

Files in `src/lib/`, `src/hooks/`, `src/components/` should NOT import from any module:

| Shared file | Imports from | Why it's a problem |
|---|---|---|
| `src/lib/biometrics-background.ts` | `@/modules/home/utils` | Shared infra depends on a feature module |
| `src/lib/powersync/useUserId.ts` | `@/modules/account-creation/store` | PowerSync (shared) depends on a feature module's Jotai atom |
| `src/hooks/useProfileAutoRecovery.ts` | `@/modules/auth/hooks` | Shared hook depends on auth module |
| `src/hooks/useNotificationScheduler.ts` | `@/modules/notifications` | Shared hook depends on notifications module |
| `src/components/ui/UserAvatar.tsx` | `@/modules/auth` | Shared UI primitive depends on auth |

### 3c. Decoupling proposal — extraction targets

**To `src/hooks/biometrics/`:**
- `useLatestBiometrics`, `useStressScore`, `useBiometricHistory`, `useEnergyCheckInHistory` (from home + insights)

**To `src/hooks/auth/`:**
- `useSession`, `useBiometricAvailability`, `useSignOut`

**To `src/hooks/purchases/`:**
- `usePackPurchases`, `usePackOffering`, `usePackPurchased`, `usePurchasePack`, `useRestorePurchases`

**To `src/store/auth.ts`:**
- `biometricEnabledAtom`, session-related atoms

**To `src/components/practice-shared/`:**
- `PracticeScreenShell`, `PracticeListRow`, `GradientText`, `MoodTabs`, `PracticeStackHeader`

**Rename / move:**
- `home/utils/` → `src/lib/biometrics/` (the platform-specific health readers don't belong to the home feature)

### 3d. Couplings that are probably **fine** (deferred)

- Movement/meditation/sound-studio importing from `practices/components` — these are practice modules; tightening this isn't worth the churn now if we're going to extract the shared bits anyway
- `EMOTIONS` data consumed across daily-flow + micro-challenges — single-source-of-truth data export, fine to live in one module's `data/`
- `profile-setup` reusing `account-creation/screens` — see complex case 4.4

---

## 4. Complex cases — need user decision before execution

### 4.1 — `/affirmation/*` plural?

**Currently:** `/affirmation/feeling-selection`, `/affirmation/affirmation-ready` (singular, module = `home`)

The screens select one affirmation from a list. Two readings:
- **Action**: "the user is performing the affirmation flow" → singular `/affirmation` OK
- **Collection**: "browsing affirmations" → plural `/affirmations`

**My rec: keep singular** — these are flow steps within a single-affirmation selection, not browsing a collection.

**Decision needed:** Singular or plural?

### 4.2 — Sound-studio depth-5 flattening

**Currently:** `/practices/emotion/sound-studio/ai/{express,feeling,playback,write}` (5 levels)

Three options:
- **A.** Hyphen-flatten: `/practices/emotion/sound-studios/ai-express` (loses "ai" subgroup, gains plural)
- **B.** Pull up: `/practices/emotion-sound-studio/ai/express` (4 levels, awkward compound name)
- **C.** Top-level: `/sound-studio/ai/express` (3 levels, but loses the "emotion" practice grouping)

**My rec: C** — sound-studio is large enough to be a top-level route, and the `/practices/emotion/...` grouping is already inconsistent (other emotion-regulation practices live at `/practices/emotion-regulation`, not `/practices/emotion/regulation`). Promoting sound-studio to top-level matches this.

**Decision needed:** A, B, or C?

### 4.3 — Meditation/movement plural

**Currently:** `/practices/body/meditation/<session>`, `/practices/body/movement/<session>`

Sessions like `body-scan`, `loving-kindness` are *individual meditations* belonging to a *collection*. Plural reads better: `/practices/body/meditations/body-scan`.

**My rec: pluralize** — `meditations` and `movements`.

**Decision needed:** Pluralize? (Confirmed depth stays at 4, see sec 2a.)

### 4.4 — `profile-setup` vs `account-creation` module split

**Currently:** Routes `/profile-setup/*` re-export from `@/modules/account-creation/screens/...`. Same screens, two route prefixes.

The flows are *semantically distinct*: account-creation = unauthenticated signup; profile-setup = authenticated post-signup setup. But they share screens.

Three options:
- **A.** Status quo: keep the route-level alias. (Current.)
- **B.** Split modules: `account-creation` and `profile-setup` become separate modules with their own screens (some duplication).
- **C.** Single module with `profile/` subfolder housing both flows, route names unchanged.

**My rec: A (status quo)** — splitting is overkill given the screens are identical. The two route prefixes are intentional product UX.

**Decision needed:** A, B, or C?

### 4.5 — `/account-creation/second` rename

**Currently:** `/account-creation/second` → `Second.tsx` screen.

`second` is meaningless. Looking at the actual screen content would tell us; from the route position (between `index` and `age-selection`), it's likely the post-welcome step.

**My rec:** Read the screen contents and pick a descriptive name. Candidates: `welcome-questions`, `getting-started`, `intro-questions`. Will inspect during execution and propose.

**Decision needed:** Approve a content-driven rename, or specify a name now?

---

## 5. Proposed execution order

Sub-phasing Phase 0 to handle the coupling work explicitly:

### Phase 0a — Resolve shared-layer leaks (highest priority)

**Status: ✅ COMPLETE (2026-05-05)**

Originally scoped 5 leaks. Of those, only the `home/utils` move was a pure path move; the other 4 require hook extraction (now folded into Phase 0b). Done in 0a:

1. ✅ Moved `home/utils/` (8 files) → `src/lib/biometrics/` via `git mv`
2. ✅ Updated 12 imports across 3 files: `src/lib/biometrics-background.ts` (the actual leak), `src/modules/home/hooks/useLatestBiometrics.android.ts`, `src/modules/home/hooks/useLatestBiometrics.ios.ts`
3. ✅ Verified with `tsc --noEmit` — no new errors introduced

**Deferred to 0b** (require hook extraction, not just path moves):
- `src/lib/powersync/useUserId.ts` imports `useSession` from `@/modules/auth/hooks/useAuth`
- `src/hooks/useProfileAutoRecovery.ts` imports `questionnaireAtom` (account-creation) + `useSaveProfile` (auth)
- `src/hooks/useNotificationScheduler.ts` imports `useNotificationSettings` from settings
- `src/components/ui/UserAvatar.tsx` imports `useSession` from auth
- `biometricEnabledAtom` extraction → `src/store/auth.ts`

**Pre-existing TS errors observed (NOT introduced by 0a):**
- `src/lib/auth.ts` — Better Auth plugin type drift (cross-package version mismatch)
- `src/lib/powersync/connector.ts` — string-vs-enum mismatches in profile field types
- `src/modules/settings/screens/Biometric.tsx:24` — function-arg count error

### Phase 0b — Extract shared module hooks/components

**Status: ✅ COMPLETE (2026-05-05)**

**Re-scoped during execution.** Original plan extracted broadly (biometric/auth/purchase hooks + practice components). Re-evaluated based on the actual layering rule: *shared layer (`src/lib/`, `src/hooks/`, `src/components/`) cannot import from feature modules*. Cross-module imports between feature modules are tolerable and get cleaned up during Phase 3. So 0b focused on the 4 confirmed shared-layer leaks.

Done in 0b:

1. ✅ Moved `src/modules/auth/hooks/` (3 files: `useAuth.ts`, `useProfile.ts`, `useBiometric.ts`) → `src/hooks/auth/`
2. ✅ Moved `src/modules/auth/store/biometric.ts` → `src/store/auth.ts` (contains `biometricEnabledAtom`, `biometricPromptShownAtom`, `isSignedOutAtom`)
3. ✅ Moved `src/modules/account-creation/store/account-creation.ts` → `src/store/onboarding.ts` (contains `questionnaireAtom` + derived atoms)
4. ✅ Moved `src/hooks/useNotificationScheduler.ts` → `src/modules/notifications/hooks/useNotificationScheduler.ts` (it was a notifications-domain hook misplaced in shared)
5. ✅ Updated 13 absolute-path importers via `sed`
6. ✅ Updated 7 relative-path importers (auth screens, account-creation screens) via `sed`
7. ✅ Verified with `tsc --noEmit` — 218 errors before, 218 errors after (all pre-existing, none introduced by 0b)

**Deferred** (no longer needed for layering — handled during Phase 3 module migrations):
- Biometric hooks (`useLatestBiometrics`, `useStressScore`, etc.) stay in `home/hooks/` and `insights/hooks/` — feature modules can import each other's hooks for now
- Purchase hooks stay in `purchases/` (service-only module, callable from feature modules)
- Practice-shared components stay in `practices/components/` — get replaced by Phase 2 design-system primitives anyway

**Empty dirs cleaned up:** `src/modules/auth/store/` (deleted), `src/modules/account-creation/store/` (deleted)

### Phase 0c — Standardize module folder structure

**Status: ✅ COMPLETE (2026-05-05)**

1. ✅ `home/utils/` → `src/lib/biometrics/` (handled in 0a)
2. ✅ `practices/utils/format.ts` → `practices/lib/format.ts`; updated 8 importers
3. ✅ `practices/types.ts` → `practices/types/index.ts`; no import updates needed (TS resolves `../types` → `../types/index.ts` automatically)
4. ✅ `calendar/types.ts` → `calendar/types/index.ts`; no import updates needed
5. ✅ Verified with `tsc --noEmit` — 218 errors before, 218 after (all pre-existing, none introduced)

### Phase 0d — Restructure routes

Per spec sec 11 + complex case decisions in sec 4 above:

1. After complex cases approved: rename routes
2. Update the 98 files containing navigation calls
3. Run `tsc --noEmit` after each batch — typed-routes catches broken paths
4. Smoke-test in simulator

**Risk:** Medium — typed-routes is the safety net but we should still test deep links in flow modules
**Files affected:** ~20 route files moved/renamed; up to 98 files updated for nav calls.

### Phase 0e — Spec amendment + CLAUDE.md

1. Amend `app/docs/design-system-spec.md` sec 11: relax max-depth rule to 4 for grouped collections (or pick a different solution from sec 4)
2. Add routing rules to `app/CLAUDE.md` (full Phase 4 deferred but the new routing rules can land here)

---

## 6. Order of attack — module dependency groups

If we choose to do Phase 0c/0d in dependency order (safer), modules group like this:

| Group | Modules | Risk |
|---|---|---|
| A (no cross-deps) | `journal`, `gentle-letter`, `ebook`, `characters`, `daily-check-in`, `coach`, `notifications`, `community` | Low |
| B (1–6 deps) | `calendar`, `micro-challenges`, `courage`, `empathy-challenge` | Low |
| C (≤2 deps) | `movement`, `meditation`, `sound-studio`, `morning-reset`, `onboarding` | Low |
| D (4–5 deps) | `account-creation`, `self-check-ins` | Medium |
| E (3 deps, dispatcher) | `daily-flow` | Medium |
| F (15 deps) | `insights` | High |
| G (17 deps + shared) | `auth` | High |
| H (31 deps) | `home` | High |
| I (34 deps, post-extraction) | `practices` | Medium (after 0b extraction) |

Process order during 0c/0d: **A → B → C → D → E → F → G → H → I**.

---

## 7. Estimated effort

| Sub-phase | Effort | Risk |
|---|---|---|
| 0a | ~1 hour | Low |
| 0b | ~3 hours | Medium |
| 0c | ~30 min | Low |
| 0d | ~3 hours | Medium |
| 0e | ~30 min | Low |
| **Total Phase 0** | **~8 hours** | — |

---

## 8. Hardcoded route strings — none found

Good news: no config/data files contain route strings. All navigation goes through `router.*` typed calls or route file paths. TS compiler is reliable safety net for path renames.

---

## 9. Locked decisions (2026-05-05)

1. **Max depth:** flatten meditation/movement to root → `/meditations/<x>`, `/movements/<x>` (depth 1). Spec rule stays at max 3.
2. **`/affirmation/*`:** singular (flow, not collection)
3. **Sound-studio:** option C → promote to top-level `/sound-studio/...` (max 3 levels)
4. **Meditation/movement:** pluralize → `/meditations`, `/movements`
5. **`profile-setup`:** status quo (alias, no module split)
6. **`/account-creation/second`:** inspect screen contents during execution, propose name
7. **Sub-phase order:** strict sequential 0a → 0b → 0c → 0d → 0e
8. **Spec amendments:** updated as each phase lands
