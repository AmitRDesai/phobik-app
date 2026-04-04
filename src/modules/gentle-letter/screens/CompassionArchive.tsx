import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { colors } from '@/constants/colors';

import {
  useLetterDatesForMonth,
  useLettersForDate,
  useListLetters,
} from '../hooks/useGentleLetter';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatCoreAct(act: string | null): string {
  if (!act) return '';
  return `Core Act: ${act.charAt(0).toUpperCase() + act.slice(1)}`;
}

function formatDate(dateStr: string): string {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) return 'Today';

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y!, m! - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CompassionArchive() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [calMonth, setCalMonth] = useState(() => now.getMonth() + 1);
  const [calYear, setCalYear] = useState(() => now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: letterDates } = useLetterDatesForMonth(calMonth, calYear);
  const { data: allLetters, isLoading: isLoadingAll } = useListLetters();
  const { data: filteredLetters, isLoading: isLoadingFiltered } =
    useLettersForDate(selectedDate);

  const letters = selectedDate ? filteredLetters : allLetters;
  const isLoading = selectedDate ? isLoadingFiltered : isLoadingAll;

  const datesWithLetters = new Set(letterDates ?? []);

  const prevMonth = () => {
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // Build calendar grid
  const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <View className="flex-1 bg-background-charcoal">
      {/* Header */}
      <View
        className="z-10 flex-row items-center justify-between px-4 py-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton />
        <Text className="text-lg font-bold text-white">
          My Compassion Archive
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar */}
        <View className="rounded-2xl border border-white/5 bg-card-elevated p-4">
          {/* Month Navigation */}
          <View className="mb-4 flex-row items-center justify-between">
            <Pressable onPress={prevMonth} className="rounded-full p-2">
              <MaterialIcons name="chevron-left" size={24} color="white" />
            </Pressable>
            <Text className="text-base font-bold text-white">
              {MONTHS[calMonth - 1]} {calYear}
            </Text>
            <Pressable onPress={nextMonth} className="rounded-full p-2">
              <MaterialIcons name="chevron-right" size={24} color="white" />
            </Pressable>
          </View>

          {/* Day Headers */}
          <View className="mb-2 flex-row">
            {DAY_LABELS.map((label, i) => (
              <View key={`day-${i}`} className="flex-1 items-center">
                <Text className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Date Grid */}
          <View className="flex-row flex-wrap">
            {calendarCells.map((day, i) => {
              const dateStr = day
                ? `${calYear}-${String(calMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                : null;
              const hasLetter = dateStr ? datesWithLetters.has(dateStr) : false;
              const isSelected = dateStr === selectedDate;
              const isFuture = dateStr ? dateStr > todayStr : false;

              return (
                <View
                  key={dateStr ?? `empty-${i}`}
                  className="w-[14.28%] items-center py-1"
                >
                  {day ? (
                    <Pressable
                      onPress={() =>
                        !isFuture &&
                        setSelectedDate(isSelected ? null : dateStr)
                      }
                      disabled={isFuture}
                      className="relative h-10 w-10 items-center justify-center"
                      style={{ opacity: isFuture ? 0.3 : 1 }}
                    >
                      {isSelected ? (
                        <View className="absolute inset-0 rounded-full bg-primary-pink" />
                      ) : hasLetter ? (
                        <View className="absolute inset-0 rounded-full border border-primary-pink/30 bg-primary-pink/20" />
                      ) : null}
                      <Text
                        className={`text-sm font-medium ${isSelected ? 'text-white' : hasLetter ? 'text-white' : 'text-slate-400'}`}
                      >
                        {day}
                      </Text>
                      {hasLetter && !isSelected && (
                        <MaterialIcons
                          name="favorite"
                          size={8}
                          color={colors.accent.yellow}
                          style={{ position: 'absolute', top: 4, right: 4 }}
                        />
                      )}
                    </Pressable>
                  ) : (
                    <View className="h-10 w-10" />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Letters */}
        <View className="mt-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">
              {selectedDate
                ? `Letters on ${formatDate(selectedDate)}`
                : 'Recent Letters'}
            </Text>
            {selectedDate && (
              <Pressable onPress={() => setSelectedDate(null)}>
                <Text className="text-sm font-semibold text-primary-pink">
                  Show All
                </Text>
              </Pressable>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary.pink} />
          ) : !letters?.length ? (
            <View className="items-center rounded-2xl border border-white/5 bg-card-elevated p-8">
              <MaterialIcons
                name="edit-note"
                size={40}
                color={colors.slate[600]}
              />
              <Text className="mt-3 text-center text-base text-slate-500">
                {selectedDate
                  ? 'No letters on this date.'
                  : 'No letters yet. Start your first gentle letter practice.'}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {letters.map((letter) => (
                <Pressable
                  key={letter.id}
                  onPress={() =>
                    router.push({
                      pathname: '/practices/gentle-letter/letter',
                      params: { id: letter.id },
                    })
                  }
                  className="flex-row overflow-hidden rounded-xl border border-white/5 bg-card-elevated"
                >
                  <View className="flex-1 gap-2 p-4">
                    <Text className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {formatDate(letter.entryDate)}
                    </Text>
                    <Text className="text-base font-bold text-white">
                      {letter.title}
                    </Text>
                    {letter.coreAct && (
                      <View className="self-start rounded-full border border-primary-pink/30 bg-primary-pink/20 px-2.5 py-1">
                        <Text className="text-[10px] font-bold uppercase tracking-tight text-primary-pink">
                          {formatCoreAct(letter.coreAct)}
                        </Text>
                      </View>
                    )}
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: '/practices/gentle-letter/letter',
                          params: { id: letter.id },
                        })
                      }
                      className="mt-1 flex-row items-center gap-1"
                    >
                      <Text className="text-sm font-medium text-white/80">
                        Read reflection
                      </Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={16}
                        color="rgba(255,255,255,0.8)"
                      />
                    </Pressable>
                  </View>

                  {/* Gradient thumbnail */}
                  <View className="w-24">
                    <LinearGradient
                      colors={[colors.primary.pink, colors.accent.yellow]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ flex: 1, opacity: 0.3 }}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Privacy Footer */}
        <View className="mt-8 flex-row items-center justify-center gap-2">
          <MaterialIcons name="lock" size={14} color={colors.slate[600]} />
          <Text className="text-center text-xs italic text-slate-600">
            Your archive is private and end-to-end encrypted.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
