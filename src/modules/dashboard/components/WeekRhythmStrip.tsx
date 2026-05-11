import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import type { DayRhythm } from '../hooks/useWeekRhythm';

interface WeekRhythmStripProps {
  days: DayRhythm[];
}

function dotsForStatus(day: DayRhythm) {
  if (day.isFuture) return null;
  return (
    <View className="mt-1 flex-row gap-1">
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: day.dailyFlowDone
            ? colors.primary.pink
            : 'rgba(127,127,127,0.25)',
        }}
      />
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: day.morningResetDone
            ? colors.accent.yellow
            : 'rgba(127,127,127,0.25)',
        }}
      />
    </View>
  );
}

/**
 * Sun–Sat strip; each pill shows the day number and two completion dots
 * (pink = Daily Flow, yellow = Morning Quick Reset). Future days are dimmed
 * and unpressable (no clicks wired in v1 — strip is read-only).
 */
export function WeekRhythmStrip({ days }: WeekRhythmStripProps) {
  const scheme = useScheme();

  return (
    <View className="flex-row justify-between">
      {days.map((day) => {
        const isBoth = day.status === 'both';
        const isOne = day.status === 'one';
        const isToday = day.isToday;
        const isFuture = day.isFuture;

        const pillStyle = isBoth
          ? {
              backgroundColor: withAlpha(colors.primary.pink, 0.18),
              borderColor: withAlpha(colors.primary.pink, 0.5),
              borderWidth: 1,
            }
          : isOne
            ? {
                backgroundColor: withAlpha(colors.accent.yellow, 0.1),
                borderColor: withAlpha(colors.accent.yellow, 0.4),
                borderWidth: 1,
              }
            : isToday
              ? {
                  backgroundColor: withAlpha(colors.accent.yellow, 0.08),
                  borderColor: withAlpha(colors.accent.yellow, 0.5),
                  borderWidth: 1.5,
                }
              : {
                  backgroundColor: 'rgba(127,127,127,0.08)',
                  borderColor: 'rgba(127,127,127,0.15)',
                  borderWidth: 1,
                };

        const numberColor = isFuture
          ? 'rgba(127,127,127,0.4)'
          : isToday
            ? accentFor(scheme, 'yellow')
            : isBoth
              ? accentFor(scheme, 'pink')
              : isOne
                ? accentFor(scheme, 'yellow')
                : 'rgba(127,127,127,0.6)';

        return (
          <View key={day.date} className="items-center gap-1.5">
            <Text
              size="xs"
              weight="bold"
              className="uppercase tracking-widest text-foreground/40"
            >
              {day.weekdayLabel}
            </Text>
            <View
              className="h-12 w-12 items-center justify-center rounded-full"
              style={pillStyle}
            >
              <Text weight="bold" size="sm" style={{ color: numberColor }}>
                {day.dayNum}
              </Text>
            </View>
            {dotsForStatus(day)}
          </View>
        );
      })}
    </View>
  );
}
