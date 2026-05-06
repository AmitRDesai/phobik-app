import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { Text } from '@/components/themed/Text';

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
        className="text-base italic leading-relaxed text-foreground/70"
        style={{ fontFamily: 'serif' }}
      >
        {children}
      </Text>
    </Card>
  );
}
