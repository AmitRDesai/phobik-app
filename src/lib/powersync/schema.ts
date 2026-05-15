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
    hr_at_entry: column.real,
    hrv_at_entry: column.real,
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

const song = new Table(
  {
    user_id: column.text,
    prompt: column.text,
    style: column.text,
    status: column.text, // 'draft' | 'generating' | 'ready' | 'failed'
    generation_stage: column.text, // 'queued' | 'text' | 'first' | 'complete' | null
    provider_job_id: column.text,
    audio_key: column.text, // S3 storage key — fetch playback URL via getPlaybackUrl
    artwork_key: column.text, // S3 storage key — presigned URL also comes via getPlaybackUrl
    title: column.text,
    composition_number: column.integer,
    duration_seconds: column.integer,
    analysis_tags: column.text, // JSON string[] — parsed via toCamel({ analysisTags: true })
    is_favorite: column.integer, // 0 / 1
    error_message: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      user_status: ['user_id', 'status'],
      user_created: ['user_id', 'created_at'],
    },
  },
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

const micro_challenge = new Table(
  {
    user_id: column.text,
    emotion_id: column.text,
    need_id: column.text,
    feeling: column.text,
    need: column.text,
    status: column.text,
    ai_response: column.text, // JSONB as JSON string
    current_step: column.integer,
    dose_dopamine: column.integer,
    dose_oxytocin: column.integer,
    dose_serotonin: column.integer,
    dose_endorphins: column.integer,
    duration_seconds: column.integer,
    reflection: column.text,
    created_at: column.text,
    completed_at: column.text,
  },
  {
    indexes: {
      user_status: ['user_id', 'status'],
      user_created: ['user_id', 'created_at'],
    },
  },
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

const user_affirmation = new Table(
  {
    user_id: column.text,
    feeling: column.text,
    text: column.text,
    selected_date: column.text,
    created_at: column.text,
  },
  { indexes: { user_date: ['user_id', 'selected_date'] } },
);

const energy_check_in = new Table(
  {
    user_id: column.text,
    purpose: column.integer,
    mental: column.integer,
    physical: column.integer,
    relationship: column.integer,
    energy_index: column.integer,
    selected_date: column.text,
    created_at: column.text,
  },
  { indexes: { user_date: ['user_id', 'selected_date'] } },
);

const practice_session = new Table(
  {
    user_id: column.text,
    practice_type: column.text,
    dose_dopamine: column.integer,
    dose_oxytocin: column.integer,
    dose_serotonin: column.integer,
    dose_endorphins: column.integer,
    duration_seconds: column.integer,
    completed_at: column.text,
    created_at: column.text,
  },
  { indexes: { user_completed: ['user_id', 'completed_at'] } },
);

const pack_purchase = new Table(
  {
    user_id: column.text,
    pack_id: column.text,
    product_id: column.text,
    purchased_at: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user_pack: ['user_id', 'pack_id'] } },
);

const ebook_progress = new Table(
  {
    user_id: column.text,
    purchased: column.integer,
    intro_seen: column.integer,
    last_chapter_id: column.integer,
    completed_chapters: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user: ['user_id'] } },
);

const notification_settings = new Table(
  {
    user_id: column.text,
    daily_reminders: column.integer,
    check_in_reminders: column.integer,
    challenge_notifications: column.integer,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: { user: ['user_id'] } },
);

const daily_flow_session = new Table(
  {
    user_id: column.text,
    status: column.text,
    current_step: column.text,
    started_at: column.text,
    completed_at: column.text,
    feeling: column.text,
    intention: column.text,
    support_option: column.text,
    add_ons: column.text, // JSONB as JSON string
    reflection: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      user_status: ['user_id', 'status'],
      user_started: ['user_id', 'started_at'],
    },
  },
);

const notification = new Table(
  {
    user_id: column.text,
    type: column.text,
    title: column.text,
    body: column.text,
    data: column.text, // JSONB stored as JSON string
    read_at: column.text, // ISO string or null
    created_at: column.text,
  },
  { indexes: { user_created: ['user_id', 'created_at'] } },
);

const biometric_reading = new Table(
  {
    user_id: column.text,
    metric: column.text, // 'heart_rate' | 'hrv_sdnn' | 'hrv_rmssd'
    value: column.real,
    unit: column.text, // 'bpm' | 'ms'
    source: column.text, // 'apple_health' | 'health_connect'
    recorded_at: column.text, // ISO 8601 — bucketing uses strftime
    created_at: column.text,
  },
  {
    indexes: {
      user_metric_recorded: ['user_id', 'metric', 'recorded_at'],
    },
  },
);

const morning_reset_session = new Table(
  {
    user_id: column.text,
    status: column.text,
    current_step: column.text,
    started_at: column.text,
    completed_at: column.text,
    created_at: column.text,
    updated_at: column.text,
  },
  {
    indexes: {
      user_status: ['user_id', 'status'],
      user_started: ['user_id', 'started_at'],
    },
  },
);

const sleep_session = new Table(
  {
    user_id: column.text,
    start_time: column.text, // ISO 8601
    end_time: column.text, // ISO 8601
    in_bed_minutes: column.real,
    total_minutes: column.real,
    deep_minutes: column.real, // nullable
    rem_minutes: column.real, // nullable
    light_minutes: column.real, // nullable
    awake_minutes: column.real, // nullable
    efficiency_pct: column.real, // nullable
    restorative_pct: column.real, // nullable — (deep+rem)/total*100
    source: column.text, // 'apple_health' | 'health_connect'
    recorded_at: column.text,
    created_at: column.text,
  },
  {
    indexes: { user_start: ['user_id', 'start_time'] },
  },
);

export const AppSchema = new Schema({
  user_profile,
  calendar_preferences,
  journal_entry,
  journal_tag,
  gentle_letter,
  song,
  empathy_challenge,
  empathy_challenge_day,
  micro_challenge,
  mystery_challenge,
  self_check_in,
  user_affirmation,
  energy_check_in,
  practice_session,
  pack_purchase,
  ebook_progress,
  notification_settings,
  notification,
  daily_flow_session,
  morning_reset_session,
  biometric_reading,
  sleep_session,
});

export type Database = (typeof AppSchema)['types'];
export type PackPurchaseRecord = Database['pack_purchase'];
export type UserProfileRecord = Database['user_profile'];
export type CalendarPreferencesRecord = Database['calendar_preferences'];
export type JournalEntryRecord = Database['journal_entry'];
export type JournalTagRecord = Database['journal_tag'];
export type GentleLetterRecord = Database['gentle_letter'];
export type SongRecord = Database['song'];
export type EmpathyChallengeRecord = Database['empathy_challenge'];
export type EmpathyChallengeDayRecord = Database['empathy_challenge_day'];
export type MicroChallengeRecord = Database['micro_challenge'];
export type MysteryChallengeRecord = Database['mystery_challenge'];
export type SelfCheckInRecord = Database['self_check_in'];
export type UserAffirmationRecord = Database['user_affirmation'];
export type EnergyCheckInRecord = Database['energy_check_in'];
export type PracticeSessionRecord = Database['practice_session'];
export type EbookProgressRecord = Database['ebook_progress'];
export type NotificationSettingsRecord = Database['notification_settings'];
export type NotificationRecord = Database['notification'];
export type DailyFlowSessionRecord = Database['daily_flow_session'];
export type MorningResetSessionRecord = Database['morning_reset_session'];
export type BiometricReadingRecord = Database['biometric_reading'];
export type SleepSessionRecord = Database['sleep_session'];
