import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { Pressable, TextInput } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

import {
  ANCHOR_OPTIONS,
  ChecklistItem,
  PHASE_CHECKLISTS,
} from '../data/flight-checklist-data';
import { flightChecklistAtom } from '../store/flight-checklist';

// --- Shared components ---

function CheckboxCircle({ selected }: { selected: boolean }) {
  const scheme = useScheme();
  if (selected) {
    return (
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialIcons name="check" size={14} color="white" />
      </LinearGradient>
    );
  }
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: foregroundFor(scheme, 0.25),
      }}
    />
  );
}

function GlassCard({
  item,
  selected,
  onPress,
}: {
  item: ChecklistItem;
  selected: boolean;
  onPress: () => void;
}) {
  const scheme = useScheme();
  const isHighlighted = !!item.highlight;
  const borderColor = isHighlighted
    ? item.highlight === 'yellow'
      ? withAlpha(colors.accent.yellow, 0.2)
      : withAlpha(colors.primary.pink, 0.2)
    : foregroundFor(scheme, 0.1);
  const bgColor = isHighlighted
    ? item.highlight === 'yellow'
      ? withAlpha(colors.accent.yellow, 0.05)
      : withAlpha(colors.primary.pink, 0.05)
    : foregroundFor(scheme, 0.03);

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View
        className="rounded-2xl p-4"
        style={{ backgroundColor: bgColor, borderWidth: 1, borderColor }}
      >
        {item.category && (
          <Text variant="caption" muted className="mb-1.5">
            {item.category}
          </Text>
        )}
        <View className="flex-row items-center gap-4">
          {item.icon && (
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: isHighlighted
                  ? withAlpha(colors.primary.pink, 0.1)
                  : foregroundFor(scheme, 0.1),
              }}
            >
              <MaterialIcons
                name={item.icon}
                size={20}
                color={
                  isHighlighted ? colors.primary.pink : colors.accent.yellow
                }
              />
            </View>
          )}
          <View className="flex-1">
            <Text
              variant="md"
              className="font-semibold"
              style={isHighlighted ? { color: colors.primary.pink } : undefined}
            >
              {item.text}
            </Text>
            {item.description && (
              <Text variant="sm" className="mt-1 text-foreground/50">
                {item.description}
              </Text>
            )}
          </View>
          <CheckboxCircle selected={selected} />
        </View>
      </View>
    </Pressable>
  );
}

// --- Once Seated: special sections ---

function BreathingCard() {
  return (
    <Card variant="toned" tone="pink">
      <View className="flex-row items-center gap-3">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons name="air" size={20} color="white" />
        </LinearGradient>
        <View className="flex-1">
          <Text variant="md" className="font-bold">
            60-90 seconds of slow breathing
          </Text>
          <Text variant="sm" className="mt-0.5 text-foreground/50">
            Regulate your nervous system before taxi.
          </Text>
        </View>
      </View>
    </Card>
  );
}

function RealityCheck() {
  return (
    <Card variant="toned" tone="yellow" className="flex-row items-center gap-3">
      <MaterialIcons name="verified" size={20} color={colors.accent.yellow} />
      <Text variant="sm" className="flex-1 font-semibold">
        Reality check:{' '}
        <Text variant="sm" className="italic text-accent-yellow">
          Right now, nothing is required of me
        </Text>
      </Text>
    </Card>
  );
}

