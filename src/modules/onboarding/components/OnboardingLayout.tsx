import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { OnboardingProgressBar } from './OnboardingProgressBar';

interface OnboardingLayoutProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  onBack?: () => void;
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

export function OnboardingLayout({
  step,
  totalSteps = 8,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  onBack,
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
}: OnboardingLayoutProps) {
  const header = (
    <View className="flex-row items-center gap-3 px-6 pb-4 pt-4">
      {onBack ? <BackButton onPress={onBack} /> : <View className="w-10" />}
      <View className="flex-1">
        <OnboardingProgressBar step={step} totalSteps={totalSteps} />
      </View>
      {onSkip ? (
        <Button variant="ghost" size="compact" onPress={onSkip}>
          Skip
        </Button>
      ) : null}
    </View>
  );

  const sticky = (
    <View className="items-center">
      <GradientButton
        onPress={onButtonPress}
        disabled={buttonDisabled}
        loading={buttonLoading}
        icon={buttonIcon}
      >
        {buttonLabel}
      </GradientButton>
      {showStepCounter && (
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          className="mt-3 tracking-[0.2em]"
          style={{ paddingRight: 2.2 }}
        >
          Step {step} of {totalSteps}
        </Text>
      )}
      {onSkip && (
        <Button variant="ghost" onPress={onSkip} className="mt-2">
          Skip for now
        </Button>
      )}
    </View>
  );

  return (
    <Screen
      variant="onboarding"
      scroll={scrollable}
      header={header}
      sticky={sticky}
      className=""
    >
      {headerContent && <View className="px-8 pt-4">{headerContent}</View>}
      <View className="px-8 pt-4">
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
      <View className="mt-6 flex-1 px-8">{children}</View>
    </Screen>
  );
}
