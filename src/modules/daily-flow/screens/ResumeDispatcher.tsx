import { Screen } from '@/components/ui/Screen';
import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { CommonActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import {
  STEP_ROUTES,
  buildStepPath,
  isTodayLocal,
} from '../data/flow-navigation';
import { useActiveDailyFlowSession } from '../hooks/useDailyFlowSession';

// Strip the `/daily-flow/` prefix — the nested Stack's route name is the
// file basename (e.g. `intro`, `feeling`).
function toRouteName(pathname: string): string {
  return pathname.replace(/^\/daily-flow\//, '');
}

export default function ResumeDispatcher() {
  const router = useRouter();
  const navigation = useNavigation();
  const userId = useUserId();
  const { session, isLoading } = useActiveDailyFlowSession();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!userId || isLoading || dispatched.current) return;
    dispatched.current = true;

    (async () => {
      try {
        // Direct SQL probe — bypasses the watched query so we never decide
        // based on a stale-cache miss right after navigation. Also lets us
        // detect duplicate in_progress rows and abandon them defensively.
        const rows = await db
          .selectFrom('daily_flow_session')
          .selectAll()
          .where('user_id', '=', userId)
          .where('status', '=', 'in_progress')
          .orderBy('started_at', 'desc')
          .execute();

        const today = rows.find(
          (r) => r.started_at && isTodayLocal(r.started_at),
        );
        const stale = rows.filter((r) => r.id !== today?.id);

        if (today) {
          if (stale.length) {
            await db
              .updateTable('daily_flow_session')
              .set({
                status: 'abandoned',
                updated_at: new Date().toISOString(),
              })
              .where(
                'id',
                'in',
                stale.map((r) => r.id),
              )
              .execute();
          }

          const path = buildStepPath(today.current_step as never);
          const routes = path.map((step) => ({
            name: toRouteName(STEP_ROUTES[step]),
          }));
          navigation.dispatch(
            CommonActions.reset({
              index: routes.length - 1,
              routes,
            }),
          );
          return;
        }

        if (stale.length) {
          await db
            .updateTable('daily_flow_session')
            .set({
              status: 'abandoned',
              updated_at: new Date().toISOString(),
            })
            .where(
              'id',
              'in',
              stale.map((r) => r.id),
            )
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
            emotional_families: JSON.stringify([]),
            body_regions: JSON.stringify([]),
            sensations: JSON.stringify([]),
            created_at: now,
            updated_at: now,
          })
          .execute();

        router.replace('/daily-flow/intro');
      } catch (err) {
        console.error('[ResumeDispatcher]', err);
        router.replace('/daily-flow/intro');
      }
    })();
  }, [userId, isLoading, session, router, navigation]);

  return <Screen loading transparent insetTop={false} />;
}
