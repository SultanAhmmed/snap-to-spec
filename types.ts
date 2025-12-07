export interface RepairStep {
  stepNumber: number;
  action: string;
  explanation: string;
}

export enum DifficultyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert"
}

export interface RepairGuideData {
  itemName: string;
  modelNumber?: string;
  damageAnalysis: string;
  difficultyLevel: DifficultyLevel;
  toolsRequired: string[];
  estimatedTime: string;
  safetyWarnings: string[];
  repairSteps: RepairStep[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: RepairGuideData | null;
}
