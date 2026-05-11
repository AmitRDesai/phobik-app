import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { EaseView } from 'react-native-ease';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { FloatingSphere } from './FloatingSphere';

export interface MapperItem {
  id: string;
  label: string;
  gradient: [string, string];
  shadowColor: string;
  subItems: string[];
}

interface FloatingMapperProps {
  items: MapperItem[];
  selectedId: string | null;
  selectedSubItem: string | null;
  onSelect: (id: string) => void;
  onSubItemSelect: (sub: string) => void;
  onConfirm: () => void;
  promptText: string;
  confirmLabel: string;
}

const SPHERE_SIZE = 125;
const ORBITAL_RADIUS = 110;

function generateBgSlots(totalItems: number, w: number, canvasH: number) {
  const pad = 20;
  const cols = 3;
  const rows = Math.ceil((totalItems + 3) / cols);
  const cellW = (w - pad * 2) / cols;
  const cellH = (canvasH - pad * 2) / rows;
  const centerX = w / 2;
  const centerY = canvasH / 2;
  const exclusionR = 130;

  const zones: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const zx = pad + c * cellW + cellW / 2;
      const zy = pad + r * cellH + cellH / 2;
      const dist = Math.sqrt((zx - centerX) ** 2 + (zy - centerY) ** 2);
      if (dist > exclusionR) {
        zones.push({ x: zx, y: zy });
      }
    }
  }

  const half = SPHERE_SIZE / 2;
  return zones.map((zone, i) => {
    const jx = (((i * 13 + 7) % 11) / 11 - 0.5) * cellW * 0.35;
    const jy = (((i * 17 + 3) % 13) / 13 - 0.5) * cellH * 0.35;
    const bgScale = 0.25 + (((i * 7 + 3) % 11) / 10) * 0.25;
    return {
      left: Math.max(pad, Math.min(zone.x + jx - half, w - SPHERE_SIZE - pad)),
      top: Math.max(
        pad,
        Math.min(zone.y + jy - half, canvasH - SPHERE_SIZE - pad),
      ),
      bgScale,
    };
  });
}

