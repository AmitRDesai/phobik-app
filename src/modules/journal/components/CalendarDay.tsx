import { variantConfig } from '@/components/variant-config';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

interface CalendarDayProps {
  day: number;
  isSelected: boolean;
  hasEntry: boolean;
  isToday: boolean;
  isFuture: boolean;
  onPress: () => void;
}

const DAY_SIZE = 36;
const BORDER_WIDTH = 2;

export function CalendarDay({
  day,
  isSelected,
  hasEntry,
  isToday,
  isFuture,
  onPress,
}: CalendarDayProps) {
  const scheme = useScheme();
  const innerBg = variantConfig.default[scheme].bgHex;
  return (
    <View className="items-center">
      <Pressable
        onPress={isFuture ? undefined : onPress}
        disabled={isFuture}
        style={{
          width: DAY_SIZE,
          height: DAY_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected ? (
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 9999,
              width: DAY_SIZE,
              height: DAY_SIZE,
              padding: BORDER_WIDTH,
            }}
          >
            <View
              className="flex-1 items-center justify-center rounded-full"
              style={{ backgroundColor: innerBg }}
            >
              <Text className="text-xs font-bold text-foreground">{day}</Text>
            </View>
          </LinearGradient>
        ) : (
          <Text
            className={clsx(
              'text-xs font-medium',
              isFuture
                ? 'text-foreground/30'
                : isToday
                  ? 'text-primary-pink'
                  : 'text-foreground/60',
            )}
          >
            {day}
          </Text>
        )}
      </Pressable>
      {hasEntry ? (
        <View
          className="mt-0.5 h-1 w-1 rounded-full bg-primary-pink"
          style={{
            boxShadow: `0 0 4px ${withAlpha(colors.primary.pink, 0.8)}`,
          }}
        />
      ) : (
        <View className="mt-0.5 h-1 w-1" />
      )}
    </View>
  );
}
