import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { useMemo } from 'react';
import {
  CHEMICAL_META,
  levelForScore,
  type Chemical,
  type DoseLevelMeta,
} from '../lib/dose-copy';

const PER_CHEMICAL_MAX = 25;

export type ChemicalBreakdown = {
  chemical: Chemical;
  /** Capped at 25. */
  score: number;
  /** Raw uncapped sum from PowerSync — useful for debugging. */
  rawScore: number;
};

export type DoseScore = {
  /** Total 0–100, sum of capped chemical scores. */
  total: number;
  dopamine: number;
  oxytocin: number;
  serotonin: number;
  endorphins: number;
  breakdown: ChemicalBreakdown[];
  level: DoseLevelMeta;
  /** Lowest-scoring chemical. Tie-break: order in the design — connection (oxytocin) first when tied. */
  lowest: Chemical;
  isLoading: boolean;
};

const TIE_BREAK_ORDER: Chemical[] = [
  'oxytocin',
  'endorphins',
  'serotonin',
  'dopamine',
];

/**
 * D.O.S.E. score for a given local date (YYYY-MM-DD).
 *
 * Aggregates the same 4 PowerSync tables `useDailyDose` reads
 * (`practice_session`, `mystery_challenge`, `empathy_challenge_day`,
 * `micro_challenge`) but accepts an arbitrary date so the dashboard's day
 * navigator can scrub back through past days. Each chemical is capped at
 * 25 per the locked formula.
 */
export function useDoseScore(date: string): DoseScore {
  const userId = useUserId();

  const { data, isLoading } = useQuery<{
    dopamine: number;
    oxytocin: number;
    serotonin: number;
    endorphins: number;
  }>({
    queryKey: ['dose-score', userId, date],
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
    parameters: [userId, date, userId, date, userId, date, userId, date],
    enabled: !!userId,
  });

  return useMemo<DoseScore>(() => {
    const row = data?.[0];
    const raw = {
      dopamine: Number(row?.dopamine) || 0,
      oxytocin: Number(row?.oxytocin) || 0,
      serotonin: Number(row?.serotonin) || 0,
      endorphins: Number(row?.endorphins) || 0,
    };

    const cap = (v: number) => Math.max(0, Math.min(PER_CHEMICAL_MAX, v));
    const dopamine = cap(raw.dopamine);
    const oxytocin = cap(raw.oxytocin);
    const serotonin = cap(raw.serotonin);
    const endorphins = cap(raw.endorphins);
    const total = dopamine + oxytocin + serotonin + endorphins;

    const breakdown: ChemicalBreakdown[] = (
      Object.keys(CHEMICAL_META) as Chemical[]
    ).map((chemical) => {
      const score =
        chemical === 'dopamine'
          ? dopamine
          : chemical === 'oxytocin'
            ? oxytocin
            : chemical === 'serotonin'
              ? serotonin
              : endorphins;
      const rawScore =
        chemical === 'dopamine'
          ? raw.dopamine
          : chemical === 'oxytocin'
            ? raw.oxytocin
            : chemical === 'serotonin'
              ? raw.serotonin
              : raw.endorphins;
      return { chemical, score, rawScore };
    });

    let lowest: Chemical = TIE_BREAK_ORDER[0]!;
    let lowestScore = Infinity;
    for (const c of TIE_BREAK_ORDER) {
      const s = breakdown.find((b) => b.chemical === c)!.score;
      if (s < lowestScore) {
        lowestScore = s;
        lowest = c;
      }
    }

    return {
      total,
      dopamine,
      oxytocin,
      serotonin,
      endorphins,
      breakdown,
      level: levelForScore(total),
      lowest,
      isLoading,
    };
  }, [data, isLoading]);
}
