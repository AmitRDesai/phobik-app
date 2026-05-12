import { Text, View } from '@/components/themed';
import { IconChip } from '@/components/ui/IconChip';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

interface ChapterCalloutProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title?: string;
  children: string;
  accentColor?: string;
}

export function ChapterCallout({
  icon,
  title,
  children,
  accentColor = colors.primary.pink,
}: ChapterCalloutProps) {
  return (
    <View
      className="my-6 rounded-xl border border-foreground/10 bg-foreground/5 p-5"
      style={{ borderTopWidth: 3, borderTopColor: accentColor }}
    >
      {icon && (
        <IconChip
          size="md"
          shape="circle"
          bg={withAlpha(accentColor, 0.2)}
          className="mb-3"
        >
          <MaterialIcons name={icon} size={22} color={accentColor} />
        </IconChip>
      )}
      {title && (
        <Text size="lg" weight="bold" className="mb-2">
          {title}
        </Text>
      )}
      <Text
        size="md"
        tone="secondary"
        className="leading-relaxed"
        style={{ fontFamily: 'serif' }}
      >
        {children}
      </Text>
    </View>
  );
}
