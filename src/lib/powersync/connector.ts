import type {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  PowerSyncCredentials,
} from '@powersync/react-native';
import { authClient } from '../auth';
import { rpcClient } from '../rpc';
import { env } from '@/utils/env';
import { parseJSON } from './utils';

export class PhobikConnector implements PowerSyncBackendConnector {
  async fetchCredentials(): Promise<PowerSyncCredentials | null> {
    const cookies = authClient.getCookie();
    if (!cookies) return null;

    const { fetch } = await import('expo/fetch');
    const res = await fetch(`${env.get('API_URL')}/api/powersync/token`, {
      headers: { Cookie: cookies },
      credentials: 'omit',
    });

    if (!res.ok) return null;

    const { token, endpoint } = (await res.json()) as {
      token: string;
      endpoint: string;
    };
    return { token, endpoint };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const batch = await database.getCrudBatch(100);
    if (!batch) return;

    try {
      for (const op of batch.crud) {
        await this.processOp(op);
      }
      await batch.complete();
    } catch (e) {
      // Network/5xx errors: throw so PowerSync retries
      // Validation errors should call batch.complete() to unblock the queue
      throw e;
    }
  }

  private async processOp(op: CrudEntry) {
    const { table, opData, id } = op;

    switch (table) {
      case 'journal_entry':
        return this.handleJournalEntry(op);
      case 'journal_tag':
        return this.handleJournalTag(op);
      case 'gentle_letter':
        return this.handleGentleLetter(op);
      case 'empathy_challenge':
        return this.handleEmpathyChallenge(op);
      case 'empathy_challenge_day':
        return this.handleEmpathyChallengeDay(op);
      case 'mystery_challenge':
        return this.handleMysteryChallenge(op);
      case 'self_check_in':
        return this.handleSelfCheckIn(op);
      case 'user_profile':
        return this.handleUserProfile(op);
      case 'calendar_preferences':
        return this.handleCalendarPreferences(op);
      default:
        console.warn(`[PowerSync] Skipping unknown table: ${table}`);
    }
  }

