import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { BackButton } from '@/components/ui/BackButton';
import { alpha, colors, withAlpha } from '@/constants/colors';
import MaskedView from '@react-native-masked-view/masked-view';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { Slider } from '../components/Slider';
import {
  useSaveEnergyCheckIn,
  useTodayEnergyCheckIn,
} from '@/modules/home/hooks/useEnergyCheckIn';

interface Pillars {
  purpose: number;
  mental: number;
  physical: number;
  relationship: number;
}

type PillarKey = keyof Pillars;

const DEFAULT_PILLARS: Pillars = {
  purpose: 12,
  mental: 12,
  physical: 12,
  relationship: 12,
};

export default function EnergyIndex() {
  const { data: todayRecord, isLoading } = useTodayEnergyCheckIn();
  const saveEnergyCheckIn = useSaveEnergyCheckIn();
  const [pillars, setPillars] = useState<Pillars>(DEFAULT_PILLARS);
  const [initialized, setInitialized] = useState(false);
  const { width: screenWidth } = useWindowDimensions();

  const containerSize = Math.min(screenWidth - 48, 340);
  const circleSize = containerSize * 0.47;
  const sliderWidth = 150;

  const energyIndex =
    pillars.purpose + pillars.mental + pillars.physical + pillars.relationship;

  // Pre-populate from today's saved record (once)
  useEffect(() => {
    if (initialized || isLoading) return;
    if (todayRecord) {
      setPillars({
        purpose: todayRecord.purpose as number,
        mental: todayRecord.mental as number,
        physical: todayRecord.physical as number,
        relationship: todayRecord.relationship as number,
      });
    }
    setInitialized(true);
  }, [todayRecord, isLoading, initialized]);

  const updatePillar = useCallback((key: PillarKey, value: number) => {
    setPillars((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    await saveEnergyCheckIn.mutateAsync(pillars);
    router.back();
  };

  return (
    <Container>
      <GlowBg centerY={0.45} intensity={0.6} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <BackButton />
        <Text className="text-base font-bold tracking-tight text-foreground">
          Check In
        </Text>
        <View className="size-10 items-center justify-center">
          <MaterialIcons
            name="analytics"
            size={24}
            color={colors.primary.pink}
          />
        </View>
      </View>

      {/* Title */}
      <View className="items-center px-6 pt-8">
        <Text className="mb-3 text-center text-2xl font-bold leading-tight tracking-tight text-foreground">
          Where does your energy need support today?
        </Text>
        <Text className="max-w-[340px] text-center text-[13px] leading-relaxed text-foreground/55">
          Adjust each slider (0-25) to see your real-time total score.
        </Text>
      </View>

      {/* Energy Circles */}
      <View className="flex-1 items-center justify-center px-6">
        <View style={{ width: containerSize, height: containerSize }}>
          {/* Top: Purpose */}
          <EnergyCircle
            label="Purpose"
            value={pillars.purpose}
            onValueChange={(v) => updatePillar('purpose', v)}
            circleSize={circleSize}
            sliderWidth={sliderWidth}
            position="top"
            containerSize={containerSize}
          />

          {/* Bottom: Relationship */}
          <EnergyCircle
            label="Relationship"
            value={pillars.relationship}
            onValueChange={(v) => updatePillar('relationship', v)}
            circleSize={circleSize}
            sliderWidth={sliderWidth}
            position="bottom"
            containerSize={containerSize}
          />

          {/* Left: Mental */}
          <EnergyCircle
            label="Mental"
            value={pillars.mental}
            onValueChange={(v) => updatePillar('mental', v)}
            circleSize={circleSize}
            sliderWidth={sliderWidth}
            position="left"
            containerSize={containerSize}
          />

          {/* Right: Physical */}
          <EnergyCircle
            label="Physical"
            value={pillars.physical}
            onValueChange={(v) => updatePillar('physical', v)}
            circleSize={circleSize}
            sliderWidth={sliderWidth}
            position="right"
            containerSize={containerSize}
          />

          {/* Center: Energy Index */}
          <View
            className="absolute items-center justify-center"
            style={{
              left: containerSize / 2 - 48,
              top: containerSize / 2 - 48,
              width: 96,
              height: 96,
            }}
          >
            <View
              className="items-center justify-center rounded-full border border-foreground/20"
              style={{
                width: 96,
                height: 96,
                backgroundColor: alpha.black95,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              }}
            >
              <Text className="mb-0.5 text-[9px] font-bold uppercase tracking-[3px] text-foreground/50">
                Energy
              </Text>
              <MaskedView
                maskElement={
                  <Text className="text-3xl font-black leading-none">
                    {energyIndex}
                  </Text>
                }
              >
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text className="text-3xl font-black leading-none opacity-0">
                    {energyIndex}
                  </Text>
                </LinearGradient>
              </MaskedView>
              <Text className="mt-1 text-[9px] font-bold uppercase tracking-[3px] text-foreground/50">
                Index
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View className="px-6 pb-4">
        <Text className="mb-6 text-center text-[11px] font-medium italic text-foreground/60">
          {'"'}When your energy aligns, courage follows.{'"'}
        </Text>
        <GradientButton
          onPress={handleSave}
          disabled={saveEnergyCheckIn.isPending}
          icon={<MaterialIcons name="check" size={20} color="white" />}
        >
          {saveEnergyCheckIn.isPending ? 'Saving...' : 'Save'}
        </GradientButton>
      </View>
    </Container>
  );
}

interface EnergyCircleProps {
  label: string;
  value: number;
  onValueChange: (v: number) => void;
  circleSize: number;
  sliderWidth: number;
  position: 'top' | 'bottom' | 'left' | 'right';
  containerSize: number;
}

function EnergyCircle({
  label,
  value,
  onValueChange,
  circleSize,
  sliderWidth,
  position,
  containerSize,
}: EnergyCircleProps) {
  const half = containerSize / 2;
  const circleHalf = circleSize / 2;
  const isVertical = position === 'left' || position === 'right';
  const labelRotation =
    position === 'left' ? '-90deg' : position === 'right' ? '90deg' : '0deg';

  const circlePositions = {
    top: { left: half - circleHalf, top: 8 },
    bottom: { left: half - circleHalf, bottom: 8 },
    left: { left: 8, top: half - circleHalf },
    right: { right: 8, top: half - circleHalf },
  };

  // Slider positions — top/bottom are horizontal, left/right are rotated vertical
  // and extend outward from the circle toward the screen edge
  const sliderPositions = {
    top: {
      left: half - sliderWidth / 2,
      top: -44,
    },
    bottom: {
      left: half - sliderWidth / 2,
      bottom: -44,
    },
    left: {
      left: 8 + circleHalf - sliderWidth / 2 - 70,
      // Container height before rotation ≈ slider(32) + pill(20) = 52; center at 26
      top: half - 26,
      transform: [{ rotate: '-90deg' }] as const,
    },
    right: {
      right: 8 + circleHalf - sliderWidth / 2 - 70,
      top: half - 26,
      transform: [{ rotate: '90deg' }] as const,
    },
  };

  return (
    <>
      {/* Circle */}
      <View
        className="absolute overflow-hidden rounded-full border border-foreground/10"
        style={{
          width: circleSize,
          height: circleSize,
          ...circlePositions[position],
          ...(value > 10
            ? {
                borderColor: alpha.white20,
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
              }
            : {}),
        }}
      >
        <LinearGradient
          colors={[
            withAlpha(colors.primary['pink-soft'], 0.14),
            withAlpha(colors.accent.gold, 0.14),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            className="text-[10px] font-bold uppercase tracking-[2px] text-foreground/60"
            style={
              isVertical
                ? { transform: [{ rotate: labelRotation }] }
                : undefined
            }
          >
            {label}
          </Text>
        </LinearGradient>
      </View>

      {/* Slider + pill */}
      <View
        className="absolute items-center"
        style={{
          width: sliderWidth,
          ...sliderPositions[position],
        }}
      >
        {(position === 'top' || isVertical) && (
          <ScorePill
            value={value}
            rotation={
              position === 'left'
                ? '90deg'
                : position === 'right'
                  ? '-90deg'
                  : undefined
            }
          />
        )}
        <Slider
          value={value}
          min={0}
          max={25}
          onValueChange={onValueChange}
          trackWidth={sliderWidth}
        />
        {position === 'bottom' && <ScorePill value={value} />}
      </View>
    </>
  );
}

function ScorePill({ value, rotation }: { value: number; rotation?: string }) {
  return (
    <View
      className="rounded-md border px-1.5 py-0.5"
      style={{
        backgroundColor: alpha.white10,
        borderColor: `${colors.primary.pink}30`,
        shadowColor: colors.primary.pink,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        ...(rotation ? { transform: [{ rotate: rotation }] } : {}),
      }}
    >
      <Text
        className="text-sm font-bold"
        style={{ color: colors.primary.pink }}
      >
        {value}
      </Text>
    </View>
  );
}
