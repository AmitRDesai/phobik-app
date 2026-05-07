import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, TextInput } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
} from '@/constants/colors';
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
        <Header
          variant="close"
          center={
            <Text variant="caption" muted>
              Phobik
            </Text>
          }
        />
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
          <Text variant="sm" className="font-semibold text-foreground/80">
            7-Day Empathy Challenge
          </Text>
          <Text variant="caption" className="text-primary-pink">
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
              withAlpha(colors.primary.pink, 0.15),
              'transparent',
              withAlpha(colors.accent.yellow, 0.1),
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
              <Text variant="caption" style={{ color: yellow }}>
                {empathyDay.badge}
              </Text>
            </View>
            <Text variant="h1">
              Day {dayNum}: {empathyDay.title}
            </Text>
            <Text variant="sm" className="mt-2 text-foreground/60">
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
          <Card variant="surface" className="p-6">
            <Text
              variant="lg"
              className="italic leading-relaxed text-foreground/85"
            >
              {empathyDay.intention}
            </Text>
          </Card>
        </View>

        <View>
          <SectionHeader
            icon="bolt"
            iconColor={yellow}
            title={empathyDay.challengeHeader ?? "Today's Challenge"}
          />

          <View className="gap-6">
            <Text variant="md" className="leading-relaxed text-foreground/65">
              {empathyDay.challengeText}
            </Text>

            {empathyDay.challengeHighlight && (
              <Card variant="toned" tone="pink" className="px-5 py-4">
                <Text
                  variant="md"
                  className="font-medium italic leading-relaxed"
                >
                  {empathyDay.challengeHighlight}
                </Text>
              </Card>
            )}

            {empathyDay.challengeBullets && (
              <View className="gap-3">
                {empathyDay.challengeBullets.map((bullet) => (
                  <Card
                    key={bullet.text}
                    variant="surface"
                    className="flex-row items-center gap-3 px-4 py-3.5"
                  >
                    <IconChip size="md" shape="circle">
                      <MaterialIcons
                        name={bullet.icon}
                        size={18}
                        color={bullet.iconColor}
                      />
                    </IconChip>
                    <Text variant="md" className="flex-1 leading-relaxed">
                      {bullet.text}
                    </Text>
                  </Card>
                ))}
              </View>
            )}

            {empathyDay.challengeCards && (
              <View className="gap-3">
                {empathyDay.challengeCards.map((card, i) => (
                  <Card
                    key={card.title}
                    variant="surface"
                    className="gap-3 p-5"
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
                        <Text variant="caption" muted>
                          Step {i + 1}
                        </Text>
                        <Text variant="md" className="font-bold">
                          {card.title}
                        </Text>
                      </View>
                    </View>
                    <Text
                      variant="sm"
                      className="leading-relaxed text-foreground/65"
                    >
                      {card.description}
                    </Text>
                  </Card>
                ))}
              </View>
            )}

            <View className="gap-2.5">
              <Text variant="caption" muted className="ml-1">
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
            <Text variant="caption" muted>
              Daily D.O.S.E. Reward
            </Text>
            <Text variant="caption" style={{ color: yellow }}>
              EARNED ON COMPLETION
            </Text>
          </View>
          <View className="flex-row gap-3">
            <DoseCard
              icon="favorite"
              iconBgColor={withAlpha(colors.primary.pink, 0.2)}
              iconColor={colors.primary.pink}
              value="+10"
              label="Oxytocin"
            />
            <DoseCard
              icon="wb-sunny"
              iconBgColor={withAlpha(yellow, 0.2)}
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
      <Text variant="h3" className="font-bold">
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
    <Card variant="surface" className="flex-1 flex-row items-center gap-3">
      <IconChip size="md" shape="circle" bg={iconBgColor}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </IconChip>
      <View>
        <Text variant="sm" className="font-black">
          {value}
        </Text>
        <Text variant="caption" muted>
          {label}
        </Text>
      </View>
    </Card>
  );
}
