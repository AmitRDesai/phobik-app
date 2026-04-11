export interface MicroChallengeAIContent {
  title: string;
  prompt: string;
  challengeText: string;
}

export interface MicroChallenge {
  id: string;
  userId: string;
  emotionId: string | null;
  needId: string | null;
  feeling: string | null;
  need: string | null;
  status: string;
  aiResponse: MicroChallengeAIContent | null;
  currentStep: number;
  doseDopamine: number;
  doseOxytocin: number;
  doseSerotonin: number;
  doseEndorphins: number;
  durationSeconds: number;
  reflection: string | null;
  createdAt: string;
  completedAt: string | null;
}
