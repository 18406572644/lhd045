import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper, Text, Stack, Group, Button, TextInput, Textarea,
  Select, NumberInput, Badge, ScrollArea, ActionIcon, ColorInput,
  Divider, SimpleGrid, Tabs, Box
} from '@mantine/core';
import {
  Atom, Plus, Trash2, ArrowRight, Settings,
  FlaskConical, Gauge, ChevronDown, ChevronUp
} from 'lucide-react';
import type {
  ChemicalEquation, ParameterConfig, ChemicalSubstance,
  ChemicalState
} from '../../../types';
import { useExperimentStore } from '../../../store/useExperimentStore';
import { chemicalLibrary } from '../../../data/library';
import { createEmptyEquation, createEmptyParameter } from './types';
import { renderChemicalFormula } from '../../../utils/helpers';

interface Step4EquationsProps {
  equations: ChemicalEquation[];
  parameters: ParameterConfig[];
  onEquationsChange: (equations: ChemicalEquation[]) => void;
  onParametersChange: (parameters: ParameterConfig[]) => void;
  selectedChemicalIds: string[];
}

const stateOptions: { value: ChemicalState; label: string }[] = [
  { value: 'solid', label: '固体 (s)' },
  { value: 'liquid', label: '液体 (l)' },
  { value: 'gas', label: '气体 (g)' },
  { value: 'aqueous', label: '溶液 (aq)' }
];

const reactionTypeOptions = [
  { value: '化合反应', label: '化合反应' },
  { value: '分解反应', label: '分解反应' },
  { value: '置换反应', label: '置换反应' },
  { value: '复分解反应', label: '复分解反应' },
  { value: '中和反应', label: '中和反应' },
  { value: '氧化还原反应', label: '氧化还原反应' },
  { value: '检验反应', label: '检验反应' },
  { value: '其他', label: '其他' }
];

const defaultColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#78350F', '#6B7280', '#F3F4F6', '#1F2937'
];

