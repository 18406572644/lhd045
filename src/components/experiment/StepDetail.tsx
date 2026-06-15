import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Text, Stack, Group, Badge, List, ThemeIcon, Box, Textarea, Button } from '@mantine/core';
import { Lightbulb, ChevronRight, Clipboard, Plus } from 'lucide-react';
import type { ExperimentStep } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';
import { formatDuration } from '../../utils/helpers';

interface StepDetailProps {
  step: ExperimentStep;
  parameters?: Record<string, number>;
  onAddObservation?: (content: string) => void;
  onAddDataPoint?: (data: Record<string, number | string>) => void;
}

export const StepDetail: React.FC<StepDetailProps> = ({ step, parameters, onAddObservation, onAddDataPoint }) => {
  const { addObservation, addDataPoint, settings } = useExperimentStore();
  const [observation, setObservation] = useState('');  
  
  const handleAddObservation = () => {
    if (observation.trim()) {
      if (onAddObservation) {
        onAddObservation(observation.trim());
      } else {
        addObservation({
          stepId: step.id,
          content: observation.trim()
        });
      }
      setObservation('');
    }
  };

  const handleAddDataPoint = (point: { id: string; label: string; unit: string; expectedValue?: number }) => {
    const data: Record<string, number | string> = {
      [point.label]: point.expectedValue || 0,
      '单位': point.unit,
      '时间': new Date().toLocaleTimeString('zh-CN')
    };
    if (onAddDataPoint) {
      onAddDataPoint(data);
    } else {
      addDataPoint(data);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
      >
        <Stack gap="md">
          <Paper
            p="lg"
            radius="md"
            style={{
              background: settings.theme === 'light'
                ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
                : 'linear-gradient(135deg, #1E3A5F 0%, #1E293B 100%)',
              border: `1px solid ${settings.theme === 'light' ? '#BFDBFE' : '#3B82F6'}`
            }}
          >
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Group gap="xs">
                    <Badge color="labBlue" size="lg" radius="sm">
                      步骤 {step.id}
                    </Badge>
                    <Badge color="warningOrange" size="sm" variant="light" radius="sm">
                      {formatDuration(step.duration)}
                    </Badge>
                  </Group>
                  <Text
                    size="xl"
                    fw={700}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      color: settings.theme === 'light' ? '#1E3A5F' : '#BFDBFE'
                    }}
                  >
                    {step.title}
                  </Text>
                </Stack>
                <ThemeIcon size={48} radius="xl" color="labBlue" variant="light">
                  <ChevronRight size={28} />
                </ThemeIcon>
              </Group>

              <Text size="md" style={{ lineHeight: 1.8 }}>
                {step.description}
              </Text>
            </Stack>
          </Paper>

          {step.tips.length > 0 && (
            <Paper p="md" radius="md" style={{
              background: settings.theme === 'light' ? '#FFFBEB' : '#422006',
              border: `1px solid ${settings.theme === 'light' ? '#FDE68A' : '#F59E0B'}`
            }}>
              <Group gap="sm" mb="xs">
                <Lightbulb size={18} color="#F59E0B" />
                <Text fw={600} size="sm" c="warningOrange">实验技巧</Text>
              </Group>
              <List
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={18} radius="xl" color="warningOrange" variant="light">
                    <Lightbulb size={12} />
                  </ThemeIcon>
                }
              >
                {step.tips.map((tip, index) => (
                  <List.Item key={index}>{tip}</List.Item>
                ))}
              </List>
            </Paper>
          )}

          {step.dataPoints && step.dataPoints.length > 0 && (
            <Paper
              p="md"
              radius="md"
              style={{
                background: settings.theme === 'light' ? '#F0FDF4' : '#052E16',
                border: `1px solid ${settings.theme === 'light' ? '#BBF7D0' : '#4ADE80'}`
              }}
            >
              <Group gap="sm" mb="md">
                <Clipboard size={18} color="#22C55E" />
                <Text fw={600} size="sm" c="successGreen">实验数据记录</Text>
              </Group>
              <Box style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px'
              }}>
                {step.dataPoints.map((point) => (
                  <Paper
                    key={point.id}
                    p="sm"
                    radius="sm"
                    style={{
                      background: settings.theme === 'light' ? '#fff' : '#1F2937',
                      textAlign: 'center'
                    }}
                  >
                    <Text size="xs" c="dimmed" mb="xs">{point.label}</Text>
                    <Group gap="xs" justify="center">
                      <Text size="lg" fw={700} c="successGreen">
                        {point.expectedValue || '--'}
                        <Text size="xs" component="span" c="dimmed" ml="xs">
                          {point.unit}
                        </Text>
                      </Text>
                      <Button
                        size="xs"
                        variant="light"
                        color="successGreen"
                        leftSection={<Plus size={12} />}
                        onClick={() => handleAddDataPoint(point)}
                      >
                        记录
                      </Button>
                    </Group>
                  </Paper>
                ))}
              </Box>
            </Paper>
          )}

          <Paper
            p="md"
            radius="md"
            style={{
              background: settings.theme === 'light' ? '#FAFAFA' : '#1F2937',
              border: `1px solid ${settings.theme === 'light' ? '#E5E7EB' : '#374151'}`
            }}
          >
            <Group gap="sm" mb="md">
              <Clipboard size={18} color="#1E6FBA" />
              <Text fw={600} size="sm" c="labBlue">观察记录</Text>
            </Group>
            <Stack gap="sm">
              <Textarea
                placeholder="记录您观察到的实验现象..."
                value={observation}
                onChange={(e) => setObservation(e.currentTarget.value)}
                minRows={3}
              />
              <Group justify="flex-end">
                <Button
                  leftSection={<Plus size={16} />}
                  onClick={handleAddObservation}
                  disabled={!observation.trim()}
                >
                  添加记录
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </motion.div>
    </AnimatePresence>
  );
};
