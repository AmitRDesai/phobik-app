import { DashboardCard } from '@/components/ui/DashboardCard';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface ReflectCardProps {
  question: string;
}

export function ReflectCard({ question }: ReflectCardProps) {
  return (
    <DashboardCard className="border-l-4 border-l-primary-pink p-5">
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialIcons
          name="psychology"
          size={14}
          color={colors.primary['pink-soft']}
        />
        <Text className="text-[10px] font-black uppercase tracking-[3px] text-primary-pink">
          Reflect
        </Text>
      </View>
      <Text className="text-[15px] font-bold italic leading-snug text-white/90">
        {question}
      </Text>
    </DashboardCard>
  );
}
