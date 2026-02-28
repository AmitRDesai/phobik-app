import * as Calendar from 'expo-calendar';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { calendarStableId, type DeviceCalendar } from '../types';

// Calendar types we want to exclude (iOS only)
const EXCLUDED_TYPES = new Set([
  Calendar.CalendarType.BIRTHDAYS,
  Calendar.CalendarType.SUBSCRIBED,
]);

function mapCalendars(raw: Calendar.Calendar[]): DeviceCalendar[] {
  return raw
    .filter((cal) => {
      // On iOS, filter out birthday/subscription calendars
      if (Platform.OS === 'ios' && cal.type && EXCLUDED_TYPES.has(cal.type)) {
        return false;
      }
      return true;
    })
    .map((cal) => ({
      id: cal.id,
      stableId: calendarStableId(
        cal.source?.type ?? 'unknown',
        cal.source?.name ?? 'Local',
        cal.title,
      ),
      title: cal.title,
      color: cal.color ?? '#888888',
      sourceName: cal.source?.name ?? 'Local',
      sourceType: cal.source?.type ?? 'unknown',
    }));
}

export function useCalendarPermission() {
  const [calendars, setCalendars] = useState<DeviceCalendar[]>([]);
  const [status, setStatus] = useState<Calendar.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    try {
      const { status: permStatus } =
        await Calendar.requestCalendarPermissionsAsync();
      setStatus(permStatus);

      if (permStatus === Calendar.PermissionStatus.GRANTED) {
        const raw = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        setCalendars(mapCalendars(raw));
      }

      return permStatus;
    } finally {
      setLoading(false);
    }
  }, []);

  return { calendars, status, requestPermission, loading };
}
