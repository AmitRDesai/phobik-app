import { DashboardCard } from '@/components/ui/DashboardCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { StressorExercise } from '../data/stressor-details';
import { STRENGTHS } from '../data/stressor-details';

interface SelfLeadershipPlanProps {
  selectedStrengths: string[];
  exercises: StressorExercise[];
}

export function SelfLeadershipPlan({
  selectedStrengths,
  exercises,
}: SelfLeadershipPlanProps) {
  const router = useRouter();

  return (
    <View className="gap-6">
      {/* Self-Leadership Check */}
      <DashboardCard className="border border-foreground/10 p-5">
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons
            name="verified-user"
            size={14}
            color={colors.accent.gold}
          />
          <Text className="text-[10px] font-black uppercase tracking-[3px] text-accent-yellow">
            Self-Leadership Check
          </Text>
        </View>
        <Text className="mb-4 text-[13px] font-bold text-foreground">
          Which strength will help you handle this stressor?
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {STRENGTHS.map((strength) => {
            const isSelected = selectedStrengths.includes(strength);
            return (
              <Pressable
                key={strength}
                className={`rounded-full px-3 py-1.5 ${
                  isSelected
                    ? 'bg-primary-pink'
                    : 'border border-foreground/10 bg-foreground/5'
                }`}
                style={
                  isSelected
                    ? {
                        boxShadow: `0px 4px 12px ${withAlpha(colors.primary['pink-soft'], 0.3)}`,
                      }
                    : undefined
                }
              >
                <Text
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-foreground' : 'text-foreground/70'
                  }`}
                >
                  {strength}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </DashboardCard>

      {/* Self-Leadership Plan */}
      <View className="gap-4">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-foreground/60">
          Self-Leadership Plan
        </Text>
        <View className="flex-row items-center gap-2 rounded-lg border border-primary-pink/10 bg-primary-pink/5 p-2">
          <MaterialIcons
            name="rocket-launch"
            size={12}
            color={colors.primary['pink-soft']}
          />
          <Text className="flex-1 text-[10px] font-bold text-primary-pink/80">
            Inner CEO: Choose your strength above to activate these tools.
          </Text>
        </View>
      </View>

      {/* Exercises */}
      {exercises.map((ex, i) => (
        <View key={i}>
          <DashboardCard
            className={`flex-row items-center gap-4 overflow-hidden p-5 ${
              ex.highlighted ? 'border-primary-pink/30' : ''
            }`}
            glow={ex.highlighted}
          >
            <View
              className="shrink-0 items-center justify-center rounded-2xl bg-foreground/10"
              style={
                ex.highlighted
                  ? {
                      boxShadow: `0px 0px 15px ${withAlpha(colors.primary['pink-soft'], 0.3)}`,
                      width: 56,
                      height: 56,
                    }
                  : { width: 48, height: 48 }
              }
            >
              <MaterialIcons
                name={ex.icon as never}
                size={ex.highlighted ? 30 : 24}
                color={ex.iconColor ?? colors.primary['pink-soft']}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-foreground">
                {ex.title}
              </Text>
              <Text className="text-[10px] text-foreground/60">
                {ex.description}
              </Text>
            </View>
            <GradientButton
              onPress={() => {
                if (ex.route) router.push(ex.route as never);
              }}
              disabled={!ex.route}
              compact
            >
              {ex.buttonLabel}
            </GradientButton>
          </DashboardCard>
          <View className="ml-4 mt-2 flex-row items-center gap-1.5">
            <View
              className="h-1 w-1 rounded-full"
              style={{
                backgroundColor: ex.highlighted
                  ? colors.primary['pink-soft']
                  : (ex.iconColor ?? alpha.white40),
              }}
            />
            <Text className="text-[9px] font-black uppercase tracking-widest text-foreground/55">
              Supports: {ex.supports}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
