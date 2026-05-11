import { Text } from '@/components/themed';
import { clsx } from 'clsx';

interface ChapterParagraphProps {
  children: string;
  bold?: boolean;
}

export function ChapterParagraph({ children, bold }: ChapterParagraphProps) {
  return (
    <Text
      size="md"
      tone="secondary"
      className={clsx('mb-6 leading-relaxed', bold && 'font-semibold')}
      style={{ fontFamily: 'serif' }}
    >
      {children}
    </Text>
  );
}
