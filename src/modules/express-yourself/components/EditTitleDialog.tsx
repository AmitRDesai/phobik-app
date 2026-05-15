import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import type { CustomDialogProps } from '@/store/dialog';
import { useState } from 'react';

interface EditTitleDialogProps extends CustomDialogProps<string> {
  initialTitle: string;
}

/**
 * Custom dialog body for renaming a song. Resolves with the trimmed new
 * title (string) on Save, or `undefined` when canceled / dismissed.
 */
export function EditTitleDialog({ close, initialTitle }: EditTitleDialogProps) {
  const [value, setValue] = useState(initialTitle);

  const submit = () => {
    const next = value.trim();
    close(next.length === 0 ? undefined : next);
  };

  return (
    <View className="gap-4 p-2">
      <View className="gap-1">
        <Text size="h3" weight="bold">
          Rename song
        </Text>
        <Text size="sm" tone="secondary">
          Give your song a name you&apos;ll recognize later.
        </Text>
      </View>

      <TextField
        type="text"
        value={value}
        onChangeText={setValue}
        placeholder="Song title"
        autoFocus
      />

      <View className="flex-row gap-3 pt-1">
        <Button variant="secondary" onPress={() => close()} className="flex-1">
          Cancel
        </Button>
        <Button
          onPress={submit}
          disabled={value.trim().length === 0}
          className="flex-1"
        >
          Save
        </Button>
      </View>
    </View>
  );
}
