import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';
import { ChapterQuote } from '../../components/ChapterQuote';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

import ch4Hero from '@/assets/images/ebook/chapter-4-hero.jpg';

export default function Chapter4() {
  return (
    <>
      <ChapterHeroImage source={ch4Hero} />
      <ChapterHeading
        label="Chapter 4"
        title="Why Flying Is a Perfect Storm for Anxiety"
      />
      <ChapterParagraph>
        Flying combines several potent anxiety triggers: being in a confined
        space, trusting strangers with your life, and having no immediate way to
        leave. It's perfectly natural that these factors create a sense of
        unease.
      </ChapterParagraph>
      <ChapterParagraph>
        For many, the core of flight anxiety isn't necessarily a fear of
        crashing, but rather claustrophobia and agoraphobia combined. You are in
        a small tube, high in the air, and there is no exit door you can simply
        open if you feel overwhelmed. This absolute lack of control is
        terrifying to the human brain, which is wired to seek escape routes in
        stressful situations.
      </ChapterParagraph>
      <ChapterQuote>
        Anxiety is a feeling of loss of control. A plane is the ultimate
        physical manifestation of handing over control.
      </ChapterQuote>
      <ChapterSectionTitle>The Brain's Alarm System</ChapterSectionTitle>
      <ChapterParagraph>
        When you board a plane, your amygdala—the part of the brain responsible
        for the fight-or-flight response—is already on high alert. The strange
        noises, the changes in air pressure, and the subtle movements all get
        interpreted as potential threats, simply because they are unfamiliar and
        you cannot escape them.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
