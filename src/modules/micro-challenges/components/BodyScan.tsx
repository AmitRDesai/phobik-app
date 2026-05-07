import { MaterialIcons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { ScrollView } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';

import { SENSATION_ATTRIBUTES } from '../data/sensation-attributes';
import { selectedBodyAreaAtom } from '../store/micro-challenges';
import { BodySilhouette } from './BodySilhouette';

interface BodyScanProps {
  onContinue: () => void;
}

export function BodyScan({ onContinue }: BodyScanProps) {
  const [selectedArea, setSelectedArea] = useAtom(selectedBodyAreaAtom);

  return (
    <ScrollView
      contentContainerClassName="px-6 pb-12"
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text variant="h1" className="mb-2 mt-6">
        Where&apos;s the Sensation
      </Text>
      <Text variant="sm" className="mb-6 leading-relaxed text-foreground/60">
        Scan your body and notice where you feel the strongest sensation.
      </Text>

      {/* Body silhouette */}
      <BodySilhouette
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
      />

      {/* Sensation attributes */}
      <Text variant="h2" className="mb-4 mt-6 text-center">
        Ask yourself, is this sensation...
      </Text>

      <View className="mb-6 flex-row flex-wrap gap-3">
        {SENSATION_ATTRIBUTES.map((attr) => (
          <View
            key={attr.id}
            className="flex-1 rounded-xl border border-foreground/5 bg-foreground/[0.03] p-4"
            style={{ minWidth: '45%' }}
          >
            <Text
              variant="caption"
              className="mb-1 text-center text-[9px] font-black text-foreground/40"
            >
              {attr.category}
            </Text>
            <Text
              variant="xs"
              className="text-center font-medium text-foreground/90"
            >
              {attr.question}
            </Text>
          </View>
        ))}
      </View>

      {/* Tip */}
      <View className="mb-8 flex-row items-start gap-3 rounded-xl border border-foreground/5 bg-foreground/[0.03] p-5">
        <MaterialIcons name="touch-app" size={20} color={colors.primary.pink} />
        <Text
          variant="xs"
          className="flex-1 leading-relaxed text-foreground/70"
        >
          Choose the strongest sensation and place your hand there. Take a few
          slow breaths into that area.
        </Text>
      </View>

      {/* Continue */}
      <GradientButton
        onPress={onContinue}
        icon={<MaterialIcons name="arrow-forward" size={18} color="white" />}
      >
        Continue
      </GradientButton>
    </ScrollView>
  );
}
