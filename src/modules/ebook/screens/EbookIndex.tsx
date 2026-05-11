import { Pressable, ScrollView, Text, View } from '@/components/themed';
import { BackButton } from '@/components/ui/BackButton';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EBOOK_CHAPTERS } from '../data/ebook-chapters';
import { useEbookProgress } from '../hooks/useEbookProgress';

export default function EbookIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = useScheme();
  const { data: progress } = useEbookProgress();
  const { completedChapters, lastChapterId: lastChapter } = progress;

  const handleChapterPress = useCallback(
    (chapterId: number) => {
      router.push(`/practices/ebook-chapter?chapter=${chapterId}`);
    },
    [router],
  );

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="flex-row items-center border-b border-foreground/5 px-4 pb-2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton icon="close" />
        <Text size="lg" align="center" weight="bold" className="flex-1 pr-10">
          Table of Contents
        </Text>
      </View>

      <ScrollView
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Book Title */}
        <View className="mb-2 px-6 py-4 text-left">
          <Text size="xs" treatment="caption" tone="secondary" className="mb-1">
            E-Book
          </Text>
          <Text size="h1">Calm Above the Clouds</Text>
        </View>

        {/* Chapter List */}
        <View className="w-full">
          {EBOOK_CHAPTERS.map((chapter) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isCurrent = lastChapter === chapter.id;

            return (
              <Pressable
                key={chapter.id}
                onPress={() => handleChapterPress(chapter.id)}
                className="active:bg-foreground/5"
              >
                {isCurrent ? (
                  <LinearGradient
                    colors={[
                      withAlpha(colors.primary.pink, 0.15),
                      withAlpha(colors.accent.yellow, 0.05),
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 24,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: foregroundFor(scheme, 0.05),
                      borderLeftWidth: 4,
                      borderLeftColor: colors.primary.pink,
                    }}
                  >
                    <View className="flex-1 pr-4">
                      <Text
                        size="xs"
                        treatment="caption"
                        tone="accent"
                        className="mb-1"
                      >
                        {chapter.label}
                      </Text>
                      <Text size="md" weight="bold">
                        {chapter.title}
                      </Text>
                    </View>
                    <Text size="xs" tone="secondary" weight="medium">
                      Reading
                    </Text>
                  </LinearGradient>
                ) : (
                  <View className="flex-row items-center justify-between border-b border-foreground/5 px-6 py-4">
                    <View className="flex-1 pr-4">
                      <Text
                        size="xs"
                        treatment="caption"
                        tone="secondary"
                        className="mb-1"
                      >
                        {chapter.label}
                      </Text>
                      <Text size="md" tone="secondary" weight="medium">
                        {chapter.title}
                      </Text>
                    </View>
                    {isCompleted && (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color={colors.accent.yellow}
                      />
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
