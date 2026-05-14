import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { View } from 'react-native';

import { ExerciseIntroScreen } from '@/modules/practices/components/ExerciseIntroScreen';
import { starBreathingSessionAtom } from '../store/session-atoms';

function StarIcon() {
  return (
    <View className="relative h-16 w-16 items-center justify-center">
      <View
        className="absolute h-16 w-16 rounded-full"
        style={{
          backgroundColor: withAlpha(colors.pink[400], 0.15),
          boxShadow: `0px 0px 30px ${withAlpha(colors.primary.pink, 0.5)}`,
        }}
      />
      <MaterialIcons name="auto-awesome" size={36} color={colors.pink[400]} />
    </View>
  );
}

export default function StarBreathingIntro() {
  const savedSession = useAtomValue(starBreathingSessionAtom);
  const setSavedSession = useSetAtom(starBreathingSessionAtom);

  return (
    <ExerciseIntroScreen
      exerciseId="star-breathing"
      sessionRoute="/breathe/star-breathing-session"
      icon={<StarIcon />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
