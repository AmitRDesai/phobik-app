import { DashboardCard } from '@/components/ui/DashboardCard';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CalendarDay {
  day: number;
  completed?: boolean;
  weekend?: boolean;
  dimmed?: boolean;
  today?: boolean;
}

/** Dummy completion set — days of the month that have a pink dot */
const COMPLETED_DAYS = new Set([
  1, 3, 4, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23, 25,
]);

/** Convert JS day (0=Sun) to Mon-based index (0=Mon … 6=Sun) */
function toMonIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

function buildTwoWeekGrid(): {
  rows: (CalendarDay | null)[][];
  monthLabel: string;
  completedCount: number;
  totalDays: number;
} {
  const today = new Date();

  // Find Monday of last week
  const lastMonday = new Date(today);
  const todayMonIdx = toMonIndex(today.getDay());
  lastMonday.setDate(today.getDate() - todayMonIdx - 7);

  // Find Sunday of this week
  const thisSunday = new Date(lastMonday);
  thisSunday.setDate(lastMonday.getDate() + 13);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const startMonth = monthNames[lastMonday.getMonth()];
  const endMonth = monthNames[thisSunday.getMonth()];
  const monthLabel =
    startMonth === endMonth
      ? `${endMonth} ${today.getFullYear()}`
      : `${startMonth} – ${endMonth}`;

  // Two full Mon–Sun rows, no padding needed
  const rows: (CalendarDay | null)[][] = [[], []];
  let completedCount = 0;
  let totalDays = 0;

  for (let i = 0; i < 14; i++) {
    const d = new Date(lastMonday);
    d.setDate(lastMonday.getDate() + i);
    const dayOfMonth = d.getDate();
    const jsDay = d.getDay();
    const isWeekend = jsDay === 0 || jsDay === 6;
    const isFuture = d > today;
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
    const completed = !isFuture && COMPLETED_DAYS.has(dayOfMonth);
    if (completed) completedCount++;
    if (!isFuture) totalDays++;

    const cell: CalendarDay = {
      day: dayOfMonth,
      completed,
      weekend: isWeekend,
      today: isToday,
      dimmed: isFuture,
    };

    rows[i < 7 ? 0 : 1].push(cell);
  }

  return { rows, monthLabel, completedCount, totalDays };
}

export function QuickResetCalendar() {
  const { rows, monthLabel, completedCount, totalDays } = useMemo(
    buildTwoWeekGrid,
    [],
  );

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/40">
          Quick Reset History
        </Text>
        <Text className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          {monthLabel}
        </Text>
      </View>
      <DashboardCard className="p-5">
        {/* Day headers — derived from first row's actual weekdays */}
        <View className="mb-2 flex-row">
          {DAY_LABELS.map((d, i) => (
            <View key={i} className="flex-1 items-center">
              <Text className="text-[8px] font-black uppercase text-white/30">
                {d}
              </Text>
            </View>
          ))}
        </View>
        {/* Calendar rows */}
        {rows.map((row, ri) => (
          <View key={ri} className="mb-4 flex-row">
            {row.map((cell, ci) => (
              <View key={ci} className="flex-1 items-center gap-1">
                {cell ? (
                  <>
                    <Text
                      className={`text-[10px] font-bold ${
                        cell.today
                          ? 'text-primary-pink'
                          : cell.weekend
                            ? 'text-accent-yellow'
                            : 'text-white'
                      }`}
                    >
                      {cell.day}
                    </Text>
                    {cell.completed && (
                      <View
                        className="h-1.5 w-1.5 rounded-full bg-primary-pink"
                        style={{
                          shadowColor: '#FF4D97',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.4,
                          shadowRadius: 8,
                          elevation: 2,
                        }}
                      />
                    )}
                  </>
                ) : null}
              </View>
            ))}
          </View>
        ))}
        {/* Footer */}
        <View className="flex-row items-center justify-between border-t border-white/5 pt-4">
          <Text className="text-[9px] font-medium text-white/40">
            Rewire Negative Thoughts
          </Text>
          <Text className="text-[9px] font-black uppercase tracking-widest text-primary-pink">
            {completedCount}/{totalDays} Complete
          </Text>
        </View>
      </DashboardCard>
    </View>
  );
}
