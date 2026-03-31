import { Text } from 'react-native';

interface ChapterParagraphProps {
  children: string;
  bold?: boolean;
}

export function ChapterParagraph({ children, bold }: ChapterParagraphProps) {
  return (
    <Text
      className={`mb-6 text-base leading-relaxed text-white/80 ${bold ? 'font-semibold' : ''}`}
      style={{ fontFamily: 'serif' }}
    >
      {children}
    </Text>
  );
}
