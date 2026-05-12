import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { CalendarSettings } from '@/modules/calendar/components/CalendarSettings';

export default function Calendar() {
  return (
    <Screen scroll header={<Header title="Calendar" />} className="px-4">
      <CalendarSettings />
    </Screen>
  );
}
