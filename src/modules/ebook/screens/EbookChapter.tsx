import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Text } from '@/components/themed/Text';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { EaseView } from 'react-native-ease';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EBOOK_CHAPTERS, TOTAL_CHAPTERS } from '../data/ebook-chapters';
import {
  useEbookProgress,
  useUpdateEbookProgress,
} from '../hooks/useEbookProgress';
import { EbookHeader } from '../components/EbookHeader';
import { EbookNavControls } from '../components/EbookNavControls';
import { EbookProgressBar } from '../components/EbookProgressBar';

const Foreword = lazy(() => import('./chapters/Foreword'));
const IntroductionChapter = lazy(() => import('./chapters/Introduction'));
const Chapter1 = lazy(() => import('./chapters/Chapter1'));
const Chapter2 = lazy(() => import('./chapters/Chapter2'));
const Chapter3 = lazy(() => import('./chapters/Chapter3'));
const Chapter4 = lazy(() => import('./chapters/Chapter4'));
const Chapter5 = lazy(() => import('./chapters/Chapter5'));
const Chapter6 = lazy(() => import('./chapters/Chapter6'));
const Chapter7 = lazy(() => import('./chapters/Chapter7'));
const Chapter8 = lazy(() => import('./chapters/Chapter8'));
const Chapter9 = lazy(() => import('./chapters/Chapter9'));
const Chapter10 = lazy(() => import('./chapters/Chapter10'));
const Chapter11 = lazy(() => import('./chapters/Chapter11'));
const Chapter12 = lazy(() => import('./chapters/Chapter12'));
const Chapter13 = lazy(() => import('./chapters/Chapter13'));
const Chapter14 = lazy(() => import('./chapters/Chapter14'));
const Chapter15 = lazy(() => import('./chapters/Chapter15'));
const Chapter16 = lazy(() => import('./chapters/Chapter16'));
const Chapter17 = lazy(() => import('./chapters/Chapter17'));
const Chapter18 = lazy(() => import('./chapters/Chapter18'));
const Chapter19 = lazy(() => import('./chapters/Chapter19'));
const Chapter20 = lazy(() => import('./chapters/Chapter20'));
const Chapter21 = lazy(() => import('./chapters/Chapter21'));
const Chapter22 = lazy(() => import('./chapters/Chapter22'));

const CHAPTER_SCREENS: Record<
  number,
  React.LazyExoticComponent<() => React.JSX.Element>
> = {
  0: Foreword,
  [-1]: IntroductionChapter,
  1: Chapter1,
  2: Chapter2,
  3: Chapter3,
  4: Chapter4,
  5: Chapter5,
  6: Chapter6,
  7: Chapter7,
  8: Chapter8,
  9: Chapter9,
  10: Chapter10,
  11: Chapter11,
  12: Chapter12,
  13: Chapter13,
  14: Chapter14,
  15: Chapter15,
  16: Chapter16,
  17: Chapter17,
  18: Chapter18,
  19: Chapter19,
  20: Chapter20,
  21: Chapter21,
  22: Chapter22,
};

export default function EbookChapter() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { chapter } = useLocalSearchParams<{ chapter: string }>();
  const chapterId = Number(chapter ?? 1);

  const [visible, setVisible] = useState(true);
  const pendingChapterId = useRef<number | null>(null);

  const { data: progress } = useEbookProgress();
  const updateProgress = useUpdateEbookProgress();
  const completedChapters = progress.completedChapters;

  const chapterInfo = useMemo(
    () => EBOOK_CHAPTERS.find((c) => c.id === chapterId),
    [chapterId],
  );

  const chapterIndex = useMemo(
    () => EBOOK_CHAPTERS.findIndex((c) => c.id === chapterId),
    [chapterId],
  );

  const progressPercent = useMemo(() => {
    if (chapterIndex < 0) return 0;
    return Math.round(((chapterIndex + 1) / TOTAL_CHAPTERS) * 100);
  }, [chapterIndex]);

  const hasPrev = chapterIndex > 0;
  const hasNext = chapterIndex < EBOOK_CHAPTERS.length - 1;

  useEffect(() => {
    updateProgress.mutate({ lastChapterId: chapterId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId]);

  const markCompleted = useCallback(() => {
    if (!completedChapters.includes(chapterId)) {
      updateProgress.mutate({
        completedChapters: [...completedChapters, chapterId],
      });
    }
  }, [chapterId, completedChapters, updateProgress]);

  const navigateToChapter = useCallback(
    (targetId: number) => {
      markCompleted();
      pendingChapterId.current = targetId;
      setVisible(false);
    },
    [markCompleted],
  );

  // When fade-out completes, swap the chapter and fade back in
  useEffect(() => {
    if (!visible && pendingChapterId.current !== null) {
      const timeout = setTimeout(() => {
        router.setParams({ chapter: String(pendingChapterId.current) });
        pendingChapterId.current = null;
        setVisible(true);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [visible, router]);

  const handlePrev = useCallback(() => {
    if (!hasPrev) return;
    const prevChapter = EBOOK_CHAPTERS[chapterIndex - 1];
    navigateToChapter(prevChapter.id);
  }, [hasPrev, chapterIndex, navigateToChapter]);

  const handleNext = useCallback(() => {
    if (!hasNext) return;
    const nextChapter = EBOOK_CHAPTERS[chapterIndex + 1];
    navigateToChapter(nextChapter.id);
  }, [hasNext, chapterIndex, navigateToChapter]);

  const handleBack = useCallback(() => {
    markCompleted();
    router.back();
  }, [router, markCompleted]);

  const handleToc = useCallback(() => {
    markCompleted();
    router.back();
  }, [router, markCompleted]);

  const Screen = CHAPTER_SCREENS[chapterId];

  return (
    <View className="flex-1 bg-surface">
      {/* Fixed header */}
      <View
        className="z-50 border-b border-foreground/5 bg-surface"
        style={{ paddingTop: insets.top }}
      >
        <EbookHeader label={chapterInfo?.label ?? ''} onBack={handleBack} />
        <EbookProgressBar percent={progressPercent} />
      </View>

      {/* Scrollable chapter content with fade transition */}
      <EaseView
        className="flex-1"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ type: 'timing', duration: 200 }}
      >
        {Screen ? (
          <ScrollView
            key={chapterId}
            contentContainerClassName="px-6 py-8 pb-8"
            showsVerticalScrollIndicator={false}
          >
            <Suspense
              fallback={
                <View className="items-center justify-center py-20">
                  <ActivityIndicator color="white" />
                </View>
              }
            >
              <Screen />
            </Suspense>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-foreground">Chapter not found</Text>
          </View>
        )}
      </EaseView>

      {/* Fixed nav controls */}
      <EbookNavControls
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={handlePrev}
        onNext={handleNext}
        onToc={handleToc}
        onFinish={handleBack}
      />
    </View>
  );
}
