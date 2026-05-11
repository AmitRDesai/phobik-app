import { Text } from '@/components/themed/Text';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import { EaseView } from 'react-native-ease';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type AccordionVariant = 'flat' | 'card';
export type AccordionSize = 'sm' | 'md';

export interface AccordionProps {
  title: string;
  /** Optional subtitle below the title in the header row. */
  subtitle?: string;
  /** Optional leading icon on the header row. */
  icon?: ReactNode;
  /** Expandable content. */
  children: ReactNode;
  /** Controlled expanded state. Omit for uncontrolled behavior. */
  expanded?: boolean;
  /** Initial expanded state (uncontrolled). Default: false. */
  defaultExpanded?: boolean;
  /** Fired whenever the accordion toggles (controlled or uncontrolled). */
  onToggle?: (expanded: boolean) => void;
  /**
   * Visual style.
   *   flat (default) — bordered row, no fill — for list-style accordions
   *   card           — uses the Card raised treatment — for hero / feature panels
   */
  variant?: AccordionVariant;
  /** Chrome size. Default: `md`. */
  size?: AccordionSize;
  /** Suppress haptic on toggle. Default: false. */
  noHaptic?: boolean;
  className?: string;
}

const SIZE_PAD: Record<AccordionSize, string> = {
  sm: 'px-3 py-2.5',
  md: 'px-4 py-3.5',
};

/**
 * Expandable row. The header is always visible; tapping it animates the
 * content below in/out via a height transition keyed to the content's
 * measured height (no caller-supplied height constant needed).
 *
 * Use for FAQ, settings groups, "see more" details. For tap-to-open
 * single-select choices, reach for DropdownSelect instead — that one
 * opens a sheet of SelectionCards rather than expanding inline.
 */
export function Accordion({
  title,
  subtitle,
  icon,
  children,
  expanded: controlled,
  defaultExpanded,
  onToggle,
  variant = 'flat',
  size = 'md',
  noHaptic,
  className,
}: AccordionProps) {
  const scheme = useScheme();
  const [uncontrolled, setUncontrolled] = useState(!!defaultExpanded);
  const isControlled = controlled !== undefined;
  const open = isControlled ? !!controlled : uncontrolled;

  const height = useSharedValue(0);
  const measured = useRef(0);
  const hasMeasured = useRef(false);

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h <= 0) return;
      measured.current = h;
      if (!hasMeasured.current) {
        hasMeasured.current = true;
        // Snap to current state on first measure (no animation).
        height.value = open ? h : 0;
      } else if (open) {
        // Content height changed while open — re-sync without animation.
        height.value = h;
      }
    },
    [open, height],
  );

  useEffect(() => {
    if (!hasMeasured.current) return;
    height.value = withTiming(open ? measured.current : 0, {
      duration: 240,
    });
  }, [open, height]);

  const heightStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  const toggle = () => {
    if (!noHaptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !open;
    if (!isControlled) setUncontrolled(next);
    onToggle?.(next);
  };

  const containerClass =
    variant === 'card'
      ? 'rounded-2xl border border-foreground/10 bg-foreground/[0.04]'
      : 'border-b border-foreground/10';

  return (
    <View className={clsx(containerClass, className)}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={title}
        className={clsx('flex-row items-center gap-3', SIZE_PAD[size])}
      >
        {icon ? <View>{icon}</View> : null}
        <View className="flex-1">
          <Text size={size === 'sm' ? 'sm' : 'md'} weight="semibold">
            {title}
          </Text>
          {subtitle ? (
            <Text size="xs" tone="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <EaseView
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 240 }}
        >
          <MaterialIcons
            name="expand-more"
            size={22}
            color={foregroundFor(scheme, 0.7)}
          />
        </EaseView>
      </Pressable>

      <Animated.View style={heightStyle}>
        {/* Inner wrapper carries the measured height — outer Animated.View
            controls how much of it is visible. */}
        <View
          onLayout={onContentLayout}
          className={clsx(SIZE_PAD[size], 'pt-0')}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}
