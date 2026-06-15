import type { Experiment, Difficulty, SafetyLevel, ExperimentStep, ChemicalEquation, ParameterConfig, DataPoint, AnimationType } from '../../../types';
import type { ChemicalItem, EquipmentItem } from '../../../data/library';

export type EditorStep = 1 | 2 | 3 | 4 | 5;

export interface SelectedEquipment {
  item: EquipmentItem;
  quantity: number;
}

export interface SelectedChemical {
  item: ChemicalItem;
  quantity: string;
}

export interface EditorState {
  currentEditorStep: EditorStep;
  basicInfo: {
    name: string;
    description: string;
    difficulty: Difficulty;
    safetyLevel: SafetyLevel;
    category: string;
    duration: number;
    icon: string;
  };
  equipment: SelectedEquipment[];
  chemicals: SelectedChemical[];
  steps: ExperimentStep[];
  equations: ChemicalEquation[];
  parameters: ParameterConfig[];
}

export const initialEditorState: EditorState = {
  currentEditorStep: 1,
  basicInfo: {
    name: '',
    description: '',
    difficulty: 'easy',
    safetyLevel: 'normal',
    category: '自定义实验',
    duration: 10,
    icon: 'flask-conical'
  },
  equipment: [],
  chemicals: [],
  steps: [],
  equations: [],
  parameters: []
};

export const createEmptyStep = (id: number): ExperimentStep => ({
  id,
  title: `步骤 ${id}`,
  description: '',
  duration: 2,
  animationType: 'idle' as AnimationType,
  animationData: {
    type: 'idle' as AnimationType,
    duration: 2
  },
  tips: ['']
});

export const createEmptyEquation = (): ChemicalEquation => ({
  id: `eq-${Date.now()}`,
  reactants: [],
  products: [],
  conditions: '',
  type: ''
});

export const createEmptyParameter = (): ParameterConfig => ({
  id: `param-${Date.now()}`,
  name: '',
  unit: '',
  min: 0,
  max: 100,
  default: 50,
  step: 1
});

export const createEmptyDataPoint = (): DataPoint => ({
  id: `dp-${Date.now()}`,
  label: '',
  unit: '',
  expectedValue: undefined
});

export const convertEditorStateToExperiment = (state: EditorState): Omit<Experiment, 'id'> => {
  const materials = state.chemicals.map(c => `${c.item.name} ${c.quantity ? `(${c.quantity})` : ''}`);
  const equipment = state.equipment.map(e => `${e.item.name}${e.quantity > 1 ? ` × ${e.quantity}` : ''}`);

  return {
    name: state.basicInfo.name,
    description: state.basicInfo.description,
    category: state.basicInfo.category,
    difficulty: state.basicInfo.difficulty,
    duration: state.basicInfo.duration,
    icon: state.basicInfo.icon,
    safetyLevel: state.basicInfo.safetyLevel,
    materials,
    equipment,
    steps: state.steps,
    equations: state.equations,
    parameters: state.parameters,
    notes: [],
    preKnowledge: [],
    quizQuestions: [],
    quizRequired: false
  };
};

export const validateEditorState = (state: EditorState): string[] => {
  const errors: string[] = [];

  if (!state.basicInfo.name.trim()) {
    errors.push('请输入实验名称');
  }
  if (!state.basicInfo.description.trim()) {
    errors.push('请输入实验描述');
  }
  if (state.equipment.length === 0) {
    errors.push('请至少选择一种实验器材');
  }
  if (state.chemicals.length === 0) {
    errors.push('请至少选择一种实验药品');
  }
  if (state.steps.length === 0) {
    errors.push('请至少添加一个实验步骤');
  }

  state.steps.forEach((step, index) => {
    if (!step.title.trim()) {
      errors.push(`步骤 ${index + 1} 请输入标题`);
    }
    if (!step.description.trim()) {
      errors.push(`步骤 ${index + 1} 请输入描述`);
    }
  });

  return errors;
};
