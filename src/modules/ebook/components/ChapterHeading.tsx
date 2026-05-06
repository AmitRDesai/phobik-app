import { Text } from '@/components/themed/Text';

interface ChapterHeadingProps {
  label: string;
  title: string;
}

export function ChapterHeading({ label, title }: ChapterHeadingProps) {
  return (
    <Text className="mb-8 text-3xl font-bold leading-tight text-foreground">
      {label}:{'\n'}
      {title}
    </Text>
  );
}