export const Step4Equations: React.FC<Step4EquationsProps> = ({
  equations,
  parameters,
  onEquationsChange,
  onParametersChange,
  selectedChemicalIds
}) => {
  const { settings } = useExperimentStore();
  const [activeTab, setActiveTab] = useState<'equations' | 'parameters'>('equations');
  const [expandedEqIds, setExpandedEqIds] = useState<Set<string>>(new Set());

  const availableChemicals = chemicalLibrary.filter(c => selectedChemicalIds.includes(c.id));

  const toggleEqExpand = (id: string) => {
    setExpandedEqIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addEquation = () => {
    const newEq = createEmptyEquation();
    onEquationsChange([...equations, newEq]);
    setExpandedEqIds(prev => new Set([...prev, newEq.id]));
  };

  const removeEquation = (id: string) => {
    onEquationsChange(equations.filter(e => e.id !== id));
    setExpandedEqIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateEquation = <K extends keyof ChemicalEquation>(
    id: string,
    field: K,
    value: ChemicalEquation[K]
  ) => {
    onEquationsChange(equations.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const addSubstance = (eqId: string, type: 'reactants' | 'products') => {
    onEquationsChange(equations.map(e => {
      if (e.id !== eqId) return e;
      const newSubstance: ChemicalSubstance = {
        formula: '',
        name: '',
        state: 'aqueous',
        color: defaultColors[Math.floor(Math.random() * defaultColors.length)]
      };
      return {
        ...e,
        [type]: [...e[type], newSubstance]
      };
    }));
  };

  const removeSubstance = (eqId: string, type: 'reactants' | 'products', index: number) => {
    onEquationsChange(equations.map(e => {
      if (e.id !== eqId) return e;
      return {
        ...e,
        [type]: e[type].filter((_, i) => i !== index)
      };
    }));
  };

  const updateSubstance = (
    eqId: string,
    type: 'reactants' | 'products',
    index: number,
    field: keyof ChemicalSubstance,
    value: string
  ) => {
    onEquationsChange(equations.map(e => {
      if (e.id !== eqId) return e;
      return {
        ...e,
        [type]: e[type].map((sub, i) =>
          i === index ? { ...sub, [field]: value } : sub
        )
      };
    }));
  };

  const addParameter = () => {
    onParametersChange([...parameters, createEmptyParameter()]);
  };

  const removeParameter = (id: string) => {
    onParametersChange(parameters.filter(p => p.id !== id));
  };

  const updateParameter = <K extends keyof ParameterConfig>(
    id: string,
    field: K,
    value: ParameterConfig[K]
  ) => {
    onParametersChange(parameters.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const quickAddChemical = (eqId: string, type: 'reactants' | 'products', chemical: typeof chemicalLibrary[0]) => {
    onEquationsChange(equations.map(e => {
      if (e.id !== eqId) return e;
      const newSubstance: ChemicalSubstance = {
        formula: chemical.formula,
        name: chemical.name,
        state: chemical.state,
        color: chemical.color || defaultColors[Math.floor(Math.random() * defaultColors.length)]
      };
      return {
        ...e,
        [type]: [...e[type], newSubstance]
      };
    }));
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
          <Group justify="space-between">
            <Group gap="sm">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#F59E0B20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Atom size={22} color="#F59E0B" />
              </div>
              <Stack gap={2}>
                <Text fw={700} size="lg">化学方程式与参数</Text>
                <Text size="sm" c="dimmed">配置化学反应方程式和实验可调参数</Text>
              </Stack>
            </Group>
          </Group>

          <Tabs value={activeTab} onChange={(v) => setActiveTab(v as 'equations' | 'parameters')}>
            <Tabs.List grow>
              <Tabs.Tab value="equations" leftSection={<FlaskConical size={16} />}>
                化学方程式 ({equations.length})
              </Tabs.Tab>
              <Tabs.Tab value="parameters" leftSection={<Gauge size={16} />}>
                实验参数 ({parameters.length})
              </Tabs.Tab>
            </Tabs.List>

            <AnimatePresence mode="wait">
              {activeTab === 'equations' ? (
                <motion.div
                  key="equations"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Stack gap="md" mt="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        配置实验涉及的化学反应方程式
                      </Text>
                      <Button
                        size="sm"
                        leftSection={<Plus size={14} />}
                        color="yellow"
                        onClick={addEquation}
                      >
                        添加方程式
                      </Button>
                    </Group>

                    {availableChemicals.length > 0 && (
                      <Paper p="sm" radius="md" style={{ background: settings.theme === 'light' ? '#FEF3C710' : '#FEF3C710' }}>
                        <Text size="xs" c="dimmed" mb="xs">
                          快速添加已选药品到方程式：
                        </Text>
                        <Group gap="xs" wrap="wrap">
                          {availableChemicals.map(chem => (
                            <Badge
                              key={chem.id}
                              size="sm"
                              radius="sm"
                              variant="outline"
                              style={{ borderColor: chem.color, color: chem.color, cursor: 'pointer' }}
                              onClick={() => {
                                if (equations.length === 0) {
                                  addEquation();
                                }
                                const lastEq = equations[equations.length - 1] || createEmptyEquation();
                                quickAddChemical(lastEq.id, 'reactants', chem);
                              }}
                            >
                              + {chem.name}
                            </Badge>
                          ))}
                        </Group>
                      </Paper>
                    )}

                    {equations.length === 0 ? (
                      <Paper
                        p="xl"
                        radius="md"
                        style={{
                          background: settings.theme === 'light' ? '#F8FAFC' : '#1E293B',
                          border: '2px dashed #CBD5E1'
                        }}
                      >
                        <Stack align="center" gap="md">
                          <Atom size={48} color="#94A3B8" />
                          <Text c="dimmed" ta="center">
                            还没有添加任何化学方程式
                            <br />
                            点击"添加方程式"开始配置
                          </Text>
                        </Stack>
                      </Paper>
                    ) : (
                      <ScrollArea h={420} scrollbarSize={6}>
                        <Stack gap="md">
                          {equations.map((eq, eqIndex) => {
                            const isExpanded = expandedEqIds.has(eq.id);

                            return (
                              <Paper key={eq.id} p="md" radius="md" withBorder>
                                <Group justify="space-between" wrap="nowrap">
                                  <Group gap="sm" wrap="nowrap" style={{ flex: 1, cursor: 'pointer' }} onClick={() => toggleEqExpand(eq.id)}>
                                    <Badge color="yellow" size="lg" radius="sm">
                                      方程式 {eqIndex + 1}
                                    </Badge>
                                    <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          flexWrap: 'wrap',
                                          fontFamily: '"JetBrains Mono", monospace',
                                          fontSize: '14px'
                                        }}
                                      >
                                        {eq.reactants.map((r, i) => (
                                          <span key={i} style={{ color: r.color || 'inherit', fontWeight: 500 }}>
                                            <span dangerouslySetInnerHTML={{ __html: renderChemicalFormula(r.formula || '?') }} />
                                            {i < eq.reactants.length - 1 && <span style={{ color: '#94A3B8', margin: '0 4px' }}>+</span>}
                                          </span>
                                        ))}
                                        {eq.reactants.length > 0 && (
                                          <span style={{ color: '#94A3B8', margin: '0 8px' }}>
                                            {eq.conditions && <span style={{ color: '#F59E0B', fontSize: '12px', marginRight: '4px' }}>{eq.conditions}</span>}
                                            <ArrowRight size={16} />
                                          </span>
                                        )}
                                        {eq.products.map((p, i) => (
                                          <span key={i} style={{ color: p.color || 'inherit', fontWeight: 500 }}>
                                            <span dangerouslySetInnerHTML={{ __html: renderChemicalFormula(p.formula || '?') }} />
                                            {i < eq.products.length - 1 && <span style={{ color: '#94A3B8', margin: '0 4px' }}>+</span>}
                                          </span>
                                        ))}
                                        {(eq.reactants.length === 0 && eq.products.length === 0) && (
                                          <Text size="xs" c="dimmed">点击展开编辑方程式</Text>
                                        )}
                                      </div>
                                      {eq.type && (
                                        <Badge size="xs" color="gray" variant="light">{eq.type}</Badge>
                                      )}
                                    </Stack>
                                  </Group>
                                  <Group gap="xs">
                                    <ActionIcon
                                      color="red"
                                      variant="subtle"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeEquation(eq.id);
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                      variant="subtle"
                                      onClick={() => toggleEqExpand(eq.id)}
                                    >
                                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </ActionIcon>
                                  </Group>
                                </Group>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <Divider my="md" />
                                      <Stack gap="md">
                                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                          <TextInput
                                            label="反应类型"
                                            value={eq.type}
                                            onChange={(e) => updateEquation(eq.id, 'type', e.currentTarget.value)}
                                            placeholder="如: 分解反应"
                                          />
                                          <TextInput
                                            label="反应条件"
                                            value={eq.conditions}
                                            onChange={(e) => updateEquation(eq.id, 'conditions', e.currentTarget.value)}
                                            placeholder="如: 加热、催化剂"
                                          />
                                        </SimpleGrid>

                                        <Divider my="sm" />
                                        <Group justify="space-between">
                                          <Text fw={600} size="sm" c="red">
                                            <Group gap="xs">
                                              <FlaskConical size={16} />
                                              反应物
                                            </Group>
                                          </Text>
                                          <Button
                                            size="xs"
                                            variant="light"
                                            color="red"
                                            leftSection={<Plus size={12} />}
                                            onClick={() => addSubstance(eq.id, 'reactants')}
                                          >
                                            添加
                                          </Button>
                                        </Group>

                                        {eq.reactants.length === 0 ? (
                                          <Text size="xs" c="dimmed" ta="center" py="xs">
                                            暂无反应物
                                          </Text>
                                        ) : (
                                          <Stack gap="sm">
                                            {eq.reactants.map((reactant, rIndex) => (
                                              <Paper key={rIndex} p="sm" radius="sm" withBorder>
                                                <Group justify="space-between" wrap="nowrap" align="flex-start">
                                                  <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm" style={{ flex: 1 }}>
                                                    <TextInput
                                                      size="sm"
                                                      label="化学式"
                                                      placeholder="如: H2O"
                                                      value={reactant.formula}
                                                      onChange={(e) => updateSubstance(eq.id, 'reactants', rIndex, 'formula', e.currentTarget.value)}
                                                    />
                                                    <TextInput
                                                      size="sm"
                                                      label="名称"
                                                      placeholder="如: 水"
                                                      value={reactant.name}
                                                      onChange={(e) => updateSubstance(eq.id, 'reactants', rIndex, 'name', e.currentTarget.value)}
                                                    />
                                                    <Select
                                                      size="sm"
                                                      label="状态"
                                                      value={reactant.state}
                                                      onChange={(val) => updateSubstance(eq.id, 'reactants', rIndex, 'state', val as ChemicalState)}
                                                      data={stateOptions}
                                                      styles={{ dropdown: { zIndex: 9999 } }}
                                                    />
                                                    <Group gap="xs">
                                                      <ColorInput
                                                        size="sm"
                                                        label="颜色"
                                                        value={reactant.color || '#3B82F6'}
                                                        onChange={(val) => updateSubstance(eq.id, 'reactants', rIndex, 'color', val)}
                                                        format="hex"
                                                        swatches={defaultColors}
                                                        style={{ flex: 1 }}
                                                        styles={{ dropdown: { zIndex: 9999 } }}
                                                      />
                                                      <ActionIcon
                                                        color="red"
                                                        variant="subtle"
                                                        mt={20}
                                                        onClick={() => removeSubstance(eq.id, 'reactants', rIndex)}
                                                      >
                                                        <Trash2 size={16} />
                                                      </ActionIcon>
                                                    </Group>
                                                  </SimpleGrid>
                                                </Group>
                                              </Paper>
                                            ))}
                                          </Stack>
                                        )}

                                        <Divider my="sm" />
                                        <Group justify="space-between">
                                          <Text fw={600} size="sm" c="green">
                                            <Group gap="xs">
                                              <FlaskConical size={16} />
                                              生成物
                                            </Group>
                                          </Text>
                                          <Button
                                            size="xs"
                                            variant="light"
                                            color="green"
                                            leftSection={<Plus size={12} />}
                                            onClick={() => addSubstance(eq.id, 'products')}
                                          >
                                            添加
                                          </Button>
                                        </Group>

                                        {eq.products.length === 0 ? (
                                          <Text size="xs" c="dimmed" ta="center" py="xs">
                                            暂无生成物
                                          </Text>
                                        ) : (
                                          <Stack gap="sm">
                                            {eq.products.map((product, pIndex) => (
                                              <Paper key={pIndex} p="sm" radius="sm" withBorder>
                                                <Group justify="space-between" wrap="nowrap" align="flex-start">
                                                  <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm" style={{ flex: 1 }}>
                                                    <TextInput
                                                      size="sm"
                                                      label="化学式"
                                                      placeholder="如: H2O"
                                                      value={product.formula}
                                                      onChange={(e) => updateSubstance(eq.id, 'products', pIndex, 'formula', e.currentTarget.value)}
                                                    />
                                                    <TextInput
                                                      size="sm"
                                                      label="名称"
                                                      placeholder="如: 水"
                                                      value={product.name}
                                                      onChange={(e) => updateSubstance(eq.id, 'products', pIndex, 'name', e.currentTarget.value)}
                                                    />
                                                    <Select
                                                      size="sm"
                                                      label="状态"
                                                      value={product.state}
                                                      onChange={(val) => updateSubstance(eq.id, 'products', pIndex, 'state', val as ChemicalState)}
                                                      data={stateOptions}
                                                      styles={{ dropdown: { zIndex: 9999 } }}
                                                    />
                                                    <Group gap="xs">
                                                      <ColorInput
                                                        size="sm"
                                                        label="颜色"
                                                        value={product.color || '#3B82F6'}
                                                        onChange={(val) => updateSubstance(eq.id, 'products', pIndex, 'color', val)}
                                                        format="hex"
                                                        swatches={defaultColors}
                                                        style={{ flex: 1 }}
                                                        styles={{ dropdown: { zIndex: 9999 } }}
                                                      />
                                                      <ActionIcon
                                                        color="red"
                                                        variant="subtle"
                                                        mt={20}
                                                        onClick={() => removeSubstance(eq.id, 'products', pIndex)}
                                                      >
                                                        <Trash2 size={16} />
                                                      </ActionIcon>
                                                    </Group>
                                                  </SimpleGrid>
                                                </Group>
                                              </Paper>
                                            ))}
                                          </Stack>
                                        )}
                                      </Stack>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Paper>
                            );
                          })}
                        </Stack>
                      </ScrollArea>
                    )}
                  </Stack>
                </motion.div>
              ) : (
                <motion.div
                  key="parameters"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Stack gap="md" mt="md">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        配置实验中可调节的参数（如温度、浓度等）
                      </Text>
                      <Button
                        size="sm"
                        leftSection={<Plus size={14} />}
                        color="blue"
                        onClick={addParameter}
                      >
                        添加参数
                      </Button>
                    </Group>

                    {parameters.length === 0 ? (
                      <Paper
                        p="xl"
                        radius="md"
                        style={{
                          background: settings.theme === 'light' ? '#F8FAFC' : '#1E293B',
                          border: '2px dashed #CBD5E1'
                        }}
                      >
                        <Stack align="center" gap="md">
                          <Settings size={48} color="#94A3B8" />
                          <Text c="dimmed" ta="center">
                            还没有添加任何实验参数
                            <br />
                            点击"添加参数"开始配置
                          </Text>
                        </Stack>
                      </Paper>
                    ) : (
                      <ScrollArea h={420} scrollbarSize={6}>
                        <Stack gap="sm">
                          {parameters.map((param, pIndex) => (
                            <Paper key={param.id} p="md" radius="md" withBorder>
                              <Group justify="space-between" wrap="nowrap" align="flex-start">
                                <SimpleGrid cols={{ base: 1, sm: 3, lg: 6 }} spacing="sm" style={{ flex: 1 }}>
                                  <TextInput
                                    size="sm"
                                    label="参数名称"
                                    placeholder="如: 加热温度"
                                    value={param.name}
                                    onChange={(e) => updateParameter(param.id, 'name', e.currentTarget.value)}
                                  />
                                  <TextInput
                                    size="sm"
                                    label="单位"
                                    placeholder="如: °C"
                                    value={param.unit}
                                    onChange={(e) => updateParameter(param.id, 'unit', e.currentTarget.value)}
                                  />
                                  <NumberInput
                                    size="sm"
                                    label="最小值"
                                    value={param.min}
                                    onChange={(val) => updateParameter(param.id, 'min', typeof val === 'number' ? val : 0)}
                                  />
                                  <NumberInput
                                    size="sm"
                                    label="最大值"
                                    value={param.max}
                                    onChange={(val) => updateParameter(param.id, 'max', typeof val === 'number' ? val : 100)}
                                  />
                                  <NumberInput
                                    size="sm"
                                    label="默认值"
                                    value={param.default}
                                    onChange={(val) => updateParameter(param.id, 'default', typeof val === 'number' ? val : 50)}
                                  />
                                  <Group gap="xs">
                                    <NumberInput
                                      size="sm"
                                      label="步长"
                                      value={param.step}
                                      onChange={(val) => updateParameter(param.id, 'step', typeof val === 'number' ? val : 1)}
                                      style={{ flex: 1 }}
                                    />
                                    <ActionIcon
                                      color="red"
                                      variant="subtle"
                                      mt={20}
                                      onClick={() => removeParameter(param.id)}
                                    >
                                      <Trash2 size={16} />
                                    </ActionIcon>
                                  </Group>
                                </SimpleGrid>
                              </Group>
                            </Paper>
                          ))}
                        </Stack>
                      </ScrollArea>
                    )}
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </Stack>
      </Paper>
    </motion.div>
  );
};
