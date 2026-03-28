import { GradientButton } from '@/components/ui/GradientButton';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CourageHeader } from '../components/CourageHeader';
import {
  ANCHOR_OPTIONS,
  ChecklistItem,
  PHASE_CHECKLISTS,
} from '../data/flight-checklist-data';
import { flightChecklistAtom } from '../store/flight-checklist';

function CategoryLabel({ category }: { category: string }) {
  return (
    <Text className="mb-1 ml-1 text-[10px] font-bold uppercase tracking-widest text-primary-pink">
      {category}
    </Text>
  );
}

function HighlightedCard({
  item,
  selected,
  onPress,
}: {
  item: ChecklistItem;
  selected: boolean;
  onPress: () => void;
}) {
  const borderColor =
    item.highlight === 'yellow' ? colors.accent.yellow : colors.primary.pink;
  const bgColor =
    item.highlight === 'yellow'
      ? `${colors.accent.yellow}0D`
      : `${colors.primary.pink}0D`;

  return (
    <View>
      {item.category && <CategoryLabel category={item.category} />}
      <Pressable onPress={onPress}>
        <View
          className="flex-row items-center gap-4 rounded-2xl px-4 py-4"
          style={{
            backgroundColor: bgColor,
            borderWidth: 1,
            borderColor: `${borderColor}33`,
          }}
        >
          {item.icon && (
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <MaterialIcons name={item.icon} size={20} color={borderColor} />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-semibold italic text-white">
              {item.text}
            </Text>
            {item.description && (
              <Text className="mt-0.5 text-sm text-white/50">
                {item.description}
              </Text>
            )}
          </View>
          <CheckboxCircle selected={selected} />
        </View>
      </Pressable>
    </View>
  );
}

function CheckboxCircle({ selected }: { selected: boolean }) {
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
        <MaterialIcons name="check" size={14} color="black" />
      </LinearGradient>
    );
  }
  return <View className="h-6 w-6 rounded-full border-2 border-gray-700" />;
}

function PhaseChecklistItem({
  item,
  selected,
  onPress,
}: {
  item: ChecklistItem;
  selected: boolean;
  onPress: () => void;
}) {
  if (item.highlight) {
    return (
      <HighlightedCard item={item} selected={selected} onPress={onPress} />
    );
  }

  return (
    <View>
      {item.category && <CategoryLabel category={item.category} />}
      <SelectionCard
        label={item.text}
        description={item.description}
        icon={
          item.icon ? (
            <MaterialIcons
              name={item.icon}
              size={20}
              color={colors.accent.yellow}
            />
          ) : undefined
        }
        variant="checkbox"
        selected={selected}
        onPress={onPress}
      />
    </View>
  );
}

// --- Once Seated: special sections ---

function BreathingCard() {
  return (
    <View
      className="rounded-2xl p-5"
      style={{
        backgroundColor: `${colors.primary.pink}0D`,
        borderWidth: 1,
        borderColor: `${colors.primary.pink}33`,
      }}
    >
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
          <Text className="text-base font-bold text-white">
            60-90 seconds of slow breathing
          </Text>
          <Text className="mt-0.5 text-sm text-white/50">
            Regulate your nervous system before taxi.
          </Text>
        </View>
      </View>
    </View>
  );
}

function RealityCheck() {
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl p-4"
      style={{
        backgroundColor: `${colors.accent.yellow}0D`,
        borderWidth: 1,
        borderColor: `${colors.accent.yellow}33`,
      }}
    >
      <MaterialIcons name="verified" size={20} color={colors.accent.yellow} />
      <Text className="flex-1 text-sm font-semibold text-white">
        Reality check:{' '}
        <Text className="italic text-accent-yellow">
          Right now, nothing is required of me
        </Text>
      </Text>
    </View>
  );
}

function AnchorSelection() {
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);

  return (
    <View className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name="anchor" size={18} color={colors.primary.pink} />
        <Text className="text-base font-bold text-white">Choose an anchor</Text>
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
                    ? `${colors.primary.pink}26`
                    : `${colors.white}0D`,
                borderWidth: 1,
                borderColor:
                  selectedAnchor === opt.id
                    ? `${colors.primary.pink}4D`
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
                    : colors.gray[400]
                }
              />
              <Text
                className="text-[10px] font-semibold text-white/70"
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// --- During Takeoff: special section ---

function ExhaleCard() {
  return (
    <LinearGradient
      colors={[colors.gray[900], colors.gray[800]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 16, padding: 20 }}
    >
      <View className="items-center">
        <MaterialIcons
          name="air"
          size={48}
          color={`${colors.primary.pink}33`}
        />
        <Text className="mt-2 text-lg font-bold text-white">
          Focus on your <Text className="text-primary-pink">Exhale</Text>
        </Text>
        <Text className="mt-1 text-xs text-gray-400">
          Current altitude: Increasing
        </Text>
      </View>
    </LinearGradient>
  );
}

// --- Main screen ---

export default function FlightChecklistPhase() {
  const { phaseId } = useLocalSearchParams<{ phaseId: string }>();
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useAtom(flightChecklistAtom);

  const phase = phaseId ? PHASE_CHECKLISTS[phaseId] : undefined;

  const toggleItem = useCallback(
    (itemId: string) => {
      const key = `${phaseId}:${itemId}`;
      setCheckedItems((prev: Set<string>) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [phaseId, setCheckedItems],
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
    <View className="flex-1 bg-background-charcoal">
      <CourageHeader title={phase.title} />

      <ScrollView
        contentContainerClassName="px-6 pb-32 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Phase badge */}
        {phase.phaseBadge && (
          <View className="mb-3 self-start rounded-full bg-primary-pink/20 px-3 py-1">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              {phase.phaseBadge}
            </Text>
          </View>
        )}

        {/* Subtitle */}
        {phase.subtitle && (
          <Text className="mb-6 text-sm leading-5 text-gray-400">
            {phase.subtitle}
          </Text>
        )}

        {/* Checklist items */}
        <View className="gap-4">
          {phase.items.map((item) => (
            <PhaseChecklistItem
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

        {/* Status text */}
        {phase.statusText && (
          <Text className="mt-4 text-center text-xs uppercase tracking-widest text-gray-500">
            {phase.statusText}
          </Text>
        )}

        {/* CTA */}
        <View className="mt-8">
          <GradientButton onPress={handleNext}>{phase.ctaLabel}</GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}
