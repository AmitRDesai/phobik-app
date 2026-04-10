import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMemo } from 'react';

export type DoseActivity = {
  source: string;
  practiceType: string;
  dopamine: number;
  oxytocin: number;
  serotonin: number;
  endorphins: number;
  completedAt: string;
};

/** Returns YYYY-MM-DD in local time */
function todayLocal(): string {
  return new Date().toLocaleDateString('en-CA');
}

/** Friendly display name for a practice type */
function formatPracticeType(source: string, type: string): string {
  if (source === 'mystery') return 'Mystery Challenge';
  if (source === 'empathy') return 'Empathy Day';
  if (source === 'micro') return 'Micro Challenge';

  const labels: Record<string, string> = {
    'box-breathing': 'Box Breathing',
    '478-breathing': '4-7-8 Breathing',
    'star-breathing': 'Star Breathing',
    'double-inhale': 'Double Inhale',
    'lazy8-breathing': 'Lazy 8 Breathing',
    grounding: 'Grounding',
    'muscle-relaxation': 'Muscle Relaxation',
    'sleep-meditation': 'Sleep Meditation',
  };

  return labels[type] ?? type;
}

/**
 * Returns today's D.O.S.E. activity log — recent completions from all sources.
 * Auto-updates reactively.
 */
export function useDoseActivityLog() {
  const userId = useUserId();
  const today = todayLocal();

  const { data, isLoading, error } = useQuery<{
    source: string;
    practice_type: string;
    dose_dopamine: number;
    dose_oxytocin: number;
    dose_serotonin: number;
    dose_endorphins: number;
    completed_at: string;
  }>({
    queryKey: ['dose-activity-log', userId, today],
    query: `
      SELECT 'practice' as source, practice_type, dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins, completed_at
      FROM practice_session
      WHERE user_id = ? AND date(completed_at) = ?
      UNION ALL
      SELECT 'mystery' as source, challenge_type as practice_type, dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins, completed_at
      FROM mystery_challenge
      WHERE user_id = ? AND date(completed_at) = ?
      UNION ALL
      SELECT 'empathy' as source, 'empathy-day' as practice_type, 0 as dose_dopamine, dose_oxytocin, dose_serotonin, 0 as dose_endorphins, completed_at
      FROM empathy_challenge_day
      WHERE user_id = ? AND date(completed_at) = ? AND status = 'completed'
      UNION ALL
      SELECT 'micro' as source, 'micro-challenge' as practice_type, dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins, completed_at
      FROM micro_challenge
      WHERE user_id = ? AND status = 'completed' AND date(completed_at) = ?
      ORDER BY completed_at DESC
    `,
    parameters: [userId, today, userId, today, userId, today, userId, today],
    enabled: !!userId,
  });

  const activities: DoseActivity[] = useMemo(
    () =>
      (data ?? []).map((row) => ({
        source: row.source,
        practiceType: formatPracticeType(row.source, row.practice_type),
        dopamine: Number(row.dose_dopamine) || 0,
        oxytocin: Number(row.dose_oxytocin) || 0,
        serotonin: Number(row.dose_serotonin) || 0,
        endorphins: Number(row.dose_endorphins) || 0,
        completedAt: row.completed_at,
      })),
    [data],
  );

  return { data: activities, isLoading, error };
}
