import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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
          <Text className="mb-3 px-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
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
                  backgroundColor: 'rgba(255,77,148,0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,77,148,0.5)',
                }}
              >
                <Text className="text-xs font-bold text-primary-pink">
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
                  backgroundColor: 'rgba(255,215,0,0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,215,0,0.5)',
                }}
              >
                <Text className="text-xs font-bold text-accent-yellow">
                  {needLabel}
                </Text>
                {!readOnly && (
                  <MaterialIcons
                    name="close"
                    size={12}
                    color={colors.accent.yellow}
                  />
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
                    className="text-xs font-bold"
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
              placeholderTextColor="rgba(255,255,255,0.3)"
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[14px] text-white"
            />
            <Pressable
              onPress={handleAddTag}
              className="rounded-xl bg-white/10 px-3 py-2"
            >
              <MaterialIcons name="add" size={18} color="white" />
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
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                >
                  <Text className="text-[10px] text-white/50">{tag.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
