import type { MaterialIcons } from '@expo/vector-icons';

export interface Device {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
}

export const DEVICES: Device[] = [
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    subtitle: 'Ready to pair',
    icon: 'watch',
  },
  {
    id: 'whoop',
    name: 'Whoop',
    subtitle: 'Search nearby',
    icon: 'fitness-center',
  },
  {
    id: 'oura-ring',
    name: 'Oura Ring',
    subtitle: 'Gen 3 / Horizon',
    icon: 'radio-button-checked',
  },
  {
    id: 'garmin',
    name: 'Garmin',
    subtitle: 'Fenix & Venu',
    icon: 'navigation',
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    subtitle: 'Versa & Charge',
    icon: 'show-chart',
  },
  {
    id: 'polar',
    name: 'Polar',
    subtitle: 'Vantage & Ignite',
    icon: 'directions-run',
  },
  {
    id: 'suunto',
    name: 'Suunto',
    subtitle: 'Peak & Vertical',
    icon: 'explore',
  },
  {
    id: 'wahoo',
    name: 'Wahoo',
    subtitle: 'Elemnt & Rival',
    icon: 'directions-bike',
  },
  {
    id: 'withings',
    name: 'Withings',
    subtitle: 'ScanWatch & Steel',
    icon: 'medical-services',
  },
];
