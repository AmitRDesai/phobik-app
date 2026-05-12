import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';

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
    <Screen
      scroll
      header={<PracticeStackHeader wordmark={wordmark} />}
      sticky={
        bottom ? (
          <View className="border-t border-foreground/5 px-2 pt-3">
            {bottom}
          </View>
        ) : undefined
      }
      className="px-6 pt-2"
    >
      {children}
    </Screen>
  );
}
