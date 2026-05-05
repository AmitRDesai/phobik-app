import { GlowBg } from '@/components/ui/GlowBg';
import { FADE_HEIGHT } from '@/components/ui/ScrollFade';
import { variantConfig, type Variant } from '@/components/variant-config';
import { VariantProvider } from '@/components/variant-context';
import { withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useSegments } from 'expo-router';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ScrollViewProps,
} from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ScreenProps {
  /** Background variant. Default: 'default'. */
  variant?: Variant;
  /** Wrap body in a ScrollView. Default: false. */
  scroll?: boolean;
  /** Wrap body in KeyboardAvoidingView. Default: false. */
  keyboard?: boolean;
  /** Pinned header rendered above the body. */
  header?: ReactNode;
  /** Sticky CTA slot rendered absolutely at the bottom; rises with keyboard. */
  sticky?: ReactNode;
  /** Show bottom scroll fade. Default: true when scroll is true. */
  fade?: boolean;
  /** Apply top safe-area inset. Default: true. */
  insetTop?: boolean;
  /** Apply bottom safe-area inset. Default: !inTabs && !modal (auto-detected). */
  insetBottom?: boolean;
  /** Modal presentation tweaks bottom inset behavior. */
  presentation?: 'modal';
  /** Body padding/layout className. Default: 'px-screen-x pt-screen-y'. */
  className?: string;
  /** ScrollView contentContainer className when scroll is true. */
  contentClassName?: string;
  /** Forward props to the inner ScrollView (when scroll is true). */
  scrollViewProps?: Omit<
    ScrollViewProps,
    'contentContainerStyle' | 'contentContainerClassName'
  >;
  children: ReactNode;
}

const DEFAULT_BODY_PADDING = 'px-screen-x pt-screen-y';

/**
 * Screen primitive — the keystone of the design system.
 *
 * Owns: safe-area insets (top/bottom, theme-aware bg), background variant
 * + glow, optional ScrollView with auto-calculated bottom padding, scroll
 * fade matching the screen background, sticky CTA that rises with the
 * keyboard, optional pinned header.
 *
 * Tab screens auto-skip the bottom inset (the TabBar handles it). Modal
 * screens (`presentation="modal"`) also skip bottom inset.
 *
 * Variants apply via React context — descendants read via `useVariant()`.
 */
export function Screen({
  variant = 'default',
  scroll = false,
  keyboard = false,
  header,
  sticky,
  fade,
  insetTop = true,
  insetBottom,
  presentation,
  className,
  contentClassName,
  scrollViewProps,
  children,
}: ScreenProps) {
  const segments = useSegments() as string[];
  const inTabs = segments.some((s) => s === '(tabs)');
  const isModal = presentation === 'modal';

  const resolvedInsetBottom = insetBottom ?? (!inTabs && !isModal);
  const showFade = fade ?? scroll;

  const scheme = useScheme();
  const v = variantConfig[variant][scheme];
  const insets = useSafeAreaInsets();

  // Sticky height is measured at runtime so scroll content reserves the
  // exact amount needed — no fixed estimate, no last-row clipping.
  const [stickyHeight, setStickyHeight] = useState(0);
  const onStickyLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setStickyHeight((prev) => (prev === h ? prev : h));
  }, []);

  // When the fade is on, it sits flush with the bottom of the screen and
  // covers the safe-area inset region (the gradient starts transparent and
  // ends in bg color, so the home-indicator area stays visually solid).
  // Reserve scroll padding equal to the larger of FADE_HEIGHT and
  // insets.bottom — they don't stack.
  const bottomReserve =
    stickyHeight +
    (showFade ? FADE_HEIGHT : resolvedInsetBottom ? insets.bottom : 0);

  const bodyPaddingClass = className ?? DEFAULT_BODY_PADDING;

  // Stable references — both contentContainerStyle and the root style array
  // are re-checked by identity by their consumers.
  const scrollContentStyle = useMemo(
    () => ({ paddingBottom: bottomReserve }),
    [bottomReserve],
  );

  const rootStyle = useMemo(
    () => [
      styles.root,
      { backgroundColor: v.bgHex },
      v.vars,
      insetTop && { paddingTop: insets.top },
    ],
    [v.bgHex, v.vars, insetTop, insets.top],
  );

  const fadeStyle = useMemo(
    () => [styles.fade, { bottom: stickyHeight }],
    [stickyHeight],
  );

  const stickyInnerStyle = useMemo(
    () => ({
      paddingBottom: (resolvedInsetBottom ? insets.bottom : 0) || 16,
    }),
    [resolvedInsetBottom, insets.bottom],
  );

  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={clsx(bodyPaddingClass, contentClassName)}
      contentContainerStyle={scrollContentStyle}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={clsx('flex-1', bodyPaddingClass)}>{children}</View>
  );

  const bodyWithKeyboard = keyboard ? (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <VariantProvider variant={variant}>
      <View style={rootStyle}>
        {v.glow && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <GlowBg {...v.glow} bgClassName="bg-transparent" />
          </View>
        )}
        {header}
        {bodyWithKeyboard}
        {showFade && (
          <LinearGradient
            colors={[withAlpha(v.bgHex, 0), v.bgHex]}
            pointerEvents="none"
            style={fadeStyle}
          />
        )}
        {sticky && (
          <KeyboardStickyView
            offset={{ closed: 0, opened: 0 }}
            style={styles.sticky}
          >
            <View
              onLayout={onStickyLayout}
              style={stickyInnerStyle}
              className="px-screen-x pt-2"
            >
              {sticky}
            </View>
          </KeyboardStickyView>
        )}
      </View>
    </VariantProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: FADE_HEIGHT,
  },
  sticky: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
