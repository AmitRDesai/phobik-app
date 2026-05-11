import { Text } from '@/components/themed';

interface ChapterSectionTitleProps {
  children: string;
}

export function ChapterSectionTitle({ children }: ChapterSectionTitleProps) {
  return (
    <Text size="h2" className="mb-4 mt-10">
      {children}
    </Text>
  );
}
