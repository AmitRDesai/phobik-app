import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { CalendarDay } from './CalendarDay';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
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

interface JournalCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  entryDates: string[];
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  // 0=Sun, 1=Mon, ..., 6=Sat → convert to Mon=0 format
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(year: number, month: number, day: number) {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function JournalCalendar({
  selectedDate,
  onSelectDate,
  entryDates,
  month,
  year,
  onPrevMonth,
  onNextMonth,
}: JournalCalendarProps) {
  const scheme = useScheme();
  const chevronColor = foregroundFor(scheme, 0.4);
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);
  const entryDateSet = new Set(entryDates);
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells: React.ReactNode[] = [];

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<View key={`empty-${i}`} />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const dayDate = new Date(year, month - 1, day);
    dayDate.setHours(0, 0, 0, 0);

    cells.push(
      <CalendarDay
        key={day}
        day={day}
        isSelected={dateStr === selectedDate}
        hasEntry={entryDateSet.has(dateStr)}
        isToday={dateStr === todayStr}
        isFuture={dayDate > today}
        onPress={() => onSelectDate(dateStr)}
      />,
    );
  }

  return (
    <View className="mb-4 mt-4">
      <View className="mb-3 flex-row items-center justify-between px-2">
        <Text size="lg" weight="bold">
          {MONTH_NAMES[month - 1]} {year}
        </Text>
        <View className="flex-row gap-4">
          <Pressable onPress={onPrevMonth} hitSlop={8}>
            <MaterialIcons name="chevron-left" size={24} color={chevronColor} />
          </Pressable>
          <Pressable onPress={onNextMonth} hitSlop={8}>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={chevronColor}
            />
          </Pressable>
        </View>
      </View>

      <View className="mb-1 flex-row">
        {DAY_LABELS.map((label) => (
          <View key={label} className="flex-1 items-center">
            <Text
              tone="tertiary"
              weight="bold"
              className="text-[9px] uppercase"
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell, idx) => (
          <View
            key={idx}
            className="items-center py-1"
            style={{ width: '14.28%' }}
          >
            {cell}
          </View>
        ))}
      </View>
    </View>
  );
}
