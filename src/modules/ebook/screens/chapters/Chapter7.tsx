import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterHeroImage } from '../../components/ChapterHeroImage';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

import ch7Hero from '@/assets/images/ebook/chapter-7-hero.jpg';

export default function Chapter7() {
  return (
    <>
      <ChapterHeroImage source={ch7Hero} />
      <ChapterHeading label="Chapter 7" title="When Fear Begins" />
      <ChapterParagraph>
        Flight anxiety doesn't always start with a bad flight. Often, it begins
        with something entirely unrelated. A sudden loss, a major life
        transition, or simply the accumulation of daily stress can trigger a
        heightened sense of vulnerability. When we feel out of control in our
        personal lives, the thought of being thousands of feet in the air,
        inside a metal tube, can suddenly become terrifying.
      </ChapterParagraph>
      <ChapterParagraph>
        Understanding this connection is the first step toward reclaiming your
        peace. It's not necessarily the flying itself that scares you, but the
        physical manifestation of deeper, unresolved fears. In this chapter, we
        will explore how life events shape our phobias and how to untangle the
        emotion from the action of flying.
      </ChapterParagraph>
      <ChapterParagraph>
        Consider the moments leading up to your first noticeable spike in
        anxiety. Was there a shift in your career? A change in a significant
        relationship? Our bodies often store stress that our minds haven't fully
        processed, releasing it in situations where our primitive 'fight or
        flight' response is easily engaged—like during turbulence or takeoff.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
