import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
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
    <Screen
      variant="default"
      header={<DailyFlowHeader wordmark />}
      sticky={
        <View className="items-center">
          <GradientButton
            onPress={handleContinue}
            loading={updateSession.isPending}
          >
            Next
          </GradientButton>
          <Text className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45">
            Swipe to choose your anchor
          </Text>
        </View>
      }
      className=""
    >
      <View className="px-6">
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary-pink">
              Step 01
            </Text>
            <View className="mt-2 flex-row flex-wrap items-baseline">
              <Text className="text-3xl font-black leading-tight tracking-tight text-foreground">
                Start with your{' '}
              </Text>
              <GradientText className="text-3xl font-black leading-tight tracking-tight">
                intention
              </GradientText>
            </View>
          </View>
          <Text className="pb-1 text-xs text-foreground/55">0% Complete</Text>
        </View>

        <View className="mt-4">
          <DailyFlowProgressBar progress={0.02} />
        </View>

        <Text className="mt-5 text-base leading-6 text-foreground/65">
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
          // paddingVertical gives the active card's boxShadow room to render
          // outside the card bounds without being clipped by the scroll view.
          contentContainerStyle={{ paddingHorizontal: 40, paddingVertical: 32 }}
          style={{ overflow: 'visible' }}
          ItemSeparatorComponent={ItemSeparator}
          onMomentumScrollEnd={onScroll}
          renderItem={renderItem}
        />
      </View>
    </Screen>
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
        boxShadow: active
          ? `0 0 30px ${withAlpha(colors.primary.pink, 0.4)}`
          : undefined,
      }}
      className={clsx(
        'relative justify-end overflow-hidden rounded-3xl p-10',
        active
          ? 'border-2 border-primary-pink/60 bg-foreground/[0.06]'
          : 'border border-foreground/10 bg-foreground/[0.02]',
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
        <Pressable className="absolute right-6 top-6 h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.08]">
          <MaterialIcons name="refresh" size={18} color={colors.primary.pink} />
        </Pressable>
      ) : null}

      <Text
        className={clsx(
          'text-3xl font-bold leading-tight tracking-tight',
          active ? 'text-foreground' : 'text-foreground/50',
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
          <View className="h-full w-full bg-foreground/15" />
        )}
      </View>
    </Pressable>
  );
}
