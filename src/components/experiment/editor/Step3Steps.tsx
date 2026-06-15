import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Paper, Text, Stack, Group, Button, TextInput, Textarea,
  Select, NumberInput, Badge, ScrollArea, ActionIcon, ColorInput,
  Collapse, Divider, SimpleGrid
} from '@mantine/core';
import {
  ListOrdered, Plus, Trash2, ChevronDown, ChevronUp,
  GripVertical, Play, Sparkles, Thermometer, Droplets,
  Wind, ArrowRight, Pause
} from 'lucide-react';
import type { ExperimentStep, AnimationType, DataPoint } from '../../../types';
import { useExperimentStore } from '../../../store/useExperimentStore';
import { animationTypes } from '../../../data/library';
import { createEmptyStep, createEmptyDataPoint } from './types';

interface Step3StepsProps {
  steps: ExperimentStep[];
  onChange: (steps: ExperimentStep[]) => void;
}

const animationIconMap: Record<AnimationType, typeof Play> = {
  idle: Pause,
  heating: Thermometer,
  mixing: Sparkles,
  pouring: Droplets,
  bubbling: Wind,
  reaction: ArrowRight
};

export const Step3Steps: React.FC<Step3StepsProps> = ({ steps, onChange }) => {
  const { settings } = useExperimentStore();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    const newSteps = [...steps, createEmptyStep(newId)];
    onChange(newSteps);
    setExpandedIds(prev => new Set([...prev, newId]));
  };

  const removeStep = (id: number) => {
    const newSteps = steps
      .filter(s => s.id !== id)
      .map((s, index) => ({ ...s, id: index + 1 }));
    onChange(newSteps);
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateStep = <K extends keyof ExperimentStep>(
    id: number,
    field: K,
    value: ExperimentStep[K]
  ) => {
    onChange(steps.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const updateAnimationData = (
    stepId: number,
    field: keyof ExperimentStep['animationData'],
    value: number | string | undefined
  ) => {
    onChange(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            animationData: { ...s.animationData, [field]: value },
            animationType: field === 'type' ? value as AnimationType : s.animationType
          }
        : s
    ));
  };

  const addDataPoint = (stepId: number) => {
    onChange(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            dataPoints: [...(s.dataPoints || []), createEmptyDataPoint()]
          }
        : s
    ));
  };

  const removeDataPoint = (stepId: number, dpId: string) => {
    onChange(steps.map(s =>
      s.id === stepId
        ? { ...s, dataPoints: (s.dataPoints || []).filter(dp => dp.id !== dpId) }
        : s
    ));
  };

  const updateDataPoint = (stepId: number, dpId: string, field: keyof DataPoint, value: string | number | undefined) => {
    onChange(steps.map(s =>
      s.id === stepId
        ? {
            ...s,
            dataPoints: (s.dataPoints || []).map(dp =>
              dp.id === dpId ? { ...dp, [field]: value } : dp
            )
          }
        : s
    ));
  };

  const handleReorder = (newSteps: ExperimentStep[]) => {
    const reordered = newSteps.map((s, index) => ({ ...s, id: index + 1 }));
    onChange(reordered);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Stack gap="lg">
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            background: settings.theme === 'light'
              ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
              : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
          }}
        >
          <Stack gap="lg">
            <Group justify="space-between">
              <Group gap="sm">
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#8B5CF620',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ListOrdered size={22} color="#8B5CF6" />
                </div>
                <Stack gap={2}>
                  <Text fw={700} size="lg">编排实验步骤</Text>
                  <Text size="sm" c="dimmed">添加、编辑和排序实验步骤，设置每步的动画和数据点</Text>
                </Stack>
              </Group>
              <Button
                leftSection={<Plus size={16} />}
                color="violet"
                onClick={addStep}
              >
                添加步骤
              </Button>
            </Group>

            {steps.length === 0 ? (
              <Paper
                p="xl"
                radius="md"
                style={{
                  background: settings.theme === 'light' ? '#F8FAFC' : '#1E293B',
                  border: '2px dashed #CBD5E1'
                }}
              >
                <Stack align="center" gap="md">
                  <ListOrdered size={48} color="#94A3B8" />
                  <Text c="dimmed" ta="center">
                    还没有添加任何步骤
                    <br />
                    点击"添加步骤"按钮开始编排实验流程
                  </Text>
                </Stack>
              </Paper>
            ) : (
              <ScrollArea h={480} scrollbarSize={6}>
                <Reorder.Group axis="y" values={steps} onReorder={handleReorder}>
                  <Stack gap="md">
                    <AnimatePresence>
                      {steps.map((step, index) => {
                        const isExpanded = expandedIds.has(step.id);
                        const AnimationIcon = animationIconMap[step.animationType] || Play;

                        return (
                          <Reorder.Item key={step.id} value={step}>
                            <motion.div
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Paper
                                p="md"
                                radius="md"
                                withBorder
                                style={{
                                  borderColor: step.animationType !== 'idle' ? '#8B5CF6' : undefined
                                }}
                              >
                                <Group justify="space-between" wrap="nowrap">
                                  <Group gap="sm" wrap="nowrap" style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleExpand(step.id)}>
                                    <ActionIcon size="sm" variant="transparent" style={{ cursor: 'grab' }}>
                                      <GripVertical size={18} color="#94A3B8" />
                                    </ActionIcon>
                                    <Badge color="violet" size="lg" radius="sm">
                                      步骤 {step.id}
                                    </Badge>
                                    <Text fw={600} style={{ flex: 1 }}>{step.title}</Text>
                                    <Badge
                                      color={step.animationType !== 'idle' ? 'violet' : 'gray'}
                                      size="sm"
                                      radius="sm"
                                      leftSection={<AnimationIcon size={12} />}
                                    >
                                      {animationTypes.find(a => a.value === step.animationType)?.label || '静止'}
                                    </Badge>
                                  </Group>
                                  <Group gap="xs">
                                    <ActionIcon
                                      color="red"
                                      variant="subtle"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeStep(step.id);
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                      variant="subtle"
                                      onClick={() => toggleExpand(step.id)}
                                    >
                                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </ActionIcon>
                                  </Group>
                                </Group>

                                <Collapse in={isExpanded}>
                                  <Divider my="md" />
                                  <Stack gap="md">
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                      <TextInput
                                        label="步骤标题"
                                        value={step.title}
                                        onChange={(e) => updateStep(step.id, 'title', e.currentTarget.value)}
                                        placeholder="输入步骤标题"
                                        required
                                      />
                                      <NumberInput
                                        label="持续时间 (秒)"
                                        value={step.duration}
                                        onChange={(val) => updateStep(step.id, 'duration', typeof val === 'number' ? val : 2)}
                                        min={1}
                                        max={30}
                                        rightSection={<Text size="xs" c="dimmed">秒</Text>}
                                      />
                                    </SimpleGrid>

                                    <Textarea
                                      label="步骤描述"
                                      value={step.description}
                                      onChange={(e) => updateStep(step.id, 'description', e.currentTarget.value)}
                                      placeholder="详细描述该步骤的操作内容和注意事项"
                                      minRows={3}
                                      required
                                    />

                                    <Divider my="sm" />
                                    <Text fw={600} size="sm" c="violet">
                                      <Group gap="xs">
                                        <Sparkles size={16} />
                                        动画设置
                                      </Group>
                                    </Text>

                                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                                      <Select
                                        label="动画类型"
                                        value={step.animationType}
                                        onChange={(val) => {
                                          updateStep(step.id, 'animationType', val as AnimationType);
                                          updateAnimationData(step.id, 'type', val);
                                        }}
                                        data={animationTypes.map(a => ({ value: a.value, label: a.label }))}
                                      />
                                      {step.animationType === 'heating' && (
                                        <NumberInput
                                          label="火焰强度"
                                          value={step.animationData.flameIntensity ?? 0.5}
                                          onChange={(val) => updateAnimationData(step.id, 'flameIntensity', typeof val === 'number' ? val : 0.5)}
                                          min={0}
                                          max={1}
                                          step={0.1}
                                          decimalScale={1}
                                        />
                                      )}
                                      {(step.animationType === 'pouring' || step.animationType === 'mixing' || step.animationType === 'reaction') && (
                                        <ColorInput
                                          label="液体颜色"
                                          value={step.animationData.liquidColor || '#3B82F6'}
                                          onChange={(val) => updateAnimationData(step.id, 'liquidColor', val)}
                                          format="hex"
                                          swatches={['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']}
                                        />
                                      )}
                                      {(step.animationType === 'bubbling' || step.animationType === 'reaction') && (
                                        <ColorInput
                                          label="气泡颜色"
                                          value={step.animationData.bubbleColor || '#60A5FA'}
                                          onChange={(val) => updateAnimationData(step.id, 'bubbleColor', val)}
                                          format="hex"
                                          swatches={['#60A5FA', '#E5E7EB', '#10B981', '#F59E0B', '#EF4444']}
                                        />
                                      )}
                                    </SimpleGrid>

                                    <Divider my="sm" />
                                    <Group justify="space-between">
                                      <Text fw={600} size="sm" c="blue">
                                        <Group gap="xs">
                                          <Thermometer size={16} />
                                          数据测量点
                                        </Group>
                                      </Text>
                                      <Button
                                        size="sm"
                                        variant="light"
                                        leftSection={<Plus size={14} />}
                                        onClick={() => addDataPoint(step.id)}
                                      >
                                        添加数据点
                                      </Button>
                                    </Group>

                                    {(step.dataPoints || []).length > 0 ? (
                                      <Stack gap="sm">
                                        {step.dataPoints?.map((dp, dpIndex) => (
                                          <Paper key={dp.id} p="sm" radius="sm" withBorder>
                                            <Group justify="space-between" wrap="nowrap">
                                              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" style={{ flex: 1 }}>
                                                <TextInput
                                                  size="sm"
                                                  label="名称"
                                                  placeholder="如: 温度"
                                                  value={dp.label}
                                                  onChange={(e) => updateDataPoint(step.id, dp.id, 'label', e.currentTarget.value)}
                                                />
                                                <TextInput
                                                  size="sm"
                                                  label="单位"
                                                  placeholder="如: °C"
                                                  value={dp.unit}
                                                  onChange={(e) => updateDataPoint(step.id, dp.id, 'unit', e.currentTarget.value)}
                                                />
                                                <NumberInput
                                                  size="sm"
                                                  label="预期值"
                                                  placeholder="可选"
                                                  value={dp.expectedValue ?? ''}
                                                  onChange={(val) => updateDataPoint(step.id, dp.id, 'expectedValue', typeof val === 'number' ? val : undefined)}
                                                />
                                              </SimpleGrid>
                                              <ActionIcon
                                                color="red"
                                                variant="subtle"
                                                onClick={() => removeDataPoint(step.id, dp.id)}
                                                mt={20}
                                              >
                                                <Trash2 size={16} />
                                              </ActionIcon>
                                            </Group>
                                          </Paper>
                                        ))}
                                      </Stack>
                                    ) : (
                                      <Text size="sm" c="dimmed" ta="center" py="xs">
                                        暂无数据点，可添加温度、pH值等测量数据
                                      </Text>
                                    )}
                                  </Stack>
                                </Collapse>
                              </Paper>
                            </motion.div>
                          </Reorder.Item>
                        );
                      })}
                    </AnimatePresence>
                  </Stack>
                </Reorder.Group>
              </ScrollArea>
            )}
          </Stack>
        </Paper>

        {steps.length > 0 && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Text fw={600} size="sm">
                实验流程概览 ({steps.length} 步)
              </Text>
              <Group gap="xs" wrap="wrap">
                {steps.map((step, index) => (
                  <Group key={step.id} gap="xs" align="center">
                    <Badge
                      color={step.animationType !== 'idle' ? 'violet' : 'gray'}
                      size="md"
                      radius="sm"
                    >
                      {step.id}. {step.title}
                    </Badge>
                    {index < steps.length - 1 && (
                      <ArrowRight size={14} color="#94A3B8" />
                    )}
                  </Group>
                ))}
              </Group>
            </Stack>
          </Paper>
        )}
      </Stack>
    </motion.div>
  );
};
