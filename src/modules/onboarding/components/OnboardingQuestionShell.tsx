import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Screen } from '@/components/ui/Screen';
import { StepCounter } from '@/components/ui/StepCounter';

interface OnboardingQuestionShellProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  onSkip?: () => void;
  buttonLabel: string;
  onButtonPress: () => void;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  buttonIcon?: React.ReactNode;
  showStepCounter?: boolean;
  headerContent?: React.ReactNode;
  children: React.ReactNode;
  scrollable?: boolean;
}

/**
 * Shared body shell for the questionnaire steps in /onboarding. The
 * persistent header (BackButton + SegmentedProgress) is owned by
 * `app/onboarding/_layout.tsx` and rendered as an absolute overlay —
 * this shell only handles the per-screen title/subtitle/body + sticky CTA.
 */
export function OnboardingQuestionShell({
  step,
  totalSteps = 8,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  onSkip,
  buttonLabel,
  onButtonPress,
  buttonDisabled,
  buttonLoading,
  buttonIcon,
  showStepCounter = true,
  headerContent,
  children,
  scrollable = true,
}: OnboardingQuestionShellProps) {
  const sticky = (
    <View className="w-full items-center">
      <Button
        onPress={onButtonPress}
        disabled={buttonDisabled}
        loading={buttonLoading}
        icon={buttonIcon}
        fullWidth
      >
        {buttonLabel}
      </Button>
      {showStepCounter && <StepCounter current={step} total={totalSteps} />}
      {onSkip && (
        <Button variant="ghost" onPress={onSkip} className="mt-2" fullWidth>
          Skip for now
        </Button>
      )}
    </View>
  );

  return (
    <Screen
      scroll={scrollable}
      keyboard
      insetTop={false}
      sticky={sticky}
      className="px-screen-x"
    >
      {headerContent && <View className="pt-4">{headerContent}</View>}
      <View className="pt-4">
        <Text
          size="h1"
          className={titleClassName ?? 'leading-tight font-extrabold'}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            size="sm"
            tone="secondary"
            className={subtitleClassName ?? 'mt-3 leading-relaxed font-medium'}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View className="mt-6 flex-1">{children}</View>
    </Screen>
  );
}
