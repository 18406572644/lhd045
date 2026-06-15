import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container, Title, Text, Group, Stack, Input, SimpleGrid, Badge, Button,
  ScrollArea, Chip, Tooltip, ActionIcon, Paper
} from '@mantine/core';
import {
  Search, Star, FlaskConical, Beaker, Droplets, Wind, Waves,
  TestTube2, ChevronRight, Filter, X, BookOpen
} from 'lucide-react';
import { chemicalLibrary, getChemicalCategories, type ChemicalItem } from '../data/library';
import { useExperimentStore } from '../store/useExperimentStore';
import { renderChemicalFormula } from '../utils/helpers';

const stateOptions = [
  { value: 'all', label: '全部状态', icon: Beaker },
  { value: 'solid', label: '固态', icon: TestTube2 },
  { value: 'liquid', label: '液态', icon: Droplets },
  { value: 'gas', label: '气态', icon: Wind },
  { value: 'aqueous', label: '溶液', icon: Waves }
];

const stateLabelMap: Record<string, string> = {
  solid: '固态',
  liquid: '液态',
  gas: '气态',
  aqueous: '溶液'
};

const stateIconMap: Record<string, typeof Beaker> = {
  solid: TestTube2,
  liquid: Droplets,
  gas: Wind,
  aqueous: Waves
};

const stateColorMap: Record<string, string> = {
  solid: '#64748B',
  liquid: '#3B82F6',
  gas: '#10B981',
  aqueous: '#8B5CF6'
};

const hazardColorMap: Record<string, string> = {
  '腐蚀性': '#EF4444',
  '强腐蚀性': '#DC2626',
  '有毒': '#7C3AED',
  '易燃': '#F59E0B',
  '氧化剂': '#06B6D4',
  '刺激性': '#84CC16'
};

const categoryIconMap: Record<string, typeof FlaskConical> = {
  '酸': Beaker,
  '碱': FlaskConical,
  '盐': TestTube2,
  '金属': FlaskConical,
  '氧化物': Beaker,
  '有机物': FlaskConical,
  '指示剂': Droplets,
  '氧化剂': FlaskConical,
  '单质': TestTube2,
  '其他': FlaskConical
};