export function FloatingMapper({
  items,
  selectedId,
  selectedSubItem,
  onSelect,
  onSubItemSelect,
  onConfirm,
  promptText,
  confirmLabel,
}: FloatingMapperProps) {
  const scheme = useScheme();
  const { width, height } = useWindowDimensions();
  const [canvasLayout, setCanvasLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const selected = items.find((i) => i.id === selectedId) ?? items[0];

  const handleCanvasLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    if (
      !canvasLayout ||
      Math.abs(canvasLayout.width - w) > 1 ||
      Math.abs(canvasLayout.height - h) > 1
    ) {
      setCanvasLayout({ width: w, height: h });
    }
  };

  // Orbital rotation (needs Reanimated for continuous loop)
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 25000 }),
      -1,
      false,
    );
    return () => cancelAnimation(rotation);
  }, []);

  const orbitalStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  const counterRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value}deg` }],
  }));

  const canvasW = canvasLayout?.width ?? width;
  const canvasH = canvasLayout?.height ?? height - 220;

  const bgSlots = useMemo(
    () => generateBgSlots(items.length, canvasW, canvasH),
    [items.length, canvasW, canvasH],
  );

  const centerLeft = canvasW / 2 - SPHERE_SIZE / 2;
  const centerTop = canvasH / 2 - SPHERE_SIZE / 2;

  return (
    <View className="flex-1">
      <View className="items-center px-6 pt-2">
        <Text
          size="lg"
          align="center"
          className="leading-relaxed text-foreground/85"
        >
          {promptText}
        </Text>
      </View>

      {/* Canvas */}
      <View className="flex-1" onLayout={handleCanvasLayout}>
        {/* All spheres — positioned at bg slot, EaseView moves selected to center */}
        {items.map((item, i) => {
          const slot = bgSlots[i % bgSlots.length];
          const isSelected = item.id === selected.id;
          // Offset from bg slot to center
          const dx = centerLeft - slot.left;
          const dy = centerTop - slot.top;

          return (
            <EaseView
              key={item.id}
              style={{
                position: 'absolute',
                left: slot.left,
                top: slot.top,
                zIndex: isSelected ? 10 : 1,
              }}
              animate={{
                translateX: isSelected ? dx : 0,
                translateY: isSelected ? dy : 0,
                scale: isSelected ? 1 : slot.bgScale,
                opacity: isSelected ? 1 : 0.4,
              }}
              transition={{ type: 'timing', duration: 400 }}
            >
              <FloatingSphere
                label={item.label}
                gradient={item.gradient}
                shadowColor={item.shadowColor}
                size={SPHERE_SIZE}
                onPress={() => onSelect(item.id)}
                floatAmplitude={isSelected ? 5 : 6 + (i % 4) * 3}
                floatDuration={isSelected ? 4000 : 5000 + (i % 5) * 800}
                blurred={!isSelected}
              />
            </EaseView>
          );
        })}

        {/* Orbital ring (centered, fades in on selection change) */}
        <EaseView
          key={selected.id}
          className="absolute items-center justify-center"
          style={{
            left: centerLeft - ORBITAL_RADIUS + SPHERE_SIZE / 2,
            top: centerTop - ORBITAL_RADIUS + SPHERE_SIZE / 2,
            width: ORBITAL_RADIUS * 2,
            height: ORBITAL_RADIUS * 2,
          }}
          initialAnimate={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 400 }}
          pointerEvents="box-none"
        >
          <Animated.View
            className="absolute"
            style={[
              {
                width: ORBITAL_RADIUS * 2,
                height: ORBITAL_RADIUS * 2,
                borderRadius: ORBITAL_RADIUS,
                borderWidth: 1,
                borderColor: foregroundFor(scheme, 0.15),
              },
              orbitalStyle,
            ]}
            pointerEvents="box-none"
          >
            {selected.subItems.map((sub, i) => {
              const angle =
                (i / selected.subItems.length) * Math.PI * 2 - Math.PI / 2;
              const cx = ORBITAL_RADIUS + ORBITAL_RADIUS * Math.cos(angle);
              const cy = ORBITAL_RADIUS + ORBITAL_RADIUS * Math.sin(angle);
              const isSubSelected = selectedSubItem === sub;
              return (
                <Pressable
                  key={sub}
                  className="absolute items-center"
                  style={{ left: cx - 45, top: cy - 12, width: 90 }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onSubItemSelect(sub);
                  }}
                  hitSlop={8}
                >
                  <EaseView
                    animate={{
                      scale: isSubSelected ? 2.5 : 1,
                      opacity: isSubSelected ? 1 : 0.5,
                    }}
                    transition={{ type: 'timing', duration: 200 }}
                  >
                    <View
                      className={clsx(
                        'mb-1 h-1.5 w-1.5 rounded-full',
                        isSubSelected ? 'bg-foreground' : 'bg-foreground/50',
                      )}
                      style={
                        isSubSelected
                          ? {
                              boxShadow: `0 0 8px ${withAlpha(selected.shadowColor, 0.8)}`,
                            }
                          : undefined
                      }
                    />
                  </EaseView>
                  <Animated.View style={counterRotateStyle}>
                    <Text
                      size="xs"
                      className={clsx(
                        'text-center',
                        isSubSelected
                          ? 'font-bold text-foreground'
                          : 'font-semibold text-foreground/70',
                      )}
                      numberOfLines={1}
                    >
                      {sub}
                    </Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </Animated.View>
        </EaseView>
      </View>

      {/* Confirm button */}
      <View className="px-6 pb-6">
        <GradientButton onPress={onConfirm} disabled={!selectedSubItem}>
          {confirmLabel}
        </GradientButton>
      </View>
    </View>
  );
}
