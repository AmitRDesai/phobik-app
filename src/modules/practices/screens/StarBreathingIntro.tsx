import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAtomValue, useSetAtom } from 'jotai';
import { View } from 'react-native';

import { ExerciseIntroScreen } from '../components/ExerciseIntroScreen';
import { starBreathingSessionAtom } from '../store/session-atoms';

function StarIcon() {
  return (
    <View className="relative h-16 w-16 items-center justify-center">
      <View
        className="absolute h-16 w-16 rounded-full"
        style={{
          backgroundColor: 'rgba(236,72,153,0.15)',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 30,
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
      sessionRoute="/practices/star-breathing-session"
      icon={<StarIcon />}
      hasSavedSession={savedSession !== null}
      onClearSession={() => setSavedSession(null)}
    />
  );
}
