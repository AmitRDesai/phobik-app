import { BackButton } from '@/components/ui/BackButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { Text } from '@/components/themed';
import { dialog } from '@/utils/dialog';
import { clsx } from 'clsx';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { type ReactNode } from 'react';

export type HeaderVariant = 'back' | 'close' | 'wordmark';

export interface HeaderProps {
  variant?: HeaderVariant;
  title?: string;
  subtitle?: string;
  /** Override the left slot (default: BackButton if canGoBack, close X if variant="close"). */
  left?: ReactNode;
  /** Right-aligned slot (e.g. avatar, action button). */
  right?: ReactNode;
  /** Step indicator. */
  progress?: { current: number; total: number };
  /** Show a confirmation dialog before close/back fires. Default: false. */
  confirmClose?: boolean;
  /**
   * Confirmation dialog config (used when confirmClose is true).
   * Defaults to a generic "Discard progress?" prompt.
   */
  confirmCloseConfig?: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  };
  className?: string;
}

const DEFAULTS = {
  title: 'Discard progress?',
  message: "If you leave now, you'll lose your progress.",
  confirmLabel: 'Discard',
  cancelLabel: 'Stay',
} as const;

/**
 * Header primitive — covers most app header use cases via one `variant` prop.
 *
 * - `variant="back"` — back button left + optional title + optional right
 * - `variant="close"` — close (X) left that calls `router.dismissAll()` + optional title
 * - `variant="wordmark"` — flow header with brand wordmark center, no title
 *
 * Always passed via `<Screen header={<Header.../>}>` — never rendered freely.
 */
export function Header({
  variant = 'back',
  title,
  subtitle,
  left,
  right,
  progress,
  confirmClose,
  confirmCloseConfig,
  className,
}: HeaderProps) {
  const { back, dismissAll, canGoBack } = useRouter();

  const dismiss = async () => {
    if (confirmClose) {
      const cfg = { ...DEFAULTS, ...confirmCloseConfig };
      const choice = await dialog.error({
        title: cfg.title,
        message: cfg.message,
        buttons: [
          { label: cfg.confirmLabel, value: 'confirm', variant: 'destructive' },
          { label: cfg.cancelLabel, value: 'cancel', variant: 'secondary' },
        ],
      });
      if (choice !== 'confirm') return;
    }
    if (variant === 'close') dismissAll();
    else back();
  };

  const leftSlot = resolveLeftSlot({ left, variant, dismiss, canGoBack });
  const center = renderCenter({ variant, title, subtitle });

  return (
    <View className={clsx('px-screen-x pt-2 pb-3', className)}>
      <View className="flex-row items-center justify-between">
        <View className="min-w-[40px] flex-row items-center">{leftSlot}</View>
        <View className="flex-1 flex-row items-center justify-center">
          {center}
        </View>
        <View className="min-w-[40px] flex-row items-center justify-end">
          {right}
        </View>
      </View>
      {progress ? (
        <View className="mt-2 items-center">
          <ProgressDots current={progress.current} total={progress.total} />
        </View>
      ) : null}
    </View>
  );
}

function resolveLeftSlot({
  left,
  variant,
  dismiss,
  canGoBack,
}: {
  left: ReactNode;
  variant: HeaderVariant;
  dismiss: () => void;
  canGoBack: () => boolean;
}): ReactNode {
  if (left !== undefined) return left;
  if (variant === 'close') {
    return <BackButton icon="close" onPress={dismiss} />;
  }
  if (canGoBack()) return <BackButton onPress={dismiss} />;
  return null;
}

function renderCenter({
  variant,
  title,
  subtitle,
}: {
  variant: HeaderVariant;
  title?: string;
  subtitle?: string;
}): ReactNode {
  if (variant === 'wordmark') {
    return (
      <Text variant="h3" className="tracking-wide">
        Phobik
      </Text>
    );
  }
  if (!title) return null;
  return (
    <View className="items-center">
      <Text variant="h3" numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body-sm" muted numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