export default function Encyclopedia() {
  const navigate = useNavigate();
  const { chemicalFavorites, toggleChemicalFavorite, settings } = useExperimentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const categories = useMemo(() => getChemicalCategories(), []);

  const filteredChemicals = useMemo(() => {
    return chemicalLibrary.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.englishName && item.englishName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesState = stateFilter === 'all' || item.state === stateFilter;
      const matchesFavorite = !showFavoritesOnly || chemicalFavorites.includes(item.id);
      return matchesSearch && matchesCategory && matchesState && matchesFavorite;
    });
  }, [searchQuery, categoryFilter, stateFilter, showFavoritesOnly, chemicalFavorites]);

  const favoriteChemicals = useMemo(() => {
    return chemicalLibrary.filter(item => chemicalFavorites.includes(item.id));
  }, [chemicalFavorites]);

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all' || stateFilter !== 'all' || showFavoritesOnly;

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStateFilter('all');
    setShowFavoritesOnly(false);
  };

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
              background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #3B82F6 100%)',
              borderRadius: '16px',
              padding: '40px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-60px',
                width: '240px',
                height: '240px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: '80px',
                width: '140px',
                height: '140px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%'
              }}
            />
            <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
              <Group gap="sm">
                <BookOpen size={32} color="#FEF3C7" />
                <Title order={1} c="white" size="h1">
                  化学物质百科
                </Title>
              </Group>
              <Text c="rgba(255,255,255,0.9)" size="lg" maw={600}>
                探索化学世界的奥秘，了解各种物质的物理化学性质、安全信息和实际用途
              </Text>
              <Group gap="sm">
                <Badge color="white" variant="filled" size="lg" radius="md">
                  {chemicalLibrary.length} 种化学物质
                </Badge>
                <Badge color="yellow" variant="light" size="lg" radius="md">
                  {chemicalFavorites.length} 个收藏
                </Badge>
                <Badge color="cyan" variant="light" size="lg" radius="md">
                  {categories.length} 个分类
                </Badge>
              </Group>
            </Stack>
          </div>

          <Group grow wrap="wrap">
            <Input
              placeholder="搜索物质名称、化学式或英文名..."
              leftSection={<Search size={18} />}
              rightSection={searchQuery ? (
                <ActionIcon variant="transparent" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </ActionIcon>
              ) : null}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              size="md"
            />
            <Group gap="xs" justify="space-between">
              <Button
                variant={showFavoritesOnly ? 'filled' : 'light'}
                color="yellow"
                leftSection={<Star size={16} />}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                {showFavoritesOnly ? '已收藏' : '我的收藏'}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="light"
                  color="gray"
                  leftSection={<Filter size={16} />}
                  onClick={clearAllFilters}
                >
                  清除筛选
                </Button>
              )}
            </Group>
          </Group>

          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <Group justify="space-between" wrap="wrap">
                <Group gap="xs" align="center">
                  <Text fw={600} size="sm">状态筛选：</Text>
                  <Group gap="xs" wrap="wrap">
                    {stateOptions.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <Chip
                          key={opt.value}
                          variant={stateFilter === opt.value ? 'filled' : 'outline'}
                          color={stateFilter === opt.value ? 'labBlue' : 'gray'}
                          size="md"
                          onClick={() => setStateFilter(stateFilter === opt.value ? 'all' : opt.value)}
                        >
                          <Group gap={4} wrap="nowrap">
                            <Icon size={14} />
                            <span>{opt.label}</span>
                          </Group>
                        </Chip>
                      );
                    })}
                  </Group>
                </Group>
              </Group>
            </Stack>
          </Paper>

          <Group align="flex-start" wrap="nowrap" style={{ gap: 0 }}>
            <ScrollArea
              style={{
                width: sidebarCollapsed ? '0px' : '220px',
                flexShrink: 0,
                transition: 'width 0.3s ease',
                overflow: 'hidden'
              }}
              h={undefined}
            >
              <Stack gap="sm" pr="md">
                <Paper withBorder radius="lg" p="md" style={{ minWidth: '200px' }}>
                  <Group justify="space-between" mb="sm">
                    <Group gap="xs">
                      <Filter size={16} color="#1E6FBA" />
                      <Text fw={600} size="sm">分类筛选</Text>
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() => setSidebarCollapsed(true)}
                    >
                      <ChevronRight size={16} />
                    </ActionIcon>
                  </Group>
                  <Stack gap="xs">
                    <Chip
                      variant={categoryFilter === 'all' ? 'filled' : 'outline'}
                      color={categoryFilter === 'all' ? 'labBlue' : 'gray'}
                      size="sm"
                      onClick={() => setCategoryFilter('all')}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      全部分类 ({chemicalLibrary.length})
                    </Chip>
                    {categories.map(cat => {
                      const count = chemicalLibrary.filter(c => c.category === cat).length;
                      const Icon = categoryIconMap[cat] || FlaskConical;
                      return (
                        <Chip
                          key={cat}
                          variant={categoryFilter === cat ? 'filled' : 'outline'}
                          color={categoryFilter === cat ? 'labBlue' : 'gray'}
                          size="sm"
                          onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                          style={{ width: '100%', justifyContent: 'flex-start' }}
                        >
                          <Group gap={4} wrap="nowrap">
                            <Icon size={12} />
                            <span>{cat} ({count})</span>
                          </Group>
                        </Chip>
                      );
                    })}
                  </Stack>
                </Paper>

                {favoriteChemicals.length > 0 && !showFavoritesOnly && (
                  <Paper withBorder radius="lg" p="md" style={{ minWidth: '200px' }}>
                    <Group gap="xs" mb="sm">
                      <Star size={16} color="#FBBF24" fill="#FBBF24" />
                      <Text fw={600} size="sm">我的收藏</Text>
                    </Group>
                    <Stack gap="xs">
                      {favoriteChemicals.slice(0, 8).map(item => (
                        <Button
                          key={item.id}
                          variant="subtle"
                          size="xs"
                          justify="flex-start"
                          leftSection={
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '3px',
                                background: item.color || '#9CA3AF',
                                border: item.color === '#FFFFFF' ? '1px solid #E5E7EB' : 'none',
                                flexShrink: 0
                              }}
                            />
                          }
                          onClick={() => navigate(`/encyclopedia/${item.id}`)}
                          style={{ paddingLeft: '8px', paddingRight: '8px' }}
                        >
                          <Text size="xs" truncate style={{ maxWidth: '130px' }}>
                            {item.name}
                          </Text>
                        </Button>
                      ))}
                      {favoriteChemicals.length > 8 && (
                        <Button
                          variant="light"
                          size="xs"
                          onClick={() => setShowFavoritesOnly(true)}
                        >
                          查看全部 {favoriteChemicals.length} 个
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </ScrollArea>

            {sidebarCollapsed && (
              <ActionIcon
                variant="light"
                color="labBlue"
                size="lg"
                onClick={() => setSidebarCollapsed(false)}
                style={{ marginTop: '8px' }}
              >
                <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
              </ActionIcon>
            )}

            <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
              <Group justify="space-between" wrap="wrap">
                <Text size="sm" c="dimmed">
                  共找到 <Text span fw={600} c="labBlue">{filteredChemicals.length}</Text> 种物质
                </Text>
                <Group gap="xs">
                  {categoryFilter !== 'all' && (
                    <Badge
                      size="sm"
                      color="labBlue"
                      variant="light"
                      rightSection={
                        <ActionIcon
                          variant="transparent"
                          size="xs"
                          onClick={() => setCategoryFilter('all')}
                        >
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      分类：{categoryFilter}
                    </Badge>
                  )}
                  {stateFilter !== 'all' && (
                    <Badge
                      size="sm"
                      color="violet"
                      variant="light"
                      rightSection={
                        <ActionIcon
                          variant="transparent"
                          size="xs"
                          onClick={() => setStateFilter('all')}
                        >
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      状态：{stateLabelMap[stateFilter]}
                    </Badge>
                  )}
                </Group>
              </Group>

              {filteredChemicals.length === 0 ? (
                <Paper withBorder radius="lg" p="xl">
                  <Stack align="center" py="xl" gap="md">
                    <Beaker size={48} color="#9CA3AF" />
                    <Text c="dimmed" size="lg">没有找到匹配的化学物质</Text>
                    <Text size="sm" c="dimmed">
                      尝试调整搜索关键词或清除筛选条件
                    </Text>
                    <Button variant="light" onClick={clearAllFilters}>
                      清除所有筛选条件
                    </Button>
                  </Stack>
                </Paper>
              ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                  {filteredChemicals.map((item, index) => (
                    <ChemicalCard
                      key={item.id}
                      item={item}
                      index={index}
                      isFavorite={chemicalFavorites.includes(item.id)}
                      onToggleFavorite={() => toggleChemicalFavorite(item.id)}
                      onClick={() => navigate(`/encyclopedia/${item.id}`)}
                      theme={settings.theme}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Stack>
          </Group>
        </Stack>
      </motion.div>
    </Container>
  );
}

interface ChemicalCardProps {
  item: ChemicalItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  theme: string;
}

const ChemicalCard: React.FC<ChemicalCardProps> = ({
  item, index, isFavorite, onToggleFavorite, onClick, theme
}) => {
  const StateIcon = stateIconMap[item.state] || Beaker;
  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Paper
        withBorder
        radius="lg"
        p="md"
        onClick={onClick}
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: isLight ? '#fff' : '#1A1A2E',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${item.color || '#9CA3AF'}33 0%, transparent 70%)`,
            borderRadius: '0 0 0 60px'
          }}
        />

        <Stack gap="sm" style={{ position: 'relative' }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: item.color || '#9CA3AF',
                  border: item.color === '#FFFFFF' || item.color === '#F9FAFB' || item.color === '#FAFAFA' || item.color === '#F3F4F6' || item.color === '#FFFFFF'
                    ? '2px solid #E5E7EB'
                    : 'none',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${item.color || '#9CA3AF'}40`
                }}
              />
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text fw={700} size="md" truncate>
                  {item.name}
                </Text>
                <Text
                  size="xs"
                  c="dimmed"
                  dangerouslySetInnerHTML={{ __html: renderChemicalFormula(item.formula) }}
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                />
              </Stack>
            </Group>
            <Tooltip label={isFavorite ? '取消收藏' : '添加收藏'}>
              <ActionIcon
                variant="transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                style={{ flexShrink: 0 }}
              >
                <Star
                  size={18}
                  color={isFavorite ? '#FBBF24' : '#9CA3AF'}
                  fill={isFavorite ? '#FBBF24' : 'none'}
                />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap="xs" wrap="wrap">
            <Badge
              size="xs"
              variant="dot"
              color="labBlue"
            >
              {item.category}
            </Badge>
            <Badge
              size="xs"
              variant="light"
              color={stateColorMap[item.state] || 'gray'}
              leftSection={<StateIcon size={10} />}
            >
              {stateLabelMap[item.state]}
            </Badge>
            {item.hazard && (
              <Badge
                size="xs"
                variant="light"
                color={hazardColorMap[item.hazard] || 'red'}
              >
                {item.hazard}
              </Badge>
            )}
            {item.safetyInfo?.hazardLevel === 'high' && (
              <Badge size="xs" color="red" variant="filled">
                高危险
              </Badge>
            )}
          </Group>

          <Text
            size="xs"
            c="dimmed"
            lineClamp={2}
            style={{ minHeight: '32px' }}
          >
            {item.description}
          </Text>
        </Stack>
      </Paper>
    </motion.div>
  );
};
