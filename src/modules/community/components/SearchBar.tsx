import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const scheme = useScheme();
  return (
    <View className="flex-row items-center rounded-full bg-surface-elevated/80 px-4">
      <MaterialIcons
        name="search"
        size={22}
        color={colors.primary.pink}
        style={{ opacity: 0.6 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Find inspiration..."
        placeholderTextColor={foregroundFor(scheme, 0.4)}
        className="ml-3 h-12 flex-1 text-sm text-foreground"
      />
    </View>
  );
}
