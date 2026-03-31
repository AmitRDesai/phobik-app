import ch14Hero from '@/assets/images/ebook/chapter-14-hero.jpg';
import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';

export default function Chapter14() {
  return (
    <>
      <ChapterHeading
        label="Chapter 14"
        title="Automatic vs. Manual Regulation"
      />
      <ChapterParagraph>
        Think of your nervous system like an aircraft. When anxiety hits, your
        body's 'autopilot' often takes over, initiating a fight-or-flight
        response. However, just like a pilot can switch off the autopilot and
        take manual control of the plane, you can take manual control of your
        nervous system.
      </ChapterParagraph>

      <ChapterHeroImage source={ch14Hero} caption="Taking back the controls" />

      <ChapterParagraph>
        The key to manual regulation lies in conscious breathing and grounding
        techniques. When you focus on extending your exhale, you are literally
        sending a mechanical signal to your heart to slow down, overriding the
        autopilot's distress signals.
      </ChapterParagraph>
    </>
  );
}
