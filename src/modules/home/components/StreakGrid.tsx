import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Text } from '@/components/themed/Text';
import { ScrollView, View } from 'react-native';
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface StreakDay {
  label: string;
  dateNum: number;
  dateStr: string; // YYYY-MM-DD
  completed: boolean;
  isToday: boolean;
}

interface StreakGridProps {
  completedDates?: Set<string>;
}

function getCurrentWeekDays(completedDates?: Set<string>): StreakDay[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  return DAY_LABELS.map((label, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dateNum = date.getDate();
    const dateStr = date.toISOString().slice(0, 10);
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    return {
      label,
      dateNum,
      dateStr,
      completed: completedDates?.has(dateStr) ?? false,
      isToday,
    };
  });
}

export function StreakGrid({ completedDates }: StreakGridProps) {
  const scheme = useScheme();
  const weekDays = useMemo(
    () => getCurrentWeekDays(completedDates),
    [completedDates],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
    >
      {weekDays.map((day) => (
        <View key={day.dateStr} className="items-center gap-1.5">
          <Text className="text-[9px] font-bold text-foreground/40">
            {day.label}
          </Text>
          <View
            className="aspect-square w-10 items-center justify-center rounded-full"
            style={
              day.completed
                ? {
                    backgroundColor: withAlpha(colors.primary.pink, 0.2),
                    borderWidth: 1,
                    borderColor: withAlpha(colors.primary.pink, 0.5),
                  }
                : day.isToday
                  ? {
                      backgroundColor: withAlpha(colors.accent.yellow, 0.1),
                      borderWidth: 1.5,
                      borderColor: withAlpha(colors.accent.yellow, 0.5),
                    }
                  : {
                      backgroundColor: foregroundFor(scheme, 0.05),
                      borderWidth: 1,
                      borderColor: foregroundFor(scheme, 0.1),
                    }
            }
          >
            {day.completed ? (
              <MaterialIcons
                name="check"
                size={24}
                color={colors.primary.pink}
              />
            ) : (
              <Text
                className="font-semibold"
                style={{
                  color: day.isToday
                    ? accentFor(scheme, 'yellow')
                    : foregroundFor(scheme, 0.3),
                }}
              >
                {day.dateNum}
              </Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
