import type { MaterialIcons } from '@expo/vector-icons';
import { colors } from './colors';

export type Chemical = 'endorphins' | 'dopamine' | 'serotonin' | 'oxytocin';

type IconName = keyof typeof MaterialIcons.glyphMap;

/** Canonical color per D.O.S.E. chemical. Used across dashboard + insights. */
export const CHEMICAL_COLORS: Record<Chemical, string> = {
  endorphins: colors.primary.pink,
  dopamine: colors.accent.orange,
  serotonin: colors.accent.yellow,
  oxytocin: colors.accent.purple,
};

/** Canonical Material icon per D.O.S.E. chemical. */
export const CHEMICAL_ICONS: Record<Chemical, IconName> = {
  endorphins: 'bolt',
  dopamine: 'auto-awesome',
  serotonin: 'wb-sunny',
  oxytocin: 'favorite',
};
