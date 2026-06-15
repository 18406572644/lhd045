import { motion } from 'framer-motion';
import { Paper, Text, Stack, TextInput, Textarea, Select, NumberInput, Group, Badge, SimpleGrid } from '@mantine/core';
import { Info, FlaskConical, Gauge, Shield, Clock, Tag } from 'lucide-react';
import type { Difficulty, SafetyLevel } from '../../../types';
import { getDifficultyColor, getDifficultyLabel, getSafetyLevelColor, getSafetyLevelLabel } from '../../../styles/theme';
import { useExperimentStore } from '../../../store/useExperimentStore';
import type { EditorState } from './types';

interface Step1BasicInfoProps {
  value: EditorState['basicInfo'];
  onChange: (value: EditorState['basicInfo']) => void;
}

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
];

const safetyLevelOptions: { value: SafetyLevel; label: string }[] = [
  { value: 'normal', label: '普通' },
  { value: 'caution', label: '注意' },
  { value: 'danger', label: '危险' }
];

const categoryOptions = [
  { value: '无机化学', label: '无机化学' },
  { value: '有机化学', label: '有机化学' },
  { value: '分析化学', label: '分析化学' },
  { value: '物理化学', label: '物理化学' },
  { value: '自定义实验', label: '自定义实验' }
];

const iconOptions = [
  { value: 'flask-conical', label: '锥形瓶' },
  { value: 'flame', label: '火焰' },
  { value: 'beaker', label: '烧杯' },
  { value: 'test-tube', label: '试管' },
  { value: 'thermometer', label: '温度计' },
  { value: 'zap', label: '电' },
  { value: 'bubble', label: '气泡' },
  { value: 'droplet', label: '液体' }
];

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ value, onChange }) => {
  const { settings } = useExperimentStore();

  const updateField = <K extends keyof EditorState['basicInfo']>(
    field: K,
    val: EditorState['basicInfo'][K]
  ) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
          <Group gap="sm">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#1E6FBA20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Info size={22} color="#1E6FBA" />
            </div>
            <Stack gap={2}>
              <Text fw={700} size="lg">实验基本信息</Text>
              <Text size="sm" c="dimmed">填写实验的基本描述信息</Text>
            </Stack>
          </Group>

          <Stack gap="md">
            <TextInput
              label={
                <Group gap="xs" mb={4}>
                  <FlaskConical size={14} color="#1E6FBA" />
                  <Text size="sm" fw={500}>实验名称</Text>
                </Group>
              }
              placeholder="请输入实验名称"
              value={value.name}
              onChange={(e) => updateField('name', e.currentTarget.value)}
              required
              size="md"
            />

            <Textarea
              label={
                <Group gap="xs" mb={4}>
                  <Tag size={14} color="#1E6FBA" />
                  <Text size="sm" fw={500}>实验描述</Text>
                </Group>
              }
              placeholder="请输入实验的详细描述，包括实验目的、原理等"
              value={value.description}
              onChange={(e) => updateField('description', e.currentTarget.value)}
              minRows={3}
              required
              size="md"
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Select
                label={
                  <Group gap="xs" mb={4}>
                    <Gauge size={14} color="#8B5CF6" />
                    <Text size="sm" fw={500}>难度等级</Text>
                  </Group>
                }
                value={value.difficulty}
                onChange={(val) => updateField('difficulty', val as Difficulty)}
                data={difficultyOptions}
                rightSection={
                  <Badge color={getDifficultyColor(value.difficulty)} size="sm">
                    {getDifficultyLabel(value.difficulty)}
                  </Badge>
                }
                size="md"
              />

              <Select
                label={
                  <Group gap="xs" mb={4}>
                    <Shield size={14} color={value.safetyLevel === 'danger' ? '#EF4444' : value.safetyLevel === 'caution' ? '#F59E0B' : '#10B981'} />
                    <Text size="sm" fw={500}>安全等级</Text>
                  </Group>
                }
                value={value.safetyLevel}
                onChange={(val) => updateField('safetyLevel', val as SafetyLevel)}
                data={safetyLevelOptions}
                rightSection={
                  <Badge color={getSafetyLevelColor(value.safetyLevel)} size="sm">
                    {getSafetyLevelLabel(value.safetyLevel)}
                  </Badge>
                }
                size="md"
              />

              <Select
                label={
                  <Group gap="xs" mb={4}>
                    <Tag size={14} color="#06B6D4" />
                    <Text size="sm" fw={500}>实验分类</Text>
                  </Group>
                }
                value={value.category}
                onChange={(val) => updateField('category', val || '自定义实验')}
                data={categoryOptions}
                size="md"
              />

              <NumberInput
                label={
                  <Group gap="xs" mb={4}>
                    <Clock size={14} color="#10B981" />
                    <Text size="sm" fw={500}>预计时长</Text>
                  </Group>
                }
                placeholder="预计时长"
                value={value.duration}
                onChange={(val) => updateField('duration', typeof val === 'number' ? val : 10)}
                min={1}
                max={120}
                rightSection={<Text size="xs" c="dimmed">分钟</Text>}
                size="md"
              />

              <Select
                label={
                  <Group gap="xs" mb={4}>
                    <FlaskConical size={14} color="#EC4899" />
                    <Text size="sm" fw={500}>实验图标</Text>
                  </Group>
                }
                value={value.icon}
                onChange={(val) => updateField('icon', val || 'flask-conical')}
                data={iconOptions}
                size="md"
              />
            </SimpleGrid>
          </Stack>
        </Stack>
      </Paper>
    </motion.div>
  );
};
