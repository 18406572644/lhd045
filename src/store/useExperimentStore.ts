import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Experiment, ExperimentRecord, Observation, AppSettings } from '../types';
import { generateId } from '../utils/helpers';

interface ExperimentState {
  experiments: Experiment[];
  customExperiments: Experiment[];
  currentExperiment: Experiment | null;
  currentStep: number;
  isPlaying: boolean;
  parameters: Record<string, number>;
  observations: Observation[];
  data: Record<string, number | string>[];
  records: ExperimentRecord[];
  favorites: string[];
  chemicalFavorites: string[];
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  preStudyCompleted: Record<string, boolean>;
  quizPassed: Record<string, boolean>;
}

interface ExperimentActions {
  setExperiments: (experiments: Experiment[]) => void;
  setCurrentExperiment: (experiment: Experiment | null) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setParameter: (id: string, value: number) => void;
  resetParameters: () => void;
  addObservation: (observation: Omit<Observation, 'timestamp'>) => void;
  addDataPoint: (data: Record<string, number | string>) => void;
  setRecords: (records: ExperimentRecord[]) => void;
  addRecord: (record: ExperimentRecord) => void;
  updateRecord: (id: string, updates: Partial<ExperimentRecord>) => void;
  deleteRecord: (id: string) => void;
  setFavorites: (favorites: string[]) => void;
  toggleFavorite: (experimentId: string) => void;
  toggleChemicalFavorite: (chemicalId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetCurrentExperiment: () => void;
  markPreStudyCompleted: (experimentId: string) => void;
  setQuizPassed: (experimentId: string, passed: boolean) => void;
  addCustomExperiment: (experiment: Omit<Experiment, 'id'>) => void;
  updateCustomExperiment: (id: string, updates: Partial<Experiment>) => void;
  deleteCustomExperiment: (id: string) => void;
  setCustomExperiments: (experiments: Experiment[]) => void;
  importCustomExperiment: (experiment: Experiment) => void;
}

const initialSettings: AppSettings = {
  theme: 'light',
  autoPlaySpeed: 1,
  showAnimations: true,
  renderMode: '2d',
  autoDetectRenderMode: true,
  enable3DInteraction: true,
  autoAdjustViewAngle: true
};

export const useExperimentStore = create<ExperimentState & ExperimentActions>()(
  persist(
    (set, get) => ({
      experiments: [],
      customExperiments: [],
      currentExperiment: null,
      currentStep: 0,
      isPlaying: false,
      parameters: {},
      observations: [],
      data: [],
      records: [],
      favorites: [],
      chemicalFavorites: [],
      settings: initialSettings,
      loading: false,
      error: null,
      preStudyCompleted: {},
      quizPassed: {},

      setExperiments: (experiments) => set({ experiments }),

      setCurrentExperiment: (experiment) => {
        if (experiment) {
          const defaultParams: Record<string, number> = {};
          experiment.parameters.forEach(p => {
            defaultParams[p.id] = p.default;
          });
          set({
            currentExperiment: experiment,
            currentStep: 0,
            parameters: defaultParams,
            observations: [],
            data: [],
            isPlaying: false
          });
        } else {
          set({
            currentExperiment: null,
            currentStep: 0,
            parameters: {},
            observations: [],
            data: [],
            isPlaying: false
          });
        }
      },

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentExperiment, currentStep } = get();
        if (currentExperiment && currentStep < currentExperiment.steps.length - 1) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      setIsPlaying: (isPlaying) => set({ isPlaying }),

      setParameter: (id, value) => set((state) => ({
        parameters: { ...state.parameters, [id]: value }
      })),

      resetParameters: () => {
        const { currentExperiment } = get();
        if (currentExperiment) {
          const defaultParams: Record<string, number> = {};
          currentExperiment.parameters.forEach(p => {
            defaultParams[p.id] = p.default;
          });
          set({ parameters: defaultParams });
        }
      },

      addObservation: (observation) => set((state) => ({
        observations: [...state.observations, {
          ...observation,
          timestamp: new Date().toISOString()
        }]
      })),

      addDataPoint: (data) => set((state) => ({
        data: [...state.data, data]
      })),

      setRecords: (records) => set({ records }),

      addRecord: (record) => set((state) => ({
        records: [record, ...state.records]
      })),

      updateRecord: (id, updates) => set((state) => ({
        records: state.records.map(r =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),

      deleteRecord: (id) => set((state) => ({
        records: state.records.filter(r => r.id !== id)
      })),

      setFavorites: (favorites) => set({ favorites }),

      toggleFavorite: (experimentId) => set((state) => {
        const isFavorite = state.favorites.includes(experimentId);
        return {
          favorites: isFavorite
            ? state.favorites.filter(id => id !== experimentId)
            : [...state.favorites, experimentId]
        };
      }),

      toggleChemicalFavorite: (chemicalId) => set((state) => {
        const isFavorite = state.chemicalFavorites.includes(chemicalId);
        return {
          chemicalFavorites: isFavorite
            ? state.chemicalFavorites.filter(id => id !== chemicalId)
            : [...state.chemicalFavorites, chemicalId]
        };
      }),

      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      resetCurrentExperiment: () => {
        const { currentExperiment } = get();
        if (currentExperiment) {
          const defaultParams: Record<string, number> = {};
          currentExperiment.parameters.forEach(p => {
            defaultParams[p.id] = p.default;
          });
          set({
            currentStep: 0,
            parameters: defaultParams,
            observations: [],
            data: [],
            isPlaying: false
          });
        }
      },

      markPreStudyCompleted: (experimentId) => set((state) => ({
        preStudyCompleted: { ...state.preStudyCompleted, [experimentId]: true }
      })),

      setQuizPassed: (experimentId, passed) => set((state) => ({
        quizPassed: { ...state.quizPassed, [experimentId]: passed }
      })),

      addCustomExperiment: (experiment) => set((state) => ({
        customExperiments: [...state.customExperiments, { ...experiment, id: `custom-${generateId()}` }]
      })),

      updateCustomExperiment: (id, updates) => set((state) => ({
        customExperiments: state.customExperiments.map(exp =>
          exp.id === id ? { ...exp, ...updates } : exp
        )
      })),

      deleteCustomExperiment: (id) => set((state) => ({
        customExperiments: state.customExperiments.filter(exp => exp.id !== id)
      })),

      setCustomExperiments: (experiments) => set({ customExperiments: experiments }),

      importCustomExperiment: (experiment) => set((state) => {
        const newId = `custom-${generateId()}`;
        return {
          customExperiments: [...state.customExperiments, { ...experiment, id: newId }]
        };
      })
    }),
    {
      name: 'chemistry-lab-storage',
      partialize: (state) => ({
        records: state.records,
        favorites: state.favorites,
        chemicalFavorites: state.chemicalFavorites,
        settings: state.settings,
        preStudyCompleted: state.preStudyCompleted,
        quizPassed: state.quizPassed,
        customExperiments: state.customExperiments
      })
    }
  )
);
