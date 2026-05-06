import heroImage from '@/assets/images/flight-checklist-hero.png';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { alpha, colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Text } from '@/components/themed/Text';
import { Pressable, ScrollView, View } from 'react-native';
import { RadialGlow } from '@/components/ui/RadialGlow';

import { CourageHeader } from '../components/CourageHeader';
import { FLIGHT_PHASES, FlightPhase, PhaseAccent } from '../data/flight-phases';
import { flightChecklistAtom } from '../store/flight-checklist';

const accentColors: Record<PhaseAccent, { icon: string; bg: string }> = {
  pink: { icon: colors.primary.pink, bg: `${colors.primary.pink}1A` },
  yellow: { icon: colors.accent.yellow, bg: `${colors.accent.yellow}1A` },
};

function PhaseButton({
  phase,
  onPress,
}: {
  phase: FlightPhase;
  onPress: () => void;
}) {
  const accent = accentColors[phase.accent];

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View className="flex-row items-center justify-between rounded-xl border border-foreground/10 bg-foreground/5 p-5">
        <View className="flex-row items-center gap-4">
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: accent.bg }}
          >
            <MaterialIcons name={phase.icon} size={22} color={accent.icon} />
          </View>
          <Text className="text-lg font-bold text-foreground">
            {phase.label}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.gray[700]}
        />
      </View>
    </Pressable>
  );
}

export default function FlightChecklistHub() {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useAtom(flightChecklistAtom);
  const hasProgress = checkedItems.size > 0;

  const handlePhasePress = useCallback(
    (phaseId: string) => {
      router.push(`/practices/flight-checklist-phase?phaseId=${phaseId}`);
    },
    [router],
  );

  const handleQuickReset = useCallback(async () => {
    const result = await dialog.info({
      title: 'Quick Reset',
      message: 'This will clear all your checklist progress. Are you sure?',
      buttons: [
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
        { label: 'Reset', value: 'reset', variant: 'destructive' },
      ],
    });
    if (result === 'reset') {
      setCheckedItems(new Set());
    }
  }, [setCheckedItems]);

  return (
    <View className="flex-1 bg-surface">
      {/* Decorative radial glows */}
      <RadialGlow
        color={colors.primary.pink}
        size={300}
        style={{ top: '20%', right: -150 }}
      />
      <CourageHeader title="Flight Checklist" />

      <ScrollView
        contentContainerClassName="px-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Card
          className="mb-8 overflow-hidden p-0"
          shadow={{ color: colors.primary.pink, opacity: 0.1, blur: 15 }}
        >
          <View className="relative h-48">
            <Image
              source={heroImage}
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
              colors={['transparent', alpha.black80]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                padding: 24,
              }}
            >
              <Badge
                variant="solid"
                tone="pink"
                size="sm"
                className="self-start"
              >
                PHOBIK
              </Badge>
            </LinearGradient>
          </View>
        </Card>

        {/* Title */}
        <View className="mb-8 items-center">
          <Text className="mb-2 text-center text-3xl font-black uppercase tracking-tighter text-foreground">
            Quick Flight{'\n'}Checklist
          </Text>
          <Text className="text-sm text-foreground/60">
            Prepare your mind for a peaceful journey.
          </Text>
        </View>

        {/* Phase Buttons */}
        <View className="gap-4">
          {FLIGHT_PHASES.map((phase) => (
            <PhaseButton
              key={phase.id}
              phase={phase}
              onPress={() => handlePhasePress(phase.id)}
            />
          ))}
        </View>

        {/* Quick Reset - only show when there's saved progress */}
        {hasProgress && (
          <View className="mb-8 mt-12">
            <Pressable onPress={handleQuickReset} className="active:scale-95">
              <View className="flex-row items-center justify-center gap-3 rounded-xl border border-status-danger/30 bg-status-danger/10 py-4">
                <MaterialIcons
                  name="emergency"
                  size={20}
                  color={colors.status.danger}
                />
                <Text className="font-black uppercase tracking-widest text-status-danger">
                  Quick Reset
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
