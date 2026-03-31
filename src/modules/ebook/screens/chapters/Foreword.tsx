import { ChapterHeading } from '../../components/ChapterHeading';
import { ChapterParagraph } from '../../components/ChapterParagraph';

export default function Foreword() {
  return (
    <>
      <ChapterHeading label="Foreword" title="A Personal Note" />
      <ChapterParagraph>Dear Reader,</ChapterParagraph>
      <ChapterParagraph>
        If you are reading this, chances are you know the familiar knot in your
        stomach when the cabin doors close. For years, the very thought of
        stepping onto an airplane sent a wave of panic through my chest. I
        avoided family gatherings, missed out on exploring new cultures, and
        felt grounded by a fear that seemed impossible to conquer.
      </ChapterParagraph>
      <ChapterParagraph>
        I remember vividly a flight to Mexico in my late thirties. I spent the
        entire duration gripping the armrests, my heart racing, convinced that
        every slight bump was a sign of impending doom. It was exhausting, not
        just physically, but emotionally. I realized then that I couldn't let
        fear dictate the boundaries of my world any longer.
      </ChapterParagraph>
      <ChapterParagraph>
        But I am here to tell you that the sky is not your enemy. Through
        patience, dedicated practice of grounding techniques, and a profound
        shift in perspective, I slowly learned to find calm above the clouds. It
        wasn't an overnight fix. It was a journey of understanding the mechanics
        of flight, trusting the invisible currents of air, and most importantly,
        learning to trust myself.
      </ChapterParagraph>
      <ChapterParagraph>
        This book is a collection of the tools, stories, and insights that
        helped me reclaim my freedom. I hope it serves as a gentle companion on
        your own journey upward.
      </ChapterParagraph>
      <ChapterParagraph bold>
        Remember, courage isn't the absence of fear; it is the willingness to
        fly despite it.
      </ChapterParagraph>
      <ChapterParagraph>{'With warmth,\nTeam Phobik'}</ChapterParagraph>
    </>
  );
}
