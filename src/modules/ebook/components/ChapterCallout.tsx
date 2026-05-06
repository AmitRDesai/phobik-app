import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

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
        <View
          className="mb-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}33` }}
        >
          <MaterialIcons name={icon} size={22} color={accentColor} />
        </View>
      )}
      {title && (
        <Text className="mb-2 text-lg font-bold text-foreground">{title}</Text>
      )}
      <Text
        className="text-base leading-relaxed text-foreground/70"
        style={{ fontFamily: 'serif' }}
      >
        {children}
      </Text>
    </View>
  );
}
