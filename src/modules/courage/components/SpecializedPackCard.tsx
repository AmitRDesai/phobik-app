import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { GradientText } from '@/components/ui/GradientText';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

import { SpecializedPack } from '../data/specialized-packs';

function HeroSection({ pack }: { pack: SpecializedPack }) {
  const isActive = pack.status === 'active';
  const iconColor = isActive ? 'white' : colors.gray[600];
  const accentColor = isActive ? colors.primary.pink : colors.gray[700];

  return (
    <View className="relative h-56 items-center justify-center overflow-hidden bg-gray-900">
      {/* Background gradient */}
      <LinearGradient
        colors={['transparent', 'black']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Radial-ish overlay */}
      {isActive && (
        <LinearGradient
          colors={[`${colors.primary.pink}4D`, 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
          }}
        />
      )}

      {/* Icons */}
      <View className="relative items-center">
        <MaterialIcons name={pack.heroIcon} size={72} color={iconColor} />
        <View
          style={{
            position: 'absolute',
            top: 16,
            right: -15,
            transform: [{ rotate: '12deg' }],
          }}
        >
          <MaterialIcons name={pack.accentIcon} size={48} color={accentColor} />
        </View>
      </View>
    </View>
  );
}

function ActiveCard({
  pack,
  unlocked,
  onUnlock,
  onView,
}: {
  pack: SpecializedPack;
  unlocked: boolean;
  onUnlock?: () => void;
  onView?: () => void;
}) {
  return (
    <LinearGradient
      colors={[colors.primary.pink, colors.accent.yellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ borderRadius: 12, padding: 2 }}
    >
      <View className="overflow-hidden rounded-[10px] bg-surface-elevated">
        <HeroSection pack={pack} />

        <View className="p-6">
          {/* Title + badge */}
          <View className="mb-2 flex-row items-start justify-between">
            <Text className="text-2xl font-bold text-foreground">
              {pack.title}
            </Text>
            <View className="rounded-full bg-primary-pink/20 px-3 py-1">
              <Text className="text-xs font-semibold uppercase tracking-wider text-primary-pink">
                {pack.badge}
              </Text>
            </View>
          </View>

          {/* Subtitle */}
          <Text className="mb-6 text-base italic text-foreground/60">
            {pack.subtitle}
          </Text>

          {/* Transformation goal */}
          <View className="mb-4 flex-row items-center gap-2">
            <Text className="text-xs font-medium uppercase tracking-tight text-foreground/55">
              Transformation Goal:
            </Text>
            <GradientText className="text-sm font-bold">
              {pack.transformationGoal}
            </GradientText>
          </View>

          {/* CTA button */}
          <Pressable
            onPress={unlocked ? onView : onUnlock}
            className="active:scale-[0.98]"
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 12,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View className="flex-row items-center justify-center gap-2 py-4">
                <MaterialIcons
                  name={unlocked ? 'play-arrow' : 'shopping-cart'}
                  size={20}
                  color="white"
                />
                <Text className="text-base font-bold text-foreground">
                  {unlocked ? 'View Journey' : pack.ctaLabel}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          {/* Support text */}
          <Text className="mt-3 text-center text-[10px] text-foreground/55">
            {pack.supportText}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

function LockedCard({ pack }: { pack: SpecializedPack }) {
  return (
    <View className="overflow-hidden rounded-xl border border-foreground/15 bg-surface-elevated/50">
      <HeroSection pack={pack} />

      <View className="p-6 opacity-80">
        {/* Title + badge */}
        <View className="mb-2 flex-row items-start justify-between">
          <Text className="text-2xl font-bold text-foreground/70">
            {pack.title}
          </Text>
          <View className="rounded-full bg-gray-800 px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
              {pack.badge}
            </Text>
          </View>
        </View>

        {/* Subtitle */}
        <Text className="mb-6 text-base italic text-foreground/55">
          {pack.subtitle}
        </Text>

        {/* Transformation goal */}
        <View className="mb-4 flex-row items-center gap-2">
          <Text className="text-xs font-medium uppercase tracking-tight text-foreground/45">
            Transformation Goal:
          </Text>
          <Text className="text-sm font-bold text-foreground/60">
            {pack.transformationGoal}
          </Text>
        </View>

        {/* Disabled button */}
        <View className="flex-row items-center justify-center gap-2 rounded-xl bg-gray-800 py-4">
          <MaterialIcons name="lock" size={20} color={colors.gray[500]} />
          <Text className="text-base font-bold text-foreground/55">
            {pack.ctaLabel}
          </Text>
        </View>

        {/* Support text */}
        <Text className="mt-3 text-center text-[10px] italic text-foreground/45">
          {pack.supportText}
        </Text>
      </View>
    </View>
  );
}

export function SpecializedPackCard({
  pack,
  unlocked,
  onUnlock,
  onView,
}: {
  pack: SpecializedPack;
  unlocked?: boolean;
  onUnlock?: () => void;
  onView?: () => void;
}) {
  if (pack.status === 'active') {
    return (
      <ActiveCard
        pack={pack}
        unlocked={!!unlocked}
        onUnlock={onUnlock}
        onView={onView}
      />
    );
  }
  return <LockedCard pack={pack} />;
}
