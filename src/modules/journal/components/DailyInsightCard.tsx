import { colors, withAlpha } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface DailyInsightCardProps {
  onStart: () => void;
}

export function DailyInsightCard({ onStart }: DailyInsightCardProps) {
  return (
    <View className="mb-6">
      <LinearGradient
        colors={[
          withAlpha(colors.primary['pink-soft'], 0.3),
          withAlpha(colors.accent.yellow, 0.3),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="relative overflow-hidden rounded-2xl bg-surface-elevated p-3">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <View className="mb-0.5 flex-row items-center gap-1">
                <MaterialIcons
                  name="auto-awesome"
                  size={12}
                  color={colors.accent.yellow}
                />
                <Text className="text-[8px] font-bold uppercase tracking-widest text-accent-yellow/80">
                  Daily Insight Prompt
                </Text>
              </View>
              <Text className="text-xs font-semibold leading-tight text-foreground">
                How did your morning walk feel today?
              </Text>
            </View>
            <Pressable onPress={onStart}>
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  boxShadow: `0 2px 4px ${withAlpha(colors.primary.pink, 0.2)}`,
                }}
              >
                <Text className="text-[10px] font-bold text-white">Start</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
