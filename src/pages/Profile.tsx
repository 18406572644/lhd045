import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Group, Stack, Button, Paper, SimpleGrid, Card, Switch, Slider, Avatar, Divider, ActionIcon, Tooltip, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User, Settings, Moon, Sun, Play, Trash2, Download, Upload, AlertTriangle, Info, Box, Layers, Eye, MousePointer } from 'lucide-react';
import { useExperimentStore } from '../store/useExperimentStore';
import { mockApi } from '../utils/api';
import { downloadFile, readFileContent } from '../utils/helpers';

export default function Profile() {
  const { settings, updateSettings, records, favorites, setLoading, setError, setRecords, setFavorites } = useExperimentStore();
  const [clearOpened, { open: openClear, close: closeClear }] = useDisclosure(false);

  const handleThemeToggle = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const handleAutoPlaySpeedChange = (value: number) => {
    updateSettings({ autoPlaySpeed: value });
  };

  const handleAnimationsToggle = () => {
    updateSettings({ showAnimations: !settings.showAnimations });
  };

  const handleRenderModeToggle = () => {
    updateSettings({ renderMode: settings.renderMode === '2d' ? '3d' : '2d', autoDetectRenderMode: false });
  };

  const handleAutoDetectToggle = () => {
    updateSettings({ autoDetectRenderMode: !settings.autoDetectRenderMode });
  };

  const handle3DInteractionToggle = () => {
    updateSettings({ enable3DInteraction: !settings.enable3DInteraction });
  };

  const handleAutoAdjustViewToggle = () => {
    updateSettings({ autoAdjustViewAngle: !settings.autoAdjustViewAngle });
  };

  const handleExportAll = async () => {
    setLoading(true);
    try {
      const response = await mockApi.exportRecords();
      if (response.success && response.data) {
        const filename = `化学实验数据_${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(response.data, filename, 'application/json');
      }
    } catch {
      setError('导出失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImportAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await readFileContent(file);
      const response = await mockApi.importRecords(content);
      if (response.success) {
        const recordsResponse = await mockApi.getRecords();
        if (recordsResponse.success && recordsResponse.data) {
          setRecords(recordsResponse.data);
        }
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

  const handleClearAllData = async () => {
    setLoading(true);
    try {
      const response = await mockApi.clearAllData();
      if (response.success) {
        setRecords([]);
        setFavorites([]);
      } else {
        setError(response.error || '清除失败');
      }
    } catch {
      setError('清除失败');
    } finally {
      setLoading(false);
      closeClear();
    }
  };

  const stats = [
    { label: '完成实验', value: records.filter(r => r.endTime).length, icon: Play, color: '#10B981' },
    { label: '总记录数', value: records.length, icon: Download, color: '#1E6FBA' },
    { label: '收藏实验', value: favorites.length, icon: Info, color: '#FBBF24' },
    { label: '平均时长', value: records.length > 0 
      ? `${Math.round(records.filter(r => r.endTime).reduce((acc, r) => {
          const duration = r.endTime ? (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / 60000 : 0;
          return acc + duration;
        }, 0) / records.filter(r => r.endTime).length)} 分钟`
      : '0 分钟', icon: User, color: '#8B5CF6' }
  ];

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack gap="xl">
          <Paper
            withBorder
            radius="lg"
            p="xl"
            style={{
              background: 'linear-gradient(135deg, #1E6FBA 0%, #2563EB 100%)',
              color: 'white'
            }}
          >
            <Group gap="lg">
              <Avatar
                size={80}
                radius="xl"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                <User size={40} color="white" />
              </Avatar>
              <Stack gap={0}>
                <Title order={2} size="h2" c="white">化学实验爱好者</Title>
                <Text c="rgba(255,255,255,0.8)">探索化学世界的奥秘</Text>
                <Group gap="sm" mt="xs">
                  <Text size="sm" c="rgba(255,255,255,0.7)">
                    已完成 {records.filter(r => r.endTime).length} 个实验
                  </Text>
                  <Text size="sm" c="rgba(255,255,255,0.7)">
                    收藏 {favorites.length} 个实验
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Paper>

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
              <Settings size={20} color="#1E6FBA" />
              <Title order={3} size="h4">应用设置</Title>
            </Group>

            <Stack gap="lg">
              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Group gap="sm">
                    {settings.theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                    <Text fw={500}>深色模式</Text>
                  </Group>
                  <Text size="sm" c="dimmed">切换应用的主题颜色</Text>
                </Stack>
                <Switch
                  checked={settings.theme === 'dark'}
                  onChange={handleThemeToggle}
                  size="lg"
                />
              </Group>

              <Divider />

              <Stack gap="sm">
                <Group justify="space-between" wrap="wrap">
                  <Stack gap={0}>
                    <Group gap="sm">
                      <Play size={18} />
                      <Text fw={500}>自动播放速度</Text>
                    </Group>
                    <Text size="sm" c="dimmed">调整实验步骤自动播放的速度</Text>
                  </Stack>
                  <Text fw={600} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {settings.autoPlaySpeed}x
                  </Text>
                </Group>
                <Slider
                  min={0.5}
                  max={3}
                  step={0.25}
                  value={settings.autoPlaySpeed}
                  onChange={handleAutoPlaySpeedChange}
                  marks={[
                    { value: 0.5, label: '0.5x' },
                    { value: 1, label: '1x' },
                    { value: 1.5, label: '1.5x' },
                    { value: 2, label: '2x' },
                    { value: 2.5, label: '2.5x' },
                    { value: 3, label: '3x' }
                  ]}
                />
              </Stack>

              <Divider />

              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Group gap="sm">
                    <Play size={18} />
                    <Text fw={500}>动画效果</Text>
                  </Group>
                  <Text size="sm" c="dimmed">启用或禁用实验场景动画</Text>
                </Stack>
                <Switch
                  checked={settings.showAnimations}
                  onChange={handleAnimationsToggle}
                  size="lg"
                />
              </Group>

              <Divider />

              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Group gap="sm">
                    {settings.renderMode === '3d' ? <Layers size={18} /> : <Box size={18} />}
                    <Text fw={500}>3D 场景模式</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {settings.renderMode === '3d'
                      ? '使用 Three.js 渲染 3D 实验场景'
                      : '使用传统 SVG 渲染 2D 实验场景'}
                  </Text>
                </Stack>
                <Switch
                  checked={settings.renderMode === '3d'}
                  onChange={handleRenderModeToggle}
                  size="lg"
                  color={settings.renderMode === '3d' ? 'labBlue' : 'gray'}
                />
              </Group>

              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Group gap="sm">
                    <Eye size={18} />
                    <Text fw={500}>自动检测设备性能</Text>
                  </Group>
                  <Text size="sm" c="dimmed">低端设备自动降级为 2D 模式以保证流畅运行</Text>
                </Stack>
                <Switch
                  checked={settings.autoDetectRenderMode}
                  onChange={handleAutoDetectToggle}
                  size="lg"
                />
              </Group>

              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Group gap="sm">
                    <MousePointer size={18} />
                    <Text fw={500}>3D 器材交互</Text>
                  </Group>
                  <Text size="sm" c="dimmed">允许在 3D 场景中点击选中和拖拽器材</Text>
                </Stack>
                <Switch
                  checked={settings.enable3DInteraction}
                  onChange={handle3DInteractionToggle}
                  size="lg"
                />
              </Group>

              <Group justify="space-between" wrap="wrap">
                <Stack gap={0}>
                  <Group gap="sm">
                    <Eye size={18} />
                    <Text fw={500}>步骤视角自动调整</Text>
                  </Group>
                  <Text size="sm" c="dimmed">切换实验步骤时自动调整到最佳观察视角</Text>
                </Stack>
                <Switch
                  checked={settings.autoAdjustViewAngle}
                  onChange={handleAutoAdjustViewToggle}
                  size="lg"
                />
              </Group>
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <Group gap="sm" mb="md">
              <Download size={20} color="#1E6FBA" />
              <Title order={3} size="h4">数据管理</Title>
            </Group>

            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Card withBorder radius="md" p="md">
                  <Stack gap="sm">
                    <Group gap="sm">
                      <Download size={18} color="#10B981" />
                      <Text fw={500}>导出所有数据</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      将所有实验记录导出为 JSON 文件，方便备份和迁移
                    </Text>
                    <Button
                      leftSection={<Download size={16} />}
                      onClick={handleExportAll}
                      fullWidth
                    >
                      导出数据
                    </Button>
                  </Stack>
                </Card>

                <Card withBorder radius="md" p="md">
                  <Stack gap="sm">
                    <Group gap="sm">
                      <Upload size={18} color="#3B82F6" />
                      <Text fw={500}>导入数据</Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                      从 JSON 文件导入实验记录
                    </Text>
                    <Button
                      component="label"
                      leftSection={<Upload size={16} />}
                      fullWidth
                    >
                      导入数据
                      <input
                        type="file"
                        accept=".json"
                        hidden
                        onChange={handleImportAll}
                      />
                    </Button>
                  </Stack>
                </Card>
              </SimpleGrid>

              <Card withBorder radius="md" p="md" style={{ borderColor: '#FEE2E2' }}>
                <Stack gap="sm">
                  <Group gap="sm">
                    <Trash2 size={18} color="#EF4444" />
                    <Text fw={500} c="red">清除所有数据</Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    清除所有实验记录和收藏数据，此操作不可撤销
                  </Text>
                  <Button
                    color="red"
                    variant="light"
                    leftSection={<Trash2 size={16} />}
                    onClick={openClear}
                    fullWidth
                  >
                    清除数据
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <Group gap="sm" mb="md">
              <Info size={20} color="#1E6FBA" />
              <Title order={3} size="h4">关于应用</Title>
            </Group>
            <Stack gap="sm">
              <Text>
                <strong>化学实验模拟器</strong> v1.0.0
              </Text>
              <Text size="sm" c="dimmed">
                一款专为学生和科普爱好者设计的交互式化学实验学习工具。通过安全的虚拟实验环境，
                您可以体验各种经典化学实验，观察化学反应现象，学习化学原理。
              </Text>
              <Text size="sm" c="dimmed">
                本应用仅供学习参考，实际化学实验请在专业人员指导下进行。
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </motion.div>

      <Modal
        opened={clearOpened}
        onClose={closeClear}
        title="确认清除数据"
        centered
      >
        <Stack gap="md">
          <Group gap="sm">
            <AlertTriangle size={24} color="#EF4444" />
            <Text fw={500}>此操作不可撤销！</Text>
          </Group>
          <Text size="sm" c="dimmed">
            您确定要清除所有实验记录和收藏数据吗？清除后将无法恢复。
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeClear}>取消</Button>
            <Button color="red" onClick={handleClearAllData}>确认清除</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
