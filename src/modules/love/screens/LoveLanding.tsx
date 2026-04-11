import empathyChallengeBg from '@/assets/images/love/empathy-challenge-bg.jpg';
import gentleLetterBg from '@/assets/images/love/gentle-letter-bg.jpg';
import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { useActiveChallenge } from '@/modules/empathy-challenge/hooks/useEmpathyChallenge';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const cardShadow = {
  borderRadius: 32,
  boxShadow: [
    {
      offsetX: 0,
      offsetY: 20,
      blurRadius: 40,
      spreadDistance: -10,
      color: `${colors.primary.pink}1A`,
    },
  ],
} as const;

export default function LoveLanding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: challenge } = useActiveChallenge();

  const hasActiveChallenge = !!challenge;

  const handleEmpathyChallenge = () => {
    if (hasActiveChallenge) {
      router.push('/practices/empathy-challenge/calendar');
    } else {
      router.push('/practices/empathy-challenge/intro');
    }
  };

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

      {/* Header */}
      <View className="px-6 pb-4" style={{ paddingTop: insets.top + 8 }}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="mb-12 mt-8">
          <Text className="mb-4 text-[56px] font-extrabold leading-none tracking-tighter text-white">
            LOVE
          </Text>
          <Text className="max-w-[300px] text-xl leading-relaxed text-slate-400">
            Deepen self-compassion and cultivate heart-centered awareness.
          </Text>
        </View>

        {/* Cards */}
        <View className="gap-8">
          {/* Card 1: 7-Day Empathy Challenge */}
          <Pressable
            onPress={handleEmpathyChallenge}
            className="active:scale-[0.98]"
          >
            <View className="rounded-[32px]" style={cardShadow}>
              <View className="relative min-h-[480px] overflow-hidden rounded-[32px]">
                <Image
                  source={empathyChallengeBg}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <View className="flex-1 justify-end p-8">
                  <View className="mb-6 h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10">
                    <MaterialIcons
                      name="favorite"
                      size={28}
                      color={colors.primary.pink}
                    />
                  </View>
                  <Text className="mb-3 text-3xl font-bold tracking-tight text-white">
                    7-Day Empathy Challenge
                  </Text>
                  <Text className="mb-8 text-lg leading-snug text-slate-400">
                    A week to strengthen awareness, connection, and compassion.
                  </Text>
                  <View className="w-3/4">
                    <GradientButton
                      onPress={handleEmpathyChallenge}
                      icon={
                        <MaterialIcons
                          name="arrow-forward"
                          size={20}
                          color="white"
                        />
                      }
                    >
                      {hasActiveChallenge
                        ? 'Continue Journey'
                        : 'Start Journey'}
                    </GradientButton>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>

          {/* Card 2: Gentle Letter to Yourself */}
          <Pressable
            onPress={() => router.push('/practices/gentle-letter')}
            className="active:scale-[0.98]"
          >
            <View className="rounded-[32px]" style={cardShadow}>
              <View className="relative min-h-[480px] overflow-hidden rounded-[32px]">
                <Image
                  source={gentleLetterBg}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ position: 'absolute', inset: 0 }}
                />
                <View className="flex-1 justify-end p-8">
                  <View className="mb-6 h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10">
                    <MaterialIcons
                      name="edit-note"
                      size={28}
                      color={colors.accent.yellow}
                    />
                  </View>
                  <Text className="mb-3 text-3xl font-bold tracking-tight text-white">
                    Gentle Letter to Yourself
                  </Text>
                  <Text className="mb-8 text-lg leading-snug text-slate-400">
                    A Phobik practice in courage and kindness.
                  </Text>
                  <Pressable
                    onPress={() => router.push('/practices/gentle-letter')}
                    className="flex-row items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-8 py-4"
                  >
                    <Text className="font-bold text-white">Begin Practice</Text>
                    <MaterialIcons
                      name="auto-awesome"
                      size={20}
                      color="white"
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
