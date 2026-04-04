import { BackButton } from '@/components/ui/BackButton';
import { CardAura } from '@/components/ui/CardAura';
import Container from '@/components/ui/Container';
import { GradientButton } from '@/components/ui/GradientButton';
import { ScrollFade } from '@/components/ui/ScrollFade';
import { alpha, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
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
  resetStressCompassAtom,
  stressorRatingsAtom,
  topStressorsAtom,
} from '../store/self-check-ins';

const CYAN = colors.accent.cyan;
const CARD_AURA_COLORS = [
  { start: colors.primary.pink, label: 'Priority focus' },
  { start: CYAN, label: 'Social Bond' },
  { start: colors.accent.yellow, label: 'Cognitive Load' },
];

export default function StressSignatureMap() {
  const topStressors = useAtomValue(topStressorsAtom);
  const allRatings = useAtomValue(stressorRatingsAtom);
  const reset = useSetAtom(resetStressCompassAtom);
  const { width: screenWidth } = useWindowDimensions();

  const handleSave = () => {
    reset();
    router.replace('/');
  };

  const stressorMap = Object.fromEntries(
    STRESSOR_CATEGORIES.map((s) => [s.key, s]),
  ) as Record<StressorKey, StressorCategory>;

  return (
    <Container>
      {/* Header */}
      <View className="border-b border-white/5 bg-black/80">
        <View className="flex-row items-center justify-between p-4">
          <BackButton />
          <View className="items-center">
            <Text className="text-[13px] font-bold uppercase tracking-[2px] text-white">
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

      <ScrollFade>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-0 pt-0 pb-24"
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
              <Text className="text-[11px] font-black uppercase tracking-[3px] text-white/80">
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
        </ScrollView>
      </ScrollFade>

      {/* Fixed Bottom Button */}
      <View className="px-6 pb-6">
        <GradientButton
          onPress={handleSave}
          icon={<MaterialIcons name="insights" size={20} color="white" />}
        >
          Save to Insights
        </GradientButton>
      </View>
    </Container>
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
  const cy = 50;

  const sorted = (Object.entries(ratings) as [StressorKey, number][]).map(
    ([key, rating]) => {
      let ring: 'inner' | 'middle' | 'outer';
      if (rating >= 7) ring = 'inner';
      else if (rating >= 4) ring = 'middle';
      else ring = 'outer';
      return { key, rating, ring, emoji: stressorMap[key].emoji };
    },
  );

  const inner = sorted.filter((s) => s.ring === 'inner');
  const middle = sorted.filter((s) => s.ring === 'middle');
  const outer = sorted.filter((s) => s.ring === 'outer');

  const ringAngles: Record<string, number[][]> = {
    inner: [[], [90], [45, 135], [-90, 45, 135], [-90, 0, 90, 180]],
    middle: [[], [90], [0, 180], [180, 0, 90], [180, 0, 60, 120]],
    outer: [
      [],
      [90],
      [30, 150],
      [30, 90, 150],
      [30, 90, 135, 165],
      [20, 60, 100, 140, 170],
    ],
  };

  const placeOnRing = (
    items: typeof sorted,
    radius: number,
    ring: 'inner' | 'middle' | 'outer',
  ) => {
    const presets = ringAngles[ring];
    const angles =
      items.length < presets.length
        ? presets[items.length]
        : Array.from(
            { length: items.length },
            (_, i) => -90 + (360 / items.length) * i,
          );
    return items.map((item, i) => {
      const angle = (angles[i] * Math.PI) / 180;
      return {
        ...item,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  };

  const innerNodes = placeOnRing(inner, 35, 'inner');
  const middleNodes = placeOnRing(middle, 70, 'middle');
  const outerNodes = placeOnRing(outer, 105, 'outer');

  return (
    <View
      className="mb-0 items-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Core icon */}
      <View
        className="absolute z-10 items-center gap-2"
        style={{ top: size * 0.295 - 29 }}
      >
        <View
          className="absolute items-center justify-center"
          style={{
            width: 100,
            height: 100,
            top: -30,
            borderRadius: 50,
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
          className="text-[8px] font-bold uppercase tracking-[3px]"
          style={{ color: CYAN }}
        >
          Core
        </Text>
      </View>

      <Svg
        width={size * 1.1}
        height={size * 1.1}
        viewBox="0 0 200 200"
        style={{ marginTop: size * 0.02 }}
      >
        <Defs>
          <RadialGradient id="coreGlow" cx="50%" cy="25%" rx="15%" ry="15%">
            <Stop offset="0%" stopColor={CYAN} stopOpacity={0.35} />
            <Stop offset="60%" stopColor={CYAN} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={CYAN} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="200" height="200" fill="url(#coreGlow)" />

        {/* Orbit rings */}
        <Circle
          cx={cx}
          cy={cy}
          r={35}
          fill="none"
          stroke={CYAN}
          strokeWidth={0.5}
          opacity={0.6}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={70}
          fill="none"
          stroke="#A6A5C1"
          strokeWidth={0.75}
          opacity={0.4}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={105}
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
        className="absolute bottom-4 flex-row items-center justify-between px-8"
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
            <Text className="text-lg font-black tracking-tight text-white">
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
        <Text className="mb-2 text-[9px] font-black uppercase tracking-[3px] text-slate-500">
          Biological Root
        </Text>
        <Text className="text-sm leading-relaxed text-slate-200">
          {stressor.biologicalRoot}
        </Text>
      </View>

      <View className="rounded-2xl border border-white/5 bg-black/40 p-4">
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
        <Text className="text-[12px] leading-snug text-slate-300">
          {stressor.practice.description}
        </Text>
      </View>
    </View>
  );
}
