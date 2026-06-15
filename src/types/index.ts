export type ChemicalState = 'solid' | 'liquid' | 'gas' | 'aqueous';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SafetyLevel = 'normal' | 'caution' | 'danger';
export type NoteType = 'warning' | 'danger' | 'info';
export type AnimationType = 'heating' | 'mixing' | 'reaction' | 'pouring' | 'bubbling' | 'idle';

export interface ChemicalSubstance {
  formula: string;
  name: string;
  state: ChemicalState;
  color?: string;
}

export interface ChemicalEquation {
  id: string;
  reactants: ChemicalSubstance[];
  products: ChemicalSubstance[];
  conditions: string;
  type: string;
}

export interface ParameterConfig {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  step: number;
}

export interface SafetyNote {
  id: string;
  type: NoteType;
  title: string;
  content: string;
}

export interface AnimationConfig {
  type: AnimationType;
  liquidColor?: string;
  bubbleColor?: string;
  flameIntensity?: number;
  duration: number;
}

export interface DataPoint {
  id: string;
  label: string;
  unit: string;
  expectedValue?: number;
}

export interface ExperimentStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  animationType: AnimationType;
  animationData: AnimationConfig;
  dataPoints?: DataPoint[];
  tips: string[];
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  icon: string;
  safetyLevel: SafetyLevel;
  materials: string[];
  equipment: string[];
  steps: ExperimentStep[];
  equations: ChemicalEquation[];
  parameters: ParameterConfig[];
  notes: SafetyNote[];
}

export interface Observation {
  stepId: number;
  timestamp: string;
  content: string;
}

export interface ExperimentRecord {
  id: string;
  experimentId: string;
  experimentName?: string;
  startTime: string;
  endTime?: string;
  parameters: Record<string, number>;
  observations: Observation[];
  data: Record<string, number | string>[];
  conclusion?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  autoPlaySpeed: number;
  showAnimations: boolean;
}

export interface MockApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
