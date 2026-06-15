import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper, Title, Text, Group, Stack, Button, Divider, Badge,
  Tabs, SimpleGrid, Tooltip, ScrollArea, ActionIcon
} from '@mantine/core';
import {
  Activity, Camera, Download, ChevronLeft, ChevronRight,
  LineChart as LineChartIcon, BarChart2, Gauge, X, Trash2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { LineChart, BarChart, GaugeChart } from '../charts';
import { useExperimentStore } from '../../store/useExperimentStore';
import { runSimulation, hasSimulationModel } from '../../utils/simulationModels';
import { formatDate, downloadFile } from '../../utils/helpers';
import type { ChartSnapshot } from '../../types';

interface RealTimeDataPanelProps {
  experimentId: string;
  currentStep: number;
  currentStepTitle: string;
  parameters: Record<string, number>;
  isPlaying: boolean;
}

export const RealTimeDataPanel: React.FC<RealTimeDataPanelProps> = ({
  experimentId,
  currentStep,
  currentStepTitle,
  parameters,
  isPlaying,
}) => {
  const {
    chartSnapshots,
    addChartSnapshot,
    deleteChartSnapshot,
    settings,
  } = useExperimentStore();

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('realtime');
  const [elapsedTime, setElapsedTime] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [snapshotting, setSnapshotting] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime((t) => t + 0.5);
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    setElapsedTime(0);
  }, [currentStep]);

  const simulation = useMemo(
    () =>
      runSimulation({
        parameters,
        currentStep,
        elapsedTime,
        experimentId,
      }),
    [parameters, currentStep, elapsedTime, experimentId]
  );

  const hasModel = hasSimulationModel(experimentId);
  const isDark = settings.theme === 'dark';

  const handleTakeSnapshot = async () => {
    if (!hasModel) return;
    setSnapshotting(true);
    try {
      addChartSnapshot({
        stepId: currentStep + 1,
        stepTitle: currentStepTitle,
        lineChartData: simulation.lineChartData,
        lineChartSeries: simulation.lineChartSeries,
        barChartData: simulation.barChartData,
        barChartSeries: simulation.barChartSeries,
        gaugeValues: simulation.gaugeValues,
        parameters: { ...parameters },
        elapsedTime,
      });
    } finally {
      setTimeout(() => setSnapshotting(false), 500);
    }
  };

  const handleExportChart = async () => {
    if (!chartContainerRef.current) return;
    try {
      const canvas = await html2canvas(chartContainerRef.current, {
        background: isDark ? '#1E293B' : '#FFFFFF',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `实验图表_${currentStepTitle}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      console.error('导出图表失败');
    }
  };

  const handleExportSnapshot = async (snapshot: ChartSnapshot) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '600px';
    tempDiv.style.padding = '20px';
    tempDiv.style.background = isDark ? '#1E293B' : '#FFFFFF';
    tempDiv.style.color = isDark ? '#F1F5F9' : '#1E293B';
    document.body.appendChild(tempDiv);

    try {
      const title = document.createElement('div');
      title.style.fontSize = '18px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '12px';
      title.textContent = `${snapshot.stepTitle} - ${formatDate(snapshot.timestamp)}`;
      tempDiv.appendChild(title);

      const lineDiv = document.createElement('div');
      lineDiv.id = 'snapshot-line-chart';
      lineDiv.style.marginBottom = '20px';
      tempDiv.appendChild(lineDiv);

      const barDiv = document.createElement('div');
      barDiv.id = 'snapshot-bar-chart';
      tempDiv.appendChild(barDiv);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        background: isDark ? '#1E293B' : '#FFFFFF',
      });
      const dataUrl = canvas.toDataURL('image/png');
      downloadFile(
        dataUrl.split(',')[1],
        `快照_${snapshot.stepTitle}_${Date.now()}.png`,
        'image/png'
      );
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  if (!hasModel) {
    return (
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          background: isDark ? '#1E293B' : '#F8FAFC',
        }}
      >
        <Stack align="center" gap="sm" py="md">
          <Activity size={32} color="#94A3B8" />
          <Text c="dimmed" size="sm">
            当前实验暂无数据可视化模型
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: collapsed ? 48 : 360,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Paper
        p="md"
        radius="lg"
        withBorder
        style={{
          height: '100%',
          minHeight: 600,
          background: isDark ? '#1E293B' : '#F8FAFC',
          borderLeft: `4px solid ${isDark ? '#3B82F6' : '#1E6FBA'}`,
        }}
      >
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <Activity size={18} color={isDark ? '#60A5FA' : '#1E6FBA'} />
                  <Title order={4} size="h5">
                    实时数据
                  </Title>
                </Group>
                <Group gap="xs">
                  <Tooltip label="拍快照">
                    <ActionIcon
                      size="sm"
                      variant={snapshotting ? 'filled' : 'subtle'}
                      color={snapshotting ? 'green' : 'gray'}
                      onClick={handleTakeSnapshot}
                    >
                      <Camera size={16} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="导出图片">
                    <ActionIcon size="sm" variant="subtle" color="gray" onClick={handleExportChart}>
                      <Download size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              <Group mb="md" gap="xs">
                <Badge color="labBlue" size="sm">
                  步骤 {currentStep + 1}
                </Badge>
                <Badge size="sm" variant="light">
                  已运行 {elapsedTime.toFixed(1)}s
                </Badge>
                <Badge size="sm" variant="light" color={isPlaying ? 'green' : 'gray'}>
                  {isPlaying ? '采集中' : '已暂停'}
                </Badge>
              </Group>

              <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List grow>
                  <Tabs.Tab value="realtime" leftSection={<LineChartIcon size={14} />}>
                    实时
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="snapshots"
                    leftSection={<Camera size={14} />}
                  >
                    快照 ({chartSnapshots.length})
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="realtime" pt="md">
                  <div ref={chartContainerRef}>
                    <Stack gap="md">
                      <SimpleGrid cols={{ base: 1, sm: 2, lg: simulation.gaugeValues.length > 2 ? 3 : 2 }}>
                        {simulation.gaugeValues.map((gauge) => (
                          <div
                            key={gauge.key}
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              padding: '8px',
                              background: isDark ? '#334155' : '#FFFFFF',
                              borderRadius: 8,
                            }}
                          >
                            <GaugeChart
                              value={gauge.value}
                              min={gauge.min}
                              max={gauge.max}
                              unit={gauge.unit}
                              label={gauge.label}
                              color={gauge.color}
                            />
                          </div>
                        ))}
                      </SimpleGrid>

                      <Divider />

                      <Paper
                        p="sm"
                        radius="md"
                        style={{ background: isDark ? '#334155' : '#FFFFFF' }}
                      >
                        <LineChart
                          data={simulation.lineChartData}
                          lines={simulation.lineChartSeries}
                          height={180}
                          title="趋势曲线"
                        />
                      </Paper>

                      <Paper
                        p="sm"
                        radius="md"
                        style={{ background: isDark ? '#334155' : '#FFFFFF' }}
                      >
                        <BarChart
                          data={simulation.barChartData}
                          bars={simulation.barChartSeries}
                          height={160}
                          title="数据对比"
                        />
                      </Paper>
                    </Stack>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel value="snapshots" pt="md">
                  <ScrollArea h={480}>
                    {chartSnapshots.length === 0 ? (
                      <Stack align="center" gap="sm" py="xl">
                        <Camera size={32} color="#94A3B8" />
                        <Text c="dimmed" size="sm">
                          暂无快照，点击相机图标保存当前图表
                        </Text>
                      </Stack>
                    ) : (
                      <Stack gap="sm">
                        {chartSnapshots.map((snapshot) => (
                          <Paper
                            key={snapshot.id}
                            p="sm"
                            radius="md"
                            withBorder
                            style={{ background: isDark ? '#334155' : '#FFFFFF' }}
                          >
                            <Stack gap="xs">
                              <Group justify="space-between">
                                <Stack gap={0}>
                                  <Group gap="xs">
                                    <Badge size="xs" color="labBlue">
                                      步骤 {snapshot.stepId}
                                    </Badge>
                                    <Text size="xs" fw={500}>
                                      {snapshot.stepTitle}
                                    </Text>
                                  </Group>
                                  <Text size="xs" c="dimmed">
                                    {formatDate(snapshot.timestamp)}
                                  </Text>
                                </Stack>
                                <Group gap="xs">
                                  <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => handleExportSnapshot(snapshot)}
                                  >
                                    <Download size={14} />
                                  </ActionIcon>
                                  <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    color="red"
                                    onClick={() => deleteChartSnapshot(snapshot.id)}
                                  >
                                    <Trash2 size={14} />
                                  </ActionIcon>
                                </Group>
                              </Group>
                              <LineChart
                                data={snapshot.lineChartData as any}
                                lines={snapshot.lineChartSeries}
                                height={100}
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </ScrollArea>
                </Tabs.Panel>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            top: 16,
            right: collapsed ? 8 : -12,
            transform: 'translateX(100%)',
            background: isDark ? '#334155' : '#FFFFFF',
            boxShadow: settings.theme === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            zIndex: 10,
          }}
        >
          {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </ActionIcon>
      </Paper>
    </motion.div>
  );
};
