import { Text } from '@/components/themed/Text';
import { DIALOG_OVERLAY_HEX, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import {
  dialogAtom,
  type DialogButton,
  type DialogResult,
  type DialogState,
} from '@/store/dialog';
import { store } from '@/utils/jotai';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { EaseView } from 'react-native-ease';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';

// Generous slide-in offset that works for tall custom dialogs without
// needing to measure the sheet height at runtime.
const SLIDE_IN_OFFSET = 600;
// Cap the sheet body so very tall custom dialogs scroll instead of pushing
// past the top of the screen on small phones.
const SHEET_MAX_HEIGHT_PCT = 0.85;

export function DialogContainer() {
  const scheme = useScheme();
  const dialogState = useAtomValue(dialogAtom);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get('window');

  // Per-scheme bottom-sheet bg. Must be OPAQUE — the sheet sits over the
  // dim overlay + the screen content underneath; any alpha would let the
  // page bleed through. Neutral charcoal on dark — distinct from the screen
  // bg (#121212) without the plum cast of the `surface-elevated` token.
  const sheetBg = scheme === 'dark' ? '#1f1f1f' : '#ffffff';

  // Keep last dialog state during exit animation
  const [renderState, setRenderState] = useState<DialogState | null>(null);
  const isShowingRef = useRef(false);

  const resolveRef = useRef<((result: DialogResult) => void) | null>(null);

  // Sync render state when dialog opens/closes
  useEffect(() => {
    if (dialogState) {
      setRenderState(dialogState);
      resolveRef.current = dialogState.resolve;
      isShowingRef.current = true;
    } else if (isShowingRef.current) {
      isShowingRef.current = false;
      setTimeout(() => setRenderState(null), 220);
    }
  }, [dialogState]);

  const dismiss = useCallback(() => {
    resolveRef.current?.(undefined);
    resolveRef.current = null;
    store.set(dialogAtom, null);
  }, []);

  // Android back button
  useEffect(() => {
    if (!renderState || renderState.type === 'loading') return;

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true;
    });
    return () => handler.remove();
  }, [renderState, dismiss]);

  const handleButtonPress = useCallback((button: DialogButton) => {
    resolveRef.current?.(button.value);
    resolveRef.current = null;
    store.set(dialogAtom, null);
  }, []);

  const handleCustomClose = useCallback((result?: DialogResult) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    store.set(dialogAtom, null);
  }, []);

  const isOpen = !!dialogState;

  if (!renderState) return null;

  const isLoading = renderState.type === 'loading';
  const isCustom = renderState.type === 'custom';
  const CustomComponent = renderState.customComponent;

  return (
    <View
      className="absolute bottom-0 left-0 right-0 top-0"
      pointerEvents="box-none"
    >
      {/* Overlay */}
      <EaseView
        className="absolute bottom-0 left-0 right-0 top-0"
        initialAnimate={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{
          type: 'timing',
          duration: isOpen ? 250 : 200,
          easing: [0.455, 0.03, 0.515, 0.955],
        }}
        style={{ backgroundColor: withAlpha(DIALOG_OVERLAY_HEX, 0.4) }}
      >
        <Pressable
          className="flex-1"
          onPress={isLoading ? undefined : dismiss}
          disabled={isLoading}
        />
      </EaseView>

      {/* Bottom sheet — wrapped in KeyboardStickyView so it rises with the
          keyboard when a custom dialog contains a focused input. */}
      <KeyboardStickyView
        offset={{ closed: 0, opened: 0 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <EaseView
          className="rounded-t-[2.5rem]"
          initialAnimate={{ translateY: SLIDE_IN_OFFSET }}
          animate={{ translateY: isOpen ? 0 : SLIDE_IN_OFFSET }}
          transition={{
            type: 'timing',
            duration: isOpen ? 250 : 200,
            easing: [0.455, 0.03, 0.515, 0.955],
          }}
          style={{
            backgroundColor: sheetBg,
            paddingBottom: Math.max(insets.bottom, 10),
            maxHeight: screenHeight * SHEET_MAX_HEIGHT_PCT,
          }}
        >
          <ScrollView
            contentContainerClassName="px-6 pb-6 pt-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {isCustom && CustomComponent ? (
              <CustomComponent
                close={handleCustomClose}
                {...renderState.customProps}
              />
            ) : (
              <>
                {/* Icon */}
                <DialogIcon type={renderState.type} />

                {/* Title */}
                {renderState.title && (
                  <Text size="h2" align="center" className="mt-4">
                    {renderState.title}
                  </Text>
                )}

                {/* Message */}
                {renderState.message && (
                  <Text
                    size="md"
                    tone="secondary"
                    align="center"
                    className="mt-2 leading-6"
                  >
                    {renderState.message}
                  </Text>
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <View className="mt-6 items-center">
                    <ActivityIndicator
                      size="large"
                      color={colors.primary.pink}
                    />
                  </View>
                )}

                {/* Buttons */}
                {renderState.buttons.length > 0 && (
                  <View className="mt-6 gap-3">
                    {renderState.buttons.map((button) => (
                      <DialogButtonView
                        key={button.label}
                        button={button}
                        onPress={() => handleButtonPress(button)}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </EaseView>
      </KeyboardStickyView>
    </View>
  );
}

function DialogIcon({ type }: { type: DialogState['type'] }) {
  if (type === 'loading' || type === 'custom') return null;

  const isError = type === 'error';

  return (
    <View className="items-center">
      <LinearGradient
        colors={
          isError
            ? [colors.chakra.red, colors.primary.pink]
            : [colors.primary.pink, colors.accent.yellow]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={isError ? 'alert-circle' : 'information-circle'}
          size={32}
          color="white"
        />
      </LinearGradient>
    </View>
  );
}

function DialogButtonView({
  button,
  onPress,
}: {
  button: DialogButton;
  onPress: () => void;
}) {
  if (button.variant === 'primary' || !button.variant) {
    return <Button onPress={onPress}>{button.label}</Button>;
  }

  if (button.variant === 'destructive') {
    return (
      <Button variant="destructive" onPress={onPress}>
        {button.label}
      </Button>
    );
  }

  // secondary
  return (
    <Button variant="ghost" onPress={onPress}>
      {button.label}
    </Button>
  );
}
