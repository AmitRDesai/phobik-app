import { GlowBg } from '@/components/ui/GlowBg';
import { colors } from '@/constants/colors';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

import { PracticeStackHeader } from './PracticeStackHeader';

type PracticeScreenShellProps = {
  /** Brand wordmark or screen title shown in the top header */
  wordmark?: string;
  hideHeader?: boolean;
  hideBack?: boolean;
  children: React.ReactNode;
  scrollContentClassName?: string;
  scrollProps?: ScrollViewProps;
};

export function PracticeScreenShell({
  wordmark = 'FOUR PILLARS',
  hideHeader,
  hideBack,
  children,
  scrollContentClassName = 'px-6 pb-32',
  scrollProps,
}: PracticeScreenShellProps) {
  return (
    <View className="flex-1 bg-background-dark">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.2}
        radius={0.35}
        intensity={0.4}
        bgClassName="bg-background-dark"
      />
      {hideHeader ? null : (
        <PracticeStackHeader wordmark={wordmark} hideBack={hideBack} />
      )}
      <ScrollView
        contentContainerClassName={scrollContentClassName}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    </View>
  );
}
