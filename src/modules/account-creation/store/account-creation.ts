import { atom } from 'jotai';
import { atomWithStorage, unwrap } from 'jotai/utils';
import { storage } from '@/utils/jotai';

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type GenderIdentity =
  | 'female'
  | 'male'
  | 'non-binary'
  | 'prefer-not-to-say';
export type Goal =
  | 'reduce-anxiety'
  | 'build-resilience'
  | 'improve-sleep'
  | 'face-social-fears'
  | 'daily-mindfulness';

export interface Questionnaire {
  age: AgeRange | null;
  gender: GenderIdentity | null;
  goals: Goal[];
  termsAcceptedAt: string | null;
  privacyAcceptedAt: string | null;
}

const defaultQuestionnaire: Questionnaire = {
  age: null,
  gender: null,
  goals: [],
  termsAcceptedAt: null,
  privacyAcceptedAt: null,
};

// Single object for all questionnaire answers
export const questionnaireAtom = atomWithStorage<Questionnaire>(
  'questionnaire',
  defaultQuestionnaire,
  storage,
);

// Sync version — returns previous/default while hydrating, never triggers Suspense
const syncQuestionnaireAtom = unwrap(
  questionnaireAtom,
  (prev) => prev ?? defaultQuestionnaire,
);

// Derived atoms for individual screens (read/write to questionnaireAtom fields)
export const questionnaireAgeAtom = atom(
  (get) => get(syncQuestionnaireAtom).age,
  (get, set, value: AgeRange | null) =>
    set(questionnaireAtom, { ...get(syncQuestionnaireAtom), age: value }),
);

export const questionnaireGenderAtom = atom(
  (get) => get(syncQuestionnaireAtom).gender,
  (get, set, value: GenderIdentity | null) =>
    set(questionnaireAtom, { ...get(syncQuestionnaireAtom), gender: value }),
);

export const questionnaireGoalsAtom = atom(
  (get) => get(syncQuestionnaireAtom).goals,
  (get, set, value: Goal[]) =>
    set(questionnaireAtom, { ...get(syncQuestionnaireAtom), goals: value }),
);
