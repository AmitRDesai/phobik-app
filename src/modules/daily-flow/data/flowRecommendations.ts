import type { AnalysisResult, FlowStepTemplate, TimeOptionId } from './types';
import { getTimeOption } from './timeOptions';

// TODO: replace with real AI-generated analysis when backend lands. For now
// every session produces the same Overthinking-Mind insight — the time-bucket
// only changes how many flow steps appear.

const STEP_TEMPLATES: FlowStepTemplate[] = [
  { id: 'regulate', label: 'Regulate', durationSeconds: 60 },
  { id: 'activate', label: 'Activate', durationSeconds: 45 },
  { id: 'build', label: 'Build', durationSeconds: 45 },
  { id: 'elevate', label: 'Elevate', durationSeconds: 30 },
  { id: 'recover', label: 'Recover', durationSeconds: 60 },
  { id: 'integrate', label: 'Integrate', durationSeconds: 90 },
  { id: 'restore', label: 'Restore', durationSeconds: 120 },
];

const STEP_PRACTICES: Record<string, string> = {
  regulate: 'Physiological Sigh',
  activate: 'Arm Swings',
  build: 'March + Reach',
  elevate: 'Fast Feet',
  recover: 'Recovery Walk',
  integrate: 'Mindful Stretch',
  restore: 'Body Scan',
};

export function buildAnalysisResult(timeOption: TimeOptionId): AnalysisResult {
  const option = getTimeOption(timeOption);
  const stepCount = option?.stepCount ?? 5;
  const flow = STEP_TEMPLATES.slice(0, stepCount).map((step) => ({
    ...step,
    label: `${step.label} · ${STEP_PRACTICES[step.id] ?? step.label}`,
  }));

  return {
    theme: 'The Overthinking Mind',
    observations: [
      {
        title: 'Mentally Busy',
        description: 'Rapid thought cycles detected in speech patterns.',
        icon: 'cloud',
      },
      {
        title: 'Shoulder Tension',
        description: 'Postural markers indicate upper-body bracing.',
        icon: 'body',
      },
      {
        title: 'Buzzing Energy',
        description: 'High-frequency micro-movements detected.',
        icon: 'flash',
      },
      {
        title: 'Activated CNS',
        description: 'Sympathetic nervous system dominant.',
        icon: 'pulse',
      },
    ],
    flow,
  };
}

export function totalFlowSeconds(flow: FlowStepTemplate[]): number {
  return flow.reduce((sum, step) => sum + step.durationSeconds, 0);
}
