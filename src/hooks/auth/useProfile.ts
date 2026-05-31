import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toJSON } from '@/lib/powersync/utils';
import type { OnboardingAnswers } from '@/store/onboarding';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMutation } from '@tanstack/react-query';

const PROFILE_STATUS_KEY = 'profile-status';

/**
 * Profile status for the navigation guard.
 * Reads from PowerSync local SQLite — instant for returning users (no network call).
 * Reactive: auto-updates when user_profile table changes (e.g., after save or sync).
 */
export function useProfileStatus(enabled: boolean) {
  const userId = useUserId();

  const { data, isLoading, error } = useQuery({
    queryKey: [PROFILE_STATUS_KEY, userId],
    query: db
      .selectFrom('user_profile')
      .select(['onboarding_completed_at'])
      .where('user_id', '=', userId ?? '')
      .limit(1),
    enabled: enabled && !!userId,
  });

  const row = data?.[0];
  const profileStatus = {
    hasProfile: !!row,
    onboardingCompleted: !!row?.onboarding_completed_at,
  };

  return {
    data: profileStatus,
    isPending: isLoading,
    error,
  };
}

/**
 * Flush the full set of onboarding answers to the local `user_profile` row.
 * Idempotent (updates the row when it already exists, inserts otherwise) so it
 * is safe to call from either onboarding path. PowerSync uploads the change to
 * the backend's two upsert procedures (saveProfile + saveOnboardingAnswers).
 */
export function useSaveProfile() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (answers: OnboardingAnswers) => {
      if (!userId) throw new Error('Not authenticated');

      const now = new Date().toISOString();
      const columns = {
        age_range: answers.age,
        gender_identity: answers.gender,
        goals: toJSON(answers.goals),
        goal_details: answers.goalDetails,
        emotional_state: toJSON(answers.emotionalState),
        sleep_quality: answers.sleepQuality,
        activity_level: answers.activityLevel,
        sedentary_time: answers.sedentaryTime,
        food_preferences: toJSON(answers.foodPreferences),
        food_preferences_other: answers.foodPreferencesOther,
        habit_ratings: toJSON(answers.habitRatings),
        terms_accepted_at: answers.termsAcceptedAt,
        privacy_accepted_at: answers.privacyAcceptedAt,
        updated_at: now,
      };

      const existing = await db
        .selectFrom('user_profile')
        .select('id')
        .where('user_id', '=', userId)
        .executeTakeFirst();

      if (existing) {
        await db
          .updateTable('user_profile')
          .set(columns)
          .where('user_id', '=', userId)
          .execute();
      } else {
        await db
          .insertInto('user_profile')
          .values({ id: uuid(), user_id: userId, created_at: now, ...columns })
          .execute();
      }
    },
  });
}
