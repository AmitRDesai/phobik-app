import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { dialog } from '@/utils/dialog';
import { useState, type ReactNode } from 'react';

export default function DialogShowcase() {
  const [lastResult, setLastResult] = useState<string>('—');

  const record = (label: string) => (result: unknown) => {
    setLastResult(`${label}: ${JSON.stringify(result)}`);
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<Header title="Dialog" />}
      className="px-4"
      contentClassName="gap-6 pb-6"
    >
      <Section title="What it is">
        <Text size="sm" tone="secondary">
          The app&apos;s themed bottom-sheet modal — replaces React
          Native&apos;s `Alert.alert()` everywhere. DialogContainer is mounted
          once at the root; you trigger dialogs imperatively via the `dialog`
          API from `@/utils/dialog`, which resolves a promise with the
          user&apos;s choice.
        </Text>
        <View className="rounded-md border border-foreground/10 bg-foreground/[0.04] p-3">
          <Text size="xs" tone="secondary" className="font-mono">
            await dialog.error({`{ title, message, buttons? }`}){'\n'}
            await dialog.info({`{ title, message, buttons? }`}){'\n'}
            const dismiss = dialog.loading({`{ message? }`}){'\n'}
            await dialog.open({`{ component, props }`}){'\n'}
            dialog.close(result?)
          </Text>
        </View>
        <Text size="xs" tone="tertiary">
          Live result of the last fired dialog:{' '}
          <Text size="xs" weight="bold" className="font-mono">
            {lastResult}
          </Text>
        </Text>
      </Section>

      <Section title="Types">
        <PropRow
          label="dialog.error"
          note="Red→pink gradient alert icon. Use for failures that need acknowledgement (network error, permission denied)."
        >
          <Button
            onPress={async () => {
              const r = await dialog.error({
                title: 'Save failed',
                message:
                  "We couldn't save your changes. Check your connection and try again.",
              });
              record('error')(r);
            }}
          >
            Fire error
          </Button>
        </PropRow>

        <PropRow
          label="dialog.info"
          note="Pink→yellow gradient info icon. Use for non-error explanations (tip, confirmation, completion)."
        >
          <Button
            onPress={async () => {
              const r = await dialog.info({
                title: 'Streak saved!',
                message: "You've checked in 14 days in a row. Keep going.",
              });
              record('info')(r);
            }}
          >
            Fire info
          </Button>
        </PropRow>

        <PropRow
          label="dialog.loading"
          note="Spinner sheet with no buttons. Returns a dismiss function — call it when async work completes. Cannot be dismissed by tapping outside."
        >
          <Button
            onPress={() => {
              const dismiss = dialog.loading({ message: 'Saving entry…' });
              setLastResult('loading: opened (auto-dismissing in 2s)');
              setTimeout(() => {
                dismiss();
                setLastResult('loading: auto-dismissed');
              }, 2000);
            }}
          >
            Fire loading (2s auto-dismiss)
          </Button>
        </PropRow>

        <PropRow
          label="dialog.open"
          note="Custom component sheet. The component receives a `close(result?)` prop to dismiss programmatically. Use for forms, inline pickers, multi-step prompts."
        >
          <Button
            onPress={async () => {
              const r = await dialog.open({
                component: NamePromptDialog,
                props: { initialValue: '' },
              });
              record('open')(r);
            }}
          >
            Fire custom (name prompt)
          </Button>
        </PropRow>
      </Section>

      <Section title="Buttons">
        <Text size="sm" tone="tertiary">
          Pass a `buttons` array of `{`{ label, value, variant }`}`. Variants
          map to the Button primitive: `primary` (default, gradient),
          `destructive` (red wash), `secondary` (ghost). Default when omitted: a
          single primary OK button.
        </Text>

        <PropRow label="Default (no buttons prop)">
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.info({
                title: 'Heads up',
                message: 'No buttons array — defaults to a single OK.',
              });
              record('default-buttons')(r);
            }}
          >
            Fire default
          </Button>
        </PropRow>

        <PropRow label="Two buttons (confirm + cancel)">
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.info({
                title: 'Mark as complete?',
                message: 'You can re-open this entry from the archive later.',
                buttons: [
                  {
                    label: 'Mark complete',
                    value: 'confirm',
                    variant: 'primary',
                  },
                  { label: 'Cancel', value: 'cancel', variant: 'secondary' },
                ],
              });
              record('confirm/cancel')(r);
            }}
          >
            Fire confirm/cancel
          </Button>
        </PropRow>

        <PropRow label="Destructive + secondary">
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.error({
                title: 'Discard progress?',
                message: 'If you leave now, your draft will be lost.',
                buttons: [
                  {
                    label: 'Discard',
                    value: 'discard',
                    variant: 'destructive',
                  },
                  { label: 'Stay', value: 'stay', variant: 'secondary' },
                ],
              });
              record('destructive')(r);
            }}
          >
            Fire destructive
          </Button>
        </PropRow>

        <PropRow
          label="Three buttons (max useful)"
          note="More than 3 buttons becomes unscannable — fold extras into a custom component."
        >
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.info({
                title: 'How was that practice?',
                message: 'Your feedback helps tune future sessions.',
                buttons: [
                  { label: 'Loved it', value: 'love', variant: 'primary' },
                  { label: 'It was fine', value: 'fine', variant: 'secondary' },
                  { label: 'Skip', value: 'skip', variant: 'secondary' },
                ],
              });
              record('three-button')(r);
            }}
          >
            Fire 3-button
          </Button>
        </PropRow>
      </Section>

      <Section title="Dismissal paths">
        <Text size="sm" tone="tertiary">
          Non-loading dialogs can be dismissed three ways. Loading dialogs can
          only be closed by calling the dismiss function returned from
          `dialog.loading(...)` or via `dialog.close()`.
        </Text>

        <PropRow
          label="Tap outside the sheet"
          note="Taps on the backdrop fire dismiss with `undefined` as the resolved value. Disabled for loading dialogs."
        >
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.info({
                title: 'Tap the dim area',
                message: 'Tap anywhere outside this sheet to dismiss.',
              });
              record('tap-outside')(r);
            }}
          >
            Open + tap outside
          </Button>
        </PropRow>

        <PropRow
          label="Android hardware back button"
          note="DialogContainer attaches a BackHandler when a non-loading dialog is open. Pressing back resolves with `undefined` instead of exiting the screen."
        >
          <Text size="xs" tone="disabled">
            (Demoed live on Android — open any non-loading dialog and press the
            system back button.)
          </Text>
        </PropRow>

        <PropRow
          label="dialog.close(result?)"
          note="Programmatic dismiss. Pass an optional value that the awaiting promise resolves with — useful when an external event closes the dialog (timeout, push notification, sync completion)."
        >
          <Button
            variant="secondary"
            onPress={async () => {
              const promise = dialog.info({
                title: 'Auto-closing…',
                message:
                  'This dialog will programmatically close in 2 seconds.',
              });
              setTimeout(() => dialog.close('auto'), 2000);
              const r = await promise;
              record('programmatic-close')(r);
            }}
          >
            Open + auto-close in 2s
          </Button>
        </PropRow>
      </Section>

      <Section title="Real-world patterns">
        <PropRow label="Confirm destructive action (delete journal entry)">
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.error({
                title: 'Delete this entry?',
                message: "This can't be undone.",
                buttons: [
                  { label: 'Delete', value: 'delete', variant: 'destructive' },
                  { label: 'Keep', value: 'cancel', variant: 'secondary' },
                ],
              });
              record('delete-confirm')(r);
            }}
          >
            Open
          </Button>
        </PropRow>

        <PropRow
          label="Async loading + dismiss"
          note="loading() returns the dismiss fn. Always wrap the work in try/finally so the loader dismisses even on failure."
        >
          <Button
            variant="secondary"
            onPress={async () => {
              const dismiss = dialog.loading({ message: 'Syncing…' });
              try {
                await new Promise((r) => setTimeout(r, 1500));
                setLastResult('async: success');
              } finally {
                dismiss();
              }
            }}
          >
            Run async (1.5s)
          </Button>
        </PropRow>

        <PropRow
          label="Custom prompt"
          note="dialog.open lets you collect input. Render a Form, call `close(value)` to resolve the promise with the entered value."
        >
          <Button
            variant="secondary"
            onPress={async () => {
              const r = await dialog.open({
                component: NamePromptDialog,
                props: { initialValue: 'John' },
              });
              record('name-prompt')(r);
            }}
          >
            Open name prompt
          </Button>
        </PropRow>
      </Section>

      <Section title="Anti-patterns (don't do these)">
        <DontRow
          bad="Using a dialog for non-modal info"
          good="If the user doesn't need to acknowledge or choose, surface the info inline (Badge, banner) — dialogs block the app."
        />

        <DontRow
          bad="loading() without a try/finally"
          good="An exception between loading and dismiss leaves the user stuck on a spinner forever. Always wrap async work in try/finally."
        />

        <DontRow
          bad="Mixing destructive + primary CTAs"
          good="Destructive variant + primary variant in the same dialog confuses the safe choice. Pair destructive with secondary (ghost) for cancel."
        />

        <DontRow
          bad="More than 3 buttons"
          good="A 4+ button stack is unscannable. Fold extras into a custom dialog with a list, or split into a multi-step prompt."
        />

        <DontRow
          bad="Calling Alert.alert()"
          good="Alert.alert() is unthemed and bypasses the design system. Always reach for `dialog.error/info/loading/open`."
        />
      </Section>
    </Screen>
  );
}

