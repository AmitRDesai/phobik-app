import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg } from '@/components/ui/GlowBg';

const SECURITY_POINTS = [
  {
    title: 'Biometric data never leaves your device',
    description:
      "Your facial data and fingerprints are processed locally using Apple's Secure Enclave.",
  },
  {
    title: 'End-to-end encrypted journaling',
    description:
      'Only you hold the keys to your thoughts. Even we cannot access your journal entries.',
  },
  {
    title: 'Absolute anonymity in our community',
    description:
      'Interact without fear. Your identity is fully protected through randomized aliases.',
  },
];

export default function DataSecurityPromiseScreen() {
  const { modal } = useLocalSearchParams<{ modal?: string }>();
  const isModal = modal === 'true';
  const pathname = usePathname();
  const isProfileSetup = pathname.startsWith('/profile-setup');

  const totalSteps = isProfileSetup ? 5 : 7;
  const currentStep = isProfileSetup ? 4 : 6;
  const nextRoute = isProfileSetup
    ? '/profile-setup/terms-of-service'
    : '/account-creation/terms-of-service';

  return (
    <View className="flex-1">
      <GlowBg intensity={0} />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="z-20 flex-row items-center justify-between px-6 pb-4 pt-8">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 items-start justify-center"
            >
              <Ionicons
                name={isModal ? 'close' : 'chevron-back'}
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>

            {!isModal && (
              <ProgressDots total={totalSteps} current={currentStep} />
            )}

            {/* Empty view for spacing */}
            <View className="w-10" />
          </View>

          {/* Security label */}
          <Text className="text-center text-xs font-black uppercase tracking-[0.3em] text-white/40">
            Security
          </Text>

          {/* Scrollable Content */}
          <ScrollFade>
            <ScrollView
              className="flex-1"
              contentContainerClassName="px-8"
              contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <View className="mb-8 mt-4 items-center">
                <Text className="text-center text-3xl font-extrabold leading-tight tracking-tight text-white">
                  Your Privacy is
                </Text>
                <MaskedView
                  maskElement={
                    <Text className="text-center text-3xl font-extrabold leading-tight tracking-tight">
                      Our Priority
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={[colors.primary.pink, colors.accent.yellow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text className="text-center text-3xl font-extrabold leading-tight tracking-tight opacity-0">
                      Our Priority
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </View>

              {/* Lock Illustration */}
              <View className="mb-10 items-center justify-center py-4">
                {/* Outer circle */}
                <View className="absolute h-48 w-48 rounded-full border border-white/5" />
                {/* Middle circle */}
                <View className="absolute h-36 w-36 rounded-full border border-white/10" />
                {/* Inner circle with glow */}
                <View
                  className="absolute h-24 w-24 rounded-full border border-white/20"
                  style={{
                    shadowColor: colors.primary.pink,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 40,
                    elevation: 10,
                  }}
                />
                {/* Lock container */}
                <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/20 shadow-2xl">
                  <LinearGradient
                    colors={[
                      `${colors.primary.pink}33`,
                      `${colors.accent.yellow}33`,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  <MaterialCommunityIcons
                    name="lock"
                    size={48}
                    color={colors.primary.pink}
                  />
                </View>
              </View>

              {/* Security Points */}
              <View className="mb-8 gap-8">
                {SECURITY_POINTS.map((point) => (
                  <View key={point.title} className="flex-row gap-4">
                    <View className="mt-1">
                      <View className="h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={colors.green[500]}
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold leading-tight text-white">
                        {point.title}
                      </Text>
                      <Text className="mt-1 text-sm leading-relaxed text-white/50">
                        {point.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollFade>

          {/* Footer */}
          <View className="z-10 items-center px-8 pb-8">
            {!isModal && (
              <GradientButton onPress={() => router.push(nextRoute)}>
                Agree and Continue
              </GradientButton>
            )}

            <Pressable className="mb-1 mt-6">
              <Text className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 underline underline-offset-4">
                Download full privacy policy
              </Text>
            </Pressable>

            {!isModal && (
              <>
                <Text className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                  Step {currentStep} of {totalSteps}
                </Text>

                <Pressable className="w-full py-4">
                  <Text className="text-center text-xs font-bold uppercase tracking-widest text-white/30">
                    Review Settings
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
