import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

export default function Chapter3() {
  return (
    <>
      <ChapterHeading label="Chapter 3" title="Your Brain's Alarm System" />
      <ChapterParagraph>
        Imagine your mind contains a highly sensitive, built-in smoke detector.
        This tiny, almond-shaped structure deep within your temporal lobe is
        called the amygdala.
      </ChapterParagraph>
      <ChapterParagraph>
        Its primary, evolutionary job is to scan your immediate environment for
        threats. It operates entirely under the radar of your conscious
        thoughts. When it senses danger—whether real or perceived—it instantly
        sounds a chemical alarm, triggering your body's autonomic fight or
        flight response.
      </ChapterParagraph>
      <ChapterParagraph>
        During a flight, turbulence or unfamiliar engine noises can be
        misinterpreted by this internal security system. The amygdala cannot
        tell the difference between a falling altitude and a genuine
        life-threatening emergency. To it, smoke is smoke.
      </ChapterParagraph>
      <ChapterParagraph>
        Understanding that your physical symptoms of anxiety are simply your
        brain trying to protect you is the first step in learning to reset the
        alarm. You are not in danger; you are just experiencing a false alarm.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