function AnchorSelection() {
  const scheme = useScheme();
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);

  return (
    <Card className="p-5">
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name="anchor" size={18} color={colors.primary.pink} />
        <Text variant="md" className="font-bold">
          Choose an anchor
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-3">
        {ANCHOR_OPTIONS.map((opt) => (
          <Pressable
            key={opt.id}
            onPress={() => setSelectedAnchor(opt.id)}
            className="active:scale-95"
          >
            <View
              className="items-center gap-1 rounded-xl px-3 py-3"
              style={{
                backgroundColor:
                  selectedAnchor === opt.id
                    ? withAlpha(colors.primary.pink, 0.15)
                    : foregroundFor(scheme, 0.05),
                borderWidth: 1,
                borderColor:
                  selectedAnchor === opt.id
                    ? withAlpha(colors.primary.pink, 0.3)
                    : 'transparent',
                width: 80,
              }}
            >
              <MaterialIcons
                name={opt.icon}
                size={20}
                color={
                  selectedAnchor === opt.id
                    ? colors.primary.pink
                    : foregroundFor(scheme, 0.55)
                }
              />
              <Text
                variant="xs"
                className="font-semibold text-foreground/70"
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

// --- During Takeoff: special section ---

function ExhaleCard() {
  const scheme = useScheme();
  return (
    <View
      className="items-center rounded-2xl bg-surface-elevated p-5"
      style={{ borderWidth: 1, borderColor: foregroundFor(scheme, 0.08) }}
    >
      <MaterialIcons
        name="air"
        size={48}
        color={withAlpha(colors.primary.pink, 0.2)}
      />
      <Text variant="lg" className="mt-2 font-bold">
        Focus on your{' '}
        <Text variant="lg" className="font-bold text-primary-pink">
          Exhale
        </Text>
      </Text>
      <Text variant="xs" className="mt-1 text-foreground/60">
        Current altitude: Increasing
      </Text>
    </View>
  );
}

// --- Journal prompt (Before Airport only) ---

function JournalPrompt() {
  const scheme = useScheme();
  const [text, setText] = useState('');

  return (
    <View className="mt-6">
      <Text variant="md" className="mb-2 font-bold">
        Journal Prompt
      </Text>
      <Text variant="sm" className="mb-3 italic text-foreground/60">
        {'"What am I worried about? Fact or fiction?"'}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type your reflections here..."
        placeholderTextColor={foregroundFor(scheme, 0.35)}
        multiline
        className="min-h-[120px] rounded-xl border border-foreground/15 bg-foreground/[0.04] p-4 text-sm text-foreground"
        textAlignVertical="top"
      />
    </View>
  );
}

// --- Main screen ---

export default function FlightChecklistPhase() {
  const { phaseId } = useLocalSearchParams<{ phaseId: string }>();
  const router = useRouter();
  const scheme = useScheme();
  const [checkedItems, setCheckedItems] = useAtom(flightChecklistAtom);

  const phase = phaseId ? PHASE_CHECKLISTS[phaseId] : undefined;

  const toggleItem = useCallback(
    (itemId: string) => {
      const key = `${phaseId}:${itemId}`;
      const next = new Set(checkedItems);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      setCheckedItems(next);
    },
    [phaseId, checkedItems, setCheckedItems],
  );

  const handleNext = useCallback(() => {
    if (phase?.nextPhase) {
      router.replace(
        `/practices/flight-checklist-phase?phaseId=${phase.nextPhase}`,
      );
    } else {
      router.back();
    }
  }, [phase, router]);

  if (!phase) return null;

  return (
    <Screen variant="default" scroll header={<Header />} className="px-6">
      {/* Phase badge */}
      {phase.phaseBadge && (
        <View className="mb-4 self-start rounded-full bg-primary-pink/10 px-3 py-1">
          <Text variant="caption" className="text-primary-pink">
            {phase.phaseBadge}
          </Text>
        </View>
      )}

      {/* Title */}
      <Text variant="display" className="mb-2 uppercase">
        {phase.title}
        {'\n'}Checklist
      </Text>

      {/* Gradient accent line below title */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 3, width: 64, borderRadius: 2, marginBottom: 16 }}
      />

      {/* Subtitle */}
      {phase.subtitle && (
        <Text variant="sm" className="mb-6 leading-5 text-foreground/60">
          {phase.subtitle}
        </Text>
      )}

      {/* Checklist items */}
      <View className="mt-4 gap-4">
        {phase.items.map((item) => (
          <GlassCard
            key={item.id}
            item={item}
            selected={checkedItems.has(`${phaseId}:${item.id}`)}
            onPress={() => toggleItem(item.id)}
          />
        ))}
      </View>

      {/* Phase-specific sections */}
      {phaseId === 'once-seated' && (
        <View className="mt-6 gap-4">
          <BreathingCard />
          <RealityCheck />
          <AnchorSelection />
        </View>
      )}

      {phaseId === 'during-takeoff' && (
        <View className="mt-6">
          <ExhaleCard />
        </View>
      )}

      {phaseId === 'during-turbulence' && (
        <Card
          variant="toned"
          tone="pink"
          onPress={() => router.push('/practices/turbulence-tools')}
          className="mt-6 flex-row items-center gap-4"
        >
          <IconChip size="md" shape="rounded" tone="pink">
            <MaterialIcons
              name="psychology"
              size={22}
              color={colors.primary.pink}
            />
          </IconChip>
          <View className="flex-1">
            <Text variant="md" className="font-bold">
              Turbulence Tools
            </Text>
            <Text variant="sm" className="mt-0.5 text-foreground/50">
              Practical grounding techniques
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={foregroundFor(scheme, 0.4)}
          />
        </Card>
      )}

      {/* Journal prompt (before airport only) */}
      {phaseId === 'before-airport' && <JournalPrompt />}

      {/* Status text */}
      {phase.statusText && (
        <Text variant="caption" muted className="mt-6 text-center">
          {phase.statusText}
        </Text>
      )}

      {/* CTA */}
      <View className="mt-12">
        <GradientButton onPress={handleNext}>{phase.ctaLabel}</GradientButton>
      </View>
    </Screen>
  );
}
