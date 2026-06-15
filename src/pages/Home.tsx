import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Group, Stack, SimpleGrid, Input, Button, Select, Badge } from '@mantine/core';
import { Search, FlaskConical, BookOpen, Star, TrendingUp, Sparkles } from 'lucide-react';
import { ExperimentCard } from '../components/common/ExperimentCard';
import { Loading } from '../components/common/Loading';
import { useMockApi } from '../utils/api';
import { mockApi } from '../utils/api';
import { useExperimentStore } from '../store/useExperimentStore';
import type { Experiment, Difficulty, SafetyLevel } from '../types';

const difficultyOptions = [
  { value: 'all', label: '全部难度' },
  { value: 'easy', label: '简单' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '困难' }
];

const categoryOptions = [
  { value: 'all', label: '全部类别' },
  { value: '氧化还原', label: '氧化还原' },
  { value: '酸碱中和', label: '酸碱中和' },
  { value: '分解反应', label: '分解反应' },
  { value: '电解反应', label: '电解反应' }
];

export default function Home() {
  const { experiments, setExperiments, favorites, records } = useExperimentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { loading, error, data, refetch } = useMockApi(() => mockApi.getExperiments(), []);

  useEffect(() => {
    if (data) {
      setExperiments(data);
    }
  }, [data, setExperiments]);

  const filteredExperiments = experiments.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || exp.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
    const matchesFavorite = !showFavoritesOnly || favorites.includes(exp.id);
    return matchesSearch && matchesDifficulty && matchesCategory && matchesFavorite;
  });

  const stats = [
    { icon: FlaskConical, label: '可用实验', value: experiments.length, color: '#1E6FBA' },
    { icon: BookOpen, label: '实验记录', value: records.length, color: '#10B981' },
    { icon: Star, label: '收藏实验', value: favorites.length, color: '#FBBF24' },
    { icon: TrendingUp, label: '完成进度', value: `${records.length > 0 ? Math.round((records.filter(r => r.endTime).length / records.length) * 100) : 0}%`, color: '#8B5CF6' }
  ];

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Loading type="page" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <Text c="red" size="lg">{error}</Text>
          <Button onClick={refetch}>重新加载</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack gap="xl">
          <div
            style={{
              background: 'linear-gradient(135deg, #1E6FBA 0%, #2563EB 50%, #3B82F6 100%)',
              borderRadius: '16px',
              padding: '48px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '100px',
                width: '120px',
                height: '120px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }}
            />
            
            <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
              <Group gap="sm">
                <Sparkles size={32} color="#FEF3C7" />
                <Title order={1} c="white" size="h1">
                  化学实验模拟器
                </Title>
              </Group>
              <Text c="rgba(255,255,255,0.9)" size="lg" maw={600}>
                探索神奇的化学世界，通过交互式模拟体验经典实验，安全直观地学习化学反应原理
              </Text>
            </Stack>
          </div>

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

          <Stack gap="md">
            <Group justify="space-between" wrap="wrap">
              <Title order={2} size="h3">
                实验列表
              </Title>
              <Button
                variant={showFavoritesOnly ? 'filled' : 'light'}
                color="yellow"
                leftSection={<Star size={16} />}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                {showFavoritesOnly ? '显示全部' : '仅显示收藏'}
              </Button>
            </Group>

            <Group grow wrap="wrap">
              <Input
                placeholder="搜索实验名称或描述..."
                leftSection={<Search size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
              <Select
                placeholder="选择难度"
                value={difficultyFilter}
                onChange={(value) => setDifficultyFilter(value || 'all')}
                data={difficultyOptions}
              />
              <Select
                placeholder="选择类别"
                value={categoryFilter}
                onChange={(value) => setCategoryFilter(value || 'all')}
                data={categoryOptions}
              />
            </Group>

            {filteredExperiments.length === 0 ? (
              <Stack align="center" py="xl" gap="md">
                <FlaskConical size={48} color="#9CA3AF" />
                <Text c="dimmed" size="lg">没有找到匹配的实验</Text>
                <Button
                  variant="light"
                  onClick={() => {
                    setSearchQuery('');
                    setDifficultyFilter('all');
                    setCategoryFilter('all');
                    setShowFavoritesOnly(false);
                  }}
                >
                  清除筛选条件
                </Button>
              </Stack>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {filteredExperiments.map((experiment, index) => (
                  <motion.div
                    key={experiment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ExperimentCard experiment={experiment} />
                  </motion.div>
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Stack>
      </motion.div>
    </Container>
  );
}