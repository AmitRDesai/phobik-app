import { useEffect, useState } from 'react';
import { CharacterScreenShell } from '../components/CharacterScreenShell';
import { OliveCharacter } from '../components/OliveCharacter';

const CELEBRATE_MS = 2400;

export default function OliveScreen() {
  const [celebrating, setCelebrating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCelebrating(false), CELEBRATE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <CharacterScreenShell title="Olive Oxytocin">
      <OliveCharacter celebrating={celebrating} />
    </CharacterScreenShell>
  );
}
