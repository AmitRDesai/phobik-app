import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';

export type DoseTotals = {
  dopamine: number;
  oxytocin: number;
  serotonin: number;
  endorphins: number;
};

const EMPTY_TOTALS: DoseTotals = {
  dopamine: 0,
  oxytocin: 0,
  serotonin: 0,
  endorphins: 0,
};

/** Returns YYYY-MM-DD in local time */
function todayLocal(): string {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Aggregates D.O.S.E. totals for today from all 4 source tables:
 * practice_session, mystery_challenge, empathy_challenge_day, micro_challenge.
 *
 * Auto-updates reactively when any of these tables change.
 */
export function useDailyDose() {
  const userId = useUserId();
  const today = todayLocal();

  const { data, isLoading, error } = useQuery<{
    dopamine: number;
    oxytocin: number;
    serotonin: number;
    endorphins: number;
  }>({
    queryKey: ['daily-dose', userId, today],
    query: `
      SELECT
        COALESCE(SUM(dose_dopamine), 0) as dopamine,
        COALESCE(SUM(dose_oxytocin), 0) as oxytocin,
        COALESCE(SUM(dose_serotonin), 0) as serotonin,
        COALESCE(SUM(dose_endorphins), 0) as endorphins
      FROM (
        SELECT dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins
        FROM practice_session
        WHERE user_id = ? AND date(completed_at) = ?
        UNION ALL
        SELECT dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins
        FROM mystery_challenge
        WHERE user_id = ? AND date(completed_at) = ?
        UNION ALL
        SELECT 0 as dose_dopamine, dose_oxytocin, dose_serotonin, 0 as dose_endorphins
        FROM empathy_challenge_day
        WHERE user_id = ? AND date(completed_at) = ?
        UNION ALL
        SELECT dose_dopamine, dose_oxytocin, dose_serotonin, dose_endorphins
        FROM micro_challenge
        WHERE user_id = ? AND status = 'completed' AND date(completed_at) = ?
      )
    `,
    parameters: [userId, today, userId, today, userId, today, userId, today],
    enabled: !!userId,
  });

  const totals: DoseTotals = data?.[0]
    ? {
        dopamine: Number(data[0].dopamine) || 0,
        oxytocin: Number(data[0].oxytocin) || 0,
        serotonin: Number(data[0].serotonin) || 0,
        endorphins: Number(data[0].endorphins) || 0,
      }
    : EMPTY_TOTALS;

  return { data: totals, isLoading, error };
}
