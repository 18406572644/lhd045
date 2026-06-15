import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper, Text, Stack, Group, Button, Progress, Container,
  ActionIcon, Tooltip
} from '@mantine/core';
import {
  X, ArrowLeft, ArrowRight, Info, Beaker, ListOrdered, Atom, Eye
} from 'lucide-react';
import type { Experiment } from '../../../types';
import { useExperimentStore } from '../../../store/useExperimentStore';
import { initialEditorState, EditorState, EditorStep, convertEditorStateToExperiment } from './types';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Equipment } from './Step2Equipment';
import { Step3Steps } from './Step3Steps';
import { Step4Equations } from './Step4Equations';
import { Step5Preview } from './Step5Preview';

interface ExperimentEditorProps {
  onClose: () => void;
  editExperiment?: Experiment;
}

const stepInfo = [
  { step: 1 as EditorStep, icon: Info, label: '基本信息', color: '#1E6FBA' },
  { step: 2 as EditorStep, icon: Beaker, label: '器材药品', color: '#10B981' },
  { step: 3 as EditorStep, icon: ListOrdered, label: '实验步骤', color: '#8B5CF6' },
  { step: 4 as EditorStep, icon: Atom, label: '方程式参数', color: '#F59E0B' },
  { step: 5 as EditorStep, icon: Eye, label: '预览保存', color: '#06B6D4' },
];

export const ExperimentEditor: React.FC<ExperimentEditorProps> = ({ onClose, editExperiment }) => {
  const { settings, addCustomExperiment, updateCustomExperiment } = useExperimentStore();

  const [state, setState] = useState<EditorState>(() => {
    if (editExperiment) {
      return {
        ...initialEditorState,
        basicInfo: {
          name: editExperiment.name,
          description: editExperiment.description,
          difficulty: editExperiment.difficulty,
          safetyLevel: editExperiment.safetyLevel,
          category: editExperiment.category,
          duration: editExperiment.duration,
          icon: editExperiment.icon,
        },
        steps: editExperiment.steps,
        equations: editExperiment.equations,
        parameters: editExperiment.parameters,
        currentEditorStep: 1 as EditorStep,
        equipment: [],
        chemicals: [],
      };
    }
    return initialEditorState;
  });

  const updateState = useCallback((updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = (step: EditorStep) => {
    updateState({ currentEditorStep: step });
  };

  const nextStep = () => {
    if (state.currentEditorStep < 5) {
      goToStep((state.currentEditorStep + 1) as EditorStep);
    }
  };

  const prevStep = () => {
    if (state.currentEditorStep > 1) {
      goToStep((state.currentEditorStep - 1) as EditorStep);
    }
  };

  const handleSave = (experiment: Omit<Experiment, 'id'>) => {
    if (editExperiment) {
      updateCustomExperiment(editExperiment.id, experiment);
    } else {
      addCustomExperiment(experiment);
    }
  };

  const progress = (state.currentEditorStep / 5) * 100;

  const canGoNext = () => {
    switch (state.currentEditorStep) {
      case 1:
        return state.basicInfo.name.trim() && state.basicInfo.description.trim();
      case 2:
        return state.equipment.length > 0 && state.chemicals.length > 0;
      case 3:
        return state.steps.length > 0;
      default:
        return true;
    }
  };

  const renderCurrentStep = () => {
    switch (state.currentEditorStep) {
      case 1:
        return (
          <Step1BasicInfo
            value={state.basicInfo}
            onChange={(basicInfo) => updateState({ basicInfo })}
          />
        );
      case 2:
        return (
          <Step2Equipment
            equipment={state.equipment}
            chemicals={state.chemicals}
            onEquipmentChange={(equipment) => updateState({ equipment })}
            onChemicalsChange={(chemicals) => updateState({ chemicals })}
          />
        );
      case 3:
        return (
          <Step3Steps
            steps={state.steps}
            onChange={(steps) => updateState({ steps })}
          />
        );
      case 4:
        return (
          <Step4Equations
            equations={state.equations}
            parameters={state.parameters}
            onEquationsChange={(equations) => updateState({ equations })}
            onParametersChange={(parameters) => updateState({ parameters })}
            selectedChemicalIds={state.chemicals.map(c => c.item.id)}
          />
        );
      case 5:
        return (
          <Step5Preview
            editorState={state}
            onSave={handleSave}
            onBack={() => goToStep(4)}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: settings.theme === 'light'
          ? 'rgba(0, 0, 0, 0.5)'
          : 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '1200px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Container size="xl" py="md">
          <Stack gap="lg">
            <Paper
              p="lg"
              radius="lg"
              withBorder
              style={{
                background: settings.theme === 'light'
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
                  : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
              }}
            >
              <Group justify="space-between">
                <Group gap="sm">
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #1E6FBA 0%, #3B82F6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                      <Beaker size={24} color="white" />
                    </div>
                    <Stack gap={2}>
                      <Text fw={700} size="xl">
                        {editExperiment ? '编辑实验' : '创建自定义实验'}
                      </Text>
                      <Text size="sm" c="dimmed">
                        步骤 {state.currentEditorStep} / 5
                      </Text>
                    </Stack>
                  </Group>
                  <Tooltip label="关闭">
                    <ActionIcon size="lg" variant="subtle" onClick={onClose}>
                      <X size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                <Stack gap="md" mt="md">
                  <Progress
                    value={progress}
                    size="lg"
                    radius="xl"
                    color="labBlue"
                    styles={{
                      root: { background: settings.theme === 'light' ? '#E2E8F0' : '#334155' }
                    }}
                  />

                  <Group justify="space-between" grow>
                    {stepInfo.map((info) => {
                      const Icon = info.icon;
                      const isActive = state.currentEditorStep === info.step;
                      const isCompleted = state.currentEditorStep > info.step;

                      return (
                        <Button
                          key={info.step}
                          variant={isActive ? 'filled' : isCompleted ? 'light' : 'subtle'}
                          color={isActive || isCompleted ? 'labBlue' : 'gray'}
                          leftSection={<Icon size={16} />}
                          onClick={() => goToStep(info.step)}
                          styles={{
                            root: {
                              opacity: isActive || isCompleted ? 1 : 0.6,
                            }
                          }}
                        >
                          {info.label}
                        </Button>
                      );
                    })}
                  </Group>
                </Stack>
            </Paper>

            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentEditorStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            {state.currentEditorStep < 5 && (
              <Paper p="md" radius="lg" withBorder>
                <Group justify="space-between">
                  <Button
                    variant="subtle"
                    leftSection={<ArrowLeft size={16} />}
                    onClick={prevStep}
                    disabled={state.currentEditorStep === 1}
                  >
                    上一步
                  </Button>
                  <Button
                    rightSection={<ArrowRight size={16} />}
                    onClick={nextStep}
                    disabled={!canGoNext()}
                    color="labBlue"
                  >
                    下一步
                  </Button>
                </Group>
              </Paper>
            )}
          </Stack>
        </Container>
      </motion.div>
    </div>
  );
};
