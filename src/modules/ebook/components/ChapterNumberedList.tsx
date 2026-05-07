import { Text, View } from '@/components/themed';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { colors, withAlpha } from '@/constants/colors';

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
      {items.map((item, i) => {
        const accent = i % 2 === 0 ? colors.primary.pink : colors.accent.yellow;
        return (
          <Card key={item.title} className="flex-row items-start gap-4">
            <IconChip size={32} shape="circle" bg={withAlpha(accent, 0.2)}>
              <Text
                variant="sm"
                className="font-bold"
                style={{ color: accent }}
              >
                {i + 1}
              </Text>
            </IconChip>
            <View className="flex-1">
              <Text variant="md" className="font-bold">
                {item.title}
              </Text>
              <Text variant="sm" muted className="mt-1 leading-relaxed">
                {item.description}
              </Text>
            </View>
          </Card>
        );
      })}
    </View>
  );
}
