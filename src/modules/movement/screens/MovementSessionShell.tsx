import { GlowBg } from '@/components/ui/GlowBg';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { ScrollView, View } from 'react-native';

type MovementSessionShellProps = {
  wordmark: string;
  /** Scrollable session body */
  children: React.ReactNode;
  /** Optional pinned content under the scroll view (e.g. bottom CTA + progress) */
  bottom?: React.ReactNode;
};

/**
 * Shared shell for every movement session screen.
 *  - Top: PracticeStackHeader with the exercise's title as the wordmark
 *  - Middle: scrollable body with bottom fade hint
 *  - Bottom: optional pinned slab (CTA, progress dots, footer note)
 */
export function MovementSessionShell({
  wordmark,
  children,
  bottom,
}: MovementSessionShellProps) {
  return (
    <View className="flex-1 bg-surface">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.3}
        radius={0.45}
        intensity={0.4}
        bgClassName="bg-surface"
      />
      <PracticeStackHeader wordmark={wordmark} />
      <ScrollFade fadeColor={colors.background.dark}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </ScrollFade>
      {bottom ? (
        <View className="border-t border-foreground/5 bg-surface/80 px-6 pb-8 pt-5">
          {bottom}
        </View>
      ) : null}
    </View>
  );
}
