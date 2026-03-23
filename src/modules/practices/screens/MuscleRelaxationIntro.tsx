import { useAtomValue, useSetAtom } from 'jotai';

import {
  ExerciseIntroScreen,
  GradientIcon,
} from '../components/ExerciseIntroScreen';
import { muscleRelaxationSessionAtom } from '../store/muscle-relaxation';

export default function MuscleRelaxationIntro() {
  const savedSession = useAtomValue(muscleRelaxationSessionAtom);
  const setSavedSession = useSetAtom(muscleRelaxationSessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="muscle-relaxation"
      sessionRoute="/practices/muscle-relaxation-session"
      icon={<GradientIcon name="accessibility-new" />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
