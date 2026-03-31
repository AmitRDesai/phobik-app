import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterQuote } from '../../components/ChapterQuote';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';
import { colors } from '@/constants/colors';
import ch18Hero from '@/assets/images/ebook/chapter-18-hero.jpg';

export default function Chapter18() {
  return (
    <>
      <ChapterHeading label="Chapter 18" title="Identity Shift" />

      <ChapterHeroImage source={ch18Hero} />

      <ChapterSectionTitle>
        From 'Anxious Flier' to 'Capable Flier'
      </ChapterSectionTitle>

      <ChapterParagraph>
        The transition from being an anxious flier to a capable one isn't just a
        mindset change—it's a profound biological transformation.
      </ChapterParagraph>

      <ChapterParagraph>
        This process of earning confidence neurologically involves several key
        shifts:
      </ChapterParagraph>

      <ChapterCallout icon="psychology" title="Amygdala Desensitization">
        The brain's fear center learns that turbulence is merely a physical
        sensation, not a threat, significantly reducing the false alarm response
        over time.
      </ChapterCallout>

      <ChapterCallout
        icon="lightbulb"
        title="Prefrontal Cortex Activation"
        accentColor={colors.accent.yellow}
      >
        Your logical brain strengthens its ability to override sudden panic,
        allowing you to access rational thoughts and statistics even at 30,000
        feet.
      </ChapterCallout>

      <ChapterCallout icon="bolt" title="Myelination of Calm Patterns">
        The more you practice your grounding techniques, the faster and more
        automatic those calming physiological responses become.
      </ChapterCallout>

      <ChapterQuote>
        Embrace the identity of a capable flier. You are not trapped; you are
        simply in transit.
      </ChapterQuote>
    </>
  );
}
