import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { colors, withAlpha } from '@/constants/colors';

import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { PermissionStatus } from 'expo-calendar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { ActivityIndicator, Linking, Pressable } from 'react-native';
import { useCalendarPermission } from '../hooks/useCalendarPermission';
import {
  calendarConnectedAtom,
  checkInTimingAtom,
  selectedCalendarIdsAtom,
  supportToneAtom,
} from '../store/calendar';
import type { CheckInTiming, SupportTone } from '../types';

const TIMING_OPTIONS: { label: string; value: CheckInTiming }[] = [
  { label: '2 Days', value: '2-days' },
  { label: 'Day of', value: 'day-of' },
  { label: '1 Hour', value: '1-hour' },
];

const TONE_OPTIONS: {
  value: SupportTone;
  label: string;
  description: string;
}[] = [
  {
    value: 'gentle',
    label: 'Gentle',
    description: 'Soft nudges & breathing prompts.',
  },
  {
    value: 'subtle',
    label: 'Subtle',
    description: 'Minimalist reminders only.',
  },
  {
    value: 'direct',
    label: 'Direct',
    description: 'Clear, actionable preparation steps.',
  },
];

interface CalendarSettingsProps {
  /** Called when user taps "Maybe later" / "Skip for now" in disconnected state. If omitted, skip buttons are hidden. */
  onSkip?: () => void;
}

export function CalendarSettings({ onSkip }: CalendarSettingsProps) {
  const [connected, setConnected] = useAtom(calendarConnectedAtom);
  const [selectedIds, setSelectedIds] = useAtom(selectedCalendarIdsAtom);
  const [checkInTiming, setCheckInTiming] = useAtom(checkInTimingAtom);
  const [supportTone, setSupportTone] = useAtom(supportToneAtom);

  const { calendars, status, requestPermission, loading } =
    useCalendarPermission();

  const denied = status === PermissionStatus.DENIED;

  // Auto-load calendars when already connected
  useEffect(() => {
    if (connected) {
      requestPermission();
    }
  }, [connected, requestPermission]);

  const toggleCalendar = (stableId: string) => {
    setSelectedIds(
      selectedIds.includes(stableId)
        ? selectedIds.filter((i) => i !== stableId)
        : [...selectedIds, stableId],
    );
  };

  const handleConnect = async () => {
    const permStatus = await requestPermission();
    if (permStatus === PermissionStatus.GRANTED) {
      setConnected(true);
    }
  };

  return (
    <View className="gap-6">
      {/* Calendar feature card */}
      <Card className="items-center gap-4 p-6">
        {/* Centered gradient icon — matches RegulationPreference info chip pattern */}
        <View
          className="h-16 w-16 items-center justify-center overflow-hidden rounded-full"
          style={{
            boxShadow: `0 0 24px ${withAlpha(colors.primary.pink, 0.35)}`,
          }}
        >
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
          <MaterialIcons name="calendar-month" size={28} color="white" />
        </View>

        {/* Card content */}
        <View className="w-full gap-4">
          <View>
            <Text variant="h3" className="text-center font-bold">
              Calendar Intelligence
            </Text>
            <Text
              variant="sm"
              muted
              className="mt-2 text-center leading-relaxed"
            >
              We&apos;ll scan for high-stress keywords like &quot;Performance
              Review&quot; or &quot;Public Speaking&quot; to offer pre-emptive
              nervous system support.
            </Text>
          </View>

          {!connected && !denied && (
            <>
              <GradientButton
                onPress={handleConnect}
                loading={loading}
                icon={
                  <MaterialIcons
                    name="calendar-today"
                    size={18}
                    color="white"
                  />
                }
              >
                Connect my calendar
              </GradientButton>
              {onSkip && (
                <Pressable onPress={onSkip}>
                  <Text
                    variant="sm"
                    className="text-center font-medium text-foreground/55"
                  >
                    Maybe later
                  </Text>
                </Pressable>
              )}
            </>
          )}

          {!connected && denied && (
            <View className="gap-3">
              <Text variant="sm" muted className="leading-relaxed">
                Calendar access was denied. You can enable it in your device
                settings to let Phobik prepare you for stressful events.
              </Text>
              <GradientButton
                onPress={() => Linking.openSettings()}
                icon={<MaterialIcons name="settings" size={18} color="white" />}
              >
                Open Settings
              </GradientButton>
              {onSkip && (
                <Pressable onPress={onSkip}>
                  <Text
                    variant="sm"
                    className="text-center font-medium text-foreground/55"
                  >
                    Skip for now
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Card>

      {/* Post-connect sections */}
      {connected && (
        <View className="gap-6">
          {/* Calendar list from device */}
          <View>
            <View className="mb-3 flex-row items-center gap-2">
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.primary.pink}
              />
              <Text variant="lg" className="font-bold">
                Which calendars to watch?
              </Text>
            </View>
            {calendars.length === 0 ? (
              <Card className="items-center p-6">
                <ActivityIndicator color={colors.primary.pink} />
                <Text variant="sm" muted className="mt-2">
                  Loading calendars...
                </Text>
              </Card>
            ) : (
              <View className="gap-2">
                {calendars.map((cal) => {
                  const isSelected = selectedIds.includes(cal.stableId);
                  return (
                    <Card
                      key={cal.stableId}
                      onPress={() => toggleCalendar(cal.stableId)}
                      className="flex-row items-center justify-between"
                    >
                      <View className="flex-1 flex-row items-center gap-3">
                        <View
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cal.color }}
                        />
                        <View className="flex-1">
                          <Text
                            variant="md"
                            className="font-medium"
                            numberOfLines={1}
                          >
                            {cal.title}
                          </Text>
                          <Text
                            variant="sm"
                            className="text-foreground/55"
                            numberOfLines={1}
                          >
                            {cal.sourceName}
                          </Text>
                        </View>
                      </View>
                      <View
                        className={clsx(
                          'h-6 w-6 items-center justify-center rounded-full',
                          isSelected
                            ? 'bg-primary-pink'
                            : 'border-2 border-foreground/25',
                        )}
                      >
                        {isSelected && (
                          <MaterialIcons name="check" size={16} color="white" />
                        )}
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
          </View>

          {/* Check-in timing */}
          <View>
            <Text variant="lg" className="mb-3 font-bold">
              When should we check in?
            </Text>
            <SegmentedControl
              options={TIMING_OPTIONS}
              selected={checkInTiming}
              onSelect={setCheckInTiming}
            />
          </View>

          {/* Support tone */}
          <View>
            <Text variant="lg" className="mb-3 font-bold">
              Choose your support tone
            </Text>
            <View className="gap-3">
              {TONE_OPTIONS.map((option) => (
                <SelectionCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={supportTone === option.value}
                  onPress={() => setSupportTone(option.value)}
                  variant="radio"
                />
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
