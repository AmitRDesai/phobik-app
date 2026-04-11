import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { scheduleEmpathyChallengeReminder } from '@/lib/notifications';
import { dialog } from '@/utils/dialog';

import { useNotificationSettings } from '@/modules/settings/hooks/useNotificationSettings';

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
  const { data: notifSettings } = useNotificationSettings();
  const [reflection, setReflection] = useState('');

  const dayNum = Number(dayNumber);
  const empathyDay = EMPATHY_DAYS.find((d) => d.day === dayNum);

  // Mark day as in_progress when screen opens
  useEffect(() => {
    if (dayId) {
      startDay.mutate({ dayId });
    }
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
        completeDay.mutate({ dayId, reflection: reflection.trim() });
        router.replace('/practices/empathy-challenge/complete');
      } else {
        await completeDay.mutateAsync({ dayId, reflection: reflection.trim() });
        if (notifSettings.challengeNotifications) {
          scheduleEmpathyChallengeReminder(dayNum + 1).catch(console.error);
        }
        router.back();
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
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.08}
        radius={0.3}
        intensity={0.5}
        bgClassName="bg-background-charcoal"
      />

      {/* Header */}
      <View
        className="z-10 flex-row items-center justify-between px-4 py-3"
        style={{ paddingTop: insets.top + 4 }}
      >
        <BackButton icon="close" />
        <Text className="flex-1 text-center text-xs font-bold uppercase tracking-[3px] text-slate-500">
          Phobik
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
        <View className="gap-2 px-5 py-4">
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

        {/* Hero Section */}
        <View className="px-5 py-2">
          <View className="relative min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-card-elevated">
            {/* Gradient overlays */}
            <LinearGradient
              colors={[
                'rgba(244, 114, 182, 0.15)',
                'transparent',
                'rgba(251, 191, 36, 0.1)',
              ]}
              start={{ x: 0.7, y: 0 }}
              end={{ x: 0.2, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <View className="flex-1 justify-end p-7">
              <View className="mb-3 self-start rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Text className="text-[10px] font-bold uppercase tracking-[2px] text-accent-yellow">
                  {empathyDay.badge}
                </Text>
              </View>
              <Text className="text-[28px] font-bold leading-tight text-white">
                Day {dayNum}: {empathyDay.title}
              </Text>
              <Text className="mt-2 text-sm text-slate-400">
                {empathyDay.subtitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Content Sections */}
        <View className="mt-6 gap-8 px-5">
          {/* Intention */}
          <View>
            <SectionHeader
              icon="gps-fixed"
              iconColor={colors.primary.pink}
              title="Intention"
            />
            <View className="rounded-2xl border border-white/5 bg-card-elevated p-6">
              <Text className="text-lg italic leading-relaxed text-slate-200">
                {empathyDay.intention}
              </Text>
            </View>
          </View>

          {/* Challenge + Reflection (combined flow) */}
          <View>
            <SectionHeader
              icon="bolt"
              iconColor={colors.accent.yellow}
              title={empathyDay.challengeHeader ?? "Today's Challenge"}
            />

            <View className="gap-6">
              <Text className="text-base leading-relaxed text-slate-400">
                {empathyDay.challengeText}
              </Text>

              {/* Highlighted quote */}
              {empathyDay.challengeHighlight && (
                <View className="rounded-2xl border border-primary-pink/20 bg-primary-pink/[0.06] px-5 py-4">
                  <Text className="text-base font-medium italic leading-relaxed text-white">
                    {empathyDay.challengeHighlight}
                  </Text>
                </View>
              )}

              {/* Bullet points (Day 3) */}
              {empathyDay.challengeBullets && (
                <View className="gap-3">
                  {empathyDay.challengeBullets.map((bullet) => (
                    <View
                      key={bullet.text}
                      className="flex-row items-center gap-3 rounded-2xl border border-white/5 bg-card-elevated px-4 py-3.5"
                    >
                      <View className="h-9 w-9 items-center justify-center rounded-full bg-white/5">
                        <MaterialIcons
                          name={bullet.icon}
                          size={18}
                          color={bullet.iconColor}
                        />
                      </View>
                      <Text className="flex-1 text-[15px] leading-relaxed text-white">
                        {bullet.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Challenge cards (Day 7) */}
              {empathyDay.challengeCards && (
                <View className="gap-3">
                  {empathyDay.challengeCards.map((card, i) => (
                    <View
                      key={card.title}
                      className="gap-3 rounded-2xl border border-white/5 bg-card-elevated p-5"
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
                          <MaterialIcons
                            name={card.icon}
                            size={20}
                            color="white"
                          />
                        </LinearGradient>
                        <View>
                          <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Step {i + 1}
                          </Text>
                          <Text className="text-base font-bold text-white">
                            {card.title}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-sm leading-relaxed text-slate-400">
                        {card.description}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Reflection (inline with challenge — no separate section) */}
              <View className="gap-2.5">
                <Text className="ml-1 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                  {empathyDay.reflectionLabel}
                </Text>
                <TextInput
                  className="rounded-2xl border border-white/10 bg-card-elevated p-4 text-base leading-relaxed text-white"
                  placeholder={empathyDay.reflectionPlaceholder}
                  placeholderTextColor={colors.slate[600]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={reflection}
                  onChangeText={setReflection}
                  style={{ minHeight: 110 }}
                />
              </View>
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
              <DoseCard
                icon="favorite"
                iconBgColor="bg-primary-pink/20"
                iconColor={colors.primary.pink}
                value="+10"
                label="Oxytocin"
              />
              <DoseCard
                icon="wb-sunny"
                iconBgColor="bg-accent-yellow/20"
                iconColor={colors.accent.yellow}
                value="+5"
                label="Serotonin"
              />
            </View>
          </View>

          {/* Complete Button */}
          <View className="pb-4 pt-2">
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

function SectionHeader({
  icon,
  iconColor,
  title,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  title: string;
}) {
  return (
    <View className="mb-4 flex-row items-center gap-2.5">
      <MaterialIcons name={icon} size={20} color={iconColor} />
      <Text className="text-lg font-bold tracking-tight text-white">
        {title}
      </Text>
    </View>
  );
}

function DoseCard({
  icon,
  iconBgColor,
  iconColor,
  value,
  label,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  value: string;
  label: string;
}) {
  return (
    <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-white/5 bg-card-elevated p-4">
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}
      >
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View>
        <Text className="text-sm font-black text-white">{value}</Text>
        <Text className="text-[10px] font-bold uppercase text-slate-500">
          {label}
        </Text>
      </View>
    </View>
  );
}
