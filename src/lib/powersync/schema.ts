import { column, Schema, Table } from '@powersync/react-native';

// PowerSync auto-creates `id` column (text) — do NOT declare it.
// JSONB → column.text (store as JSON strings)
// Timestamps → column.text (ISO strings)
// Enums → column.text
// Booleans → column.integer (0/1)

const user_profile = new Table(
  {
    user_id: column.text,
    age_range: column.text,
    gender_identity: column.text,
    goals: column.text,
    stressors: column.text,
    triggers: column.text,
    custom_trigger: column.text,
    reminder_preference: column.text,
    regulation_tools: column.text,
    custom_tool: column.text,
    energy_focus: column.text,
    energy_creativity: column.text,
    energy_dip: column.text,
    terms_accepted_at: column.text,
    privacy_accepted_at: column.text,
    onboarding_completed_at: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user: ['user_id'] } },
);

const calendar_preferences = new Table(
  {
    user_id: column.text,
    calendar_connected: column.integer,
    selected_calendar_ids: column.text,
    check_in_timing: column.text,
    support_tone: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user: ['user_id'] } },
);

const journal_entry = new Table(
  {
    user_id: column.text,
    feeling: column.text,
    need: column.text,
    title: column.text,
    content: column.text,
    tags: column.text,
    entry_date: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user_date: ['user_id', 'entry_date'] } },
);

const journal_tag = new Table(
  {
    user_id: column.text,
    name: column.text,
    color: column.text,
    created_at: column.text,
  },
  { indexes: { user: ['user_id'] } },
);

const gentle_letter = new Table(
  {
    user_id: column.text,
    title: column.text,
    core_act: column.text,
    content: column.text,
    entry_date: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user_date: ['user_id', 'entry_date'] } },
);

const empathy_challenge = new Table(
  {
    user_id: column.text,
    status: column.text,
    started_at: column.text,
    completed_at: column.text,
    created_at: column.text,
  },
  { indexes: { user_status: ['user_id', 'status'] } },
);

const empathy_challenge_day = new Table(
  {
    challenge_id: column.text,
    user_id: column.text,
    day_number: column.integer,
    status: column.text,
    reflection: column.text,
    dose_oxytocin: column.integer,
    dose_serotonin: column.integer,
    started_at: column.text,
    completed_at: column.text,
    created_at: column.text,
  },
  { indexes: { challenge: ['challenge_id'] } },
);

const mystery_challenge = new Table(
  {
    user_id: column.text,
    challenge_type: column.text,
    dose_dopamine: column.integer,
    dose_oxytocin: column.integer,
    dose_serotonin: column.integer,
    dose_endorphins: column.integer,
    duration_seconds: column.integer,
    completed_at: column.text,
    created_at: column.text,
  },
  { indexes: { user: ['user_id'] } },
);

const self_check_in = new Table(
  {
    user_id: column.text,
    type: column.text,
    status: column.text,
    current_question: column.integer,
    answers: column.text,
    started_at: column.text,
    completed_at: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      user_type: ['user_id', 'type'],
      user_status: ['user_id', 'status'],
    },
  },
);

export const AppSchema = new Schema({
  user_profile,
  calendar_preferences,
  journal_entry,
  journal_tag,
  gentle_letter,
  empathy_challenge,
  empathy_challenge_day,
  mystery_challenge,
  self_check_in,
});

export type Database = (typeof AppSchema)['types'];
export type UserProfileRecord = Database['user_profile'];
export type CalendarPreferencesRecord = Database['calendar_preferences'];
export type JournalEntryRecord = Database['journal_entry'];
export type JournalTagRecord = Database['journal_tag'];
export type GentleLetterRecord = Database['gentle_letter'];
export type EmpathyChallengeRecord = Database['empathy_challenge'];
export type EmpathyChallengeDayRecord = Database['empathy_challenge_day'];
export type MysteryChallengeRecord = Database['mystery_challenge'];
export type SelfCheckInRecord = Database['self_check_in'];
