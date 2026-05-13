import { useEffect, useState } from 'react';
import { CharacterScreenShell } from '../components/CharacterScreenShell';
import { DashCharacter } from '../components/DashCharacter';

const CELEBRATE_MS = 3000;

export default function DashScreen() {
  const [celebrating, setCelebrating] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setCelebrating(false), CELEBRATE_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <CharacterScreenShell title="Dash Dopamine">
      <DashCharacter celebrating={celebrating} />
    </CharacterScreenShell>
  );
}
