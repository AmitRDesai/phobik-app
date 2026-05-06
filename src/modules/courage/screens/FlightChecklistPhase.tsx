import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { IconChip } from '@/components/ui/IconChip';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ANCHOR_OPTIONS,
  ChecklistItem,
  PHASE_CHECKLISTS,
} from '../data/flight-checklist-data';
import { flightChecklistAtom } from '../store/flight-checklist';

// --- Shared components ---

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
        borderColor: colors.gray[700],
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
  const isHighlighted = !!item.highlight;
  const borderColor = isHighlighted
    ? item.highlight === 'yellow'
      ? `${colors.accent.yellow}33`
      : `${colors.primary.pink}33`
    : 'rgba(255,255,255,0.1)';
  const bgColor = isHighlighted
    ? item.highlight === 'yellow'
      ? `${colors.accent.yellow}0D`
      : `${colors.primary.pink}0D`
    : 'rgba(255,255,255,0.03)';

  return (
    <Pressable onPress={onPress} className="active:scale-[0.98]">
      <View
        className="rounded-2xl p-4"
        style={{ backgroundColor: bgColor, borderWidth: 1, borderColor }}
      >
        {item.category && (
          <Text className="mb-1.5 text-xs font-bold uppercase tracking-widest text-foreground/55">
            {item.category}
          </Text>
        )}
        <View className="flex-row items-center gap-4">
          {item.icon && (
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: isHighlighted
                  ? `${colors.primary.pink}1A`
                  : 'rgba(255,255,255,0.1)',
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
              className="text-base font-semibold"
              style={{
                color: isHighlighted ? colors.primary.pink : 'white',
              }}
            >
              {item.text}
            </Text>
            {item.description && (
              <Text className="mt-1 text-sm leading-5 text-foreground/50">
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
          <Text className="text-base font-bold text-foreground">
            60-90 seconds of slow breathing
          </Text>
          <Text className="mt-0.5 text-sm text-foreground/50">
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
      <Text className="flex-1 text-sm font-semibold text-foreground">
        Reality check:{' '}
        <Text className="italic text-accent-yellow">
          Right now, nothing is required of me
        </Text>
      </Text>
    </Card>
  );
}

function AnchorSelection() {
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);

  return (
    <Card className="p-5">
      <View className="mb-4 flex-row items-center gap-2">
        <MaterialIcons name="anchor" size={18} color={colors.primary.pink} />
        <Text className="text-base font-bold text-foreground">
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
                    ? `${colors.primary.pink}26`
                    : 'rgba(255,255,255,0.05)',
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
                className="text-[10px] font-semibold text-foreground/70"
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
        <Text className="mt-2 text-lg font-bold text-foreground">
          Focus on your <Text className="text-primary-pink">Exhale</Text>
        </Text>
        <Text className="mt-1 text-xs text-foreground/60">
          Current altitude: Increasing
        </Text>
      </View>
    </LinearGradient>
  );
}

// --- Journal prompt (Before Airport only) ---

function JournalPrompt() {
  const [text, setText] = useState('');

  return (
    <View className="mt-6">
      <Text className="mb-2 text-base font-bold text-foreground">
        Journal Prompt
      </Text>
      <Text className="mb-3 text-sm italic text-foreground/60">
        {'"What am I worried about? Fact or fiction?"'}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type your reflections here..."
        placeholderTextColor={colors.gray[600]}
        multiline
        className="min-h-[120px] rounded-xl border border-foreground/15 bg-black/40 p-4 text-sm text-foreground"
        textAlignVertical="top"
      />
    </View>
  );
}

// --- Main screen ---

export default function FlightChecklistPhase() {
  const { phaseId } = useLocalSearchParams<{ phaseId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <View className="flex-1 bg-surface">
      {/* Header — just back button */}
      <View className="px-4 pb-2" style={{ paddingTop: insets.top + 8 }}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerClassName="px-6 pb-8 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Phase badge */}
        {phase.phaseBadge && (
          <View className="mb-4 self-start rounded-full bg-primary-pink/10 px-3 py-1">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
              {phase.phaseBadge}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text className="mb-2 text-3xl font-black uppercase tracking-tighter text-foreground">
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
          <Text className="mb-6 text-sm leading-5 text-foreground/60">
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
              <Text className="text-base font-bold text-foreground">
                Turbulence Tools
              </Text>
              <Text className="mt-0.5 text-sm text-foreground/50">
                Practical grounding techniques
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.gray[600]}
            />
          </Card>
        )}

        {/* Journal prompt (before airport only) */}
        {phaseId === 'before-airport' && <JournalPrompt />}

        {/* Status text */}
        {phase.statusText && (
          <Text className="mt-6 text-center text-xs uppercase tracking-widest text-foreground/55">
            {phase.statusText}
          </Text>
        )}

        {/* CTA */}
        <View className="mt-12">
          <GradientButton onPress={handleNext}>{phase.ctaLabel}</GradientButton>
        </View>
      </ScrollView>
    </View>
  );
}
