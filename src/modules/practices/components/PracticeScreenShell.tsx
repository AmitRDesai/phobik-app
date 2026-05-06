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
  /** Background color class. Defaults to bg-surface. */
  bgClassName?: string;
  /** Vertical position of the glow center (0–1). Defaults to 0.2. */
  glowCenterY?: number;
  /** Glow intensity multiplier. Defaults to 0.4. */
  glowIntensity?: number;
};

export function PracticeScreenShell({
  wordmark = 'FOUR PILLARS',
  hideHeader,
  hideBack,
  children,
  scrollContentClassName = 'px-6 pb-8',
  scrollProps,
  bgClassName = 'bg-surface',
  glowCenterY = 0.2,
  glowIntensity = 0.4,
}: PracticeScreenShellProps) {
  return (
    <View className={`flex-1 ${bgClassName}`}>
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={glowCenterY}
        radius={0.35}
        intensity={glowIntensity}
        bgClassName={bgClassName}
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
