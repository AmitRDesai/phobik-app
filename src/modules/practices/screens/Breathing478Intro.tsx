import { useAtomValue, useSetAtom } from 'jotai';

import {
  ExerciseIntroScreen,
  GradientIcon,
} from '../components/ExerciseIntroScreen';
import { breathing478SessionAtom } from '../store/session-atoms';

export default function Breathing478Intro() {
  const savedSession = useAtomValue(breathing478SessionAtom);
  const setSavedSession = useSetAtom(breathing478SessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="478-breathing"
      sessionRoute="/practices/478-breathing-session"
      icon={<GradientIcon name="air" />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