function NamePromptDialog({
  close,
  initialValue = '',
}: {
  close: (result?: string) => void;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <View className="gap-4 pt-2">
      <Text size="h3" align="center">
        What should we call you?
      </Text>
      <TextField
        label="Display name"
        value={value}
        onChangeText={setValue}
        placeholder="Your name"
        autoFocus
      />
      <View className="gap-2">
        <Button onPress={() => close(value)} disabled={!value.trim()}>
          Save
        </Button>
        <Button variant="ghost" onPress={() => close(undefined)}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text size="xs" treatment="caption" tone="tertiary" className="px-2">
        {title}
      </Text>
      <Card variant="raised" size="lg" className="gap-5">
        {children}
      </Card>
    </View>
  );
}

function PropRow({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <View className="gap-2">
      <Text size="xs" tone="tertiary" className="font-mono">
        {label}
      </Text>
      {note ? (
        <Text size="xs" tone="disabled">
          {note}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function DontRow({ bad, good }: { bad: string; good: string }) {
  return (
    <View className="gap-1 rounded-md border border-status-danger/30 bg-status-danger/[0.05] p-3">
      <Text size="xs" tone="danger" weight="bold">
        ✕ {bad}
      </Text>
      <Text size="xs" tone="success">
        ✓ {good}
      </Text>
    </View>
  );
}
