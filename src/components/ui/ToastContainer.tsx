import { Text } from '@/components/themed/Text';
import { toastAtom, type ToastType } from '@/store/toast';
import { toast } from '@/utils/toast';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { EaseView } from 'react-native-ease';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TYPE_CONFIG: Record<
  ToastType,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  success: { icon: 'checkmark-circle', color: colors.status.success },
  info: { icon: 'information-circle', color: colors.primary.pink },
  warning: { icon: 'alert-circle', color: colors.status.warning },
  error: { icon: 'close-circle', color: colors.status.danger },
};

/**
 * Singleton toast renderer. Mount once at the app root (above DialogContainer
 * so toasts can sit on top of dialogs if they happen to overlap). Reads the
 * `toastAtom` and animates a single toast in/out — newer toasts replace
 * older ones.
 */
export function ToastContainer() {
  const scheme = useScheme();
  const insets = useSafeAreaInsets();
  const current = useAtomValue(toastAtom);

  // Keep the last toast rendered during the exit animation.
  const [renderState, setRenderState] = useState(current);
  useEffect(() => {
    if (current) {
      setRenderState(current);
    } else if (renderState) {
      const t = setTimeout(() => setRenderState(null), 220);
      return () => clearTimeout(t);
    }
  }, [current, renderState]);

  if (!renderState) return null;

  const cfg = TYPE_CONFIG[renderState.type];
  const isOpen = !!current;
  const bg =
    scheme === 'dark' ? withAlpha('#1f1f1f', 0.95) : withAlpha('#ffffff', 0.98);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        bottom: Math.max(insets.bottom, 16) + 8,
        left: 16,
        right: 16,
        alignItems: 'center',
      }}
    >
      <EaseView
        initialAnimate={{ opacity: 0, translateY: 24 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          translateY: isOpen ? 0 : 24,
        }}
        transition={{
          type: 'timing',
          duration: isOpen ? 220 : 180,
          easing: [0.455, 0.03, 0.515, 0.955],
        }}
        style={{ maxWidth: 420, width: '100%' }}
      >
        <Pressable
          onPress={() => toast.dismiss()}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          className="flex-row items-center gap-3 rounded-2xl border border-foreground/10 px-4 py-3"
          style={{
            backgroundColor: bg,
            boxShadow: `0 8px 24px ${withAlpha(foregroundFor(scheme, 1), scheme === 'dark' ? 0.5 : 0.12)}`,
          }}
        >
          <Ionicons name={cfg.icon} size={20} color={cfg.color} />
          <View className="flex-1">
            <Text size="sm" weight="semibold" numberOfLines={2}>
              {renderState.message}
            </Text>
            {renderState.description ? (
              <Text
                size="xs"
                tone="secondary"
                numberOfLines={2}
                className="mt-0.5"
              >
                {renderState.description}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </EaseView>
    </View>
  );
}
