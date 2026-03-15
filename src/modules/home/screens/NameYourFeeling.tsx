import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors, alpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const FEELINGS = [
  {
    id: 'stressed',
    label: 'Stressed',
    description: 'High Tension',
    icon: 'bolt' as const,
  },
  {
    id: 'anxious',
    label: 'Anxious',
    description: 'Restless Mind',
    icon: 'accessibility-new' as const,
  },
  {
    id: 'burned-out',
    label: 'Burned Out',
    description: 'Depleted Energy',
    icon: 'battery-0-bar' as const,
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed',
    description: 'Sensory Load',
    icon: 'layers' as const,
  },
  {
    id: 'disconnected',
    label: 'Disconnected',
    description: 'Numb / Void',
    icon: 'waves' as const,
  },
] as const;

type FeelingId = (typeof FEELINGS)[number]['id'];

export default function NameYourFeeling() {
  const [selected, setSelected] = useState<FeelingId | null>(null);

  return (
    <Container>
      <GlowBg centerY={0.2} intensity={0.6} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pb-2 pt-2">
        <BackButton />

        <View className="items-center">
          <Text className="text-sm font-semibold uppercase tracking-widest text-white/40">
            Name Your Feeling
          </Text>
          <Text className="mt-0.5 text-[10px] font-medium uppercase text-white/30">
            Step 1 of 5
          </Text>
        </View>

        <Pressable
          onPress={() => router.dismiss()}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <MaterialIcons name="close" size={20} color="white" />
        </Pressable>
      </View>

      {/* Progress Dots */}
      <View className="items-center py-4">
        <ProgressDots total={5} current={1} />
      </View>

      {/* Scrollable Content */}
      <ScrollFade>
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT + 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View className="mb-8 flex-row flex-wrap">
            <Text className="text-3xl font-bold leading-tight text-white">
              What are you{' '}
            </Text>
            <MaskedView
              maskElement={
                <Text className="text-3xl font-bold leading-tight">
                  feeling
                </Text>
              }
            >
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text className="text-3xl font-bold leading-tight opacity-0">
                  feeling
                </Text>
              </LinearGradient>
            </MaskedView>
            <Text className="text-3xl font-bold leading-tight text-white">
              {' '}
              right now?
            </Text>
          </View>

          {/* Feeling Cards */}
          <View className="gap-4">
            {FEELINGS.map((feeling) => (
              <SelectionCard
                key={feeling.id}
                label={feeling.label}
                description={feeling.description}
                icon={
                  <FeelingIcon
                    name={feeling.icon}
                    selected={selected === feeling.id}
                  />
                }
                selected={selected === feeling.id}
                onPress={() => setSelected(feeling.id)}
                variant="checkbox"
              />
            ))}
          </View>
        </ScrollView>
      </ScrollFade>

      {/* Continue Button */}
      <View className="px-6 pb-6">
        <GradientButton
          onPress={() =>
            router.push({
              pathname: '/quick-reset/reflection-input',
              params: { feeling: selected! },
            })
          }
          disabled={!selected}
        >
          Continue
        </GradientButton>
      </View>
    </Container>
  );
}

function FeelingIcon({ name, selected }: { name: string; selected: boolean }) {
  return (
    <View className="h-12 w-12 items-center justify-center rounded-xl">
      {selected ? (
        <LinearGradient
          colors={[colors.primary.pink + '33', colors.accent.yellow + '33']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialIcons
            name={name as keyof typeof MaterialIcons.glyphMap}
            size={24}
            color={colors.primary.pink}
          />
        </LinearGradient>
      ) : (
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/5">
          <MaterialIcons
            name={name as keyof typeof MaterialIcons.glyphMap}
            size={24}
            color={alpha.white60}
          />
        </View>
      )}
    </View>
  );
}
