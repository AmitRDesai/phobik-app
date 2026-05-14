import { useAtomValue, useSetAtom } from 'jotai';

import {
  ExerciseIntroScreen,
  GradientIcon,
} from '@/modules/practices/components/ExerciseIntroScreen';
import { lazy8BreathingSessionAtom } from '../store/session-atoms';

export default function Lazy8BreathingIntro() {
  const savedSession = useAtomValue(lazy8BreathingSessionAtom);
  const setSavedSession = useSetAtom(lazy8BreathingSessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="lazy-8-breathing"
      sessionRoute="/breathe/lazy-8-breathing-session"
      icon={<GradientIcon name="all-inclusive" />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
