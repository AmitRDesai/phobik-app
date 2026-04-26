import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import {
  STEP_ROUTES,
  buildStepPath,
  isTodayLocal,
} from '../data/flow-navigation';
import { useActiveMorningResetSession } from './useMorningResetSession';

/**
 * Enter the Morning Reset directly from Home. Resolves resume vs.
 * fresh-start synchronously off the already-watched session, then
 * pushes each prior screen so back-nav unwinds naturally.
 */
export function useEnterMorningReset() {
  const router = useRouter();
  const userId = useUserId();
  const { session } = useActiveMorningResetSession();

  return useCallback(async () => {
    if (!userId) return;

    if (session && isTodayLocal(session.startedAt)) {
      const path = buildStepPath(session.currentStep);
      for (const step of path) {
        router.push(STEP_ROUTES[step] as never);
      }
      return;
    }

    if (session) {
      await db
        .updateTable('morning_reset_session')
        .set({ status: 'abandoned', updated_at: new Date().toISOString() })
        .where('id', '=', session.id)
        .execute();
    }

    const id = uuid();
    const now = new Date().toISOString();
    await db
      .insertInto('morning_reset_session')
      .values({
        id,
        user_id: userId,
        status: 'in_progress',
        current_step: 'landing',
        started_at: now,
        created_at: now,
        updated_at: now,
      })
      .execute();

    router.push('/morning-reset');
  }, [router, userId, session]);
}
