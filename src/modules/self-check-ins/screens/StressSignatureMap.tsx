import { BackButton } from '@/components/ui/BackButton';
import { CardAura } from '@/components/ui/CardAura';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {
  STRESSOR_CATEGORIES,
  type StressorCategory,
  type StressorKey,
} from '../data/stressors';
import {
  useAssessmentList,
  useCompleteAssessment,
} from '../hooks/useSelfCheckIn';
import {
  resetStressCompassAtom,
  stressorRatingsAtom,
} from '../store/self-check-ins';

const CYAN = colors.accent.cyan;
const CARD_AURA_COLORS = [
  { start: colors.primary.pink, label: 'Priority focus' },
  { start: CYAN, label: 'Social Bond' },
  { start: colors.accent.yellow, label: 'Cognitive Load' },
];

export default function StressSignatureMap() {
  const params = useLocalSearchParams<{ id?: string }>();
  const assessmentId = params.id;
  const { data: assessments } = useAssessmentList();
  const completeAssessment = useCompleteAssessment();
  const atomRatings = useAtomValue(stressorRatingsAtom);
  const reset = useSetAtom(resetStressCompassAtom);
  const { width: screenWidth } = useWindowDimensions();

  const assessment = useMemo(
    () =>
      assessmentId
        ? (
            assessments as
              | { id: string; answers?: Record<string, number> }[]
              | undefined
          )?.find((a) => a.id === assessmentId)
        : undefined,
    [assessments, assessmentId],
  );

  // Derive ratings from persisted assessment if present, otherwise fall back to live atom
  const allRatings = useMemo<Record<StressorKey, number>>(() => {
    if (!assessment) return atomRatings;
    const next = { ...atomRatings };
    const answers = (assessment.answers ?? {}) as Record<string, number>;
    for (const [qid, value] of Object.entries(answers)) {
      const idx = Number(qid);
      const stressor = STRESSOR_CATEGORIES[idx];
      if (stressor) next[stressor.key] = value;
    }
    return next;
  }, [assessment, atomRatings]);

  const topStressors = useMemo(
    () =>
      (Object.entries(allRatings) as [StressorKey, number][])
        .sort((a, b) => a[1] - b[1])
        .slice(0, 3)
        .map(([key, rating]) => ({ key, rating })),
    [allRatings],
  );

  const handleSave = async () => {
    if (assessmentId) {
      try {
        await completeAssessment.mutateAsync({ id: assessmentId });
      } catch {
        // Best-effort: PowerSync queues the write; navigate regardless
      }
    }
    reset();
    router.replace('/');
  };

  const stressorMap = Object.fromEntries(
    STRESSOR_CATEGORIES.map((s) => [s.key, s]),
  ) as Record<StressorKey, StressorCategory>;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="flex-1 bg-background"
    >
      {/* Header */}
      <View className="border-b border-foreground/5">
        <View className="flex-row items-center justify-between p-4">
          <BackButton />
          <View className="items-center">
            <Text className="text-[13px] font-bold uppercase tracking-[2px] text-foreground">
              Stress Signature
            </Text>
            <Text
              className="text-[9px] font-medium uppercase tracking-[4px]"
              style={{ color: CYAN }}
            >
              Gradient Orbit Map
            </Text>
          </View>
          <View className="size-10 items-center justify-center">
            <MaterialIcons name="hub" size={24} color={CYAN} />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-0 pt-0 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Orbital Visualization */}
        <OrbitMap
          ratings={allRatings}
          screenWidth={screenWidth}
          stressorMap={stressorMap}
        />

        {/* Top 3 Stressors */}
        <View className="mt-8 px-5">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-[11px] font-black uppercase tracking-[3px] text-foreground/80">
              Your Top 3 Stressors
            </Text>
            <Text
              className="text-[10px] font-bold uppercase"
              style={{ color: colors.primary.pink }}
            >
              Focus Priority
            </Text>
          </View>

          <View className="gap-5">
            {topStressors.map((item, index) => {
              const stressor = stressorMap[item.key];
              const aura = CARD_AURA_COLORS[index];
              return (
                <StressorResultCard
                  key={item.key}
                  stressor={stressor}
                  rank={index + 1}
                  accentColor={aura.start}
                  subtitle={aura.label}
                />
              );
            })}
          </View>
        </View>

        {/* Save Button (in-scroll) */}
        <View className="mt-10 px-6">
          <GradientButton
            onPress={handleSave}
            icon={<MaterialIcons name="insights" size={20} color="white" />}
          >
            Save to Insights
          </GradientButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Orbital SVG Map ---
