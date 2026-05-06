import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

type Props = { progress: number };

export function DailyFlowProgressBar({ progress }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: 999,
        }}
      />
    </View>
  );
}
