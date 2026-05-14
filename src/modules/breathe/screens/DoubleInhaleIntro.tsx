import { useAtomValue, useSetAtom } from 'jotai';

import {
  ExerciseIntroScreen,
  GradientIcon,
} from '@/modules/practices/components/ExerciseIntroScreen';
import { doubleInhaleSessionAtom } from '../store/session-atoms';

export default function DoubleInhaleIntro() {
  const savedSession = useAtomValue(doubleInhaleSessionAtom);
  const setSavedSession = useSetAtom(doubleInhaleSessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="double-inhale"
      sessionRoute="/breathe/double-inhale-session"
      icon={<GradientIcon name="air" />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