interface OrbitMapProps {
  ratings: Record<StressorKey, number>;
  screenWidth: number;
  stressorMap: Record<StressorKey, StressorCategory>;
}

function OrbitMap({ ratings, screenWidth, stressorMap }: OrbitMapProps) {
  const size = screenWidth;
  const cx = 100;
  const cy = 100;

  // Ring radii chosen so that outermost node (radius + node_r ≈ 90) stays
  // safely within the 0..200 viewBox (center 100, half-extent 100).
  const INNER_R = 28;
  const MIDDLE_R = 54;
  const OUTER_R = 80;

  type RingKey = 'inner' | 'middle' | 'outer';
  const bucketed = (Object.entries(ratings) as [StressorKey, number][]).map(
    ([key, rating]) => {
      let ring: RingKey;
      if (rating >= 7) ring = 'inner';
      else if (rating >= 4) ring = 'middle';
      else ring = 'outer';
      return { key, rating, ring, emoji: stressorMap[key].emoji };
    },
  );

  const placeEvenly = (
    items: typeof bucketed,
    radius: number,
    startAngleDeg: number,
  ) => {
    const count = items.length;
    return items.map((item, i) => {
      const angle =
        ((startAngleDeg + (count > 0 ? (360 / count) * i : 0)) * Math.PI) / 180;
      return {
        ...item,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  };

  // Sort within each ring by rating so the layout feels deterministic
  // and visually clustered (strongest pattern at the top of each ring).
  const sortRing = (a: { rating: number }, b: { rating: number }) =>
    a.rating - b.rating;

  const innerNodes = placeEvenly(
    bucketed.filter((s) => s.ring === 'inner').sort(sortRing),
    INNER_R,
    -90,
  );
  const middleNodes = placeEvenly(
    bucketed.filter((s) => s.ring === 'middle').sort(sortRing),
    MIDDLE_R,
    -90,
  );
  const outerNodes = placeEvenly(
    bucketed.filter((s) => s.ring === 'outer').sort(sortRing),
    OUTER_R,
    -90,
  );

  return (
    <View
      className="mb-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Core icon — centered in the parent */}
      <View className="absolute inset-0 z-10 items-center justify-center">
        <View
          className="absolute items-center justify-center"
          style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: `${CYAN}08`,
            shadowColor: CYAN,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 40,
          }}
        />
        <View
          className="size-10 items-center justify-center rounded-full border"
          style={{
            backgroundColor: `${CYAN}20`,
            borderColor: `${CYAN}30`,
            shadowColor: CYAN,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 30,
          }}
        >
          <MaterialIcons name="spa" size={18} color={CYAN} />
        </View>
        <Text
          className="mt-2 text-[8px] font-bold uppercase tracking-[3px]"
          style={{ color: CYAN }}
        >
          Core
        </Text>
      </View>

      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={CYAN} stopOpacity={0.25} />
            <Stop offset="50%" stopColor={CYAN} stopOpacity={0.06} />
            <Stop offset="100%" stopColor={CYAN} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="200" height="200" fill="url(#coreGlow)" />

        {/* Orbit rings */}
        <Circle
          cx={cx}
          cy={cy}
          r={INNER_R}
          fill="none"
          stroke={CYAN}
          strokeWidth={0.5}
          opacity={0.6}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={MIDDLE_R}
          fill="none"
          stroke="#A6A5C1"
          strokeWidth={0.75}
          opacity={0.4}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={OUTER_R}
          fill="none"
          stroke={colors.primary.pink}
          strokeWidth={1}
          opacity={0.3}
        />

        {innerNodes.map((node) => (
          <StressNode
            key={node.key}
            x={node.x}
            y={node.y}
            emoji={node.emoji}
            ring="inner"
          />
        ))}
        {middleNodes.map((node) => (
          <StressNode
            key={node.key}
            x={node.x}
            y={node.y}
            emoji={node.emoji}
            ring="middle"
          />
        ))}
        {outerNodes.map((node) => (
          <StressNode
            key={node.key}
            x={node.x}
            y={node.y}
            emoji={node.emoji}
            ring="outer"
          />
        ))}
      </Svg>

      {/* Legend */}
      <View
        className="absolute bottom-2 flex-row items-center justify-between px-8"
        style={{ width: size }}
      >
        <View className="items-center gap-1">
          <View
            className="size-2 rounded-full"
            style={{ backgroundColor: colors.primary.pink }}
          />
          <Text
            className="text-[8px] font-bold uppercase tracking-[3px]"
            style={{ color: colors.primary.pink }}
          >
            Drained
          </Text>
        </View>
        <LinearGradient
          colors={[`${colors.primary.pink}30`, alpha.white10, `${CYAN}30`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, height: 1, marginHorizontal: 16 }}
        />
        <View className="items-center gap-1">
          <View
            className="size-2 rounded-full"
            style={{ backgroundColor: CYAN }}
          />
          <Text
            className="text-[8px] font-bold uppercase tracking-[3px]"
            style={{ color: CYAN }}
          >
            Balanced
          </Text>
        </View>
      </View>
    </View>
  );
}

function StressNode({
  x,
  y,
  emoji,
  ring,
}: {
  x: number;
  y: number;
  emoji: string;
  ring: 'inner' | 'middle' | 'outer';
}) {
  const config = {
    inner: {
      r: 7,
      fill: `${CYAN}10`,
      stroke: `${CYAN}66`,
      fontSize: 7,
    },
    middle: {
      r: 8,
      fill: alpha.white05,
      stroke: alpha.white20,
      fontSize: 8,
    },
    outer: {
      r: 10,
      fill: `${colors.primary.pink}15`,
      stroke: `${colors.primary.pink}80`,
      fontSize: 10,
    },
  }[ring];

  return (
    <>
      <Circle
        cx={x}
        cy={y}
        r={config.r}
        fill={config.fill}
        stroke={config.stroke}
      />
      <SvgText
        x={x}
        y={y + config.fontSize * 0.35}
        fontSize={config.fontSize}
        textAnchor="middle"
      >
        {emoji}
      </SvgText>
    </>
  );
}

// --- Result Card ---
interface StressorResultCardProps {
  stressor: StressorCategory;
  rank: number;
  accentColor: string;
  subtitle: string;
}

function StressorResultCard({
  stressor,
  rank,
  accentColor,
  subtitle,
}: StressorResultCardProps) {
  return (
    <View
      className="overflow-hidden rounded-[28px] p-6"
      style={{
        backgroundColor: withAlpha(colors.background.charcoal, 0.6),
        borderWidth: 1,
        borderColor: alpha.white08,
      }}
    >
      <CardAura color={accentColor} />
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center gap-4">
          <View
            className="size-12 items-center justify-center rounded-2xl border"
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}20`,
            }}
          >
            <Text className="text-2xl">{stressor.emoji}</Text>
          </View>
          <View>
            <Text className="text-lg font-black tracking-tight text-foreground">
              {stressor.label}
            </Text>
            <Text
              className="text-[9px] font-bold uppercase tracking-[3px]"
              style={{ color: accentColor }}
            >
              {subtitle}
            </Text>
          </View>
        </View>
        <Text
          className="text-xl font-black italic opacity-20"
          style={{ color: accentColor }}
        >
          {String(rank).padStart(2, '0')}
        </Text>
      </View>

      <View className="mb-5">
        <Text className="mb-2 text-[9px] font-black uppercase tracking-[3px] text-foreground/55">
          Biological Root
        </Text>
        <Text className="text-sm leading-relaxed text-foreground/80">
          {stressor.biologicalRoot}
        </Text>
      </View>

      <View className="rounded-2xl border border-foreground/5 bg-black/40 p-4">
        <View className="mb-2 flex-row items-center gap-2">
          <MaterialIcons
            name={stressor.practice.icon as keyof typeof MaterialIcons.glyphMap}
            size={16}
            color={accentColor}
          />
          <Text
            className="text-[10px] font-black uppercase tracking-[3px]"
            style={{ color: accentColor }}
          >
            Phobik Practice: {stressor.practice.name}
          </Text>
        </View>
        <Text className="text-[12px] leading-snug text-foreground/70">
          {stressor.practice.description}
        </Text>
      </View>
    </View>
  );
}
