import { BlurView } from '@/components/ui/BlurView';
import { variantConfig } from '@/components/variant-config';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  index: 'today',
  practices: 'self-improvement',
  coach: 'psychology',
  community: 'groups',
  insights: 'insights',
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useScheme();
  const paddingBottom = Math.max(insets.bottom, 8);
  const blurBg = withAlpha(variantConfig.default[scheme].bgHex, 0.7);

  const content = (
    <View
      className="flex-row items-center justify-around border-t border-foreground/10 px-4 pt-3"
      style={{ paddingBottom }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const iconName = TAB_ICONS[route.name] ?? 'circle';

        // Inactive uses the same scheme-aware yellow as the rest of the app
        // (dark: brand yellow at 80%, light: amber-700) so the tab bar reads
        // consistent with surfaces above it.
        const color = isFocused
          ? colors.primary.pink
          : scheme === 'dark'
            ? withAlpha(colors.accent.yellow, 0.8)
            : accentFor('light', 'yellow');

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="min-w-[64px] items-center gap-1"
          >
            <MaterialIcons name={iconName} size={24} color={color} />
            <Text
              className="text-[10px]"
              style={[
                {
                  color,
                  fontWeight: isFocused ? '700' : '500',
                },
                isFocused && {
                  textShadowColor: colors.primary.pink,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 10,
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <BlurView intensity={25} tint={scheme} style={{ backgroundColor: blurBg }}>
      {content}
    </BlurView>
  );
}
