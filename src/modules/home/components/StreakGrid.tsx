import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

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
      {weekDays.map((day, index) => (
        <View key={index} className="items-center gap-1.5">
          <Text className="text-[9px] font-bold text-white/40">
            {day.label}
          </Text>
          <View
            className="aspect-square w-10 items-center justify-center rounded-full"
            style={
              day.completed
                ? {
                    backgroundColor: `${colors.primary.pink}33`,
                    borderWidth: 1,
                    borderColor: `${colors.primary.pink}80`,
                  }
                : day.isToday
                  ? {
                      backgroundColor: `${colors.accent.yellow}1A`,
                      borderWidth: 1.5,
                      borderColor: `${colors.accent.yellow}80`,
                    }
                  : {
                      backgroundColor: alpha.white05,
                      borderWidth: 1,
                      borderColor: alpha.white10,
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
                className={`font-semibold ${day.isToday ? 'text-accent-yellow' : 'text-white/30'}`}
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
