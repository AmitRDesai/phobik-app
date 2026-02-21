import { atom } from 'jotai';

// --- Existing atoms ---
export const selectedImageUriAtom = atom<string | null>(null);
export const auraFilterEnabledAtom = atom<boolean>(false);

// --- Types ---
export type LifeStressor =
  | 'work'
  | 'financial'
  | 'relationships'
  | 'self-image'
  | 'time'
  | 'inner-critic'
  | 'isolation'
  | 'fear'
  | 'purpose'
  | 'exhaustion';

export type FearTrigger =
  | 'spiders'
  | 'heights'
  | 'claustrophobia'
  | 'flying'
  | 'snakes'
  | 'dentist'
  | 'public-speaking'
  | 'crowds'
  | 'needles'
  | 'dogs';

export type ReminderPreference =
  | 'yes-reminders'
  | 'high-stress-only'
  | 'no-reminders';

export type RegulationTool =
  | 'breathing'
  | 'movement'
  | 'journaling'
  | 'meditation'
  | 'calming-sounds'
  | 'learning'
  | 'talking'
  | 'listen-to-music'
  | 'laughter'
  | 'rest'
  | 'cooking'
  | 'not-sure';

export type TimeOfDay = 'morning' | 'midday' | 'evening';

export type CalendarType = 'work' | 'personal';

export type CheckInTiming = '2-days' | 'day-of' | '1-hour';

export type SupportTone = 'gentle' | 'subtle' | 'direct';

export interface OnboardingData {
  stressors: LifeStressor[];
  triggers: FearTrigger[];
  customTrigger: string;
  reminderPreference: ReminderPreference | null;
  regulationTools: RegulationTool[];
  customTool: string;
  energyFocus: TimeOfDay | null;
  energyCreativity: TimeOfDay | null;
  energyDip: TimeOfDay | null;
  calendarConnected: boolean;
  calendarTypes: CalendarType[];
  checkInTiming: CheckInTiming | null;
  supportTone: SupportTone | null;
}

const defaultOnboardingData: OnboardingData = {
  stressors: [],
  triggers: [],
  customTrigger: '',
  reminderPreference: null,
  regulationTools: [],
  customTool: '',
  energyFocus: null,
  energyCreativity: null,
  energyDip: null,
  calendarConnected: false,
  calendarTypes: [],
  checkInTiming: null,
  supportTone: null,
};

// --- In-memory atom (onboarding is a one-time flow, no persistence needed) ---
const onboardingDataAtom = atom<OnboardingData>(defaultOnboardingData);

// --- Derived read/write atoms for each screen slice ---
export const onboardingStressorsAtom = atom(
  (get) => get(onboardingDataAtom).stressors,
  (get, set, stressors: LifeStressor[]) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), stressors });
  },
);

export const onboardingTriggersAtom = atom(
  (get) => get(onboardingDataAtom).triggers,
  (get, set, triggers: FearTrigger[]) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), triggers });
  },
);

export const onboardingCustomTriggerAtom = atom(
  (get) => get(onboardingDataAtom).customTrigger,
  (get, set, customTrigger: string) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), customTrigger });
  },
);

export const onboardingReminderPrefAtom = atom(
  (get) => get(onboardingDataAtom).reminderPreference,
  (get, set, reminderPreference: ReminderPreference | null) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), reminderPreference });
  },
);

export const onboardingRegulationToolsAtom = atom(
  (get) => get(onboardingDataAtom).regulationTools,
  (get, set, regulationTools: RegulationTool[]) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), regulationTools });
  },
);

export const onboardingCustomToolAtom = atom(
  (get) => get(onboardingDataAtom).customTool,
  (get, set, customTool: string) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), customTool });
  },
);

export const onboardingEnergyFocusAtom = atom(
  (get) => get(onboardingDataAtom).energyFocus,
  (get, set, energyFocus: TimeOfDay | null) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), energyFocus });
  },
);

export const onboardingEnergyCreativityAtom = atom(
  (get) => get(onboardingDataAtom).energyCreativity,
  (get, set, energyCreativity: TimeOfDay | null) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), energyCreativity });
  },
);

export const onboardingEnergyDipAtom = atom(
  (get) => get(onboardingDataAtom).energyDip,
  (get, set, energyDip: TimeOfDay | null) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), energyDip });
  },
);

export const onboardingCalendarConnectedAtom = atom(
  (get) => get(onboardingDataAtom).calendarConnected,
  (get, set, calendarConnected: boolean) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), calendarConnected });
  },
);

export const onboardingCalendarTypesAtom = atom(
  (get) => get(onboardingDataAtom).calendarTypes,
  (get, set, calendarTypes: CalendarType[]) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), calendarTypes });
  },
);

export const onboardingCheckInTimingAtom = atom(
  (get) => get(onboardingDataAtom).checkInTiming,
  (get, set, checkInTiming: CheckInTiming | null) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), checkInTiming });
  },
);

export const onboardingSupportToneAtom = atom(
  (get) => get(onboardingDataAtom).supportTone,
  (get, set, supportTone: SupportTone | null) => {
    set(onboardingDataAtom, { ...get(onboardingDataAtom), supportTone });
  },
);
