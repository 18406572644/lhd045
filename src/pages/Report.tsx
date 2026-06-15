import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Group, Stack, Button, Paper, SimpleGrid, Select, Card, Badge, Tabs, Table, ScrollArea, Progress, Alert, RingProgress } from '@mantine/core';
import { FileText, Download, Printer, Clock, FlaskConical, BookOpen, CheckCircle, AlertTriangle, TrendingUp, Lightbulb, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import { useExperimentStore } from '../store/useExperimentStore';
import { experiments } from '../data/experiments';
import { generateExperimentReportHtml, formatDate, downloadFile, analyzeExperiment } from '../utils/helpers';
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

  const analysis = useMemo(() => {
    if (!selectedRecord || !experiment) return null;
    return analyzeExperiment(experiment, selectedRecord);
  }, [selectedRecord, experiment]);

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
      conclusion: selectedRecord.conclusion || '',
      analysis: analysis || undefined
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
      conclusion: selectedRecord.conclusion || '',
      analysis: analysis || undefined
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
                      <Tabs.Tab value="analysis" leftSection={<BarChart3 size={14} />}>
                        智能分析
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

                    <Tabs.Panel value="analysis" pt="md">
                      {analysis ? (
                        <Stack gap="lg">
                          <Paper withBorder radius="md" p="lg" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)' }}>
                            <Group justify="space-between" align="flex-start">
                              <Stack gap="sm">
                                <Group gap="sm">
                                  <TrendingUp size={24} color="#1E6FBA" />
                                  <Text fw={700} size="xl" c="#1E6FBA">实验数据分析评分</Text>
                                </Group>
                                <Text size="sm" c="dimmed">基于实验数据和操作规范的综合评估</Text>
                              </Stack>
                              <RingProgress
                                size={100}
                                thickness={10}
                                sections={[{ value: analysis.overallScore, color: analysis.overallScore >= 70 ? '#10B981' : analysis.overallScore >= 50 ? '#F59E0B' : '#EF4444' }]}
                                label={
                                  <Text size="xl" fw={700} c={analysis.overallScore >= 70 ? '#10B981' : analysis.overallScore >= 50 ? '#F59E0B' : '#EF4444'}>
                                    {analysis.overallScore}
                                  </Text>
                                }
                              />
                            </Group>
                          </Paper>

                          <Alert
                            icon={<Lightbulb size={20} />}
                            title="分析总结"
                            color={analysis.overallScore >= 70 ? 'green' : analysis.overallScore >= 50 ? 'yellow' : 'red'}
                            variant="light"
                          >
                            <Text>{analysis.summary}</Text>
                          </Alert>

                          <Paper withBorder radius="md" p="md">
                            <Group gap="sm" mb="md">
                              <BarChart3 size={20} color="#1E6FBA" />
                              <Text fw={700} size="lg">数据误差分析</Text>
                            </Group>
                            <Stack gap="md">
                              {analysis.dataAnalysis.map((item, idx) => (
                                <Card key={idx} withBorder radius="sm" p="md">
                                  <Stack gap="sm">
                                    <Group justify="space-between">
                                      <Group gap="sm">
                                        {item.isWithinRange ? (
                                          <CheckCircle2 size={18} color="#10B981" />
                                        ) : (
                                          <XCircle size={18} color="#EF4444" />
                                        )}
                                        <Text fw={600}>{item.dataPointLabel}</Text>
                                        <Badge color={item.isWithinRange ? 'green' : 'red'} variant="light">
                                          {item.isWithinRange ? '正常' : '异常'}
                                        </Badge>
                                      </Group>
                                      <Text size="sm" fw={600} c={item.isWithinRange ? 'green' : 'red'}>
                                        误差: {item.errorPercentage}%
                                      </Text>
                                    </Group>
                                    
                                    <SimpleGrid cols={3}>
                                      <div>
                                        <Text size="xs" c="dimmed">测量值</Text>
                                        <Text fw={600}>{item.measuredValue} {item.unit}</Text>
                                      </div>
                                      <div>
                                        <Text size="xs" c="dimmed">理论值</Text>
                                        <Text fw={600}>{item.expectedValue} {item.unit}</Text>
                                      </div>
                                      <div>
                                        <Text size="xs" c="dimmed">允许范围</Text>
                                        <Text fw={600}>{item.acceptableRange.min.toFixed(2)} ~ {item.acceptableRange.max.toFixed(2)} {item.unit}</Text>
                                      </div>
                                    </SimpleGrid>

                                    {item.errorSources.length > 0 && (
                                      <div>
                                        <Text size="xs" c="dimmed" mb="xs">可能的误差来源：</Text>
                                        <Stack gap={4}>
                                          {item.errorSources.map((source, sIdx) => (
                                            <Group key={sIdx} gap="xs" align="flex-start">
                                              <AlertTriangle size={14} color="#F59E0B" style={{ marginTop: 2 }} />
                                              <Text size="sm">{source}</Text>
                                            </Group>
                                          ))}
                                        </Stack>
                                      </div>
                                    )}

                                    <Progress
                                      value={Math.min(100, item.errorPercentage)}
                                      color={item.isWithinRange ? 'green' : item.errorPercentage > 20 ? 'red' : 'yellow'}
                                      size="sm"
                                    />
                                  </Stack>
                                </Card>
                              ))}
                            </Stack>
                          </Paper>

                          <Paper withBorder radius="md" p="md">
                            <Group gap="sm" mb="md">
                              <CheckCircle2 size={20} color="#10B981" />
                              <Text fw={700} size="lg">操作规范性检查</Text>
                            </Group>
                            <Stack gap="sm">
                              {analysis.operationChecks.map((check) => (
                                <Card key={check.id} withBorder radius="sm" p="md" style={{
                                  borderLeft: `4px solid ${check.isNormal ? '#10B981' : '#EF4444'}`
                                }}>
                                  <Group justify="space-between" align="flex-start">
                                    <Group gap="sm" align="flex-start">
                                      {check.isNormal ? (
                                        <CheckCircle2 size={18} color="#10B981" style={{ marginTop: 2 }} />
                                      ) : (
                                        <XCircle size={18} color="#EF4444" style={{ marginTop: 2 }} />
                                      )}
                                      <div>
                                        <Text fw={600}>{check.title}</Text>
                                        <Text size="sm" c="dimmed">{check.description}</Text>
                                      </div>
                                    </Group>
                                    <Badge color={check.isNormal ? 'green' : 'red'} variant="light">
                                      {check.isNormal ? '规范' : '不规范'}
                                    </Badge>
                                  </Group>
                                  {!check.isNormal && check.suggestion && (
                                    <Text size="sm" c="orange" mt="xs">
                                      💡 建议：{check.suggestion}
                                    </Text>
                                  )}
                                </Card>
                              ))}
                            </Stack>
                          </Paper>

                          <Paper withBorder radius="md" p="md" style={{ background: '#FFFBEB' }}>
                            <Group gap="sm" mb="md">
                              <Lightbulb size={20} color="#F59E0B" />
                              <Text fw={700} size="lg">改进建议</Text>
                            </Group>
                            <Stack gap="sm">
                              {analysis.improvements.map((improvement, idx) => (
                                <Group key={idx} gap="sm" align="flex-start">
                                  <Text fw={600} c="#F59E0B">{idx + 1}.</Text>
                                  <Text size="sm">{improvement}</Text>
                                </Group>
                              ))}
                            </Stack>
                          </Paper>
                        </Stack>
                      ) : (
                        <Text c="dimmed">暂无分析数据</Text>
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
