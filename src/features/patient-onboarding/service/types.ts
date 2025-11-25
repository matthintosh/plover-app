export type OnboardingResponse = {
  id: string;
  patientId: string;
  age: number;
  diet: string;
  sleep: string;
  bruxismClenching: boolean;
  completedAt: string;
};

export type OnboardingInput = {
  age: number;
  diet: string;
  sleep: string;
  bruxismClenching: boolean;
};

