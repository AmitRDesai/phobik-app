import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';
import { FEELING_OPTIONS, NEED_OPTIONS } from '../data/options';
import { getTagColor, getTagColorFromHex } from '../data/tag-colors';
import { useCreateTag, useJournalTags } from '../hooks/useJournalTags';

interface TagSectionProps {
  feeling: string | null;
  need: string | null;
  tags: string[];
  onRemoveFeeling: () => void;
  onRemoveNeed: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  readOnly?: boolean;
}

export function TagSection({
  feeling,
  need,
  tags,
  onRemoveFeeling,
  onRemoveNeed,
  onAddTag,
  onRemoveTag,
  readOnly,
}: TagSectionProps) {
  const scheme = useScheme();
  const yellowAccent = accentFor(scheme, 'yellow');
  const [newTag, setNewTag] = useState('');
  const { data: savedTags } = useJournalTags();
  const createTag = useCreateTag();

  const feelingLabel = feeling
    ? FEELING_OPTIONS.find((o) => o.value === feeling)?.label
    : null;
  const needLabel = need
    ? NEED_OPTIONS.find((o) => o.value === need)?.label
    : null;

  const hasChips = !!feelingLabel || !!needLabel || tags.length > 0;

  const handleAddTag = async () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setNewTag('');
      return;
    }
    const tagColor = getTagColor(trimmed);
    onAddTag(trimmed);
    await createTag.mutateAsync({ name: trimmed, color: tagColor.text });
    setNewTag('');
  };

  // Existing tags that aren't already selected
  const suggestedTags = savedTags?.filter((t) => !tags.includes(t.name)) ?? [];

  return (
    <View className="mb-6">
      {hasChips && (
        <>
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="mb-3 px-1 tracking-widest text-foreground/40"
          >
            Selected Tags
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-6 pb-1"
            className="-mx-6 mb-3"
          >
            {feelingLabel && (
              <Pressable
                onPress={readOnly ? undefined : onRemoveFeeling}
                className="flex-row items-center gap-1 rounded-full px-4 py-1.5"
                style={{
                  backgroundColor: withAlpha(colors.primary['pink-soft'], 0.15),
                  borderWidth: 1,
                  borderColor: withAlpha(colors.primary['pink-soft'], 0.5),
                }}
              >
                <Text tone="accent" weight="bold" size="xs">
                  {feelingLabel}
                </Text>
                {!readOnly && (
                  <MaterialIcons
                    name="close"
                    size={12}
                    color={colors.primary.pink}
                  />
                )}
              </Pressable>
            )}
            {needLabel && (
              <Pressable
                onPress={readOnly ? undefined : onRemoveNeed}
                className="flex-row items-center gap-1 rounded-full px-4 py-1.5"
                style={{
                  backgroundColor: withAlpha(yellowAccent, 0.15),
                  borderWidth: 1,
                  borderColor: withAlpha(yellowAccent, 0.5),
                }}
              >
                <Text weight="bold" size="xs" style={{ color: yellowAccent }}>
                  {needLabel}
                </Text>
                {!readOnly && (
                  <MaterialIcons name="close" size={12} color={yellowAccent} />
                )}
              </Pressable>
            )}
            {tags.map((tag) => {
              const saved = savedTags?.find((t) => t.name === tag);
              const tagColor = saved?.color
                ? getTagColorFromHex(saved.color)
                : getTagColor(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={readOnly ? undefined : () => onRemoveTag(tag)}
                  className="flex-row items-center gap-1 rounded-full px-4 py-1.5"
                  style={{
                    backgroundColor: tagColor.bg,
                    borderWidth: 1,
                    borderColor: tagColor.border,
                  }}
                >
                  <Text
                    weight="bold"
                    size="xs"
                    style={{ color: tagColor.text }}
                  >
                    {tag}
                  </Text>
                  {!readOnly && (
                    <MaterialIcons
                      name="close"
                      size={12}
                      color={tagColor.text}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </>
      )}

      {!readOnly && (
        <>
          <View className="flex-row items-center gap-2">
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add tag..."
              placeholderTextColor={foregroundFor(scheme, 0.3)}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              className="flex-1 rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-[14px] text-foreground"
            />
            <Pressable
              onPress={handleAddTag}
              className="rounded-xl bg-foreground/10 px-3 py-2"
            >
              <MaterialIcons
                name="add"
                size={18}
                color={foregroundFor(scheme, 1)}
              />
            </Pressable>
          </View>

          {suggestedTags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-1.5 px-6"
              className="-mx-6 mt-2"
            >
              {suggestedTags.map((tag) => (
                <Pressable
                  key={tag.id}
                  onPress={() => onAddTag(tag.name)}
                  className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1"
                >
                  <Text size="xs" className="text-foreground/50">
                    {tag.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
