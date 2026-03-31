import { colors } from '@/constants/colors';
import { Text, View } from 'react-native';

interface ChapterQuoteProps {
  children: string;
}

export function ChapterQuote({ children }: ChapterQuoteProps) {
  return (
    <View
      className="my-6 rounded-xl border border-white/10 bg-white/5 p-5"
      style={{ borderLeftWidth: 4, borderLeftColor: colors.primary.pink }}
    >
      <Text
        className="text-base italic leading-relaxed text-white/70"
        style={{ fontFamily: 'serif' }}
      >
        {children}
      </Text>
    </View>
  );
}
