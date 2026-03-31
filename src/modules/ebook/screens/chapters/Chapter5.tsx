import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterSectionTitle } from '../../components/ChapterSectionTitle';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

import ch5Hero from '@/assets/images/ebook/chapter-5-hero.jpg';

export default function Chapter5() {
  return (
    <>
      <ChapterHeading label="Chapter 5" title="Regulation Practice" />
      <ChapterSectionTitle>Why Regulation Practice Matters</ChapterSectionTitle>
      <ChapterParagraph>
        Think of your nervous system as a highly sophisticated autopilot. Most
        of the time, it runs seamlessly in the background, managing your heart
        rate, breathing, and threat detection without you ever noticing. But
        what happens when the autopilot encounters severe turbulence and
        misinterprets it as a catastrophic failure?
      </ChapterParagraph>
      <ChapterHeroImage
        source={ch5Hero}
        caption="Finding stillness amidst the internal storm."
      />
      <ChapterParagraph>
        This is where your manual backup systems come into play. Regulation
        practice isn't about stopping the turbulence—it's about knowing how to
        disengage a malfunctioning autopilot and manually fly the plane until
        the weather clears.
      </ChapterParagraph>
      <ChapterCallout icon="psychology" title="The Manual Override">
        When anxiety spikes, the amygdala (the brain's alarm bell) takes
        control, shutting down the prefrontal cortex (the logical brain).
        Regulation techniques are the specific manual commands that force the
        prefrontal cortex back online.
      </ChapterCallout>
      <ChapterParagraph>
        If you only try to learn these techniques while you are already in a
        state of panic—say, sitting on the tarmac waiting for takeoff—it's like
        trying to learn how to swim while drowning. Your brain is too consumed
        with survival to absorb new information.
      </ChapterParagraph>
      <ChapterParagraph>
        Practicing these skills on dry land, when you are calm, builds strong
        neural pathways. When the anxiety hits, your body will know exactly what
        to do.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
