import { ChipSelect } from '@/components/ui/ChipSelect';

const ALL = 'all';

const CIRCLES = [
  { label: 'All Stories', value: ALL },
  { label: '18-24', value: '18-24' },
  { label: '25-34', value: '25-34' },
  { label: '35-44', value: '35-44' },
  { label: '45-54', value: '45-54' },
  { label: '55+', value: '55+' },
] as const;

interface FilterChipsProps {
  selected: string | undefined;
  onSelect: (circle: string | undefined) => void;
}

export function FilterChips({ selected, onSelect }: FilterChipsProps) {
  return (
    <ChipSelect
      options={[...CIRCLES]}
      value={[selected ?? ALL]}
      onChange={(next) => onSelect(next[0] === ALL ? undefined : next[0])}
      multi={false}
      layout="scroll"
      variant="gradient"
    />
  );
}
