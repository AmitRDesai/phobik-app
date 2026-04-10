import { db } from '@/lib/powersync/database';
import { useUserId } from '@/lib/powersync/useUserId';
import { toJSON } from '@/lib/powersync/utils';
import { useMutation } from '@tanstack/react-query';

export function useSaveOnboardingAnswers() {
  const userId = useUserId();

  return useMutation({
    mutationFn: async (input: {
      stressors: string[];
      triggers: string[];
      customTrigger: string;
      reminderPreference: string | null;
      regulationTools: string[];
      customTool: string;
      energyFocus: string | null;
      energyCreativity: string | null;
      energyDip: string | null;
    }) => {
      if (!userId) throw new Error('Not authenticated');

      await db
        .updateTable('user_profile')
        .set({
          stressors: toJSON(input.stressors),
          triggers: toJSON(input.triggers),
          custom_trigger: input.customTrigger,
          reminder_preference: input.reminderPreference,
          regulation_tools: toJSON(input.regulationTools),
          custom_tool: input.customTool,
          energy_focus: input.energyFocus,
          energy_creativity: input.energyCreativity,
          energy_dip: input.energyDip,
          updated_at: new Date().toISOString(),
        })
        .where('user_id', '=', userId)
        .execute();
    },
  });
}
