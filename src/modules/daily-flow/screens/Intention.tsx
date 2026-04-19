import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { DailyFlowHeader } from '../components/DailyFlowHeader';
import { DailyFlowProgressBar } from '../components/DailyFlowProgressBar';
import {
  INTENTIONS,
  type Intention as IntentionData,
} from '../data/affirmations';
import {
  useActiveDailyFlowSession,
  useUpdateDailyFlowSession,
} from '../hooks/useDailyFlowSession';

const CARD_SPACING = 16;

function GradientWord({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-3xl font-black leading-tight tracking-tight">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-3xl font-black leading-tight tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function Intention() {
  const router = useRouter();
  const { session, isLoading } = useActiveDailyFlowSession();
  const updateSession = useUpdateDailyFlowSession();
  const [activeIndex, setActiveIndex] = useState(0);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const cardWidth = screenWidth - 80;
  const cardHeight = Math.max(280, Math.min(420, screenHeight * 0.45));

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(
        e.nativeEvent.contentOffset.x / (cardWidth + CARD_SPACING),
      );
      setActiveIndex(idx);
    },
    [cardWidth],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: IntentionData; index: number }) => (
      <IntentionCard
        item={item}
        active={index === activeIndex}
        width={cardWidth}
        height={cardHeight}
        onPress={() => setActiveIndex(index)}
      />
    ),
    [activeIndex, cardWidth, cardHeight],
  );

  if (isLoading || !session) return <LoadingScreen />;

  const handleContinue = async () => {
    const chosen = INTENTIONS[activeIndex];
    if (!chosen) return;
    await updateSession.mutateAsync({
      id: session.id,
      intention: chosen.text,
      currentStep: 'detailed_feeling',
    });
    router.push('/daily-flow/detailed-feeling');
  };

  return (
    <View className="flex-1">
      <GlowBg
        bgClassName="bg-background-charcoal"
        centerY={0.25}
        intensity={0.4}
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
      />
      <DailyFlowHeader wordmark />

      <View className="px-6">
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-pink">
              Step 01
            </Text>
            <View className="mt-2 flex-row flex-wrap items-baseline">
              <Text className="text-3xl font-black leading-tight tracking-tight text-white">
                Start with your{' '}
              </Text>
              <GradientWord text="intention" />
            </View>
          </View>
          <Text className="pb-1 text-xs text-white/55">0% Complete</Text>
        </View>

        <View className="mt-4">
          <DailyFlowProgressBar progress={0.02} />
        </View>

        <Text className="mt-5 text-base leading-6 text-white/65">
          Hold this in your mind as you begin your shift.
        </Text>
      </View>

      <View className="flex-1 justify-center pt-10">
        <FlatList
          horizontal
          data={INTENTIONS}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 40 }}
          ItemSeparatorComponent={ItemSeparator}
          onMomentumScrollEnd={onScroll}
          renderItem={renderItem}
        />
      </View>

      <View className="items-center px-6 pb-8">
        <GradientButton
          onPress={handleContinue}
          loading={updateSession.isPending}
        >
          Next
        </GradientButton>
        <Text className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
          Swipe to choose your anchor
        </Text>
      </View>
    </View>
  );
}

function ItemSeparator() {
  return <View style={{ width: CARD_SPACING }} />;
}

function IntentionCard({
  item,
  active,
  width,
  height,
  onPress,
}: {
  item: IntentionData;
  active: boolean;
  width: number;
  height: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width,
        height,
        shadowColor: active ? colors.primary.pink : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: active ? 0.4 : 0,
        shadowRadius: 30,
      }}
      className={clsx(
        'relative justify-end overflow-hidden rounded-3xl p-10',
        active
          ? 'border-2 border-primary-pink/60 bg-white/[0.06]'
          : 'border border-white/10 bg-white/[0.02]',
      )}
    >
      <View className="absolute right-6 top-6" pointerEvents="none">
        <MaterialIcons
          name={item.icon as keyof typeof MaterialIcons.glyphMap}
          size={100}
          color={active ? colors.primary.pink : 'white'}
          style={{ opacity: active ? 0.2 : 0.05 }}
        />
      </View>

      {active ? (
        <Pressable className="absolute right-6 top-6 h-10 w-10 items-center justify-center rounded-full bg-white/[0.08]">
          <MaterialIcons name="refresh" size={18} color={colors.primary.pink} />
        </Pressable>
      ) : null}

      <Text
        className={clsx(
          'text-3xl font-bold leading-tight tracking-tight',
          active ? 'text-white' : 'text-white/50',
        )}
      >
        {item.text}
      </Text>

      <View className="mt-5 h-1 w-12 overflow-hidden rounded-full">
        {active ? (
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ) : (
          <View className="h-full w-full bg-white/15" />
        )}
      </View>
    </Pressable>
  );
}
