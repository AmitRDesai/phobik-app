import { colors } from '@/constants/colors';
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
            <View className="flex-1 items-center justify-center rounded-full bg-black">
              <Text className="text-xs font-bold text-white">{day}</Text>
            </View>
          </LinearGradient>
        ) : (
          <Text
            className={`text-xs font-medium ${
              isFuture
                ? 'text-white/30'
                : isToday
                  ? 'text-primary-pink'
                  : 'text-white/60'
            }`}
          >
            {day}
          </Text>
        )}
      </Pressable>
      {hasEntry ? (
        <View
          className="mt-0.5 h-1 w-1 rounded-full bg-primary-pink"
          style={{
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
          }}
        />
      ) : (
        <View className="mt-0.5 h-1 w-1" />
      )}
    </View>
  );
}
