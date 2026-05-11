import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Pressable } from 'react-native';

import heroImage from '@/assets/images/flight-checklist-hero.png';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { Screen } from '@/components/ui/Screen';
import { alpha, colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { dialog } from '@/utils/dialog';

import { FLIGHT_PHASES, FlightPhase, PhaseAccent } from '../data/flight-phases';
import { flightChecklistAtom } from '../store/flight-checklist';

const accentColors: Record<PhaseAccent, { icon: string; bg: string }> = {
  pink: {
    icon: colors.primary.pink,
    bg: withAlpha(colors.primary.pink, 0.1),
  },
  yellow: {
    icon: colors.accent.yellow,
    bg: withAlpha(colors.accent.yellow, 0.1),
  },
};

function PhaseButton({
  phase,
  onPress,
}: {
  phase: FlightPhase;
  onPress: () => void;
}) {
  const scheme = useScheme();
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
          <Text size="lg" weight="bold">
            {phase.label}
          </Text>
        </View>
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={foregroundFor(scheme, 0.5)}
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
    <Screen
      variant="default"
      scroll
      header={<Header title="Flight Checklist" />}
      className="px-6"
    >
      {/* Decorative radial glow */}
      <RadialGlow
        color={colors.primary.pink}
        size={300}
        style={{ top: '20%', right: -150 }}
      />

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
            <Badge variant="solid" tone="pink" size="sm" className="self-start">
              PHOBIK
            </Badge>
          </LinearGradient>
        </View>
      </Card>

      {/* Title */}
      <View className="mb-8 items-center">
        <Text size="display" align="center" className="mb-2 uppercase">
          Quick Flight{'\n'}Checklist
        </Text>
        <Text size="sm" className="text-foreground/60">
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
          <Button
            variant="destructive"
            onPress={handleQuickReset}
            prefixIcon={
              <MaterialIcons name="emergency" size={20} color="white" />
            }
          >
            Quick Reset
          </Button>
        </View>
      )}
    </Screen>
  );
}
