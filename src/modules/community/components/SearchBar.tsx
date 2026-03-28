import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="flex-row items-center rounded-full bg-card-plum/40 px-4">
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
        placeholderTextColor="rgba(244,37,140,0.3)"
        className="ml-3 h-12 flex-1 text-sm text-white"
      />
    </View>
  );
}
