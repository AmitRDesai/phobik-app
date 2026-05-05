import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { Pressable, Text, View } from 'react-native';
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
        <Pressable onPress={onSkip} className="h-10 justify-center">
          <Text className="text-sm font-medium text-primary-pink">Skip</Text>
        </Pressable>
      ) : (
        <View className="w-10" />
      )}
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
        <Text className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/55">
          Step {step} of {totalSteps}
        </Text>
      )}
      {onSkip && (
        <Pressable onPress={onSkip} className="mt-2 py-2">
          <Text className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/45">
            Skip for now
          </Text>
        </Pressable>
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
          className={
            titleClassName ??
            'text-[28px] font-extrabold leading-tight tracking-tight text-foreground'
          }
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={
              subtitleClassName ??
              'mt-3 text-sm font-medium leading-relaxed text-foreground/60'
            }
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View className="mt-6 flex-1 px-8">{children}</View>
    </Screen>
  );
}
