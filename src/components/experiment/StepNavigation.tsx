import { motion } from 'framer-motion';
import { Stack, Text, Group, Button, ActionIcon, Tooltip, Progress } from '@mantine/core';
import { Check, ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import type { ExperimentStep } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';
import { calculateProgress } from '../../utils/helpers';

interface StepNavigationProps {
  steps: ExperimentStep[];
  currentStep?: number;
  progress?: number;
  onStepClick?: (step: number) => void;
  onAutoPlay?: (playing: boolean) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStep: propCurrentStep, progress: propProgress, onStepClick, onAutoPlay }) => {
  const {
    currentStep: storeCurrentStep,
    isPlaying,
    nextStep,
    prevStep,
    setCurrentStep,
    setIsPlaying,
    resetCurrentExperiment,
    settings
  } = useExperimentStore();

  const currentStep = propCurrentStep !== undefined ? propCurrentStep : storeCurrentStep;
  const progress = propProgress !== undefined ? propProgress : calculateProgress(currentStep, steps.length);
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handlePrev = () => {
    if (!isFirstStep) {
      prevStep();
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      nextStep();
    }
  };

  const handlePlayPause = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    onAutoPlay?.(newPlaying);
  };

  const handleReset = () => {
    resetCurrentExperiment();
    setIsPlaying(false);
    onAutoPlay?.(false);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Text fw={600} size="lg" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          实验步骤
        </Text>
        <Text size="sm" c="dimmed">
          {currentStep + 1} / {steps.length}
        </Text>
      </Group>

      <Progress
        value={progress}
        size="sm"
        radius="xl"
        color="labBlue"
        striped
        animated={isPlaying}
      />

      <Stack gap="xs" style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '8px' }}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                fullWidth
                variant={isActive ? 'filled' : isCompleted ? 'light' : 'subtle'}
                color="labBlue"
                onClick={() => onStepClick ? onStepClick(index) : setCurrentStep(index)}
                style={{
                  height: 'auto',
                  padding: '12px 16px',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  background: isActive
                    ? 'linear-gradient(135deg, #1E6FBA 0%, #2A8AE0 100%)'
                    : undefined
                }}
                leftSection={
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)'
                        : isActive
                          ? 'rgba(255,255,255,0.2)'
                          : settings.theme === 'light'
                            ? '#E2E8F0'
                            : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: isCompleted || isActive ? '#fff' : '#64748B',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    {isCompleted ? <Check size={16} /> : index + 1}
                  </div>
                }
              >
                <Stack gap={2} style={{ flex: 1, overflow: 'hidden' }}>
                  <Text
                    fw={500}
                    size="sm"
                    lineClamp={1}
                    style={{
                      color: isActive ? '#fff' : undefined
                    }}
                  >
                    {step.title}
                  </Text>
                  {isActive && (
                    <Text
                      size="xs"
                      lineClamp={1}
                      style={{
                        color: 'rgba(255,255,255,0.8)'
                      }}
                    >
                      {step.description.substring(0, 50)}...
                    </Text>
                  )}
                </Stack>
              </Button>
            </motion.div>
          );
        })}
      </Stack>

      <Group grow>
        <Tooltip label="上一步">
          <ActionIcon
            variant="light"
            color="labBlue"
            size="lg"
            onClick={handlePrev}
            disabled={isFirstStep}
            radius="md"
          >
            <ChevronLeft size={20} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label={isPlaying ? '暂停' : '自动播放'}>
          <Button
            variant={isPlaying ? 'light' : 'filled'}
            color={isPlaying ? 'warningOrange' : 'labBlue'}
            leftSection={isPlaying ? <Pause size={18} /> : <Play size={18} />}
            onClick={handlePlayPause}
            radius="md"
            style={{ flex: 2 }}
          >
            {isPlaying ? '暂停' : '自动播放'}
          </Button>
        </Tooltip>

        <Tooltip label="重置">
          <ActionIcon
            variant="light"
            color="dangerRed"
            size="lg"
            onClick={handleReset}
            radius="md"
          >
            <RotateCcw size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="下一步">
          <ActionIcon
            variant="light"
            color="labBlue"
            size="lg"
            onClick={handleNext}
            disabled={isLastStep}
            radius="md"
          >
            <ChevronRight size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Stack>
  );
};
