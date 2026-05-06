import { BackButton } from '@/components/ui/BackButton';
import { FloatingAddButton } from '@/components/ui/FloatingAddButton';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { DailyInsightCard } from '../components/DailyInsightCard';
import { EntryCard } from '../components/EntryCard';
import { JournalCalendar } from '../components/JournalCalendar';
import {
  useEntryDatesForMonth,
  useJournalEntriesForDate,
} from '../hooks/useJournalEntries';
import { useJournalLock } from '../hooks/useJournalLock';
import {
  journalUnlockedAtom,
  selectedDateAtom,
  selectedMonthAtom,
  selectedYearAtom,
} from '../store/journal';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = DAY_NAMES[d.getDay()]?.toUpperCase();
  const monthName = MONTH_SHORT[d.getMonth()];
  return `${dayName} • ${monthName} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function JournalDashboard() {
  const router = useRouter();
  const scheme = useScheme();
  const { lock } = useJournalLock();
  const isUnlocked = useAtomValue(journalUnlockedAtom);

  // Redirect to lock screen when journal gets locked (e.g. app backgrounded)
  useEffect(() => {
    if (!isUnlocked) {
      router.replace('/journal?autoUnlock=1');
    }
  }, []);

  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [month, setMonth] = useAtom(selectedMonthAtom);
  const [year, setYear] = useAtom(selectedYearAtom);

  const { data: entryDates } = useEntryDatesForMonth(month, year);
  const { data: entries } = useJournalEntriesForDate(selectedDate);

  const handleLock = () => {
    lock();
    router.replace('/journal');
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <>
      <Screen
        variant="default"
        scroll
        header={
          <View className="flex-row items-center justify-between px-4 py-2">
            <BackButton />
            <View className="items-center">
              <Text className="text-xl font-bold tracking-tight text-foreground">
                Private Journal
              </Text>
              <Text
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: accentFor(scheme, 'yellow') }}
              >
                Encrypted Reflections
              </Text>
            </View>
            <Pressable
              onPress={handleLock}
              className="h-10 w-10 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/20"
            >
              <MaterialIcons
                name="lock"
                size={22}
                color={colors.primary.pink}
              />
            </Pressable>
          </View>
        }
        className="px-4"
      >
        <JournalCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          entryDates={entryDates ?? []}
          month={month}
          year={year}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <DailyInsightCard onStart={() => router.push('/journal/new')} />

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
            {formatDateLabel(selectedDate)}
          </Text>
        </View>

        <View className="gap-3">
          {entries && entries.length > 0 ? (
            entries.map((entry) => (
              <EntryCard
                key={entry.id}
                title={entry.title}
                content={entry.content}
                createdAt={entry.createdAt}
                feeling={entry.feeling}
                tags={entry.tags}
                onPress={() => router.push(`/journal/${entry.id}`)}
              />
            ))
          ) : (
            <View className="items-center py-8">
              <Text className="text-sm text-foreground/30">
                No entries for this date
              </Text>
            </View>
          )}
        </View>
      </Screen>
      <FloatingAddButton onPress={() => router.push('/journal/new')} />
    </>
  );
}
