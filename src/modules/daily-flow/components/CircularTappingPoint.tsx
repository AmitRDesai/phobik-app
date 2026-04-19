import { colors } from '@/constants/colors';
import { View } from 'react-native';
import { EaseView } from 'react-native-ease';

type Props = {
  accent: 'pink' | 'yellow';
};

export function CircularTappingPoint({ accent }: Props) {
  const color =
    accent === 'yellow' ? colors.accent.yellow : colors.primary.pink;

  return (
    <View className="items-center justify-center">
      <EaseView
        initialAnimate={{ opacity: 0.3, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1.2 }}
        transition={{
          type: 'timing',
          duration: 1200,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
        className="absolute h-14 w-14 rounded-full"
        style={{ backgroundColor: color }}
      />
      <EaseView
        initialAnimate={{ opacity: 0.4 }}
        animate={{ opacity: 0.9 }}
        transition={{
          type: 'timing',
          duration: 1200,
          easing: 'easeInOut',
          loop: 'reverse',
        }}
        className="absolute h-6 w-6 rounded-full"
        style={{ backgroundColor: color }}
      />
      <View
        className="h-2.5 w-2.5 rounded-full bg-white"
        style={{
          shadowColor: 'white',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 8,
        }}
      />
    </View>
  );
}
