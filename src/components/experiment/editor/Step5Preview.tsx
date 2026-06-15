import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Paper, Text, Stack, Group, Button, Badge, ScrollArea,
  Divider, Alert, SimpleGrid, Tabs, List
} from '@mantine/core';
import {
  Eye, Save, Download, Upload, CheckCircle2,
  AlertTriangle, FileJson, FlaskConical, Clock,
  Shield, Gauge, ListOrdered, Atom, Beaker
} from 'lucide-react';
import type { Experiment } from '../../../types';
import { useExperimentStore } from '../../../store/useExperimentStore';
import {
  getDifficultyColor, getDifficultyLabel,
  getSafetyLevelColor, getSafetyLevelLabel
} from '../../../styles/theme';
import { downloadFile, readFileContent } from '../../../utils/helpers';
import type { EditorState } from './types';
import { convertEditorStateToExperiment, validateEditorState } from './types';
import { renderChemicalFormula } from '../../../utils/helpers';

interface Step5PreviewProps {
  editorState: EditorState;
  onSave: (experiment: Omit<Experiment, 'id'>) => void;
  onBack: () => void;
  onClose: () => void;
}

export const Step5Preview: React.FC<Step5PreviewProps> = ({
  editorState,
  onSave,
  onBack,
  onClose
}) => {
  const { settings, importCustomExperiment } = useExperimentStore();
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [importError, setImportError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const errors = validateEditorState(editorState);
  const experimentData = convertEditorStateToExperiment(editorState);
  const jsonString = JSON.stringify(experimentData, null, 2);

  const handleSave = () => {
    if (errors.length > 0) return;
    onSave(experimentData);
    setSaveSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleExport = () => {
    const exportData = {
      ...experimentData,
      version: '1.0',
      exportedAt: new Date().toISOString()
    };
    const fileName = `${experimentData.name.replace(/\s+/g, '_')}.json`;
    downloadFile(JSON.stringify(exportData, null, 2), fileName, 'application/json');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const content = await readFileContent(file);
      const data = JSON.parse(content) as Experiment;

      if (!data.name || !data.steps || !Array.isArray(data.steps)) {
        throw new Error('无效的实验数据格式');
      }

      importCustomExperiment(data);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : '导入失败，请检查文件格式');
    }
  };

  if (saveSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            background: settings.theme === 'light'
              ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
              : 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
            borderColor: '#10B981'
          }}
        >
          <Stack align="center" gap="lg" py="xl">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle2 size={64} color="#10B981" />
            </motion.div>
            <Text fw={700} size="xl" c="#10B981">
              保存成功！
            </Text>
            <Text c="dimmed">
              实验已保存到本地存储
            </Text>
          </Stack>
        </Paper>
      </motion.div>
    );
  }

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
                    background: '#10B98120',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Eye size={22} color="#10B981" />
                </div>
                <Stack gap={2}>
                  <Text fw={700} size="lg">预览与保存</Text>
                  <Text size="sm" c="dimmed">预览实验配置，确认无误后保存</Text>
                </Stack>
              </Group>
            </Group>

            {errors.length > 0 && (
              <Alert
                icon={<AlertTriangle size={18} />}
                title="请完成以下内容"
                color="red"
                variant="light"
              >
                <List size="sm" spacing="xs">
                  {errors.map((error, i) => (
                    <List.Item key={i}>{error}</List.Item>
                  ))}
                </List>
              </Alert>
            )}

            <Tabs value={activeTab} onChange={(v) => setActiveTab(v as 'preview' | 'json')}>
              <Tabs.List grow>
                <Tabs.Tab value="preview" leftSection={<Eye size={16} />}>
                  预览
                </Tabs.Tab>
                <Tabs.Tab value="json" leftSection={<FileJson size={16} />}>
                  JSON
                </Tabs.Tab>
              </Tabs.List>

              {activeTab === 'preview' ? (
                <ScrollArea h={450} scrollbarSize={6} mt="md">
                  <Stack gap="md">
                    <Paper p="md" radius="md" withBorder>
                      <Group gap="sm" mb="md">
                        <FlaskConical size={18} color="#1E6FBA" />
                        <Text fw={600}>基本信息</Text>
                      </Group>
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">实验名称</Text>
                          <Text size="sm" fw={500}>{editorState.basicInfo.name || '未设置'}</Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">实验描述</Text>
                          <Text size="sm" style={{ maxWidth: '60%' }} ta="right">
                            {editorState.basicInfo.description || '未设置'}
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">分类</Text>
                          <Text size="sm">{editorState.basicInfo.category || '未设置'}</Text>
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                          <Group justify="space-between">
                            <Group gap="xs">
                              <Gauge size={14} color="#8B5CF6" />
                              <Text size="sm" c="dimmed">难度</Text>
                            </Group>
                            <Badge color={getDifficultyColor(editorState.basicInfo.difficulty)}>
                              {getDifficultyLabel(editorState.basicInfo.difficulty)}
                            </Badge>
                          </Group>
                          <Group justify="space-between">
                            <Group gap="xs">
                              <Shield size={14} color="#EF4444" />
                              <Text size="sm" c="dimmed">安全等级</Text>
                            </Group>
                            <Badge color={getSafetyLevelColor(editorState.basicInfo.safetyLevel)}>
                              {getSafetyLevelLabel(editorState.basicInfo.safetyLevel)}
                            </Badge>
                          </Group>
                          <Group justify="space-between">
                            <Group gap="xs">
                              <Clock size={14} color="#10B981" />
                              <Text size="sm" c="dimmed">时长</Text>
                            </Group>
                            <Text size="sm">{editorState.basicInfo.duration} 分钟</Text>
                          </Group>
                        </SimpleGrid>
                      </Stack>
                    </Paper>

                    <Paper p="md" radius="md" withBorder>
                      <Group gap="sm" mb="md">
                        <Beaker size={18} color="#10B981" />
                        <Text fw={600}>器材与药品</Text>
                      </Group>
                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="labBlue">实验器材 ({editorState.equipment.length})</Text>
                          <Group gap="xs" wrap="wrap">
                            {editorState.equipment.length > 0 ? (
                              editorState.equipment.map(e => (
                                <Badge key={e.item.id} color="labBlue" size="sm" radius="sm">
                                  {e.item.name}{e.quantity > 1 ? ` × ${e.quantity}` : ''}
                                </Badge>
                              ))
                            ) : (
                              <Text size="xs" c="dimmed">未选择</Text>
                            )}
                          </Group>
                        </Stack>
                        <Stack gap="xs">
                          <Text size="sm" fw={500} c="pink">实验药品 ({editorState.chemicals.length})</Text>
                          <Group gap="xs" wrap="wrap">
                            {editorState.chemicals.length > 0 ? (
                              editorState.chemicals.map(c => (
                                <Badge key={c.item.id} color="pink" size="sm" radius="sm">
                                  {c.item.name}{c.quantity ? ` (${c.quantity})` : ''}
                                </Badge>
                              ))
                            ) : (
                              <Text size="xs" c="dimmed">未选择</Text>
                            )}
                          </Group>
                        </Stack>
                      </SimpleGrid>
                    </Paper>

                    <Paper p="md" radius="md" withBorder>
                      <Group gap="sm" mb="md">
                        <ListOrdered size={18} color="#8B5CF6" />
                        <Text fw={600}>实验步骤 ({editorState.steps.length})</Text>
                      </Group>
                      <Stack gap="sm">
                        {editorState.steps.length > 0 ? (
                          editorState.steps.map((step, index) => (
                            <Paper key={step.id} p="sm" radius="sm" withBorder>
                              <Group justify="space-between" wrap="nowrap">
                                <Group gap="sm" wrap="nowrap">
                                  <Badge color="violet" size="lg">{index + 1}</Badge>
                                  <Stack gap={0}>
                                    <Text size="sm" fw={500}>{step.title}</Text>
                                    <Text size="xs" c="dimmed" lineClamp={1}>{step.description}</Text>
                                  </Stack>
                                </Group>
                                <Group gap="xs">
                                  <Badge size="sm" color="gray">
                                    {step.animationType}
                                  </Badge>
                                  {step.dataPoints && step.dataPoints.length > 0 && (
                                    <Badge size="sm" color="blue">
                                      {step.dataPoints.length} 数据点
                                    </Badge>
                                  )}
                                </Group>
                              </Group>
                            </Paper>
                          ))
                        ) : (
                          <Text size="xs" c="dimmed">未添加步骤</Text>
                        )}
                      </Stack>
                    </Paper>

                    {editorState.equations.length > 0 && (
                      <Paper p="md" radius="md" withBorder>
                        <Group gap="sm" mb="md">
                          <Atom size={18} color="#F59E0B" />
                          <Text fw={600}>化学方程式 ({editorState.equations.length})</Text>
                        </Group>
                        <Stack gap="sm">
                          {editorState.equations.map((eq, index) => (
                            <Paper key={eq.id} p="sm" radius="sm" withBorder>
                              <Group gap="sm" wrap="nowrap" justify="space-between">
                                <Text size="sm" c="dimmed">方程式 {index + 1}</Text>
                                {eq.type && <Badge size="xs" color="yellow">{eq.type}</Badge>}
                              </Group>
                              <div
                                style={{
                                  fontFamily: '"JetBrains Mono", monospace',
                                  fontSize: '14px',
                                  marginTop: '8px'
                                }}
                              >
                                {eq.reactants.map((r, i) => (
                                  <span key={i} style={{ color: r.color || 'inherit' }}>
                                    <span dangerouslySetInnerHTML={{ __html: renderChemicalFormula(r.formula || '?') }} />
                                    {i < eq.reactants.length - 1 && <span style={{ color: '#94A3B8', margin: '0 4px' }}>+</span>}
                                  </span>
                                ))}
                                {eq.reactants.length > 0 && (
                                  <span style={{ color: '#94A3B8', margin: '0 8px' }}>→</span>
                                )}
                                {eq.products.map((p, i) => (
                                  <span key={i} style={{ color: p.color || 'inherit' }}>
                                    <span dangerouslySetInnerHTML={{ __html: renderChemicalFormula(p.formula || '?') }} />
                                    {i < eq.products.length - 1 && <span style={{ color: '#94A3B8', margin: '0 4px' }}>+</span>}
                                  </span>
                                ))}
                              </div>
                            </Paper>
                          ))}
                        </Stack>
                      </Paper>
                    )}

                    {editorState.parameters.length > 0 && (
                      <Paper p="md" radius="md" withBorder>
                        <Group gap="sm" mb="md">
                          <Gauge size={18} color="#3B82F6" />
                          <Text fw={600}>实验参数 ({editorState.parameters.length})</Text>
                        </Group>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                          {editorState.parameters.map(param => (
                            <Paper key={param.id} p="sm" radius="sm" withBorder>
                              <Group justify="space-between">
                                <Text size="sm" fw={500}>{param.name}</Text>
                                <Text size="xs" c="dimmed">
                                  {param.min} - {param.max} {param.unit}
                                </Text>
                              </Group>
                              <Text size="xs" c="dimmed" mt="xs">
                                默认值: {param.default} {param.unit}
                              </Text>
                            </Paper>
                          ))}
                        </SimpleGrid>
                      </Paper>
                    )}
                  </Stack>
                </ScrollArea>
              ) : (
                <ScrollArea h={450} scrollbarSize={6} mt="md">
                  <Paper
                    p="md"
                    radius="md"
                    style={{
                      background: settings.theme === 'light' ? '#F8FAFC' : '#1E293B',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '12px'
                    }}
                  >
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {jsonString}
                    </pre>
                  </Paper>
                </ScrollArea>
              )}
            </Tabs>
          </Stack>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Stack gap="md">
            <Divider />
            <Group justify="space-between" wrap="wrap">
              <Group gap="sm" wrap="wrap">
                <Button
                  variant="outline"
                  leftSection={<Download size={16} />}
                  onClick={handleExport}
                  disabled={errors.length > 0}
                >
                  导出 JSON
                </Button>
                <Button
                  component="label"
                  variant="outline"
                  color="violet"
                  leftSection={<Upload size={16} />}
                >
                  导入 JSON
                  <input
                    type="file"
                    accept=".json"
                    hidden
                    onChange={handleImport}
                  />
                </Button>
              </Group>
              <Group gap="sm">
                <Button variant="subtle" onClick={onBack}>
                  返回编辑
                </Button>
                <Button
                  color="green"
                  leftSection={<Save size={16} />}
                  onClick={handleSave}
                  disabled={errors.length > 0}
                  size="lg"
                >
                  保存实验
                </Button>
              </Group>
            </Group>
            {importError && (
              <Alert color="red" icon={<AlertTriangle size={14} />}>
                {importError}
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </motion.div>
  );
};
