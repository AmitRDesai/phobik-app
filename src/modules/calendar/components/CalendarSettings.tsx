import { BlurView } from '@/components/ui/BlurView';
import { GradientButton } from '@/components/ui/GradientButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { PermissionStatus } from 'expo-calendar';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
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
      <View className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
        {/* Hero gradient */}
        <View className="h-36 items-center justify-center">
          <LinearGradient
            colors={['#4a1040', '#6b2450', '#8b4020', '#a06020']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />
          <View
            className="items-center justify-center overflow-hidden rounded-2xl border border-white/30 p-4"
            style={{ backgroundColor: alpha.white35 }}
          >
            <BlurView intensity={20} tint="dark" className="absolute inset-0" />
            <MaskedView
              maskElement={
                <MaterialIcons name="calendar-month" size={48} color="black" />
              }
            >
              <LinearGradient
                colors={[
                  colors.primary.pink,
                  colors.gradient['orange-red'],
                  colors.accent.yellow,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 48, height: 48 }}
              />
            </MaskedView>
          </View>
        </View>

        {/* Card content */}
        <View className="gap-4 p-5">
          <View>
            <Text className="text-xl font-bold text-white">
              Calendar Intelligence
            </Text>
            <Text className="mt-2 text-sm leading-relaxed text-primary-muted">
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
                  <Text className="text-center text-sm font-medium text-white/40">
                    Maybe later
                  </Text>
                </Pressable>
              )}
            </>
          )}

          {!connected && denied && (
            <View className="gap-3">
              <Text className="text-sm leading-relaxed text-white/60">
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
                  <Text className="text-center text-sm font-medium text-white/40">
                    Skip for now
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>

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
              <Text className="text-base font-bold text-white">
                Which calendars to watch?
              </Text>
            </View>
            {calendars.length === 0 ? (
              <View className="items-center rounded-xl border border-white/5 bg-white/5 p-6">
                <ActivityIndicator color={colors.primary.pink} />
                <Text className="mt-2 text-sm text-white/40">
                  Loading calendars...
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {calendars.map((cal) => {
                  const isSelected = selectedIds.includes(cal.stableId);
                  return (
                    <Pressable
                      key={cal.stableId}
                      onPress={() => toggleCalendar(cal.stableId)}
                    >
                      <View className="flex-row items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                        <View className="flex-1 flex-row items-center gap-3">
                          <View
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: cal.color }}
                          />
                          <View className="flex-1">
                            <Text
                              className="font-medium text-white"
                              numberOfLines={1}
                            >
                              {cal.title}
                            </Text>
                            <Text
                              className="text-xs text-white/40"
                              numberOfLines={1}
                            >
                              {cal.sourceName}
                            </Text>
                          </View>
                        </View>
                        <View
                          className={`h-6 w-6 items-center justify-center rounded-full ${
                            isSelected
                              ? 'bg-primary-pink'
                              : 'border-2 border-white/20'
                          }`}
                        >
                          {isSelected && (
                            <MaterialIcons
                              name="check"
                              size={16}
                              color="white"
                            />
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Check-in timing */}
          <View>
            <Text className="mb-3 text-base font-bold text-white">
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
            <Text className="mb-3 text-base font-bold text-white">
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
