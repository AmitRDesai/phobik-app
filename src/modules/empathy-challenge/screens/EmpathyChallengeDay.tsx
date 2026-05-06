import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
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
  const scheme = useScheme();
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

  const yellow = accentFor(scheme, 'yellow');

  return (
    <Screen
      variant="default"
      scroll
      keyboard
      header={
        <View className="flex-row items-center justify-between px-4 py-2">
          <BackButton icon="close" />
          <Text className="flex-1 text-center text-xs font-bold uppercase tracking-[3px] text-foreground/55">
            Phobik
          </Text>
          <View className="w-10" />
        </View>
      }
      sticky={
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
      }
      className=""
    >
      <View className="gap-2 px-5 py-4">
        <View className="flex-row items-end justify-between">
          <Text className="text-sm font-semibold text-foreground/80">
            7-Day Empathy Challenge
          </Text>
          <Text className="text-xs font-bold uppercase tracking-wider text-primary-pink">
            Day {dayNum} of 7
          </Text>
        </View>
        <View className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
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

      <View className="px-5 py-2">
        <View className="relative min-h-[220px] overflow-hidden rounded-3xl border border-foreground/10 bg-surface-elevated">
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
            <View className="mb-3 self-start rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5">
              <Text
                className="text-[10px] font-bold uppercase tracking-[2px]"
                style={{ color: yellow }}
              >
                {empathyDay.badge}
              </Text>
            </View>
            <Text className="text-[28px] font-bold leading-tight text-foreground">
              Day {dayNum}: {empathyDay.title}
            </Text>
            <Text className="mt-2 text-sm text-foreground/60">
              {empathyDay.subtitle}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-6 gap-8 px-5">
        <View>
          <SectionHeader
            icon="gps-fixed"
            iconColor={colors.primary.pink}
            title="Intention"
          />
          <View className="rounded-2xl border border-foreground/5 bg-surface-elevated p-6">
            <Text className="text-lg italic leading-relaxed text-foreground/85">
              {empathyDay.intention}
            </Text>
          </View>
        </View>

        <View>
          <SectionHeader
            icon="bolt"
            iconColor={yellow}
            title={empathyDay.challengeHeader ?? "Today's Challenge"}
          />

          <View className="gap-6">
            <Text className="text-base leading-relaxed text-foreground/65">
              {empathyDay.challengeText}
            </Text>

            {empathyDay.challengeHighlight && (
              <View className="rounded-2xl border border-primary-pink/20 bg-primary-pink/[0.06] px-5 py-4">
                <Text className="text-base font-medium italic leading-relaxed text-foreground">
                  {empathyDay.challengeHighlight}
                </Text>
              </View>
            )}

            {empathyDay.challengeBullets && (
              <View className="gap-3">
                {empathyDay.challengeBullets.map((bullet) => (
                  <View
                    key={bullet.text}
                    className="flex-row items-center gap-3 rounded-2xl border border-foreground/5 bg-surface-elevated px-4 py-3.5"
                  >
                    <View className="h-9 w-9 items-center justify-center rounded-full bg-foreground/5">
                      <MaterialIcons
                        name={bullet.icon}
                        size={18}
                        color={bullet.iconColor}
                      />
                    </View>
                    <Text className="flex-1 text-[15px] leading-relaxed text-foreground">
                      {bullet.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {empathyDay.challengeCards && (
              <View className="gap-3">
                {empathyDay.challengeCards.map((card, i) => (
                  <View
                    key={card.title}
                    className="gap-3 rounded-2xl border border-foreground/5 bg-surface-elevated p-5"
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
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-foreground/55">
                          Step {i + 1}
                        </Text>
                        <Text className="text-base font-bold text-foreground">
                          {card.title}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm leading-relaxed text-foreground/65">
                      {card.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View className="gap-2.5">
              <Text className="ml-1 text-[10px] font-bold uppercase tracking-[1.5px] text-foreground/55">
                {empathyDay.reflectionLabel}
              </Text>
              <TextInput
                className="rounded-2xl border border-foreground/10 bg-surface-elevated p-4 text-base leading-relaxed text-foreground"
                placeholder={empathyDay.reflectionPlaceholder}
                placeholderTextColor={foregroundFor(scheme, 0.35)}
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

        <View>
          <View className="mb-3 flex-row items-center justify-between px-1">
            <Text className="text-[11px] font-bold uppercase tracking-wider text-foreground/55">
              Daily D.O.S.E. Reward
            </Text>
            <Text className="text-[10px] font-black" style={{ color: yellow }}>
              EARNED ON COMPLETION
            </Text>
          </View>
          <View className="flex-row gap-3">
            <DoseCard
              icon="favorite"
              iconBgColor={`${colors.primary.pink}33`}
              iconColor={colors.primary.pink}
              value="+10"
              label="Oxytocin"
            />
            <DoseCard
              icon="wb-sunny"
              iconBgColor={`${yellow}33`}
              iconColor={yellow}
              value="+5"
              label="Serotonin"
            />
          </View>
        </View>
      </View>
    </Screen>
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
      <Text className="text-lg font-bold tracking-tight text-foreground">
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
    <View className="flex-1 flex-row items-center gap-3 rounded-2xl border border-foreground/5 bg-surface-elevated p-4">
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBgColor }}
      >
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View>
        <Text className="text-sm font-black text-foreground">{value}</Text>
        <Text className="text-[10px] font-bold uppercase text-foreground/55">
          {label}
        </Text>
      </View>
    </View>
  );
}
