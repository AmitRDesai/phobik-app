import { env } from '@/utils/env';
import type {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  PowerSyncCredentials,
} from '@powersync/react-native';
import { authClient } from '../auth';
import { rpcClient } from '../rpc';
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
        await this.processOp(op, database);
      }
      await batch.complete();
    } catch (e) {
      // Network/5xx errors: throw so PowerSync retries
      // Validation errors should call batch.complete() to unblock the queue
      throw e;
    }
  }

  private async processOp(op: CrudEntry, database: AbstractPowerSyncDatabase) {
    const { table, opData, id } = op;

    switch (table) {
      case 'journal_entry':
        return this.handleJournalEntry(op);
      case 'journal_tag':
        return this.handleJournalTag(op);
      case 'gentle_letter':
        return this.handleGentleLetter(op);
      case 'song':
        return this.handleSong(op);
      case 'empathy_challenge':
        return this.handleEmpathyChallenge(op, database);
      case 'empathy_challenge_day':
        return this.handleEmpathyChallengeDay(op);
      case 'micro_challenge':
        return this.handleMicroChallenge(op);
      case 'mystery_challenge':
        return this.handleMysteryChallenge(op);
      case 'self_check_in':
        return this.handleSelfCheckIn(op);
      case 'user_affirmation':
        return this.handleUserAffirmation(op);
      case 'energy_check_in':
        return this.handleEnergyCheckIn(op);
      case 'practice_session':
        return this.handlePracticeSession(op);
      case 'pack_purchase':
        return this.handlePackPurchase(op);
      case 'ebook_progress':
        return this.handleEbookProgress(op);
      case 'notification_settings':
        return this.handleNotificationSettings(op);
      case 'notification':
        return this.handleNotification(op);
      case 'user_profile':
        return this.handleUserProfile(op);
      case 'calendar_preferences':
        return this.handleCalendarPreferences(op);
      case 'daily_flow_session':
        return this.handleDailyFlowSession(op);
      case 'morning_reset_session':
        return this.handleMorningResetSession(op);
      case 'biometric_reading':
        return this.handleBiometricReading(op);
      case 'sleep_session':
        return this.handleSleepSession(op);
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
          hrAtEntry: (d?.hr_at_entry as number | null) ?? null,
          hrvAtEntry: (d?.hrv_at_entry as number | null) ?? null,
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

  private async handleSong(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      // Server-only fields (status='generating'/'ready'/'failed', audio_key, etc.) are
      // written by the backend and replicate down — don't echo them back up.
      const status = d?.status as string | undefined;
      if (status && status !== 'draft') return;

      await rpcClient.song.upsert({
        id: op.id,
        prompt: (d?.prompt as string) ?? '',
        style: d?.style !== undefined ? (d.style as string) : undefined,
        isFavorite:
          d?.is_favorite !== undefined ? Boolean(d.is_favorite) : undefined,
        title: d?.title !== undefined ? (d.title as string | null) : undefined,
      });
    } else if (op.op === 'DELETE') {
      await rpcClient.song.delete({ id: op.id });
    }
  }

  private async handleEmpathyChallenge(
    op: CrudEntry,
    database: AbstractPowerSyncDatabase,
  ) {
    if (op.op === 'PUT') {
      // Read the client-generated day IDs from local SQLite so the server
      // uses the same IDs — prevents ID mismatch during sync reconciliation
      const days = await database.getAll<{ id: string }>(
        'SELECT id FROM empathy_challenge_day WHERE challenge_id = ? ORDER BY day_number ASC',
        [op.id],
      );
      const dayIds = days.map((d) => d.id);
      await rpcClient.empathyChallenge.startChallenge({
        id: op.id,
        dayIds: dayIds.length === 7 ? dayIds : undefined,
      });
    }
    // PATCH operations (status changes like 'abandoned', 'completed') are
    // handled by the server via startChallenge/completeDay — no separate upload needed
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

  private async handleMicroChallenge(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.microChallenge.startChallenge({ id: op.id });
    } else if (op.op === 'PATCH') {
      const status = d?.status as string | undefined;
      if (status === 'completed') {
        await rpcClient.microChallenge.completeChallenge({
          id: op.id,
          reflection: (d?.reflection as string) ?? undefined,
          durationSeconds: (d?.duration_seconds as number) ?? undefined,
        });
      } else if (status === 'abandoned') {
        await rpcClient.microChallenge.abandonChallenge({ id: op.id });
      } else {
        // Partial update (emotion, need, step, dose, AI response)
        await rpcClient.microChallenge.updateChallenge({
          id: op.id,
          emotionId: (d?.emotion_id as string) ?? undefined,
          needId: (d?.need_id as string) ?? undefined,
          feeling: (d?.feeling as string) ?? undefined,
          need: (d?.need as string) ?? undefined,
          currentStep: (d?.current_step as number) ?? undefined,
          aiResponse: d?.ai_response
            ? (parseJSON(d.ai_response as string) ?? undefined)
            : undefined,
          doseDopamine: (d?.dose_dopamine as number) ?? undefined,
          doseOxytocin: (d?.dose_oxytocin as number) ?? undefined,
          doseSerotonin: (d?.dose_serotonin as number) ?? undefined,
          doseEndorphins: (d?.dose_endorphins as number) ?? undefined,
          durationSeconds: (d?.duration_seconds as number) ?? undefined,
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

  private async handlePracticeSession(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.practiceSession.recordSession({
        id: op.id,
        practiceType: (d?.practice_type as string) ?? '',
        doseDopamine: (d?.dose_dopamine as number) ?? 0,
        doseOxytocin: (d?.dose_oxytocin as number) ?? 0,
        doseSerotonin: (d?.dose_serotonin as number) ?? 0,
        doseEndorphins: (d?.dose_endorphins as number) ?? 0,
        durationSeconds: (d?.duration_seconds as number) ?? 0,
      });
    }
  }

  private async handleUserAffirmation(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.affirmation.createAffirmation({
        id: op.id,
        feeling: (d?.feeling as string) ?? '',
        text: (d?.text as string) ?? '',
        selectedDate: (d?.selected_date as string) ?? '',
      });
    }
  }

  private async handleEnergyCheckIn(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT') {
      await rpcClient.energyCheckIn.createEnergyCheckIn({
        id: op.id,
        purpose: (d?.purpose as number) ?? 0,
        mental: (d?.mental as number) ?? 0,
        physical: (d?.physical as number) ?? 0,
        relationship: (d?.relationship as number) ?? 0,
        energyIndex: (d?.energy_index as number) ?? 0,
        selectedDate: (d?.selected_date as string) ?? '',
      });
    }
  }

  private async handlePackPurchase(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      await rpcClient.packPurchase.recordPurchase({
        id: op.id,
        packId: (d?.pack_id as string) ?? '',
        productId: (d?.product_id as string) ?? '',
        purchasedAt: (d?.purchased_at as string) ?? undefined,
      });
    }
  }

  private async handleEbookProgress(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      const completedChaptersRaw = d?.completed_chapters;
      const completedChapters =
        typeof completedChaptersRaw === 'string'
          ? (parseJSON<number[]>(completedChaptersRaw) ?? undefined)
          : undefined;

      await rpcClient.ebookProgress.updateProgress({
        id: op.id,
        purchased:
          d?.purchased !== undefined ? Boolean(d.purchased) : undefined,
        introSeen:
          d?.intro_seen !== undefined ? Boolean(d.intro_seen) : undefined,
        lastChapterId:
          d?.last_chapter_id !== undefined
            ? ((d.last_chapter_id as number | null) ?? null)
            : undefined,
        completedChapters,
      });
    }
  }

  private async handleNotificationSettings(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      await rpcClient.notificationSettings.updateSettings({
        id: op.id,
        dailyReminders:
          d?.daily_reminders !== undefined
            ? Boolean(d.daily_reminders)
            : undefined,
        checkInReminders:
          d?.check_in_reminders !== undefined
            ? Boolean(d.check_in_reminders)
            : undefined,
        challengeNotifications:
          d?.challenge_notifications !== undefined
            ? Boolean(d.challenge_notifications)
            : undefined,
      });
    }
  }

  private async handleNotification(op: CrudEntry) {
    const d = op.opData;

    if (op.op === 'PATCH') {
      // Local mark-as-read: only sync if read_at was set
      if (d?.read_at !== undefined && d?.read_at !== null) {
        await rpcClient.notification.markRead({ id: op.id });
      }
    } else if (op.op === 'PUT') {
      // Locally created notifications (rare — most come from the server)
      const type = (d?.type as string) ?? 'system';
      await rpcClient.notification.createNotification({
        id: op.id,
        type: type as
          | 'system'
          | 'reminder'
          | 'challenge'
          | 'community'
          | 'coach',
        title: (d?.title as string) ?? '',
        body: (d?.body as string) ?? '',
        data: parseJSON(d?.data as string) ?? undefined,
      });
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
          reminderPreference: (d?.reminder_preference as string) || null,
          regulationTools:
            parseJSON<string[]>(d?.regulation_tools as string) ?? [],
          customTool: (d?.custom_tool as string) ?? '',
          energyFocus: (d?.energy_focus as string) || null,
          energyCreativity: (d?.energy_creativity as string) || null,
          energyDip: (d?.energy_dip as string) || null,
        });
      }
      if (d?.onboarding_completed_at !== undefined) {
        await rpcClient.profile.completeOnboarding();
      }
    }
  }

  private async handleDailyFlowSession(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      const status = d?.status as
        | 'in_progress'
        | 'completed'
        | 'abandoned'
        | undefined;

      if (status === 'completed') {
        await rpcClient.dailyFlow.completeSession({
          id: op.id,
          reflection: (d?.reflection as string) ?? '',
        });
        return;
      }

      if (status === 'abandoned') {
        await rpcClient.dailyFlow.abandonSession({ id: op.id });
        return;
      }

      const addOns = parseJSON<{ eft: boolean; bilateral: boolean }>(
        d?.add_ons as string,
      );

      await rpcClient.dailyFlow.upsertSession({
        id: op.id,
        status: (status as 'in_progress') ?? undefined,
        currentStep:
          (d?.current_step as
            | 'intro'
            | 'feeling'
            | 'feeling_detail'
            | 'guide'
            | 'intention'
            | 'detailed_feeling'
            | 'support_options'
            | 'player'
            | 'bi_lateral_tutorial'
            | 'eft_guide'
            | 'eft_toh_focus'
            | 'tapping'
            | 'reflection') ?? undefined,
        startedAt: (d?.started_at as string) ?? undefined,
        feeling: d?.feeling !== undefined ? (d.feeling as string) : undefined,
        intention:
          d?.intention !== undefined ? (d.intention as string) : undefined,
        supportOption:
          d?.support_option !== undefined
            ? (d.support_option as string)
            : undefined,
        addOns: addOns ?? undefined,
        reflection:
          d?.reflection !== undefined ? (d.reflection as string) : undefined,
      });
    }
  }

  private async handleMorningResetSession(op: CrudEntry) {
    const d = op.opData;
    if (op.op === 'PUT' || op.op === 'PATCH') {
      const status = d?.status as
        | 'in_progress'
        | 'completed'
        | 'abandoned'
        | undefined;

      if (status === 'completed') {
        await rpcClient.morningReset.completeSession({ id: op.id });
        return;
      }

      if (status === 'abandoned') {
        await rpcClient.morningReset.abandonSession({ id: op.id });
        return;
      }

      await rpcClient.morningReset.upsertSession({
        id: op.id,
        status: (status as 'in_progress') ?? undefined,
        currentStep:
          (d?.current_step as
            | 'landing'
            | 'light_exposure'
            | 'stillness'
            | 'mental_reset'
            | 'movement'
            | 'cold_exposure'
            | 'nourishment'
            | 'deep_focus') ?? undefined,
        startedAt: (d?.started_at as string) ?? undefined,
      });
    }
  }

  private async handleBiometricReading(op: CrudEntry) {
    const d = op.opData;
    if (op.op !== 'PUT') return;
    const metric = d?.metric as
      | 'heart_rate'
      | 'hrv_sdnn'
      | 'hrv_rmssd'
      | 'resting_hr'
      | 'respiratory_rate'
      | undefined;
    const source = d?.source as 'apple_health' | 'health_connect' | undefined;
    const unit = d?.unit as 'bpm' | 'ms' | 'breaths_per_min' | undefined;
    const value = d?.value as number | undefined;
    const recordedAt = d?.recorded_at as string | undefined;
    if (!metric || !source || !unit || value == null || !recordedAt) return;
    await rpcClient.biometricReading.recordReading({
      id: op.id,
      metric,
      value,
      unit,
      source,
      recordedAt,
    });
  }

  private async handleSleepSession(op: CrudEntry) {
    const d = op.opData;
    if (op.op !== 'PUT') return;
    const source = d?.source as 'apple_health' | 'health_connect' | undefined;
    const startTime = d?.start_time as string | undefined;
    const endTime = d?.end_time as string | undefined;
    const recordedAt = d?.recorded_at as string | undefined;
    if (!source || !startTime || !endTime || !recordedAt) return;
    await rpcClient.sleepSession.recordSession({
      id: op.id,
      startTime,
      endTime,
      inBedMinutes: (d?.in_bed_minutes as number) ?? 0,
      totalMinutes: (d?.total_minutes as number) ?? 0,
      deepMinutes: (d?.deep_minutes as number | null) ?? null,
      remMinutes: (d?.rem_minutes as number | null) ?? null,
      lightMinutes: (d?.light_minutes as number | null) ?? null,
      awakeMinutes: (d?.awake_minutes as number | null) ?? null,
      efficiencyPct: (d?.efficiency_pct as number | null) ?? null,
      restorativePct: (d?.restorative_pct as number | null) ?? null,
      source,
      recordedAt,
    });
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
