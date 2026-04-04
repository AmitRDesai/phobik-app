import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { colors } from '@/constants/colors';

export default function EmpathyChallengeComplete() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-dark">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.35}
        radius={0.4}
        intensity={0.7}
        bgClassName="bg-background-dark"
      />

      {/* Header */}
      <View
        className="z-10 flex-row items-center justify-between px-6 py-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton icon="close" />
        <Text
          className="text-xs font-semibold uppercase tracking-widest text-white/60"
          numberOfLines={1}
        >
          Challenge Complete
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="overflow-visible"
        contentContainerClassName="items-center px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Badge */}
        <View className="relative mb-12 mt-8 items-center justify-center">
          {/* Ambient glow behind badge */}
          <RadialGlow
            color={colors.primary.pink}
            size={400}
            style={{ top: -70, left: -70 }}
          />
          {/* Gradient ring with glow shadow */}
          <LinearGradient
            colors={[
              colors.primary.pink,
              colors.primary.pink,
              colors.accent.yellow,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 256,
              height: 256,
              borderRadius: 128,
              padding: 3,
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 60,
                  spreadDistance: 10,
                  color: 'rgba(238,43,140,0.4)',
                },
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 100,
                  spreadDistance: 20,
                  color: 'rgba(251,191,36,0.2)',
                },
              ],
            }}
          >
            {/* Dark inner circle */}
            <View
              className="flex-1 items-center justify-center rounded-full"
              style={{ backgroundColor: '#11050a' }}
            >
              <MaterialIcons
                name="favorite"
                size={110}
                color={colors.primary['pink-soft']}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Title */}
        <Text className="mb-4 text-4xl font-bold text-white">
          Empathy Master!
        </Text>
        <Text className="max-w-[320px] text-center text-lg leading-relaxed text-white/70">
          You&apos;ve completed 7 days of growth. Your heart is more open, and
          your connections are stronger.
        </Text>

        {/* Stats */}
        <View className="mt-10 w-full max-w-[180px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-5">
          <MaterialIcons
            name="calendar-today"
            size={24}
            color={colors.primary.pink}
          />
          <Text className="text-[11px] font-bold uppercase tracking-widest text-white/50">
            Sessions Done
          </Text>
          <Text className="text-2xl font-bold text-white">7/7</Text>
        </View>

        {/* D.O.S.E. Reward */}
        <View className="mt-8 w-full gap-3 pb-8">
          <Text className="mb-1 text-center text-[10px] font-bold uppercase tracking-[3px] text-white/40">
            Daily D.O.S.E. Reward
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1 flex-row items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-pink/10">
                <MaterialIcons
                  name="favorite"
                  size={18}
                  color={colors.primary.pink}
                />
              </View>
              <View>
                <Text className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                  Oxytocin
                </Text>
                <Text className="text-lg font-bold text-white">+10</Text>
              </View>
            </View>
            <View className="flex-1 flex-row items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-accent-info/10">
                <MaterialIcons
                  name="psychology"
                  size={18}
                  color={colors.accent.info}
                />
              </View>
              <View>
                <Text className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                  Serotonin
                </Text>
                <Text className="text-lg font-bold text-white">+5</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          className="gap-3 pb-4 self-stretch"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <GradientButton
            onPress={() => {
              // TODO: Share achievement
            }}
            prefixIcon={<MaterialIcons name="share" size={20} color="white" />}
          >
            Share Achievement
          </GradientButton>
          <Pressable
            onPress={() => router.replace('/(tabs)/practices')}
            className="w-full items-center rounded-full border border-white/10 bg-white/5 py-5"
          >
            <Text className="font-semibold text-white/80">Return to Home</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
    </View>
  );
}
