import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Group, Stack, Button, Paper, SimpleGrid, Select, Card, Badge, Tabs, Table, ScrollArea } from '@mantine/core';
import { FileText, Download, Printer, Clock, FlaskConical, BookOpen, CheckCircle } from 'lucide-react';
import { useExperimentStore } from '../store/useExperimentStore';
import { experiments } from '../data/experiments';
import { generateExperimentReportHtml, formatDate, downloadFile } from '../utils/helpers';
import { mockApi } from '../utils/api';

export default function Report() {
  const { records, setLoading, setError } = useExperimentStore();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(
    records.length > 0 ? records[0].id : null
  );

  const selectedRecord = records.find(r => r.id === selectedRecordId);
  const experiment = selectedRecord
    ? experiments.find(e => e.id === selectedRecord.experimentId)
    : null;

  const completedRecords = records.filter(r => r.endTime);

  const handleGenerateHtml = () => {
    if (!selectedRecord || !experiment) return;

    const reportData = {
      experimentName: experiment.name,
      date: formatDate(selectedRecord.startTime),
      purpose: experiment.description,
      materials: experiment.materials,
      equipment: experiment.equipment,
      procedures: experiment.steps.map(s => ({
        step: s.id,
        title: s.title,
        description: s.description
      })),
      observations: selectedRecord.observations,
      data: selectedRecord.data,
      conclusion: selectedRecord.conclusion || ''
    };

    const html = generateExperimentReportHtml(reportData);
    const filename = `实验报告_${experiment.name}_${new Date().toISOString().split('T')[0]}.html`;
    downloadFile(html, filename, 'text/html');
  };

  const handlePrint = () => {
    if (!selectedRecord || !experiment) return;

    const reportData = {
      experimentName: experiment.name,
      date: formatDate(selectedRecord.startTime),
      purpose: experiment.description,
      materials: experiment.materials,
      equipment: experiment.equipment,
      procedures: experiment.steps.map(s => ({
        step: s.id,
        title: s.title,
        description: s.description
      })),
      observations: selectedRecord.observations,
      data: selectedRecord.data,
      conclusion: selectedRecord.conclusion || ''
    };

    const html = generateExperimentReportHtml(reportData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportJson = async () => {
    if (!selectedRecord || !experiment) return;

    setLoading(true);
    try {
      const response = await mockApi.exportRecords();
      if (response.success && response.data) {
        const filename = `实验数据_${experiment.name}_${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(response.data, filename, 'application/json');
      }
    } catch {
      setError('导出失败');
    } finally {
      setLoading(false);
    }
  };

  const recordOptions = completedRecords.map(r => ({
    value: r.id,
    label: `${r.experimentName || '未命名实验'} - ${formatDate(r.startTime)}`
  }));

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
              <Title order={2} size="h3">实验报告</Title>
              <Text c="dimmed">生成和导出专业的实验报告</Text>
            </Stack>
            <Group>
              <Button
                variant="light"
                leftSection={<FileText size={16} />}
                onClick={handleGenerateHtml}
                disabled={!selectedRecord}
              >
                导出 HTML
              </Button>
              <Button
                variant="light"
                leftSection={<Printer size={16} />}
                onClick={handlePrint}
                disabled={!selectedRecord}
              >
                打印报告
              </Button>
              <Button
                leftSection={<Download size={16} />}
                onClick={handleExportJson}
                disabled={!selectedRecord}
              >
                导出数据
              </Button>
            </Group>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 4 }}>
            {[
              { label: '总记录数', value: records.length, icon: FileText, color: '#1E6FBA' },
              { label: '可生成报告', value: completedRecords.length, icon: CheckCircle, color: '#10B981' },
              { label: '进行中', value: records.filter(r => !r.endTime).length, icon: Clock, color: '#F59E0B' },
              { label: '有结论', value: records.filter(r => r.conclusion).length, icon: BookOpen, color: '#8B5CF6' }
            ].map((stat, index) => {
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

          {completedRecords.length === 0 ? (
            <Paper withBorder radius="lg" p="xl">
              <Stack align="center" gap="md" py="xl">
                <FileText size={48} color="#9CA3AF" />
                <Text c="dimmed" size="lg">暂无可生成报告的记录</Text>
                <Text c="dimmed">完成至少一个实验后才能生成报告</Text>
              </Stack>
            </Paper>
          ) : (
            <>
              <Paper withBorder radius="lg" p="md">
                <Select
                  label="选择实验记录"
                  placeholder="请选择要生成报告的实验记录"
                  value={selectedRecordId}
                  onChange={setSelectedRecordId}
                  data={recordOptions}
                  searchable
                />
              </Paper>

              {selectedRecord && experiment && (
                <Paper withBorder radius="lg" p="lg">
                  <Tabs defaultValue="overview">
                    <Tabs.List>
                      <Tabs.Tab value="overview" leftSection={<FlaskConical size={14} />}>
                        实验概述
                      </Tabs.Tab>
                      <Tabs.Tab value="observations" leftSection={<BookOpen size={14} />}>
                        观察记录
                      </Tabs.Tab>
                      <Tabs.Tab value="data" leftSection={<FileText size={14} />}>
                        数据记录
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="overview" pt="md">
                      <Stack gap="md">
                        <Group>
                          <Title order={3} size="h4">{experiment.name}</Title>
                          <Badge>{experiment.category}</Badge>
                        </Group>
                        <Text c="dimmed">实验时间: {formatDate(selectedRecord.startTime)}</Text>
                        
                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                          <div>
                            <Text fw={600} mb="sm" c="#1E6FBA">实验目的</Text>
                            <Text>{experiment.description}</Text>
                          </div>
                          <div>
                            <Text fw={600} mb="sm" c="#10B981">实验结论</Text>
                            <Text>{selectedRecord.conclusion || '暂未填写结论'}</Text>
                          </div>
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }}>
                          <div>
                            <Text fw={600} mb="sm" c="#1E6FBA">实验器材</Text>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {experiment.equipment.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <Text fw={600} mb="sm" c="#10B981">实验药品</Text>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                              {experiment.materials.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </SimpleGrid>
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="observations" pt="md">
                      <Stack gap="sm">
                        {selectedRecord.observations.length === 0 ? (
                          <Text c="dimmed">暂无观察记录</Text>
                        ) : (
                          selectedRecord.observations.map((obs, idx) => (
                            <Card key={idx} withBorder radius="md" p="md">
                              <Group justify="space-between" mb="xs">
                                <Badge>步骤 {obs.stepId}</Badge>
                                <Text size="xs" c="dimmed">
                                  {formatDate(obs.timestamp)}
                                </Text>
                              </Group>
                              <Text>{obs.content}</Text>
                            </Card>
                          ))
                        )}
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="data" pt="md">
                      {selectedRecord.data.length === 0 ? (
                        <Text c="dimmed">暂无数据记录</Text>
                      ) : (
                        <ScrollArea>
                          <Table highlightOnHover>
                            <Table.Thead>
                              <Table.Tr>
                                {Object.keys(selectedRecord.data[0]).map(key => (
                                  <Table.Th key={key}>{key}</Table.Th>
                                ))}
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {selectedRecord.data.map((row, idx) => (
                                <Table.Tr key={idx}>
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
                  </Tabs>
                </Paper>
              )}
            </>
          )}
        </Stack>
      </motion.div>
    </Container>
  );
}
