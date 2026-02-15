import { colors } from '@/constants/colors';
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
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientButton } from './GradientButton';

export function DialogContainer() {
  const dialogState = useAtomValue(dialogAtom);
  const insets = useSafeAreaInsets();

  // Keep last dialog state during exit animation
  const [renderState, setRenderState] = useState<DialogState | null>(null);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  const overlayOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(300);

  const resolveRef = useRef<((result: DialogResult) => void) | null>(null);

  const onExitComplete = useCallback(() => {
    setVisible(false);
    setRenderState(null);
  }, []);

  // Animate in/out when dialog state changes
  useEffect(() => {
    if (dialogState) {
      setRenderState(dialogState);
      resolveRef.current = dialogState.resolve;
      setVisible(true);
      visibleRef.current = true;
      overlayOpacity.value = withTiming(1, { duration: 250 });
      sheetTranslateY.value = withTiming(0, { duration: 250 });
    } else if (visibleRef.current) {
      visibleRef.current = false;
      overlayOpacity.value = withTiming(0, { duration: 200 });
      sheetTranslateY.value = withTiming(300, { duration: 200 });
      // Clean up after animation
      setTimeout(onExitComplete, 220);
    }
  }, [dialogState, overlayOpacity, sheetTranslateY, onExitComplete]);

  const dismiss = useCallback(() => {
    resolveRef.current?.(undefined);
    resolveRef.current = null;
    store.set(dialogAtom, null);
  }, []);

  // Android back button
  useEffect(() => {
    if (!visible || renderState?.type === 'loading') return;

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true;
    });
    return () => handler.remove();
  }, [visible, renderState?.type, dismiss]);

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

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  if (!visible || !renderState) return null;

  const isLoading = renderState.type === 'loading';
  const isCustom = renderState.type === 'custom';
  const CustomComponent = renderState.customComponent;

  return (
    <View
      className="absolute bottom-0 left-0 right-0 top-0"
      pointerEvents="box-none"
    >
      {/* Overlay */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 top-0"
        style={[{ backgroundColor: 'rgba(10, 4, 8, 0.9)' }, overlayStyle]}
      >
        <Pressable
          className="flex-1"
          onPress={isLoading ? undefined : dismiss}
          disabled={isLoading}
        />
      </Animated.View>

      {/* Bottom sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-[2.5rem] bg-[#24111b]"
        style={[sheetStyle, { paddingBottom: Math.max(insets.bottom, 10) }]}
      >
        {/* Drag handle */}
        <View className="items-center pt-3">
          <View className="h-1 w-10 rounded-full bg-white/20" />
        </View>

        <View className="px-6 pb-6 pt-4">
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
                <Text className="mt-4 text-center text-xl font-bold text-white">
                  {renderState.title}
                </Text>
              )}

              {/* Message */}
              {renderState.message && (
                <Text className="mt-2 text-center text-base leading-6 text-white/60">
                  {renderState.message}
                </Text>
              )}

              {/* Loading indicator */}
              {isLoading && (
                <View className="mt-6 items-center">
                  <ActivityIndicator size="large" color={colors.primary.pink} />
                </View>
              )}

              {/* Buttons */}
              {renderState.buttons.length > 0 && (
                <View className="mt-6 gap-3">
                  {renderState.buttons.map((button, index) => (
                    <DialogButtonView
                      key={index}
                      button={button}
                      onPress={() => handleButtonPress(button)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </Animated.View>
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
    return <GradientButton onPress={onPress}>{button.label}</GradientButton>;
  }

  if (button.variant === 'destructive') {
    return (
      <Pressable
        onPress={onPress}
        className="items-center rounded-full border border-red-500/30 bg-red-500/10 py-4"
      >
        <Text className="text-base font-semibold text-red-400">
          {button.label}
        </Text>
      </Pressable>
    );
  }

  // secondary
  return (
    <Pressable onPress={onPress} className="items-center py-3">
      <Text className="text-base font-medium text-white/50">
        {button.label}
      </Text>
    </Pressable>
  );
}
