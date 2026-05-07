import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { withAlpha } from '@/constants/colors';
import { clsx } from 'clsx';
import { useAtom } from 'jotai';
import { Pressable } from 'react-native';
import { type TimeRange, timeRangeAtom } from '../store/insights';

const RANGES: TimeRange[] = ['Day', 'Week', '2 Weeks', 'Month'];

export function TimeRangeControl() {
  const [selected, setSelected] = useAtom(timeRangeAtom);

  return (
    <View className="flex-row items-center rounded-xl bg-foreground/5 p-1">
      {RANGES.map((range) => (
        <Pressable
          key={range}
          onPress={() => setSelected(range)}
          className={`flex-1 items-center rounded-lg py-2 ${
            selected === range ? 'bg-foreground/10' : ''
          }`}
          style={
            selected === range
              ? {
                  boxShadow: `0 0 12px ${withAlpha('#000', 0.5)}`,
                }
              : undefined
          }
        >
          <Text
            variant="caption"
            className={clsx(
              selected === range ? 'text-foreground' : 'text-foreground/40',
            )}
          >
            {range}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
