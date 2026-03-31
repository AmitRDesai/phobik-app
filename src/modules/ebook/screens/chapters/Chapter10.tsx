import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterCallout } from '../../components/ChapterCallout';
import { ChapterNumberedList } from '../../components/ChapterNumberedList';
import { ChapterAffirmation } from '../../components/ChapterAffirmation';

export default function Chapter10() {
  return (
    <>
      <ChapterHeading label="Chapter 10" title="Rumination Loop" />
      <ChapterParagraph>
        Understanding how fear rewrites memory and learning how to break the
        cycle of rumination is key to overcoming flight anxiety. The mind
        naturally seeks patterns, and in the case of phobias, it latches onto
        perceived threats, playing them on an endless loop.
      </ChapterParagraph>

      <ChapterNumberedList
        items={[
          {
            title: 'Change Your State',
            description:
              'Stand up, stretch, or take a short walk. Movement helps release built-up nervous energy.',
          },
          {
            title: 'Get Into Light',
            description:
              'Look out a window or toward the sky. Light helps your brain reset and feel more grounded.',
          },
          {
            title: 'Externalize the Thought',
            description:
              "Write down what's worrying you. Then add one more balanced or calming thought. This moves the fear out of your head and into perspective.",
          },
          {
            title: 'Redirect Your Focus',
            description:
              'Put on a movie, podcast, or game. Focused attention interrupts the worry loop.',
          },
          {
            title: 'Reach Out',
            description:
              'Text someone or talk to the person next to you. Connection signals safety to your brain.',
          },
          {
            title: 'Take One Small Action',
            description:
              'Tidy your space or plan your arrival. Simple tasks shift your brain from fear \u2192 function.',
          },
          {
            title: 'Widen Your View',
            description:
              'Look out at the clouds or distant horizon. Expansive views help calm your nervous system.',
          },
          {
            title: 'Slow Your Breathing',
            description:
              "Breathe in slowly\u2026 then exhale longer. Longer exhales tell your body it's safe.",
          },
          {
            title: 'Relax Your Body',
            description:
              'Sip water. Drop your shoulders. Unclench your jaw. A relaxed body helps quiet racing thoughts.',
          },
          {
            title: 'Shift to Something Positive',
            description:
              "Picture where you're going or someone you love. Positive imagery balances the fear response.",
          },
        ]}
      />

      <ChapterCallout icon="psychology" title="Phobik Insight">
        Rumination = your brain getting stuck in a loop. You don't need to stop
        the thoughts. You just need to change the channel.
      </ChapterCallout>

      <ChapterParagraph>
        Practice these steps when you notice the spiral beginning. Over time,
        you build new neural pathways that default to calm rather than panic.
      </ChapterParagraph>

      <ChapterAffirmation />
    </>
  );
}
