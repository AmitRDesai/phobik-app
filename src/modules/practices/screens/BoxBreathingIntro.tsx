import { useAtomValue, useSetAtom } from 'jotai';

import {
  ExerciseIntroScreen,
  GradientIcon,
} from '../components/ExerciseIntroScreen';
import { boxBreathingSessionAtom } from '../store/session-atoms';

export default function BoxBreathingIntro() {
  const savedSession = useAtomValue(boxBreathingSessionAtom);
  const setSavedSession = useSetAtom(boxBreathingSessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="box-breathing"
      sessionRoute="/practices/box-breathing-session"
      icon={<GradientIcon name="air" />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
