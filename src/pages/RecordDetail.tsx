import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container, Title, Text, Group, Stack, Button, Paper, Badge,
  Table, ScrollArea, Card, SimpleGrid, Tabs, Textarea, Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ArrowLeft, Edit, Trash2, Download, Clock, BookOpen,
  FlaskConical, CheckCircle, AlertCircle, FileText,
  Settings, Lightbulb, Clipboard, Plus, Save
} from 'lucide-react';
import { Loading } from '../components/common/Loading';
import { useExperimentStore } from '../store/useExperimentStore';
import { experiments } from '../data/experiments';
import { formatDate, downloadFile, generateExperimentReportHtml } from '../utils/helpers';
import { mockApi } from '../utils/api';
import type { ExperimentRecord, Experiment } from '../types';

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { records, deleteRecord, updateRecord, setLoading, setError, error } = useExperimentStore();
  const [editConclusionOpened, { open: openEditConclusion, close: closeEditConclusion }] = useDisclosure(false);
  const [conclusionText, setConclusionText] = useState('');
  const [record, setRecord] = useState<ExperimentRecord | null>(null);
  const [experiment, setExperiment] = useState<Experiment | null>(null);

  useEffect(() => {
    if (!id) return;

    const foundRecord = records.find(r => r.id === id);
    setRecord(foundRecord || null);

    if (foundRecord) {
      const foundExperiment = experiments.find(e => e.id === foundRecord.experimentId);
      setExperiment(foundExperiment || null);
      setConclusionText(foundRecord.conclusion || '');
    }
  }, [id, records]);

  const handleDelete = async () => {
    if (!id || !confirm('确定要删除这条记录吗？此操作不可撤销。')) return;

    setLoading(true);
    try {
      const response = await mockApi.deleteRecord(id);
      if (response.success) {
        deleteRecord(id);
        navigate('/record');
      } else {
        setError(response.error || '删除失败');
      }
    } catch {
      setError('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConclusion = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await mockApi.updateRecord(id, { conclusion: conclusionText });
      if (response.success && response.data) {
        updateRecord(id, { conclusion: response.data.conclusion });
        setRecord(prev => prev ? { ...prev, conclusion: response.data.conclusion } : null);
        closeEditConclusion();
      } else {
        setError(response.error || '保存失败');
      }
    } catch {
      setError('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!record || !experiment) return;

    const reportData = {
      experimentName: experiment.name,
      date: formatDate(record.startTime),
      purpose: experiment.description,
      materials: experiment.materials,
      equipment: experiment.equipment,
      procedures: experiment.steps.map(s => ({
        step: s.id,
        title: s.title,
        description: s.description
      })),
      observations: record.observations,
      data: record.data,
      conclusion: record.conclusion || ''
    };

    const html = generateExperimentReportHtml(reportData);
    const filename = `实验报告_${experiment.name}_${new Date().toISOString().split('T')[0]}.html`;
    downloadFile(html, filename, 'text/html');
  };

  const handlePrintReport = () => {
    if (!record || !experiment) return;

    const reportData = {
      experimentName: experiment.name,
      date: formatDate(record.startTime),
      purpose: experiment.description,
      materials: experiment.materials,
      equipment: experiment.equipment,
      procedures: experiment.steps.map(s => ({
        step: s.id,
        title: s.title,
        description: s.description
      })),
      observations: record.observations,
      data: record.data,
      conclusion: record.conclusion || ''
    };

    const html = generateExperimentReportHtml(reportData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!record) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md" py="xl">
          <AlertCircle size={48} color="#EF4444" />
          <Text c="dimmed" size="lg">记录不存在或已被删除</Text>
          <Button
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate('/record')}
          >
            返回记录列表
          </Button>
        </Stack>
      </Container>
    );
  }

  const duration = record.endTime
    ? Math.round((new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / 60000)
    : null;

  const observationsByStep = record.observations.reduce((acc, obs) => {
    if (!acc[obs.stepId]) {
      acc[obs.stepId] = [];
    }
    acc[obs.stepId].push(obs);
    return acc;
  }, {} as Record<number, typeof record.observations>);

  const stats = [
    { label: '观察记录', value: record.observations.length, icon: BookOpen, color: '#1E6FBA' },
    { label: '数据记录', value: record.data.length, icon: Clipboard, color: '#10B981' },
    { label: '实验时长', value: duration ? `${duration} 分钟` : '未完成', icon: Clock, color: '#F59E0B' },
    { label: '状态', value: record.endTime ? '已完成' : '进行中', icon: CheckCircle, color: record.endTime ? '#10B981' : '#F59E0B' }
  ];

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack gap="xl">
          <Group justify="space-between" wrap="wrap">
            <Group gap="md" wrap="wrap">
              <Button
                variant="light"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => navigate('/record')}
              >
                返回列表
              </Button>
              <Stack gap={0}>
                <Title order={2} size="h3">
                  {record.experimentName || '未命名实验'}
                </Title>
                <Group gap="sm">
                  <Badge color={record.endTime ? 'green' : 'yellow'}>
                    {record.endTime ? '已完成' : '进行中'}
                  </Badge>
                  {experiment && (
                    <Badge variant="light">{experiment.category}</Badge>
                  )}
                  <Text size="sm" c="dimmed">
                    {formatDate(record.startTime)}
                  </Text>
                </Group>
              </Stack>
            </Group>
            <Group>
              <Button
                variant="light"
                leftSection={<Download size={16} />}
                onClick={handleExportReport}
              >
                导出报告
              </Button>
              <Button
                variant="light"
                leftSection={<FileText size={16} />}
                onClick={handlePrintReport}
              >
                打印报告
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<Trash2 size={16} />}
                onClick={handleDelete}
              >
                删除记录
              </Button>
            </Group>
          </Group>

          {error && (
            <Group gap="xs">
              <AlertCircle size={20} color="#EF4444" />
              <Text c="red">{error}</Text>
            </Group>
          )}

          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card withBorder radius="lg" p="md" style={{ height: '100%' }}>
                    <Group gap="sm">
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: `${stat.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={22} color={stat.color} />
                      </div>
                      <Stack gap={0}>
                        <Text size="sm" c="dimmed">{stat.label}</Text>
                        <Text size="xl" fw={700} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {stat.value}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                </motion.div>
              );
            })}
          </SimpleGrid>

          <Paper withBorder radius="lg" p="lg">
            <Group gap="sm" mb="md">
              <FlaskConical size={20} color="#1E6FBA" />
              <Title order={3} size="h4">实验概述</Title>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              <div>
                <Text fw={600} mb="sm" c="#1E6FBA">实验目的</Text>
                <Text>{experiment?.description || '暂无实验描述'}</Text>
              </div>
              <div>
                <Text fw={600} mb="sm" c="#10B981">实验结论</Text>
                {record.conclusion ? (
                  <Text>{record.conclusion}</Text>
                ) : (
                  <Group gap="xs">
                    <Text c="dimmed">暂未填写结论</Text>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<Edit size={12} />}
                      onClick={openEditConclusion}
                    >
                      添加结论
                    </Button>
                  </Group>
                )}
              </div>
            </SimpleGrid>
          </Paper>

          {Object.keys(record.parameters).length > 0 && experiment && (
            <Paper withBorder radius="lg" p="lg">
              <Group gap="sm" mb="md">
                <Settings size={20} color="#1E6FBA" />
                <Title order={3} size="h4">实验参数设置</Title>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                {experiment.parameters.map(param => {
                  const value = record.parameters[param.id];
                  return (
                    <Card key={param.id} withBorder radius="md" p="md">
                      <Text size="sm" c="dimmed" mb="xs">{param.name}</Text>
                      <Group gap="xs" align="baseline">
                        <Text size="xl" fw={700} c="#1E6FBA" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {value ?? param.default}
                        </Text>
                        <Text size="sm" c="dimmed">{param.unit}</Text>
                      </Group>
                      <Group gap="xs" mt="xs">
                        <Text size="xs" c="dimmed">
                          范围: {param.min} - {param.max}
                        </Text>
                      </Group>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </Paper>
          )}

          <Paper withBorder radius="lg" p="lg">
            <Tabs defaultValue="observations">
              <Tabs.List>
                <Tabs.Tab value="observations" leftSection={<BookOpen size={14} />}>
                  观察记录 ({record.observations.length})
                </Tabs.Tab>
                <Tabs.Tab value="data" leftSection={<Clipboard size={14} />}>
                  数据记录 ({record.data.length})
                </Tabs.Tab>
                {experiment && (
                  <Tabs.Tab value="steps" leftSection={<Lightbulb size={14} />}>
                    实验步骤 ({experiment.steps.length})
                  </Tabs.Tab>
                )}
              </Tabs.List>

              <Tabs.Panel value="observations" pt="md">
                {record.observations.length === 0 ? (
                  <Stack align="center" gap="md" py="xl">
                    <BookOpen size={48} color="#9CA3AF" />
                    <Text c="dimmed">暂无观察记录</Text>
                  </Stack>
                ) : (
                  <Stack gap="md">
                    {Object.entries(observationsByStep)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(([stepId, observations]) => (
                        <Card key={stepId} withBorder radius="md" p="md">
                          <Group mb="md">
                            <Badge color="labBlue" size="lg">
                              步骤 {stepId}
                            </Badge>
                            {experiment && experiment.steps[Number(stepId) - 1] && (
                              <Text fw={500}>
                                {experiment.steps[Number(stepId) - 1].title}
                              </Text>
                            )}
                          </Group>
                          <Stack gap="sm">
                            {observations.map((obs, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: '12px',
                                  background: '#F8FAFC',
                                  borderRadius: '8px',
                                  borderLeft: '3px solid #1E6FBA'
                                }}
                              >
                                <Group justify="space-between" mb="xs">
                                  <Text size="xs" c="dimmed">
                                    {formatDate(obs.timestamp)}
                                  </Text>
                                </Group>
                                <Text>{obs.content}</Text>
                              </div>
                            ))}
                          </Stack>
                        </Card>
                      ))}
                  </Stack>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="data" pt="md">
                {record.data.length === 0 ? (
                  <Stack align="center" gap="md" py="xl">
                    <Clipboard size={48} color="#9CA3AF" />
                    <Text c="dimmed">暂无数据记录</Text>
                  </Stack>
                ) : (
                  <ScrollArea>
                    <Table highlightOnHover striped>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>序号</Table.Th>
                          {Object.keys(record.data[0]).map(key => (
                            <Table.Th key={key}>{key}</Table.Th>
                          ))}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {record.data.map((row, idx) => (
                          <Table.Tr key={idx}>
                            <Table.Td fw={600} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                              #{idx + 1}
                            </Table.Td>
                            {Object.values(row).map((value, vIdx) => (
                              <Table.Td key={vIdx}>{String(value)}</Table.Td>
                            ))}
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                )}
              </Tabs.Panel>

              {experiment && (
                <Tabs.Panel value="steps" pt="md">
                  <Stack gap="md">
                    {experiment.steps.map((step, idx) => (
                      <Card
                        key={step.id}
                        withBorder
                        radius="md"
                        p="md"
                        style={{
                          borderLeft: `4px solid ${observationsByStep[step.id] ? '#10B981' : '#E5E7EB'}`
                        }}
                      >
                        <Group justify="space-between" align="flex-start" mb="sm">
                          <Group gap="sm">
                            <Badge color={observationsByStep[step.id] ? 'successGreen' : 'gray'}>
                              步骤 {step.id}
                            </Badge>
                            <Text fw={600}>{step.title}</Text>
                          </Group>
                          {observationsByStep[step.id] && (
                            <Badge color="successGreen" variant="light">
                              有 {observationsByStep[step.id].length} 条记录
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm" c="dimmed" mb="sm">
                          {step.description}
                        </Text>
                        {step.tips.length > 0 && (
                          <div
                            style={{
                              padding: '10px 14px',
                              background: '#FFFBEB',
                              borderRadius: '6px',
                              borderLeft: '3px solid #F59E0B'
                            }}
                          >
                            <Group gap="xs" mb="xs">
                              <Lightbulb size={14} color="#F59E0B" />
                              <Text size="sm" fw={500} c="#F59E0B">实验技巧</Text>
                            </Group>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {step.tips.map((tip, tipIdx) => (
                                <li key={tipIdx} style={{ fontSize: '14px' }}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    ))}
                  </Stack>
                </Tabs.Panel>
              )}
            </Tabs>
          </Paper>

          {experiment && (
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Paper withBorder radius="lg" p="lg">
                <Group gap="sm" mb="md">
                  <FlaskConical size={18} color="#1E6FBA" />
                  <Text fw={600}>实验器材</Text>
                </Group>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {experiment.equipment.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </Paper>
              <Paper withBorder radius="lg" p="lg">
                <Group gap="sm" mb="md">
                  <FlaskConical size={18} color="#10B981" />
                  <Text fw={600}>实验药品</Text>
                </Group>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {experiment.materials.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </Paper>
            </SimpleGrid>
          )}
        </Stack>
      </motion.div>

      <Modal
        opened={editConclusionOpened}
        onClose={closeEditConclusion}
        title="编辑实验结论"
        size="lg"
      >
        <Stack gap="md">
          <Textarea
            placeholder="请输入实验结论，包括实验结果分析、误差分析、心得体会等..."
            value={conclusionText}
            onChange={(e) => setConclusionText(e.currentTarget.value)}
            minRows={8}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeEditConclusion}>取消</Button>
            <Button leftSection={<Save size={16} />} onClick={handleSaveConclusion}>
              保存结论
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
