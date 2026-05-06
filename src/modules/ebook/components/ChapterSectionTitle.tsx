import { Text } from '@/components/themed/Text';

interface ChapterSectionTitleProps {
  children: string;
}

export function ChapterSectionTitle({ children }: ChapterSectionTitleProps) {
  return (
    <Text className="mb-4 mt-10 text-2xl font-semibold text-foreground">
      {children}
    </Text>
  );
}
