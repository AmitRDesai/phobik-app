import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView } from 'react-native';
import { getTagColor } from '../data/tag-colors';

interface EntryCardProps {
  title: string | null;
  content: string;
  createdAt: string | Date;
  feeling: string | null;
  tags: string[] | null;
  onPress: () => void;
}

function formatTime(dateVal: string | Date) {
  const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getHour(dateVal: string | Date) {
  const d = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
  return d.getHours();
}

function getTimeIconName(hour: number): keyof typeof MaterialIcons.glyphMap {
  return hour >= 6 && hour < 18 ? 'wb-sunny' : 'bedtime';
}

export function EntryCard({
  title,
  content,
  createdAt,
  tags,
  onPress,
}: EntryCardProps) {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const purple = accentFor(scheme, 'purple');
  const displayTitle = title || content.slice(0, 30).trim() || 'Untitled';
  const timeStr = formatTime(createdAt);
  const hour = getHour(createdAt);
  const isDay = hour >= 6 && hour < 18;
  const timeIcon = {
    name: getTimeIconName(hour),
    color: isDay ? yellow : purple,
  };
  const displayTags = tags?.slice(0, 3) ?? [];

  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <LinearGradient
        colors={[
          withAlpha(colors.primary['pink-soft'], 0.3),
          withAlpha(colors.accent.yellow, 0.15),
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="rounded-2xl bg-surface-elevated p-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text
              variant="caption"
              className="font-bold tracking-wider text-foreground/30"
            >
              {timeStr}
            </Text>
            <MaterialIcons
              name={timeIcon.name}
              size={16}
              color={timeIcon.color}
            />
          </View>

          <Text variant="sm" className="font-bold">
            {displayTitle}
          </Text>

          <Text
            variant="sm"
            className="mt-1 leading-relaxed text-foreground/40"
            numberOfLines={1}
          >
            {content}
          </Text>

          {/* Tags */}
          {displayTags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-1.5"
              className="mt-3"
            >
              {displayTags.map((tag) => {
                const tagColor = getTagColor(tag);
                return (
                  <View
                    key={tag}
                    className="rounded-full px-2.5 py-0.5"
                    style={{
                      backgroundColor: tagColor.bg,
                      borderWidth: 0.5,
                      borderColor: tagColor.border,
                    }}
                  >
                    <Text
                      className="text-[9px] font-semibold"
                      style={{ color: tagColor.text }}
                    >
                      {tag}
                    </Text>
                  </View>
                );
              })}
              {tags && tags.length > 3 && (
                <View className="rounded-full bg-foreground/5 px-2.5 py-0.5">
                  <Text className="text-[9px] font-semibold text-foreground/30">
                    +{tags.length - 3}
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}
