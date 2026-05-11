import { Text } from '@/components/themed';

interface ChapterHeadingProps {
  label: string;
  title: string;
}

export function ChapterHeading({ label, title }: ChapterHeadingProps) {
  return (
    <Text size="h1" className="mb-8">
      {label}:{'\n'}
      {title}
    </Text>
  );
}
