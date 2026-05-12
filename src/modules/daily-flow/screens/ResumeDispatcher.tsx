import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { CommonActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import {
  buildStepPath,
  isTodayLocal,
  resolveStepRoute,
} from '../data/flow-navigation';
import { useActiveDailyFlowSession } from '../hooks/useDailyFlowSession';

// Strip the `/daily-flow/` prefix — the nested Stack's route name is the
// file basename (e.g. `intro`, `feeling-detail`).
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
        if (session && isTodayLocal(session.startedAt)) {
          const path = buildStepPath(session.currentStep, session.addOns);
          // Atomic stack reset — no per-step push animation, and the
          // resulting back-stack matches the user's forward path so
          // `router.back()` from the layout's BackButton pops with the
          // native pop animation.
          const routes = path.map((step) => {
            const { pathname, params } = resolveStepRoute(
              step,
              session.feeling,
            );
            return { name: toRouteName(pathname), params };
          });
          navigation.dispatch(
            CommonActions.reset({
              index: routes.length - 1,
              routes,
            }),
          );
          return;
        }

        if (session) {
          await db
            .updateTable('daily_flow_session')
            .set({
              status: 'abandoned',
              updated_at: new Date().toISOString(),
            })
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

        router.replace('/daily-flow/intro');
      } catch (err) {
        console.error('[ResumeDispatcher]', err);
        router.replace('/daily-flow/intro');
      }
    })();
  }, [userId, isLoading, session, router, navigation]);

  return <LoadingScreen />;
}
