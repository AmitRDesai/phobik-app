import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import type { AssessmentMeta } from '../data/assessments';

interface AssessmentCardProps {
  assessment: AssessmentMeta;
  isInProgress?: boolean;
  onPress: () => void;
}

function renderIcon(assessment: AssessmentMeta) {
  const icon = assessment.icon;
  const size = 24;
  const color = colors.primary.pink;

  if ('family' in icon && icon.family === 'ionicons') {
    return <Ionicons name={icon.name} size={size} color={color} />;
  }

  return (
    <MaterialIcons
      name={(icon as { name: keyof typeof MaterialIcons.glyphMap }).name}
      size={size}
      color={color}
    />
  );
}

export function AssessmentCard({
  assessment,
  isInProgress,
  onPress,
}: AssessmentCardProps) {
  return (
    <Card
      onPress={onPress}
      className="overflow-hidden p-6"
      style={{ borderRadius: 28 }}
      shadow={{
        color: colors.primary.pink,
        opacity: 0.1,
        blur: 32,
        offsetY: 16,
        spread: -8,
      }}
    >
      <View className="mb-5 flex-row items-center gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-foreground/10">
          {renderIcon(assessment)}
        </View>
        <View className="flex-1">
          <Text size="h3" weight="bold">
            {assessment.title}
          </Text>
          <Text size="sm" tone="secondary" className="mt-1 leading-relaxed">
            {assessment.description}
          </Text>
        </View>
      </View>

      <View className="self-start">
        <Button
          size="xs"
          onPress={onPress}
          icon={
            <MaterialIcons
              name={isInProgress ? 'play-arrow' : 'arrow-forward'}
              size={14}
              color="white"
            />
          }
        >
          {isInProgress ? 'Resume' : 'Start Test'}
        </Button>
      </View>
    </Card>
  );
}
