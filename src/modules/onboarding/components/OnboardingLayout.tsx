import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const content = (
    <>
      {/* Optional header content above title */}
      {headerContent && <View className="px-8 pt-4">{headerContent}</View>}

      {/* Title & Subtitle */}
      <View className="px-8 pt-4">
        <Text
          className={
            titleClassName ??
            'text-[28px] font-extrabold leading-tight tracking-tight text-white'
          }
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={
              subtitleClassName ??
              'mt-3 text-sm font-medium leading-relaxed text-white/60'
            }
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Screen Content */}
      <View className="mt-6 flex-1 px-8">{children}</View>
    </>
  );

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-onboarding"
        centerY={0.35}
        intensity={1.2}
        radius={0.35}
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header: Back + Progress Bar + Skip */}
          <View className="flex-row items-center gap-3 px-6 pb-4 pt-4">
            {onBack ? (
              <Pressable
                onPress={onBack}
                className="h-10 w-10 items-start justify-center"
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color="rgba(255,255,255,0.5)"
                />
              </Pressable>
            ) : (
              <View className="w-10" />
            )}

            <View className="flex-1">
              <OnboardingProgressBar step={step} totalSteps={totalSteps} />
            </View>

            {onSkip ? (
              <Pressable onPress={onSkip} className="h-10 justify-center">
                <Text className="text-sm font-medium text-primary-pink">
                  Skip
                </Text>
              </Pressable>
            ) : (
              <View className="w-10" />
            )}
          </View>

          {/* Scrollable or Static Content */}
          {scrollable ? (
            <ScrollFade fadeColor={colors.background.onboarding}>
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {content}
              </ScrollView>
            </ScrollFade>
          ) : (
            <View className="flex-1">{content}</View>
          )}

          {/* Footer */}
          <View className="z-10 items-center px-8 pb-6 pt-2">
            <GradientButton
              onPress={onButtonPress}
              disabled={buttonDisabled}
              loading={buttonLoading}
              icon={buttonIcon}
            >
              {buttonLabel}
            </GradientButton>

            {showStepCounter && (
              <Text className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                Step {step} of {totalSteps}
              </Text>
            )}

            {onSkip && (
              <Pressable onPress={onSkip} className="mt-2 py-2">
                <Text className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white/40">
                  Skip for now
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
