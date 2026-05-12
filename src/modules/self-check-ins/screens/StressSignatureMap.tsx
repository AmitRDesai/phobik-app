import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { CardAura } from '@/components/ui/CardAura';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
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

const CARD_AURA_LABELS = [
  'Priority focus',
  'Social Bond',
  'Cognitive Load',
] as const;

function useAuraColors(): string[] {
  const scheme = useScheme();
  return [
    colors.primary.pink,
    accentFor(scheme, 'cyan'),
    accentFor(scheme, 'yellow'),
  ];
}

export default function StressSignatureMap() {
  const scheme = useScheme();
  const cyan = accentFor(scheme, 'cyan');
  const auraColors = useAuraColors();
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
    <Screen
      scroll
      header={
        <Header
          left={<BackButton />}
          center={
            <View className="items-center">
              <Text size="sm" weight="bold" className="tracking-[2px]">
                Stress Signature
              </Text>
              <Text
                size="xs"
                treatment="caption"
                weight="medium"
                className="tracking-[4px]"
                style={{ color: cyan }}
              >
                Gradient Orbit Map
              </Text>
            </View>
          }
          right={
            <View className="size-10 items-center justify-center">
              <MaterialIcons name="hub" size={24} color={cyan} />
            </View>
          }
        />
      }
      sticky={
        <Button
          onPress={handleSave}
          icon={<MaterialIcons name="insights" size={20} color="white" />}
        >
          Save to Insights
        </Button>
      }
      className="px-0"
      contentClassName="pb-4"
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
          <Text
            size="xs"
            treatment="caption"
            weight="black"
            className="tracking-[3px] text-foreground/80"
          >
            Your Top 3 Stressors
          </Text>
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            style={{ color: colors.primary.pink }}
          >
            Focus Priority
          </Text>
        </View>

        <View className="gap-5">
          {topStressors.map((item, index) => {
            const stressor = stressorMap[item.key];
            return (
              <StressorResultCard
                key={item.key}
                stressor={stressor}
                rank={index + 1}
                accentColor={auraColors[index]}
                subtitle={CARD_AURA_LABELS[index]}
              />
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

// --- Orbital SVG Map ---
interface OrbitMapProps {
  ratings: Record<StressorKey, number>;
  screenWidth: number;
  stressorMap: Record<StressorKey, StressorCategory>;
}

function OrbitMap({ ratings, screenWidth, stressorMap }: OrbitMapProps) {
  const scheme = useScheme();
  const cyan = accentFor(scheme, 'cyan');
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
            backgroundColor: `${cyan}08`,
            boxShadow: `0px 0px 40px ${withAlpha(cyan, 0.6)}`,
          }}
        />
        <View
          className="size-10 items-center justify-center rounded-full border"
          style={{
            backgroundColor: `${cyan}20`,
            borderColor: `${cyan}30`,
            boxShadow: `0px 0px 30px ${withAlpha(cyan, 0.5)}`,
          }}
        >
          <MaterialIcons name="spa" size={18} color={cyan} />
        </View>
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          className="mt-2 tracking-[3px]"
          style={{ color: cyan }}
        >
          Core
        </Text>
      </View>

      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <RadialGradient id="coreGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={cyan} stopOpacity={0.25} />
            <Stop offset="50%" stopColor={cyan} stopOpacity={0.06} />
            <Stop offset="100%" stopColor={cyan} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="200" height="200" fill="url(#coreGlow)" />

        {/* Orbit rings */}
        <Circle
          cx={cx}
          cy={cy}
          r={INNER_R}
          fill="none"
          stroke={cyan}
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
            size="xs"
            treatment="caption"
            weight="bold"
            className="tracking-[3px]"
            style={{ color: colors.primary.pink }}
          >
            Drained
          </Text>
        </View>
        <LinearGradient
          colors={[
            `${colors.primary.pink}30`,
            foregroundFor(scheme, 0.1),
            `${cyan}30`,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, height: 1, marginHorizontal: 16 }}
        />
        <View className="items-center gap-1">
          <View
            className="size-2 rounded-full"
            style={{ backgroundColor: cyan }}
          />
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="tracking-[3px]"
            style={{ color: cyan }}
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
  const scheme = useScheme();
  const cyan = accentFor(scheme, 'cyan');
  const config = {
    inner: {
      r: 7,
      fill: `${cyan}10`,
      stroke: `${cyan}66`,
      fontSize: 7,
    },
    middle: {
      r: 8,
      fill: foregroundFor(scheme, 0.05),
      stroke: foregroundFor(scheme, 0.2),
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
    <View className="overflow-hidden rounded-[28px] border border-foreground/[0.08] bg-surface-elevated p-6">
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
            <Text size="h3" weight="black">
              {stressor.label}
            </Text>
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="tracking-[3px]"
              style={{ color: accentColor }}
            >
              {subtitle}
            </Text>
          </View>
        </View>
        <Text
          size="display"
          weight="black"
          className="opacity-20"
          style={{ color: accentColor }}
        >
          {String(rank).padStart(2, '0')}
        </Text>
      </View>

      <View className="mb-5">
        <Text
          size="xs"
          treatment="caption"
          tone="secondary"
          weight="black"
          className="mb-2 tracking-[3px]"
        >
          Biological Root
        </Text>
        <Text size="sm" className="leading-relaxed text-foreground/80">
          {stressor.biologicalRoot}
        </Text>
      </View>

      <View className="rounded-2xl border border-foreground/5 bg-foreground/[0.04] p-4">
        <View className="mb-2 flex-row items-center gap-2">
          <MaterialIcons
            name={stressor.practice.icon as keyof typeof MaterialIcons.glyphMap}
            size={16}
            color={accentColor}
          />
          <Text
            size="xs"
            treatment="caption"
            weight="black"
            className="tracking-[3px]"
            style={{ color: accentColor }}
          >
            Phobik Practice: {stressor.practice.name}
          </Text>
        </View>
        <Text size="sm" className="leading-snug text-foreground/70">
          {stressor.practice.description}
        </Text>
      </View>
    </View>
  );
}
