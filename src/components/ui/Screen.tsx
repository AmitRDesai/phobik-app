import { GlowBg } from '@/components/ui/GlowBg';
import { FADE_HEIGHT } from '@/components/ui/ScrollFade';
import { variantConfig, type Variant } from '@/components/variant-config';
import { VariantProvider } from '@/components/variant-context';
import { useTheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import { useSegments } from 'expo-router';
import { useState, type ReactNode } from 'react';
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

  const { scheme } = useTheme();
  const v = variantConfig[variant][scheme];
  const insets = useSafeAreaInsets();

  // Sticky height is measured at runtime so scroll content reserves the
  // exact amount needed — no fixed estimate, no last-row clipping.
  const [stickyHeight, setStickyHeight] = useState(0);
  const onStickyLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h !== stickyHeight) setStickyHeight(h);
  };

  const bottomReserve =
    (resolvedInsetBottom ? insets.bottom : 0) +
    (showFade ? FADE_HEIGHT : 0) +
    stickyHeight;

  const bodyPaddingClass = className ?? DEFAULT_BODY_PADDING;

  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={clsx(bodyPaddingClass, contentClassName)}
      contentContainerStyle={{ paddingBottom: bottomReserve }}
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
      <View
        style={[
          styles.root,
          { backgroundColor: v.bgHex },
          v.vars,
          insetTop && { paddingTop: insets.top },
        ]}
      >
        {v.glow && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <GlowBg {...v.glow} bgClassName="bg-transparent" />
          </View>
        )}
        {header}
        <View style={styles.flex1}>{bodyWithKeyboard}</View>
        {showFade && (
          <LinearGradient
            colors={['transparent', v.bgHex]}
            pointerEvents="none"
            style={[
              styles.fade,
              {
                bottom:
                  stickyHeight + (resolvedInsetBottom ? insets.bottom : 0),
              },
            ]}
          />
        )}
        {sticky && (
          <KeyboardStickyView
            offset={{ closed: 0, opened: 0 }}
            style={styles.sticky}
          >
            <View
              onLayout={onStickyLayout}
              style={[
                styles.stickyInner,
                {
                  paddingBottom:
                    (resolvedInsetBottom ? insets.bottom : 0) || 16,
                },
              ]}
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
  flex1: { flex: 1 },
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
  stickyInner: {},
});
