import { useAtomValue, useSetAtom } from 'jotai';

import {
  ExerciseIntroScreen,
  GradientIcon,
} from '../components/ExerciseIntroScreen';
import { doubleInhaleSessionAtom } from '../store/session-atoms';

export default function DoubleInhaleIntro() {
  const savedSession = useAtomValue(doubleInhaleSessionAtom);
  const setSavedSession = useSetAtom(doubleInhaleSessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="double-inhale"
      sessionRoute="/practices/double-inhale-session"
      icon={<GradientIcon name="air" />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
