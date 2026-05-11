import { Text } from '@/components/themed';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

interface ChapterQuoteProps {
  children: string;
}

export function ChapterQuote({ children }: ChapterQuoteProps) {
  return (
    <Card
      className="my-6 p-5"
      style={{ borderLeftWidth: 4, borderLeftColor: colors.primary.pink }}
    >
      <Text
        size="md"
        tone="secondary"
        italic
        className="leading-relaxed"
        style={{ fontFamily: 'serif' }}
      >
        {children}
      </Text>
    </Card>
  );
}
