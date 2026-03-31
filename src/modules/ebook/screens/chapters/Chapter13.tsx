import { colors } from '@/constants/colors';
import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';
import { ChapterCallout } from '../../components/ChapterCallout';

export default function Chapter13() {
  return (
    <>
      <ChapterHeading label="Chapter 13" title="Panic is not always Danger" />
      <ChapterParagraph>
        When you're in the air and turbulence hits, your body might react as if
        it's in a life-or-death situation. But a core principle of overcoming
        flight anxiety is understanding this distinction:
      </ChapterParagraph>

      <ChapterCallout
        accentColor={colors.accent.yellow}
        title="Commitment ends panic"
      >
        Panic feeds on hesitation. It thrives in the space where you are
        deciding whether you should try to escape or fight. On a plane, escape
        isn't an option. Once you commit entirely to the fact that you are on
        this flight until it lands, the fuel for panic begins to dry up.
      </ChapterCallout>

      <ChapterParagraph>
        Acceptance is not defeat. It is the active, powerful choice to stop
        fighting the reality of your situation.
      </ChapterParagraph>
    </>
  );
}
