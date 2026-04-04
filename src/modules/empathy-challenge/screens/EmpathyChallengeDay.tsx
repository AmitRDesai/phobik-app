import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';

import { EMPATHY_DAYS } from '../data/empathy-days';
import { useCompleteDay, useStartDay } from '../hooks/useEmpathyChallenge';

export default function EmpathyChallengeDay() {
  const { dayNumber, dayId } = useLocalSearchParams<{
    dayNumber: string;
    dayId: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const startDay = useStartDay();
  const completeDay = useCompleteDay();
  const [reflection, setReflection] = useState('');

  const dayNum = Number(dayNumber);
  const empathyDay = EMPATHY_DAYS.find((d) => d.day === dayNum);

  // Mark day as in_progress when screen opens
  useEffect(() => {
    if (dayId) {
      startDay.mutate({ dayId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayId]);

  if (!empathyDay) return null;

  const handleComplete = async () => {
    if (!reflection.trim()) {
      await dialog.error({
        title: 'Reflection required',
        message: 'Please write your reflection before completing the day.',
      });
      return;
    }

    try {
      Keyboard.dismiss();
      if (dayNum === 7) {
        // Navigate first to avoid calendar reacting to invalidated query
        completeDay.mutate({ dayId, reflection: reflection.trim() });
        router.replace('/practices/empathy-challenge/complete');
      } else {
        await completeDay.mutateAsync({ dayId, reflection: reflection.trim() });
        router.replace('/practices/empathy-challenge/calendar');
      }
    } catch {
      await dialog.error({
        title: 'Something went wrong',
        message: 'Could not complete the day. Please try again.',
      });
    }
  };

  return (
    <View className="flex-1 bg-background-charcoal">
      {/* Header */}
      <View
        className="z-10 flex-row items-center justify-between border-b border-white/5 px-4 py-3"
        style={{ paddingTop: insets.top + 4 }}
      >
        <BackButton />
        <Text className="flex-1 text-center text-lg font-bold text-white">
          Day {dayNum}
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAwareScrollView
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={72}
      >
        {/* Progress Bar */}
        <View className="gap-2 px-4 py-4">
          <View className="flex-row items-end justify-between">
            <Text className="text-sm font-semibold text-slate-300">
              7-Day Empathy Challenge
            </Text>
            <Text className="text-xs font-bold uppercase tracking-wider text-primary-pink">
              Day {dayNum} of 7
            </Text>
          </View>
          <View className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 6,
                borderRadius: 9999,
                width: `${(dayNum / 7) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Hero Section — dark card with subtle energy glow */}
        <View className="px-4 py-2">
          <View className="relative min-h-[240px] overflow-hidden rounded-3xl border border-white/10 bg-card-elevated">
            <RadialGlow
              color={colors.primary.pink}
              size={200}
              style={{ top: -40, right: -40 }}
            />
            <RadialGlow
              color={colors.accent.yellow}
              size={160}
              style={{ bottom: -30, left: -30 }}
            />
            <View className="flex-1 justify-end p-8">
              <View className="mb-3 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-widest text-accent-yellow">
                  {empathyDay.badge}
                </Text>
              </View>
              <Text className="text-3xl font-bold leading-tight text-white">
                Day {dayNum}: {empathyDay.title}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Sections */}
        <View className="mt-8 gap-10 px-4">
          {/* Intention */}
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <MaterialIcons
                name="gps-fixed"
                size={20}
                color={colors.primary.pink}
              />
              <Text className="text-lg font-bold text-white">Intention</Text>
            </View>
            <View className="rounded-2xl border border-white/5 bg-card-elevated p-6">
              <Text className="text-xl italic font-medium leading-relaxed text-slate-200">
                {empathyDay.intention}
              </Text>
            </View>
          </View>

          {/* Challenge */}
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <MaterialIcons
                name="bolt"
                size={20}
                color={colors.accent.yellow}
              />
              <Text className="text-lg font-bold text-white">
                {empathyDay.challengeHeader ?? 'Today\u0027s Challenge'}
              </Text>
            </View>
            <Text className="text-base leading-relaxed text-slate-400">
              {empathyDay.challengeText}
            </Text>

            {/* Bullet points (Day 3) */}
            {empathyDay.challengeBullets && (
              <View className="mt-4 gap-3">
                {empathyDay.challengeBullets.map((bullet) => (
                  <View
                    key={bullet.text}
                    className="flex-row items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <MaterialIcons
                      name={bullet.icon}
                      size={20}
                      color={bullet.iconColor}
                    />
                    <Text className="flex-1 text-base leading-relaxed text-white">
                      {bullet.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Challenge cards (Day 7) */}
            {empathyDay.challengeCards && (
              <View className="mt-4 gap-3">
                {empathyDay.challengeCards.map((card) => (
                  <View
                    key={card.title}
                    className="gap-2 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-pink/20">
                        <MaterialIcons
                          name={card.icon}
                          size={20}
                          color={colors.primary.pink}
                        />
                      </View>
                      <Text className="text-base font-bold text-white">
                        {card.title}
                      </Text>
                    </View>
                    <Text className="text-sm leading-relaxed text-slate-400">
                      {card.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Highlighted quote */}
            {empathyDay.challengeHighlight && (
              <View className="mt-4 rounded-xl border-l-2 border-primary-pink bg-white/5 px-4 py-3">
                <Text className="text-base font-semibold italic leading-relaxed text-white">
                  {empathyDay.challengeHighlight}
                </Text>
              </View>
            )}
          </View>

          {/* Reflection */}
          <View>
            <View className="mb-4 flex-row items-center gap-2">
              <MaterialIcons
                name="edit-note"
                size={20}
                color={colors.primary.pink}
              />
              <Text className="text-lg font-bold text-white">Reflection</Text>
            </View>
            <View className="gap-3">
              <Text className="ml-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {empathyDay.reflectionLabel}
              </Text>
              <TextInput
                className="rounded-2xl border border-white/10 bg-card-elevated p-4 text-base text-white"
                placeholder={empathyDay.reflectionPlaceholder}
                placeholderTextColor={colors.slate[600]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={reflection}
                onChangeText={setReflection}
                style={{ minHeight: 100 }}
              />
            </View>
          </View>

          {/* D.O.S.E. Reward */}
          <View>
            <View className="mb-3 flex-row items-center justify-between px-1">
              <Text className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Daily D.O.S.E. Reward
              </Text>
              <Text className="text-[10px] font-black text-accent-yellow">
                EARNED ON COMPLETION
              </Text>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary-pink/20">
                  <MaterialIcons
                    name="favorite"
                    size={20}
                    color={colors.primary.pink}
                  />
                </View>
                <View>
                  <Text className="text-sm font-black text-white">+10</Text>
                  <Text className="text-[10px] font-bold uppercase text-slate-500">
                    Oxytocin
                  </Text>
                </View>
              </View>
              <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-accent-yellow/20">
                  <MaterialIcons
                    name="wb-sunny"
                    size={20}
                    color={colors.accent.yellow}
                  />
                </View>
                <View>
                  <Text className="text-sm font-black text-white">+5</Text>
                  <Text className="text-[10px] font-bold uppercase text-slate-500">
                    Serotonin
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Complete Button */}
          <View className="pt-4">
            <GradientButton
              onPress={handleComplete}
              loading={completeDay.isPending}
              disabled={!reflection.trim()}
              prefixIcon={
                <MaterialIcons name="check-circle" size={20} color="white" />
              }
            >
              {empathyDay.buttonLabel ?? `Complete Day ${dayNum}`}
            </GradientButton>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
