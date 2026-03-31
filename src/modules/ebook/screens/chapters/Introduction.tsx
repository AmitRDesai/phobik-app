import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';
import { ChapterQuote } from '../../components/ChapterQuote';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';

import introHero from '@/assets/images/ebook/introduction-hero.jpg';

export default function Introduction() {
  return (
    <>
      <ChapterHeroImage source={introHero} caption="Phobik Series" />
      <ChapterHeading
        label="Introduction"
        title="A New Way to Understand and Work with the Fear of Flying"
      />
      <ChapterSectionTitle>
        Welcome to Calm Above the Clouds
      </ChapterSectionTitle>
      <ChapterQuote>
        This package is designed to help you navigate the skies with confidence.
        My personal journey through flight anxiety led to the creation of this
        two-part approach.
      </ChapterQuote>
      <ChapterNumberedList
        items={[
          {
            title: '1. Intellectual Reassurance',
            description:
              'Gaining a logical understanding of how aviation works to dispel common myths and technical fears.',
          },
          {
            title: '2. Emotional Safety',
            description:
              'Nervous System Regulation via the Phobik app to manage the physical symptoms of anxiety in real-time.',
          },
        ]}
      />
      <ChapterParagraph>
        By combining logic with somatic tools, we address both the mind and the
        body, ensuring you feel supported from takeoff to landing.
      </ChapterParagraph>
    </>
  );
}
