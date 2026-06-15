import { motion } from 'framer-motion';
import { Stack, Text, Group, Slider, NumberInput, Button, Paper } from '@mantine/core';
import { RotateCcw, Settings } from 'lucide-react';
import type { ParameterConfig } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';

interface ParameterSettingsProps {
  parameters: ParameterConfig[];
  values?: Record<string, number>;
  onChange?: (id: string, value: number) => void;
  onReset?: () => void;
}

export const ParameterSettings: React.FC<ParameterSettingsProps> = ({ parameters, values, onChange, onReset }) => {
  const { parameters: storeParams, setParameter: storeSetParameter, resetParameters: storeReset, settings } = useExperimentStore();
  
  const currentParams = values || storeParams;
  const setParameter = onChange || storeSetParameter;
  const resetParameters = onReset || storeReset;

  if (parameters.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        p="lg"
        radius="md"
        style={{
          background: settings.theme === 'light'
            ? 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
            : 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          border: `1px solid ${settings.theme === 'light' ? '#E2E8F0' : '#475569'}`
        }}
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="sm">
              <Settings size={18} color="#1E6FBA" />
              <Text fw={600} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                实验参数设置
              </Text>
            </Group>
            <Button
              variant="subtle"
              size="sm"
              color="gray"
              onClick={resetParameters}
              leftSection={<RotateCcw size={14} />}
            >
              重置
            </Button>
          </Group>

          <Stack gap="lg">
            {parameters.map((param, index) => (
              <motion.div
                key={param.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>
                      {param.name}
                    </Text>
                    <Group gap="xs">
                      <NumberInput
                        size="xs"
                        w={100}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={currentParams[param.id] ?? param.default}
                        onChange={(value) => {
                          if (typeof value === 'number') {
                            setParameter(param.id, value);
                          }
                        }}
                        rightSection={<Text size="xs" c="dimmed">{param.unit}</Text>}
                      />
                    </Group>
                  </Group>
                  <Slider
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={currentParams[param.id] ?? param.default}
                    onChange={(value) => setParameter(param.id, value)}
                    color="labBlue"
                    size="sm"
                    marks={[
                      { value: param.min, label: `${param.min}` },
                      { value: param.max, label: `${param.max}` }
                    ]}
                    styles={{
                      markLabel: { fontSize: '11px', color: '#64748B' }
                    }}
                  />
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                      默认值: {param.default} {param.unit}
                    </Text>
                    <Text size="xs" c="labBlue" fw={500}>
                      当前: {currentParams[param.id] ?? param.default} {param.unit}
                    </Text>
                  </Group>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </motion.div>
  );
};
