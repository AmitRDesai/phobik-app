import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';

import { EMPATHY_DAYS } from '../data/empathy-days';
import { useActiveChallenge } from '../hooks/useEmpathyChallenge';

export default function EmpathyChallengeCalendar() {
  const { data: challenge, isLoading } = useActiveChallenge();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-charcoal">
        <ActivityIndicator size="large" color={colors.primary.pink} />
      </View>
    );
  }

  if (!challenge) {
    return <Redirect href="/practices/empathy-challenge/intro" />;
  }

  const { days } = challenge;

  const completedCount = days.filter((d) => d.status === 'completed').length;

  const progressPercent = Math.max((completedCount / 7) * 100, 5);

  return (
    <View className="flex-1 bg-background-charcoal">
      {/* Header */}
      <View
        className="z-10 flex-row items-center px-4 py-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="flex-1 pr-10 text-center text-lg font-bold text-white">
          Empathy Challenge
        </Text>
      </View>

      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Header */}
        <View className="gap-3 py-4">
          <View className="flex-row items-end justify-between">
            <Text className="text-base font-medium text-white">
              Overall Progress
            </Text>
            <Text className="text-sm font-bold text-primary-pink">
              {completedCount}/7 Days
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-white/10">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 8,
                borderRadius: 9999,
                width: `${progressPercent}%`,
              }}
            />
          </View>
        </View>

        {/* Timeline */}
        <View className="mt-2">
          {EMPATHY_DAYS.map((empathyDay, index) => {
            const challengeDay = days.find(
              (d) => d.dayNumber === empathyDay.day,
            );
            const status = challengeDay?.status ?? 'locked';
            const isActive = status === 'unlocked' || status === 'in_progress';
            const isCompleted = status === 'completed';
            const isLocked = status === 'locked';
            const isLast = index === EMPATHY_DAYS.length - 1;

            return (
              <View
                key={empathyDay.day}
                className="flex-row"
                style={{ opacity: isLocked ? 0.4 : 1 }}
              >
                {/* Timeline column */}
                <View className="w-10 items-center">
                  {isActive || isCompleted ? (
                    <LinearGradient
                      colors={[colors.primary.pink, colors.accent.yellow]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isCompleted ? (
                        <MaterialIcons name="check" size={18} color="white" />
                      ) : (
                        <Text className="text-sm font-bold text-white">
                          {empathyDay.day}
                        </Text>
                      )}
                    </LinearGradient>
                  ) : (
                    <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white/20">
                      {empathyDay.icon ? (
                        <MaterialIcons
                          name={empathyDay.icon}
                          size={18}
                          color="white"
                        />
                      ) : (
                        <MaterialIcons name="lock" size={18} color="white" />
                      )}
                    </View>
                  )}

                  {/* Connector line */}
                  {!isLast && (
                    <View className="w-[2px] flex-1 bg-white/10">
                      {isActive && (
                        <LinearGradient
                          colors={[
                            colors.accent.yellow,
                            'rgba(255,255,255,0.1)',
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={{ flex: 1, width: 2 }}
                        />
                      )}
                    </View>
                  )}
                </View>

                {/* Content column */}
                <View className="ml-4 flex-1 pb-12">
                  {isActive ? (
                    <ActiveDayCard
                      empathyDay={empathyDay}
                      dayId={challengeDay?.id ?? ''}
                    />
                  ) : (
                    <View className="justify-center pt-2">
                      <Text className="text-lg font-semibold text-white">
                        Day {empathyDay.day}: {empathyDay.title}
                      </Text>
                      <Text className="text-sm text-slate-400">
                        {isCompleted
                          ? 'Completed'
                          : index > 0 &&
                              days.find(
                                (d) => d.dayNumber === empathyDay.day - 1,
                              )?.status === 'unlocked'
                            ? 'Unlock tomorrow'
                            : 'Locked'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function ActiveDayCard({
  empathyDay,
  dayId,
}: {
  empathyDay: (typeof EMPATHY_DAYS)[number];
  dayId: string;
}) {
  const router = useRouter();

  return (
    <View className="overflow-hidden rounded-xl bg-card-elevated">
      {/* Gradient hero image */}
      <LinearGradient
        colors={[
          withAlpha(colors.primary.pink, 0.3),
          withAlpha(colors.accent.yellow, 0.15),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: 128, borderRadius: 8, margin: 16, marginBottom: 0 }}
      />

      <View className="gap-1 p-4">
        <Text className="text-xl font-bold text-white">
          Day {empathyDay.day}: {empathyDay.title}
        </Text>
        <Text className="mb-4 text-sm leading-relaxed text-slate-300">
          {empathyDay.calendarDescription}
        </Text>
        <GradientButton
          onPress={() =>
            router.push({
              pathname: '/practices/empathy-challenge/day',
              params: { dayNumber: String(empathyDay.day), dayId },
            })
          }
        >
          Start Day {empathyDay.day}
        </GradientButton>
      </View>
    </View>
  );
}
