import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import { EMPATHY_DAYS } from '../data/empathy-days';
import { useActiveChallenge } from '../hooks/useEmpathyChallenge';

export default function EmpathyChallengeCalendar() {
  const { data: challenge, isLoading } = useActiveChallenge();
  const scheme = useScheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
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
  const lockIconColor = foregroundFor(scheme, 1);

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Empathy Challenge" />}
      className="px-4"
    >
      <View className="gap-3 py-4">
        <View className="flex-row items-end justify-between">
          <Text size="md" weight="medium">
            Overall Progress
          </Text>
          <Text size="sm" tone="accent" weight="bold">
            {completedCount}/7 Days
          </Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-foreground/10">
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

      <View className="mt-2">
        {EMPATHY_DAYS.map((empathyDay, index) => {
          const challengeDay = days.find((d) => d.dayNumber === empathyDay.day);
          const status = challengeDay?.status ?? 'locked';
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';
          const isLast = index === EMPATHY_DAYS.length - 1;

          // Available to start only if unlocked/in_progress AND either day 1
          // or the previous day was completed before today.
          const isActive = (() => {
            if (status === 'in_progress') return true;
            if (status !== 'unlocked') return false;
            if (empathyDay.day === 1) return true;

            const prevDay = days.find(
              (d) => d.dayNumber === empathyDay.day - 1,
            );
            if (!prevDay?.completedAt) return false;
            const completedDate = String(prevDay.completedAt).slice(0, 10);
            const today = new Date().toISOString().slice(0, 10);
            return completedDate < today;
          })();

          // Unlocked in DB but gated until tomorrow
          const isWaiting = status === 'unlocked' && !isActive;

          return (
            <View
              key={empathyDay.day}
              className="flex-row"
              style={{
                opacity: isLocked || isWaiting ? 0.4 : 1,
              }}
            >
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
                      <Text size="sm" tone="inverse" weight="bold">
                        {empathyDay.day}
                      </Text>
                    )}
                  </LinearGradient>
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20">
                    {isWaiting ? (
                      <MaterialIcons
                        name="schedule"
                        size={18}
                        color={lockIconColor}
                      />
                    ) : empathyDay.icon ? (
                      <MaterialIcons
                        name={empathyDay.icon}
                        size={18}
                        color={lockIconColor}
                      />
                    ) : (
                      <MaterialIcons
                        name="lock"
                        size={18}
                        color={lockIconColor}
                      />
                    )}
                  </View>
                )}

                {!isLast && (
                  <View className="w-[2px] flex-1 bg-foreground/10">
                    {isActive && (
                      <LinearGradient
                        colors={[
                          colors.accent.yellow,
                          withAlpha(colors.accent.yellow, 0),
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1, width: 2 }}
                      />
                    )}
                  </View>
                )}
              </View>

              <View className="ml-4 flex-1 pb-12">
                {isActive ? (
                  <ActiveDayCard
                    empathyDay={empathyDay}
                    dayId={String(challengeDay?.id ?? '')}
                  />
                ) : (
                  <View className="justify-center pt-2">
                    <Text size="lg" weight="semibold">
                      Day {empathyDay.day}: {empathyDay.title}
                    </Text>
                    <Text size="sm" className="text-foreground/60">
                      {isCompleted
                        ? 'Completed'
                        : isWaiting
                          ? 'Come back tomorrow'
                          : 'Locked'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </Screen>
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
    <View className="overflow-hidden rounded-xl bg-surface-elevated">
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
        <Text size="h2">
          Day {empathyDay.day}: {empathyDay.title}
        </Text>
        <Text size="sm" className="mb-4 leading-relaxed text-foreground/70">
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
