import { MaterialIcons } from '@expo/vector-icons';

export type PhaseAccent = 'pink' | 'yellow';

export interface FlightPhase {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  accent: PhaseAccent;
}

export const FLIGHT_PHASES: FlightPhase[] = [
  {
    id: 'before-airport',
    label: 'Before the Airport',
    icon: 'home',
    accent: 'pink',
  },
  {
    id: 'at-airport',
    label: 'At the Airport',
    icon: 'apartment',
    accent: 'yellow',
  },
  {
    id: 'once-seated',
    label: 'Once Seated',
    icon: 'airline-seat-recline-normal',
    accent: 'pink',
  },
  {
    id: 'during-takeoff',
    label: 'During Takeoff',
    icon: 'flight-takeoff',
    accent: 'yellow',
  },
  {
    id: 'during-turbulence',
    label: 'During Turbulence',
    icon: 'air',
    accent: 'pink',
  },
  {
    id: 'during-landing',
    label: 'During Landing',
    icon: 'flight-land',
    accent: 'yellow',
  },
];
