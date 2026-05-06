import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface QuestionProgressProps {
  current: number;
  total: number;
  sectionLabel?: string;
  showPercentage?: boolean;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function QuestionProgress({
  current,
  total,
  sectionLabel,
  showPercentage,
}: QuestionProgressProps) {
  const progress = (current / total) * 100;
  const displayNumber = String(current).padStart(2, '0');
  const displayTotal = String(total).padStart(2, '0');

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 400 });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%` as any,
    height: '100%',
    borderRadius: 9999,
  }));

  return (
    <View className="mb-8">
      <View className="mb-4 flex-row items-end justify-between">
        {showPercentage ? (
          <>
            <Text className="text-base font-bold text-foreground">
              Question {current} of {total}
            </Text>
            <Text className="text-sm font-bold text-foreground/60">
              {Math.round(progress)}%
            </Text>
          </>
        ) : (
          <>
            <Text className="text-4xl font-extrabold tracking-tight text-foreground">
              {displayNumber}
              <Text className="text-xl font-medium text-foreground/45">
                /{displayTotal}
              </Text>
            </Text>
            {sectionLabel && (
              <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                {sectionLabel}
              </Text>
            )}
          </>
        )}
      </View>
      <View className="h-1 overflow-hidden rounded-full bg-foreground/10">
        <AnimatedLinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={barStyle}
        />
      </View>
    </View>
  );
}
