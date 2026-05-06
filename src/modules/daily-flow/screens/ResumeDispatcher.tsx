import { uuid } from '@/lib/crypto';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';

import {
  buildStepPath,
  isTodayLocal,
  resolveStepRoute,
} from '../data/flow-navigation';
import type { FlowStep } from '../data/types';

type AddOns = { eft: boolean; bilateral: boolean };

export default function ResumeDispatcher() {
  const router = useRouter();
  const userId = useUserId();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!userId || dispatched.current) return;
    dispatched.current = true;

    (async () => {
      try {
        const rows = await db
          .selectFrom('daily_flow_session')
          .selectAll()
          .where('user_id', '=', userId)
          .where('status', '=', 'in_progress')
          .orderBy('started_at', 'desc')
          .limit(1)
          .execute();

        const session = rows[0] as
          | {
              id: string;
              current_step: FlowStep;
              started_at: string;
              feeling: string | null;
              add_ons: string | null;
            }
          | undefined;

        if (session && isTodayLocal(session.started_at)) {
          const addOns: AddOns = session.add_ons
            ? (JSON.parse(session.add_ons) as AddOns)
            : { eft: false, bilateral: false };
          const path = buildStepPath(session.current_step, addOns);

          const [first, ...rest] = path;
          if (!first) {
            router.replace('/daily-flow/intro');
            return;
          }
          router.replace(resolveStepRoute(first, session.feeling) as never);
          for (const step of rest) {
            router.push(resolveStepRoute(step, session.feeling) as never);
          }
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
  }, [userId, router]);

  return <View className="flex-1 bg-surface" />;
}
