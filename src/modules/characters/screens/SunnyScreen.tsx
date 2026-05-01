import { useEffect, useState } from 'react';
import { CharacterScreenShell } from '../components/CharacterScreenShell';
import { SunnyCharacter } from '../components/SunnyCharacter';

const CELEBRATE_MS = 2400;

export default function SunnyScreen() {
  const [celebrating, setCelebrating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCelebrating(false), CELEBRATE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <CharacterScreenShell title="Sunny Serotonin">
      <SunnyCharacter celebrating={celebrating} />
    </CharacterScreenShell>
  );
}
