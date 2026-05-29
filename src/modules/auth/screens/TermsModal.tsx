import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsModal() {
  return (
    <Screen
      scroll
      presentation="modal"
      header={<Header left={<BackButton icon="close" />} />}
      sticky={
        <Button
          variant="ghost"
          size="sm"
          prefixIcon={
            <Ionicons
              name="document-text-outline"
              size={18}
              color={colors.primary.pink}
            />
          }
        >
          Download full Terms of Service (PDF)
        </Button>
      }
      className="px-screen-x pt-2"
    >
      <View className="mb-4 items-center">
        <LinearGradient
          colors={[colors.primary.pink, colors.accent.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: `0 4px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Ionicons name="shield-checkmark" size={36} color="white" />
        </LinearGradient>
        <Text size="h1" className="tracking-tight">
          Terms of Service
        </Text>
        <Text size="xs" tone="secondary" className="mt-2">
          Phobik (PBK) App
        </Text>
      </View>
      <Card className="mb-4 p-6">
        <Text size="lg" align="center" weight="bold">
          Phobik is a wellness and self development app designed to provide
          educational tools and personal growth. It is not a healthcare provider
          and does not provide medical advice, diagnosis or therapy.
        </Text>
      </Card>
      <View className="px-2">
        <Text size="md" tone="secondary" align="center">
          By continuing, you agree to our full Terms of Service which govern
          your account, subscriptions, and use of our community and biometric
          features.
        </Text>
      </View>
    </Screen>
  );
}
