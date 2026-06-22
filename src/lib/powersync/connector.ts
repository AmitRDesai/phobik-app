import { env } from '@/utils/env';
import type {
  ActivityLevel,
  AgeRange,
  EmotionalState,
  FoodPreference,
  GenderIdentity,
  Goal,
  SedentaryTime,
  SleepQuality,
} from '@/store/onboarding';
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

    // Network failures (offline, DNS, TLS) reject here and propagate to
    // PowerSync, which retries — we never want to silently halt sync on a
    // transient error by returning null (that reads as "not authenticated").
    const { fetch } = await import('expo/fetch');
    const res = await fetch(`${env.get('API_URL')}/api/powersync/token`, {
      headers: { Cookie: cookies },
      credentials: 'omit',
    });

    // Only a genuine "not authenticated" response (401) maps to null, which
    // tells PowerSync to stop until the session is restored. A 5xx (or any
    // other non-ok status) is transient — throw so PowerSync retries instead
    // of stalling on a stale/empty token.
    if (res.status === 401) return null;
    if (!res.ok) {
      throw new Error(
        `[PowerSync] token endpoint returned ${res.status} ${res.statusText}`,
      );
    }

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

    // Each handler below forwards only the ops that have a matching oRPC
    // procedure. Ops with no handler branch (e.g. a DELETE on an append-only
    // table) are intentionally not synced: gentle_letter, mystery_challenge,
    // user_affirmation, energy_check_in, and practice_session have no delete
    // feature, so the missing DELETE branches are deliberate — there is no
    // backend procedure to call. Do NOT invent handlers for non-existent
    // procedures (e.g. gentleLetter.deleteLetter does not exist).
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
      case 'data_source_preference':
        return this.handleDataSourcePreference(op, database);
      default:
        // No upload handler for this table — intentionally not synced upward.
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
        // Only forward fields that actually changed — sending `prompt: ''`
        // on a partial PATCH (e.g. favorite toggle) would overwrite the
        // stored poem with empty string on the backend.
        prompt: d?.prompt !== undefined ? (d.prompt as string) : undefined,
        style: d?.style !== undefined ? (d.style as string) : undefined,
        isFavorite:
          d?.is_favorite !== undefined ? Boolean(d.is_favorite) : undefined,
        title: d?.title !== undefined ? (d.title as string | null) : undefined,
        source: d?.source !== undefined ? (d.source as string) : undefined,
        inputMeta:
          d?.input_meta !== undefined
            ? (parseJSON<Record<string, unknown>>(d.input_meta as string) ??
              null)
            : undefined,
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
      } else if (status === 'completed') {
        // Complete on any 'completed' PATCH — gating on a truthy reflection
        // silently dropped completions with an empty reflection, leaving the
        // day stuck in_progress forever. completeDay accepts an empty string.
        await rpcClient.empathyChallenge.completeDay({
          dayId: op.id,
          reflection: (d?.reflection as string) ?? '',
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
        // Send the FULL answers map, not just the latest question. When
        // multiple answers are coalesced into one PATCH (offline batching),
        // sending only Math.max(questionId) drops the rest — real data loss.
        // saveAnswer merges into the server answers JSON and is idempotent,
        // so re-sending the cumulative set ascending is safe.
        const questionIds: number[] = [];
        for (const k of Object.keys(answers)) {
          const q = Number(k);
          if (q > 0) questionIds.push(q);
        }
        questionIds.sort((a, b) => a - b);
        for (const questionId of questionIds) {
          await rpcClient.selfCheckIn.saveAnswer({
            id: op.id,
            questionId,
            answer: answers[String(questionId)] ?? 0,
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
        d?.goals !== undefined ||
        d?.terms_accepted_at !== undefined ||
        d?.privacy_accepted_at !== undefined
      ) {
        await rpcClient.profile.saveProfile({
          ageRange: (d?.age_range as AgeRange) ?? null,
          genderIdentity: (d?.gender_identity as GenderIdentity) ?? null,
          goals: parseJSON<Goal[]>(d?.goals as string) ?? [],
          termsAcceptedAt: (d?.terms_accepted_at as string) ?? null,
          privacyAcceptedAt: (d?.privacy_accepted_at as string) ?? null,
        });
      }
      if (
        d?.emotional_state !== undefined ||
        d?.sleep_quality !== undefined ||
        d?.activity_level !== undefined ||
        d?.sedentary_time !== undefined ||
        d?.food_preferences !== undefined ||
        d?.habit_ratings !== undefined ||
        d?.goal_details !== undefined
      ) {
        await rpcClient.profile.saveOnboardingAnswers({
          goalDetails: (d?.goal_details as string) ?? '',
          emotionalState:
            parseJSON<EmotionalState[]>(d?.emotional_state as string) ?? [],
          sleepQuality: (d?.sleep_quality as SleepQuality) || null,
          activityLevel: (d?.activity_level as ActivityLevel) || null,
          sedentaryTime: (d?.sedentary_time as SedentaryTime) || null,
          foodPreferences:
            parseJSON<FoodPreference[]>(d?.food_preferences as string) ?? [],
          foodPreferencesOther: (d?.food_preferences_other as string) ?? '',
          habitRatings:
            parseJSON<Record<string, number>>(d?.habit_ratings as string) ?? {},
        });
      }
      if (d?.onboarding_completed_at !== undefined) {
        await rpcClient.profile.completeOnboarding();
      }
    }
  }

  private async handleDailyFlowSession(op: CrudEntry) {
    const d = op.opData;
    if (op.op !== 'PUT' && op.op !== 'PATCH') return;

    const status = d?.status as
      | 'in_progress'
      | 'completed'
      | 'abandoned'
      | undefined;

    if (status === 'completed') {
      await rpcClient.dailyFlow.completeSession({
        id: op.id,
        effectRating:
          (d?.effect_rating as 'worse' | 'same' | 'better') ?? 'same',
        reflectionText: (d?.reflection_text as string) ?? '',
      });
      return;
    }

    if (status === 'abandoned') {
      await rpcClient.dailyFlow.abandonSession({ id: op.id });
      return;
    }

    await rpcClient.dailyFlow.upsertSession({
      id: op.id,
      status: (status as 'in_progress') ?? undefined,
      currentStep:
        (d?.current_step as
          | 'intro'
          | 'stressor'
          | 'check_in'
          | 'feeling'
          | 'body_map'
          | 'body_sensations'
          | 'body_insight'
          | 'ai_analysis'
          | 'player'
          | 'reflection') ?? undefined,
      startedAt: (d?.started_at as string) ?? undefined,
      timeOption:
        d?.time_option !== undefined ? (d.time_option as string) : undefined,
      emotionalFamilies:
        d?.emotional_families !== undefined
          ? (parseJSON<string[]>(d.emotional_families as string) ?? [])
          : undefined,
      feelingIntensities:
        d?.feeling_intensities !== undefined
          ? (parseJSON<Record<string, number>>(
              d.feeling_intensities as string,
            ) ?? {})
          : undefined,
      stressor: d?.stressor !== undefined ? (d.stressor as string) : undefined,
      checkInState:
        d?.check_in_state !== undefined
          ? (d.check_in_state as string)
          : undefined,
      affirmationText:
        d?.affirmation_text !== undefined
          ? (d.affirmation_text as string)
          : undefined,
      affirmationCategory:
        d?.affirmation_category !== undefined
          ? (d.affirmation_category as string)
          : undefined,
      bodyRegions:
        d?.body_regions !== undefined
          ? (parseJSON<string[]>(d.body_regions as string) ?? [])
          : undefined,
      sensations:
        d?.sensations !== undefined
          ? (parseJSON<string[]>(d.sensations as string) ?? [])
          : undefined,
      analysisResult:
        d?.analysis_result !== undefined
          ? parseJSON(d.analysis_result as string)
          : undefined,
      effectRating:
        d?.effect_rating !== undefined
          ? (d.effect_rating as 'worse' | 'same' | 'better')
          : undefined,
    });
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

  private async handleDataSourcePreference(
    op: CrudEntry,
    database: AbstractPowerSyncDatabase,
  ) {
    if (op.op !== 'PUT' && op.op !== 'PATCH') return;
    // A PATCH (changing an existing preference) only carries the columns whose
    // value changed — so `data_type` is absent when only `source` changes. Read
    // the authoritative local row to get both, regardless of the op shape;
    // otherwise the upload is dropped and the picker reverts.
    const rows = await database.getAll<{ data_type: string; source: string }>(
      'SELECT data_type, source FROM data_source_preference WHERE id = ?',
      [op.id],
    );
    const row = rows[0];
    if (!row?.data_type || !row?.source) return;
    await rpcClient.health.setDataSourcePreference({
      id: op.id,
      dataType: row.data_type,
      source: row.source,
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
