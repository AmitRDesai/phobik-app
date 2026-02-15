import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/jotai';

export const onboardingCompletedAtom = atomWithStorage<boolean>(
  'onboarding-completed',
  false,
  storage,
);

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export const selectedAgeAtom = atomWithStorage<AgeRange | null>(
  'onboarding-age',
  null,
  storage,
);

export type GenderIdentity =
  | 'female'
  | 'male'
  | 'non-binary'
  | 'prefer-not-to-say';
export const selectedGenderAtom = atomWithStorage<GenderIdentity | null>(
  'onboarding-gender',
  null,
  storage,
);

export type Goal =
  | 'reduce-anxiety'
  | 'build-resilience'
  | 'improve-sleep'
  | 'face-social-fears'
  | 'daily-mindfulness';
export const selectedGoalsAtom = atomWithStorage<Goal[]>(
  'onboarding-goals',
  [],
  storage,
);

export const termsAcceptedAtom = atomWithStorage<boolean>(
  'onboarding-terms-accepted',
  false,
  storage,
);

export const privacyAcceptedAtom = atomWithStorage<boolean>(
  'onboarding-privacy-accepted',
  false,
  storage,
);
