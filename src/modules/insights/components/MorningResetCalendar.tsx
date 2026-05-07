import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors, withAlpha } from '@/constants/colors';
import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { useQuery } from '@powersync/tanstack-react-query';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const DAY_LABELS = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
];

interface CalendarDay {
  day: number;
  completed?: boolean;
  weekend?: boolean;
  dimmed?: boolean;
  today?: boolean;
}

/** Convert JS day (0=Sun) to Mon-based index (0=Mon … 6=Sun) */
function toMonIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

function buildTwoWeekGrid(completedDays: Set<string>): {
  rows: (CalendarDay | null)[][];
  monthLabel: string;
  completedCount: number;
  totalDays: number;
} {
  const today = new Date();

  const lastMonday = new Date(today);
  const todayMonIdx = toMonIndex(today.getDay());
  lastMonday.setDate(today.getDate() - todayMonIdx - 7);

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
    const isoDate = dayjs(d).format('YYYY-MM-DD');
    const completed = !isFuture && completedDays.has(isoDate);
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

export function MorningResetCalendar() {
  const userId = useUserId();

  const rangeStart = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - toMonIndex(today.getDay()) - 7);
    start.setHours(0, 0, 0, 0);
    return start.toISOString();
  }, []);

  const { data } = useQuery({
    queryKey: ['morning-reset-completed', userId, rangeStart],
    query: db
      .selectFrom('morning_reset_session')
      .select('completed_at')
      .where('user_id', '=', userId ?? '')
      .where('status', '=', 'completed')
      .where('completed_at', '>=', rangeStart),
    enabled: !!userId,
  });

  const completedDays = useMemo(() => {
    const set = new Set<string>();
    for (const row of data ?? []) {
      if (row.completed_at) {
        set.add(dayjs(row.completed_at).format('YYYY-MM-DD'));
      }
    }
    return set;
  }, [data]);

  const { rows, monthLabel, completedCount, totalDays } = useMemo(
    () => buildTwoWeekGrid(completedDays),
    [completedDays],
  );

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text variant="caption" muted>
          Morning Reset History
        </Text>
        <Text variant="caption" className="text-foreground/60">
          {monthLabel}
        </Text>
      </View>
      <DashboardCard className="p-5">
        <View className="mb-2 flex-row">
          {DAY_LABELS.map((day) => (
            <View key={day.key} className="flex-1 items-center">
              <Text variant="caption" className="text-foreground/30">
                {day.label}
              </Text>
            </View>
          ))}
        </View>
        {rows.map((row, ri) => (
          <View key={`row-${ri}`} className="mb-4 flex-row">
            {row.map((cell, ci) => (
              <View
                key={cell ? `day-${cell.day}` : `empty-${ci}`}
                className="flex-1 items-center gap-1"
              >
                {cell ? (
                  <>
                    <Text
                      variant="xs"
                      className={clsx(
                        'font-bold',
                        cell.today
                          ? 'text-primary-pink'
                          : cell.weekend
                            ? 'text-accent-yellow'
                            : 'text-foreground',
                      )}
                    >
                      {cell.day}
                    </Text>
                    {cell.completed && (
                      <View
                        className="h-1.5 w-1.5 rounded-full bg-primary-pink"
                        style={{
                          boxShadow: [
                            {
                              offsetX: 0,
                              offsetY: 0,
                              blurRadius: 8,
                              color: withAlpha(
                                colors.primary['pink-soft'],
                                0.4,
                              ),
                            },
                          ],
                        }}
                      />
                    )}
                  </>
                ) : null}
              </View>
            ))}
          </View>
        ))}
        <View className="flex-row items-center justify-between border-t border-foreground/5 pt-4">
          <Text variant="xs" muted className="font-medium">
            Build a Steady Morning
          </Text>
          <Text variant="caption" className="text-primary-pink">
            {completedCount}/{totalDays} Complete
          </Text>
        </View>
      </DashboardCard>
    </View>
  );
}
