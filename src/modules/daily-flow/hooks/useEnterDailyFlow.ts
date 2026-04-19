import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  buildStepPath,
  isTodayLocal,
  resolveStepRoute,
} from '../data/flow-navigation';
import { useActiveDailyFlowSession } from './useDailyFlowSession';

/**
 * Enter the Daily Flow directly from Home. Resolves resume vs fresh-start
 * synchronously off the already-watched session, then pushes each screen
 * onto the navigator. Avoids an intermediate dispatcher route (which
 * flashed a blank screen while it did the same work).
 */
export function useEnterDailyFlow() {
  const router = useRouter();
  const userId = useUserId();
  const { session } = useActiveDailyFlowSession();

  return useCallback(async () => {
    if (!userId) return;

    // Resume: same-day in-progress session → stack every prior step then
    // the current one, so back-navigation pops naturally.
    if (session && isTodayLocal(session.startedAt)) {
      const path = buildStepPath(session.currentStep, session.addOns);
      for (const step of path) {
        router.push(resolveStepRoute(step, session.feeling) as never);
      }
      return;
    }

    // Fresh start: abandon any stale in-progress row, then insert a new
    // row. Both writes hit local SQLite — no network wait before routing.
    if (session) {
      await db
        .updateTable('daily_flow_session')
        .set({ status: 'abandoned', updated_at: new Date().toISOString() })
        .where('id', '=', session.id)
        .execute();
    }

    const id = uuid();
    const now = new Date().toISOString();
    await db
      .insertInto('daily_flow_session')
      .values({
        id,
        user_id: userId,
        status: 'in_progress',
        current_step: 'intro',
        started_at: now,
        add_ons: JSON.stringify({ eft: false, bilateral: false }),
        created_at: now,
        updated_at: now,
      })
      .execute();

    router.push('/daily-flow/intro');
  }, [router, userId, session]);
}
