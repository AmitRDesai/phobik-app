import { withAlpha } from '@/constants/colors';
import { type TimeRange, timeRangeAtom } from '../store/insights';
import { useAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';

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
                  boxShadow: `0px 2px 10px ${withAlpha('#000', 0.5)}`,
                }
              : undefined
          }
        >
          <Text
            className={`text-xs font-semibold ${
              selected === range ? 'text-foreground' : 'text-foreground/40'
            }`}
          >
            {range}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
