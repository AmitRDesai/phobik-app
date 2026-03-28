import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';
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

function getTimeIcon(hour: number): {
  name: keyof typeof MaterialIcons.glyphMap;
  color: string;
} {
  if (hour >= 6 && hour < 18) {
    return { name: 'wb-sunny', color: colors.accent.yellow };
  }
  return { name: 'bedtime', color: colors.accent.purple };
}

export function EntryCard({
  title,
  content,
  createdAt,
  feeling,
  tags,
  onPress,
}: EntryCardProps) {
  const displayTitle = title || content.slice(0, 30).trim() || 'Untitled';
  const timeStr = formatTime(createdAt);
  const hour = getHour(createdAt);
  const timeIcon = getTimeIcon(hour);
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
        <View className="rounded-2xl bg-card-dark p-4">
          {/* Top row: time + icon */}
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              {timeStr}
            </Text>
            <MaterialIcons
              name={timeIcon.name}
              size={16}
              color={timeIcon.color}
            />
          </View>

          {/* Title */}
          <Text className="text-sm font-bold text-white">{displayTitle}</Text>

          {/* Preview */}
          <Text
            className="mt-1 text-[11px] leading-relaxed text-white/40"
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
                <View className="rounded-full bg-white/5 px-2.5 py-0.5">
                  <Text className="text-[9px] font-semibold text-white/30">
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
