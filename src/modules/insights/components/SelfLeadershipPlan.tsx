import { GradientButton } from '@/components/ui/GradientButton';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, TextInput, View } from 'react-native';
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
  return (
    <View className="gap-6">
      {/* Self-Leadership Check */}
      <DashboardCard className="border border-white/10 p-5">
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
        <Text className="mb-4 text-[13px] font-bold text-white">
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
                    : 'border border-white/10 bg-white/5'
                }`}
                style={
                  isSelected
                    ? {
                        shadowColor: colors.primary['pink-soft'],
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        elevation: 4,
                      }
                    : undefined
                }
              >
                <Text
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-white' : 'text-slate-300'
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
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-slate-400">
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
              className={`h-${ex.highlighted ? '14' : '12'} w-${ex.highlighted ? '14' : '12'} shrink-0 items-center justify-center rounded-2xl bg-white/10`}
              style={
                ex.highlighted
                  ? {
                      shadowColor: colors.primary['pink-soft'],
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                      shadowRadius: 15,
                      elevation: 4,
                      width: 56,
                      height: 56,
                    }
                  : { width: 48, height: 48 }
              }
            >
              <MaterialIcons
                name={ex.icon as any}
                size={ex.highlighted ? 30 : 24}
                color={ex.iconColor ?? colors.primary['pink-soft']}
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-white">{ex.title}</Text>
              <Text className="text-[10px] text-slate-400">
                {ex.description}
              </Text>
            </View>
            <GradientButton onPress={() => {}} compact>
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
            <Text className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              Supports: {ex.supports}
            </Text>
          </View>
        </View>
      ))}

      {/* Next Step input */}
      <DashboardCard className="rounded-[2rem] border-dashed border-primary-pink/30 p-6">
        <Text className="mb-4 text-[11px] font-black uppercase tracking-[3px] text-primary-pink">
          Next Step
        </Text>
        <View className="flex-row items-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <TextInput
            className="flex-1 text-sm font-medium italic text-white"
            placeholder="One small action I will take now..."
            placeholderTextColor={alpha.white20}
          />
          <MaterialIcons
            name="send"
            size={20}
            color={colors.primary['pink-soft']}
          />
        </View>
      </DashboardCard>
    </View>
  );
}
