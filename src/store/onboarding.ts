import { storage } from '@/utils/jotai';
import { atom } from 'jotai';
import { atomWithStorage, unwrap } from 'jotai/utils';

// --- Enums (shared across the unified onboarding flow) ---
export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export type GenderIdentity =
  | 'female'
  | 'male'
  | 'non-binary'
  | 'prefer-not-to-say';

export type Goal =
  | 'stress-less'
  | 'increase-energy'
  | 'improve-sleep'
  | 'build-healthy-habits'
  | 'improve-focus'
  | 'emotionally-balanced'
  | 'move-more'
  | 'build-confidence'
  | 'feel-happier'
  | 'support-wellness'
  | 'not-sure';

export type EmotionalState =
  | 'calm'
  | 'energized'
  | 'hopeful'
  | 'focused'
  | 'tired'
  | 'stressed'
  | 'anxious'
  | 'restless'
  | 'overwhelmed'
  | 'burned-out'
  | 'disconnected'
  | 'foggy'
  | 'not-sure';

export type SleepQuality =
  | 'deep-refreshing'
  | 'pretty-good'
  | 'light-inconsistent'
  | 'hard-to-fall-asleep'
  | 'wake-during-night'
  | 'tired-most-days';

export type ActivityLevel =
  | 'mostly-sitting'
  | 'lightly-active'
  | 'moderately-active'
  | 'very-active'
  | 'it-varies';

export type SedentaryTime = 'lt-4h' | '4-8h' | 'gt-8h' | 'not-sure';

export type FoodPreference =
  | 'dairy-free'
  | 'gluten-free'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'high-protein'
  | 'low-sugar'
  | 'no-preference';

export type HabitCategory =
  | 'nutrition'
  | 'movement'
  | 'sleep'
  | 'stress-management'
  | 'energy'
  | 'focus'
  | 'emotional-wellbeing'
  | 'relationships';

export type HabitRating = 1 | 2 | 3 | 4 | 5;
export type HabitRatings = Partial<Record<HabitCategory, HabitRating>>;

/**
 * All answers collected during the unified onboarding flow. Persisted to
 * AsyncStorage so the pre-signup (anonymous) flow is resumable on-device —
 * there is no authenticated user yet, so PowerSync can't be the store until
 * after signup. Flushed to `user_profile` and cleared on completion.
 */
export interface OnboardingAnswers {
  age: AgeRange | null;
  gender: GenderIdentity | null;
  goals: Goal[];
  goalDetails: string;
  emotionalState: EmotionalState[];
  sleepQuality: SleepQuality | null;
  activityLevel: ActivityLevel | null;
  sedentaryTime: SedentaryTime | null;
  foodPreferences: FoodPreference[];
  foodPreferencesOther: string;
  habitRatings: HabitRatings;
  termsAcceptedAt: string | null;
  privacyAcceptedAt: string | null;
}

export const defaultOnboardingAnswers: OnboardingAnswers = {
  age: null,
  gender: null,
  goals: [],
  goalDetails: '',
  emotionalState: [],
  sleepQuality: null,
  activityLevel: null,
  sedentaryTime: null,
  foodPreferences: [],
  foodPreferencesOther: '',
  habitRatings: {},
  termsAcceptedAt: null,
  privacyAcceptedAt: null,
};

// Single persisted object for all onboarding answers.
export const onboardingAnswersAtom = atomWithStorage<OnboardingAnswers>(
  'onboarding-answers',
  defaultOnboardingAnswers,
  storage,
);

// Sync version — returns previous/default while hydrating, never triggers
// Suspense. Merges with defaults so values stored by older app versions that
// lack newer fields don't read as undefined.
const syncAnswersAtom = unwrap(onboardingAnswersAtom, (prev) => ({
  ...defaultOnboardingAnswers,
  ...(prev ?? {}),
}));

// Read-only snapshot of all answers (merged with defaults, never suspends) —
// used by the flush at completion.
export const onboardingAnswersValueAtom = atom((get) => get(syncAnswersAtom));

// Write-only atom to reset all onboarding answers after a successful flush.
export const resetOnboardingAtom = atom(null, (_get, set) => {
  set(onboardingAnswersAtom, defaultOnboardingAnswers);
});

/**
 * `true` once the user has worked through the questionnaire — used by the
 * post-auth guard to resume at the completion screen rather than restarting
 * the flow (e.g. after email signup + verification). Social-login users who
 * never touched the flow have empty answers and start at Welcome.
 */
export const hasOnboardingAnswersAtom = atom((get) => {
  const a = get(syncAnswersAtom);
  return (
    a.age !== null ||
    a.gender !== null ||
    a.goals.length > 0 ||
    a.emotionalState.length > 0 ||
    a.sleepQuality !== null ||
    a.activityLevel !== null ||
    a.sedentaryTime !== null ||
    a.foodPreferences.length > 0 ||
    Object.keys(a.habitRatings).length > 0
  );
});

// --- Derived read/write atoms per screen slice ---
function fieldAtom<K extends keyof OnboardingAnswers>(key: K) {
  return atom(
    (get) => get(syncAnswersAtom)[key],
    (get, set, value: OnboardingAnswers[K]) => {
      set(onboardingAnswersAtom, { ...get(syncAnswersAtom), [key]: value });
    },
  );
}

export const onboardingAgeAtom = fieldAtom('age');
export const onboardingGenderAtom = fieldAtom('gender');
export const onboardingGoalsAtom = fieldAtom('goals');
export const onboardingGoalDetailsAtom = fieldAtom('goalDetails');
export const onboardingEmotionalStateAtom = fieldAtom('emotionalState');
export const onboardingSleepQualityAtom = fieldAtom('sleepQuality');
export const onboardingActivityLevelAtom = fieldAtom('activityLevel');
export const onboardingSedentaryTimeAtom = fieldAtom('sedentaryTime');
export const onboardingFoodPreferencesAtom = fieldAtom('foodPreferences');
export const onboardingFoodPreferencesOtherAtom = fieldAtom(
  'foodPreferencesOther',
);
export const onboardingHabitRatingsAtom = fieldAtom('habitRatings');
export const onboardingTermsAcceptedAtAtom = fieldAtom('termsAcceptedAt');
export const onboardingPrivacyAcceptedAtAtom = fieldAtom('privacyAcceptedAt');
