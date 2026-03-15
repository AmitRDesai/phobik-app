import { colors, alpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

interface AffirmationReadyCardProps {
  feeling: string;
  affirmation: string;
  onSync?: () => void;
}

export function AffirmationReadyCard({
  feeling,
  affirmation,
  onSync,
}: AffirmationReadyCardProps) {
  const index = affirmation.toLowerCase().indexOf(feeling.toLowerCase());
  const before = index >= 0 ? affirmation.slice(0, index) : affirmation;
  const word =
    index >= 0 ? affirmation.slice(index, index + feeling.length) : '';
  const after = index >= 0 ? affirmation.slice(index + feeling.length) : '';

  return (
    <View className="relative">
      {/* Pink glow behind card */}
      <View
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          right: '10%',
          bottom: '10%',
          shadowColor: colors.primary.pink,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 60,
          elevation: 0,
          backgroundColor: 'transparent',
        }}
      />

      {/* Gradient border */}
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1.5 }}
      >
        <View
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.9)',
            borderRadius: 22,
          }}
          className="px-8 py-10"
        >
          {/* Sync button */}
          {onSync && (
            <Pressable
              onPress={onSync}
              className="absolute right-4 top-4 active:opacity-70"
            >
              <MaterialIcons name="sync" size={20} color={alpha.white40} />
            </Pressable>
          )}

          {/* Sparkle icon */}
          <View className="mb-4 items-center">
            <MaterialIcons
              name="auto-awesome"
              size={28}
              color={`${colors.primary.pink}66`}
            />
          </View>

          {/* Affirmation text */}
          <View className="flex-row flex-wrap justify-center">
            <Text className="text-center text-xl font-light leading-relaxed text-white">
              {'"'}
              {before}
            </Text>
            {word ? (
              <MaskedView
                maskElement={
                  <Text className="text-xl leading-relaxed font-medium">
                    {word}
                  </Text>
                }
              >
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-xl leading-relaxed font-medium opacity-0">
                    {word}
                  </Text>
                </LinearGradient>
              </MaskedView>
            ) : null}
            <Text className="text-center text-xl font-light leading-relaxed text-white">
              {after}
              {'"'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
