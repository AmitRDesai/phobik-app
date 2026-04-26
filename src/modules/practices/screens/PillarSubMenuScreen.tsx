import { dialog } from '@/utils/dialog';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { PillarCard } from '../components/PillarCard';
import { PillarHeroHeader } from '../components/PillarHeroHeader';
import { PracticeScreenShell } from '../components/PracticeScreenShell';
import type { PillarSubMenu } from '../data/four-pillars';

type PillarSubMenuScreenProps = {
  submenu: PillarSubMenu;
  footer?: React.ReactNode;
};

export function PillarSubMenuScreen({
  submenu,
  footer,
}: PillarSubMenuScreenProps) {
  const router = useRouter();

  const handleItemPress = (item: PillarSubMenu['items'][number]) => {
    if (item.comingSoon || !item.route) {
      void dialog.info({
        title: 'Coming soon',
        message: 'Design in progress — this practice will be available soon.',
      });
      return;
    }
    router.push(item.route);
  };

  return (
    <PracticeScreenShell
      wordmark="FOUR PILLARS"
      bgClassName="bg-background-charcoal"
      glowCenterY={0.25}
      glowIntensity={0.5}
    >
      <PillarHeroHeader
        title={submenu.title}
        accent={submenu.accent}
        subtitle={submenu.subtitle}
      />
      <View className="gap-5">
        {submenu.items.map((item) => (
          <PillarCard
            key={item.id}
            image={item.image}
            title={item.title}
            subtitle={item.subtitle}
            badge={item.badge}
            icon={item.icon}
            accentColor={item.accentColor}
            cta={item.cta}
            ctaIcon={item.ctaIcon}
            onPress={() => handleItemPress(item)}
            aspect="square"
          />
        ))}
      </View>
      {footer}
    </PracticeScreenShell>
  );
}
