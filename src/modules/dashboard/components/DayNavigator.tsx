import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Pressable } from 'react-native';

interface DayNavigatorProps {
  date: string; // YYYY-MM-DD
  isToday: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
}

function formatLabel(date: string, isToday: boolean): string {
  if (isToday) return 'TODAY';
  return dayjs(date).format('ddd, MMM D').toUpperCase();
}

export function DayNavigator({
  date,
  isToday,
  canGoForward,
  onBack,
  onForward,
}: DayNavigatorProps) {
  const scheme = useScheme();
  const fg = foregroundFor(scheme, 0.4);
  const fgDisabled = foregroundFor(scheme, 0.15);

  return (
    <View className="items-center">
      <View className="flex-row items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 px-3 py-2">
        <Pressable
          onPress={onBack}
          hitSlop={8}
          className="h-7 w-7 items-center justify-center"
        >
          <MaterialIcons name="chevron-left" size={22} color={fg} />
        </Pressable>
        <Text
          variant="caption"
          className="px-2 font-bold tracking-[0.2em] text-foreground"
        >
          {formatLabel(date, isToday)}
        </Text>
        <Pressable
          onPress={canGoForward ? onForward : undefined}
          disabled={!canGoForward}
          hitSlop={8}
          className="h-7 w-7 items-center justify-center"
        >
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={canGoForward ? fg : fgDisabled}
          />
        </Pressable>
      </View>
    </View>
  );
}
