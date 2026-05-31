import { PermissionStatus } from 'expo';
import * as Calendar from 'expo-calendar';
import { useState } from 'react';
import { Platform } from 'react-native';
import { calendarStableId, type DeviceCalendar } from '../types';

// Calendar types we want to exclude (iOS only)
const EXCLUDED_TYPES = new Set([
  Calendar.CalendarType.BIRTHDAYS,
  Calendar.CalendarType.SUBSCRIBED,
]);

function mapCalendars(raw: Calendar.ExpoCalendar[]): DeviceCalendar[] {
  const result: DeviceCalendar[] = [];
  for (const cal of raw) {
    // On iOS, filter out birthday/subscription calendars
    if (Platform.OS === 'ios' && cal.type && EXCLUDED_TYPES.has(cal.type)) {
      continue;
    }
    result.push({
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
    });
  }
  return result;
}

export function useCalendarPermission() {
  const [calendars, setCalendars] = useState<DeviceCalendar[]>([]);
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status: permStatus } =
        await Calendar.requestCalendarPermissions();
      setStatus(permStatus);

      if (permStatus === PermissionStatus.GRANTED) {
        const raw = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
        setCalendars(mapCalendars(raw));
      }

      return permStatus;
    } finally {
      setLoading(false);
    }
  };

  return { calendars, status, requestPermission, loading };
}