  private async handleJournalEntry(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      if (op.op === 'PUT') {
        await rpcClient.journal.createEntry({
          id: op.id,
          feeling: d?.feeling ?? undefined,
          need: d?.need ?? undefined,
          content: d?.content ?? '',
          title: d?.title ?? undefined,
          tags: parseJSON<string[]>(d?.tags as string) ?? undefined,
          entryDate: d?.entry_date ?? new Date().toISOString().slice(0, 10),
        });
      } else {
        await rpcClient.journal.updateEntry({
          id: op.id,
          ...(d?.feeling !== undefined && { feeling: d.feeling as string }),
          ...(d?.need !== undefined && { need: d.need as string }),
          ...(d?.content !== undefined && { content: d.content as string }),
          ...(d?.title !== undefined && { title: d.title as string }),
          ...(d?.tags !== undefined && {
            tags: parseJSON<string[]>(d.tags as string) ?? [],
          }),
        });
      }
    } else if (op.op === 'DELETE') {
      await rpcClient.journal.deleteEntry({ id: op.id });
    }
  }

  private async handleJournalTag(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.journal.createTag({
        id: op.id,
        name: (d?.name as string) ?? '',
        color: d?.color as string,
      });
    } else if (op.op === 'DELETE') {
      await rpcClient.journal.deleteTag({ id: op.id });
    }
  }

  private async handleGentleLetter(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.gentleLetter.createLetter({
        id: op.id,
        content: parseJSON(d?.content as string) ?? {
          step1: '',
          step2: '',
          step3: '',
          step4: '',
          step5: '',
        },
        coreAct: (d?.core_act as string) ?? 'kindness',
        title: d?.title as string,
        entryDate: d?.entry_date as string,
      });
    }
  }

  private async handleEmpathyChallenge(op: CrudEntry) {
    // Challenge creation is handled as a unit via startChallenge
    // Individual PATCH operations (status changes) don't need separate upload
    // since day completion triggers challenge completion on the backend
  }

  private async handleEmpathyChallengeDay(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PATCH') {
      const status = d?.status as string;
      if (status === 'in_progress') {
        await rpcClient.empathyChallenge.startDay({ dayId: op.id });
      } else if (status === 'completed' && d?.reflection) {
        await rpcClient.empathyChallenge.completeDay({
          dayId: op.id,
          reflection: d.reflection as string,
        });
      }
    }
  }

  private async handleMysteryChallenge(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.mysteryChallenge.recordChallenge({
        id: op.id,
        challengeType: (d?.challenge_type as string) ?? 'breathing',
        doseDopamine: (d?.dose_dopamine as number) ?? 0,
        doseOxytocin: (d?.dose_oxytocin as number) ?? 0,
        doseSerotonin: (d?.dose_serotonin as number) ?? 0,
        doseEndorphins: (d?.dose_endorphins as number) ?? 0,
        durationSeconds: (d?.duration_seconds as number) ?? 0,
      });
    }
  }

  private async handleSelfCheckIn(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.selfCheckIn.startAssessment({
        id: op.id,
        type:
          (d?.type as 'intimacy' | 'pivot-point' | 'stress-compass') ??
          'intimacy',
      });
    } else if (op.op === 'PATCH') {
      const status = d?.status as string;
      if (status === 'completed') {
        await rpcClient.selfCheckIn.completeAssessment({ id: op.id });
      } else if (d?.answers !== undefined) {
        const answers =
          parseJSON<Record<string, number>>(d.answers as string) ?? {};
        const currentQuestion = (d?.current_question as number) ?? 0;
        // Find the latest answer to send
        const questionIds = Object.keys(answers).map(Number);
        const latestQ = Math.max(...questionIds, 0);
        if (latestQ > 0) {
          await rpcClient.selfCheckIn.saveAnswer({
            id: op.id,
            questionId: latestQ,
            answer: answers[String(latestQ)] ?? 0,
            currentQuestion,
          });
        }
      }
    } else if (op.op === 'DELETE') {
      await rpcClient.selfCheckIn.abandonAssessment({ id: op.id });
    }
  }

  private async handleUserProfile(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      // Profile uses upsert on userId — always safe to call saveProfile
      if (
        d?.age_range !== undefined ||
        d?.gender_identity !== undefined ||
        d?.goals !== undefined
      ) {
        await rpcClient.profile.saveProfile({
          ageRange: d?.age_range as string,
          genderIdentity: d?.gender_identity as string,
          goals: parseJSON<string[]>(d?.goals as string) ?? [],
          termsAcceptedAt: d?.terms_accepted_at as string,
          privacyAcceptedAt: d?.privacy_accepted_at as string,
        });
      }
      if (d?.stressors !== undefined || d?.triggers !== undefined) {
        await rpcClient.profile.saveOnboardingAnswers({
          stressors: parseJSON<string[]>(d?.stressors as string) ?? [],
          triggers: parseJSON<string[]>(d?.triggers as string) ?? [],
          customTrigger: (d?.custom_trigger as string) ?? '',
          reminderPreference: d?.reminder_preference as string,
          regulationTools:
            parseJSON<string[]>(d?.regulation_tools as string) ?? [],
          customTool: (d?.custom_tool as string) ?? '',
          energyFocus: d?.energy_focus as string,
          energyCreativity: d?.energy_creativity as string,
          energyDip: d?.energy_dip as string,
        });
      }
      if (d?.onboarding_completed_at !== undefined) {
        await rpcClient.profile.completeOnboarding();
      }
    }
  }

  private async handleCalendarPreferences(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      await rpcClient.calendar.savePreferences({
        calendarConnected: Boolean(d?.calendar_connected),
        selectedCalendarIds:
          parseJSON<string[]>(d?.selected_calendar_ids as string) ?? [],
        checkInTiming: (d?.check_in_timing as string) ?? null,
        supportTone: (d?.support_tone as string) ?? null,
      });
    }
  }
}
