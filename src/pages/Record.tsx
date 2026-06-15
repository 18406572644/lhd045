import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Title, Text, Group, Stack, Button, Paper, SimpleGrid, Card, Modal, Textarea, ActionIcon, Tooltip, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BookOpen, Edit, Trash2, Download, Upload, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Loading } from '../components/common/Loading';
import { useMockApi } from '../utils/api';
import { mockApi } from '../utils/api';
import { useExperimentStore } from '../store/useExperimentStore';
import { formatDate, downloadFile, readFileContent } from '../utils/helpers';
import type { ExperimentRecord } from '../types';

export default function Record() {
  const { records, setRecords, deleteRecord, updateRecord, setLoading, setError, error } = useExperimentStore();
  const [selectedRecord, setSelectedRecord] = useState<ExperimentRecord | null>(null);
  const [conclusion, setConclusion] = useState('');
  const [opened, { open, close }] = useDisclosure(false);

  const { loading, refetch } = useMockApi(() => mockApi.getRecords(), []);

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [setRecords]);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await mockApi.exportRecords();
      if (response.success && response.data) {
        const filename = `实验记录_${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(response.data, filename, 'application/json');
      }
    } catch {
      setError('导出失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await readFileContent(file);
      const response = await mockApi.importRecords(content);
      if (response.success) {
        await refetch();
      } else {
        setError(response.error || '导入失败');
      }
    } catch {
      setError('导入失败');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleEditConclusion = (record: ExperimentRecord) => {
    setSelectedRecord(record);
    setConclusion(record.conclusion || '');
    open();
  };

  const handleSaveConclusion = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      const response = await mockApi.updateRecord(selectedRecord.id, { conclusion });
      if (response.success && response.data) {
        updateRecord(selectedRecord.id, { conclusion: response.data.conclusion });
        close();
      } else {
        setError(response.error || '保存失败');
      }
    } catch {
      setError('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    setLoading(true);
    try {
      const response = await mockApi.deleteRecord(id);
      if (response.success) {
        deleteRecord(id);
      } else {
        setError(response.error || '删除失败');
      }
    } catch {
      setError('删除失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading && records.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Loading type="list" />
      </Container>
    );
  }

  const stats = [
    { label: '总记录数', value: records.length, icon: BookOpen, color: '#1E6FBA' },
    { label: '已完成', value: records.filter(r => r.endTime).length, icon: CheckCircle, color: '#10B981' },
    { label: '进行中', value: records.filter(r => !r.endTime).length, icon: Clock, color: '#F59E0B' },
    { label: '有结论', value: records.filter(r => r.conclusion).length, icon: Edit, color: '#8B5CF6' }
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
            <Stack gap={0}>
              <Title order={2} size="h3">实验记录</Title>
              <Text c="dimmed">查看和管理您的所有实验记录</Text>
            </Stack>
            <Group>
              <Button
                component="label"
                variant="light"
                leftSection={<Upload size={16} />}
              >
                导入记录
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={handleImport}
                />
              </Button>
              <Button
                variant="light"
                leftSection={<Download size={16} />}
                onClick={handleExport}
              >
                导出记录
              </Button>
            </Group>
          </Group>

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
                  <div
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
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
                  </div>
                </motion.div>
              );
            })}
          </SimpleGrid>

          {error && (
            <Group gap="xs">
              <AlertCircle size={20} color="#EF4444" />
              <Text c="red">{error}</Text>
            </Group>
          )}

          {records.length === 0 ? (
            <Paper withBorder radius="lg" p="xl">
              <Stack align="center" gap="md" py="xl">
                <BookOpen size={48} color="#9CA3AF" />
                <Text c="dimmed" size="lg">暂无实验记录</Text>
                <Text c="dimmed">开始一个实验，记录您的观察和数据</Text>
                <Button
                  leftSection={<Plus size={16} />}
                  component="a"
                  href="/"
                >
                  浏览实验
                </Button>
              </Stack>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              <AnimatePresence mode="popLayout">
                {records.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    layout
                  >
                    <Card
                      withBorder
                      radius="lg"
                      style={{ height: '100%' }}
                    >
                      <Card.Section withBorder inheritPadding py="md">
                        <Group justify="space-between" align="flex-start">
                          <Stack gap={0}>
                            <Text fw={600} size="lg" lineClamp={1}>
                              {record.experimentName || '未命名实验'}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {formatDate(record.startTime)}
                            </Text>
                          </Stack>
                          <Badge color={record.endTime ? 'green' : 'yellow'}>
                            {record.endTime ? '已完成' : '进行中'}
                          </Badge>
                        </Group>
                      </Card.Section>

                      <Stack gap="sm" mt="md">
                        <Group gap="xs">
                          <Clock size={14} color="#6B7280" />
                          <Text size="sm" c="dimmed">
                            {record.endTime
                              ? `时长: ${Math.round((new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / 60000)} 分钟`
                              : '未完成'}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <BookOpen size={14} color="#6B7280" />
                          <Text size="sm" c="dimmed">
                            {record.observations.length} 条观察记录
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <Edit size={14} color="#6B7280" />
                          <Text size="sm" c="dimmed">
                            {record.data.length} 条数据记录
                          </Text>
                        </Group>
                        {record.conclusion && (
                          <Text size="sm" lineClamp={2} c="dimmed" mt="xs">
                            结论: {record.conclusion}
                          </Text>
                        )}
                      </Stack>

                      <Group mt="md" grow>
                        <Button
                          variant="light"
                          leftSection={<Edit size={16} />}
                          onClick={() => handleEditConclusion(record)}
                        >
                          {record.conclusion ? '编辑结论' : '添加结论'}
                        </Button>
                        <Button
                          variant="light"
                          color="red"
                          leftSection={<Trash2 size={16} />}
                          onClick={() => handleDelete(record.id)}
                        >
                          删除
                        </Button>
                      </Group>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </SimpleGrid>
          )}
        </Stack>
      </motion.div>

      <Modal
        opened={opened}
        onClose={close}
        title="编辑实验结论"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            实验: {selectedRecord?.experimentName}
          </Text>
          <Textarea
            placeholder="请输入实验结论..."
            value={conclusion}
            onChange={(e) => setConclusion(e.currentTarget.value)}
            minRows={6}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={close}>取消</Button>
            <Button onClick={handleSaveConclusion}>保存</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
