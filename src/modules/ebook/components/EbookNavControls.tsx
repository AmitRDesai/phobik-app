import { Pressable, Text, View } from '@/components/themed';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EbookNavControlsProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToc: () => void;
  onFinish?: () => void;
}

export function EbookNavControls({
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onToc,
  onFinish,
}: EbookNavControlsProps) {
  const insets = useSafeAreaInsets();
  const scheme = useScheme();
  const fg = foregroundFor(scheme, 1);
  const isLastChapter = !hasNext && onFinish;

  return (
    <View
      className="z-10 flex-row items-center justify-between border-t border-foreground/10 bg-surface px-6 py-4"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <Pressable
        onPress={onPrev}
        disabled={!hasPrev}
        className="items-center gap-1"
        style={{ opacity: hasPrev ? 1 : 0.3 }}
      >
        <MaterialIcons name="chevron-left" size={28} color={fg} />
        <Text size="xs" treatment="caption" tone="secondary">
          Previous
        </Text>
      </Pressable>

      <Pressable
        onPress={onToc}
        className="h-12 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 active:scale-95"
      >
        <MaterialIcons name="menu-book" size={24} color={fg} />
      </Pressable>

      {isLastChapter ? (
        <Pressable onPress={onFinish} className="items-center gap-1">
          <MaterialIcons name="check-circle" size={28} color="#0bda8e" />
          <Text size="xs" treatment="caption" tone="success">
            Finish
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={onNext}
          disabled={!hasNext}
          className="items-center gap-1"
          style={{ opacity: hasNext ? 1 : 0.3 }}
        >
          <MaterialIcons name="chevron-right" size={28} color={fg} />
          <Text size="xs" treatment="caption" tone="secondary">
            Next
          </Text>
        </Pressable>
      )}
    </View>
  );
}
