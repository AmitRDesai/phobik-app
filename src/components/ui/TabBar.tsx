import { BlurView } from '@/components/ui/BlurView';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, Text, View } from 'react-native';
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
  const paddingBottom = Math.max(insets.bottom, 8);

  const content = (
    <View
      className="flex-row items-center justify-around border-t border-white/10 px-4 pt-3"
      style={{ paddingBottom }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const iconName = TAB_ICONS[route.name] ?? 'circle';

        const color = isFocused
          ? colors.primary.pink
          : `${colors.accent.yellow}CC`; // 80% opacity

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
    <BlurView
      intensity={25}
      tint="dark"
      style={{ backgroundColor: withAlpha(colors.background.onboarding, 0.95) }}
    >
      {content}
    </BlurView>
  );
}
