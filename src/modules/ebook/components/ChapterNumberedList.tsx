import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

interface ListItem {
  title: string;
  description: string;
}

interface ChapterNumberedListProps {
  items: ListItem[];
}

export function ChapterNumberedList({ items }: ChapterNumberedListProps) {
  return (
    <View className="my-6 gap-4">
      {items.map((item, i) => (
        <View
          key={item.title}
          className="flex-row items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <View
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                i % 2 === 0
                  ? `${colors.primary.pink}33`
                  : `${colors.accent.yellow}33`,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{
                color: i % 2 === 0 ? colors.primary.pink : colors.accent.yellow,
              }}
            >
              {i + 1}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-white">{item.title}</Text>
            <Text className="mt-1 text-sm leading-relaxed text-white/60">
              {item.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
