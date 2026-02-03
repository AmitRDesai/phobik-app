import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SECURITY_POINTS = [
  {
    title: 'Biometric data never leaves your device',
    description: 'Stored securely in your hardware enclave.',
  },
  {
    title: 'End-to-end encrypted journaling',
    description: 'Only you can read what you write. Not even us.',
  },
  {
    title: 'Absolute anonymity in our community',
    description: 'Interact freely without ever sharing your identity.',
  },
];

export default function DataSecurityPromiseScreen() {
  return (
    <View className="flex-1 bg-background-charcoal">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4">
            <Pressable
              onPress={() => router.back()}
              className="h-12 w-12 items-start justify-center"
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </Pressable>
            <Text className="flex-1 pr-12 text-center text-sm font-medium uppercase tracking-widest text-white/60">
              Security
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1 px-8"
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View className="mb-10">
              <Text className="text-center text-[32px] font-bold leading-tight tracking-tight text-white">
                Your Privacy is{'\n'}
                <Text
                  style={{
                    color: colors.primary.pink,
                    textShadowColor: 'rgba(244, 37, 140, 0.3)',
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                  }}
                >
                  Our Priority
                </Text>
              </Text>
            </View>

            {/* Mandala Padlock Illustration */}
            <View className="items-center justify-center py-6">
              <View className="relative h-64 w-64 items-center justify-center">
                {/* Background glow */}
                <View
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: colors.primary.pink,
                    opacity: 0.1,
                  }}
                />

                {/* Outer decorative ring */}
                <View
                  className="absolute items-center justify-center"
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: 110,
                    borderWidth: 1,
                    borderColor: `${colors.primary.pink}66`,
                    transform: [{ rotate: '-12deg' }],
                  }}
                />

                {/* Middle ring */}
                <View
                  className="items-center justify-center rounded-full border-2 p-8"
                  style={{
                    borderColor: `${colors.primary.pink}33`,
                    width: 180,
                    height: 180,
                    borderRadius: 90,
                  }}
                >
                  {/* Inner decorative ring */}
                  <View
                    className="absolute"
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 80,
                      borderWidth: 1,
                      borderColor: `${colors.accent.yellow}4D`,
                      transform: [{ rotate: '45deg' }],
                    }}
                  />

                  {/* Lock icon container */}
                  <View
                    className="items-center justify-center rounded-full p-6"
                    style={{
                      backgroundColor: colors.background.dark,
                      borderWidth: 1,
                      borderColor: `${colors.primary.pink}80`,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="lock"
                      size={60}
                      color={colors.primary.pink}
                    />
                  </View>
                </View>

                {/* Dashed outer ring */}
                <View
                  className="absolute"
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: 120,
                    borderWidth: 2,
                    borderColor: colors.primary.pink,
                    borderStyle: 'dashed',
                    opacity: 0.3,
                  }}
                />
              </View>
            </View>

            {/* Security Points */}
            <View className="mb-12 mt-8 gap-6">
              {SECURITY_POINTS.map((point) => (
                <View key={point.title} className="flex-row items-start gap-4">
                  <View className="mt-1">
                    <View
                      className="items-center justify-center rounded-full p-1"
                      style={{
                        backgroundColor: `${colors.primary.pink}33`,
                        borderWidth: 1,
                        borderColor: `${colors.primary.pink}66`,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={colors.primary.pink}
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold leading-tight text-white">
                      {point.title}
                    </Text>
                    <Text className="mt-1 text-xs text-white/50">
                      {point.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-8 pb-10 pt-4">
            <GradientButton
              onPress={() => router.push('/onboarding/terms-of-service')}
            >
              I Feel Secure
            </GradientButton>
            <Text className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/30">
              Verified by PHOBIK Security Lab
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
