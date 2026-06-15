import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container, Title, Text, Group, Stack, Button, Badge, SimpleGrid, Paper,
  Tabs, Table, Alert, Divider, ScrollArea, ActionIcon, Tooltip
} from '@mantine/core';
import {
  ArrowLeft, Star, StarOff, ChevronRight, FlaskConical, Droplets,
  TestTube2, Shield, AlertTriangle, FlaskRound, Atom, Factory, Home,
  BookOpen, Lightbulb, Thermometer, Gauge, Droplet, Factory as FactoryIcon,
  AlertOctagon, HeartPulse, Hand, Eye, PackageOpen, ArrowRight, Play,
  Zap, Clock, Flame, Microscope, Wind, Waves
} from 'lucide-react';
import {
  chemicalLibrary, getChemicalById, type ChemicalItem, type PhysicalProperties
} from '../data/library';
import { experiments } from '../data/experiments';
import { useExperimentStore } from '../store/useExperimentStore';
import { renderChemicalFormula } from '../utils/helpers';
import type { ChemicalSubstance } from '../types';

const stateLabelMap: Record<string, string> = {
  solid: '固态',
  liquid: '液态',
  gas: '气态',
  aqueous: '溶液'
};

const stateIconMap: Record<string, typeof FlaskConical> = {
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

const hazardLevelMap: Record<string, { label: string; color: string; icon: typeof AlertTriangle }> = {
  low: { label: '低风险', color: 'green', icon: Shield },
  medium: { label: '中等风险', color: 'warningOrange', icon: AlertTriangle },
  high: { label: '高风险', color: 'dangerRed', icon: AlertOctagon }
};

const hazardColorMap: Record<string, string> = {
  '腐蚀性': '#EF4444',
  '强腐蚀性': '#DC2626',
  '有毒': '#7C3AED',
  '易燃': '#F59E0B',
  '氧化剂': '#06B6D4',
  '刺激性': '#84CC16'
};

interface RelatedExperiment {
  experimentId: string;
  experimentName: string;
  roles: string[];
  substances: { name: string; formula: string; isTarget: boolean; role: string }[];
}

export default function SubstanceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chemicalFavorites, toggleChemicalFavorite, settings } = useExperimentStore();

  const substance = useMemo(() => {
    if (!id) return undefined;
    return getChemicalById(id);
  }, [id]);

  const isFavorite = substance ? chemicalFavorites.includes(substance.id) : false;

  const relatedExperiments = useMemo<RelatedExperiment[]>(() => {
    if (!substance) return [];

    const results: RelatedExperiment[] = [];

    for (const exp of experiments) {
      const roles: Set<string> = new Set();
      const matchedSubstances: RelatedExperiment['substances'] = [];
      let found = false;

      for (const eq of exp.equations) {
        for (const reactant of eq.reactants) {
          const isMatch = matchSubstance(reactant, substance);
          if (isMatch) {
            found = true;
            roles.add('反应物');
            matchedSubstances.push({
              name: reactant.name,
              formula: reactant.formula,
              isTarget: true,
              role: '反应物'
            });
          }
        }
        for (const product of eq.products) {
          const isMatch = matchSubstance(product, substance);
          if (isMatch) {
            found = true;
            roles.add('生成物');
            matchedSubstances.push({
              name: product.name,
              formula: product.formula,
              isTarget: true,
              role: '生成物'
            });
          }
        }
      }

      for (const mat of exp.materials) {
        if (mat.includes(substance.name) ||
            (substance.formula && mat.includes(stripNumbers(substance.formula)))) {
          found = true;
          roles.add('实验药品');
          break;
        }
      }

      for (const pk of exp.preKnowledge) {
        if (pk.content.includes(substance.name)) {
          found = true;
          break;
        }
      }

      if (found) {
        results.push({
          experimentId: exp.id,
          experimentName: exp.name,
          roles: Array.from(roles),
          substances: matchedSubstances
        });
      }
    }

    return results;
  }, [substance]);

  if (!substance) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md" py="xl">
          <FlaskConical size={48} color="#9CA3AF" />
          <Text c="dimmed" size="lg">未找到该化学物质</Text>
          <Group>
            <Button variant="light" onClick={() => navigate('/encyclopedia')}>
              返回百科列表
            </Button>
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  const StateIcon = stateIconMap[substance.state] || FlaskConical;

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
                onClick={() => navigate('/encyclopedia')}
              >
                返回百科
              </Button>
            </Group>
            <Group>
              <Tooltip label={isFavorite ? '取消收藏' : '添加收藏'}>
                <Button
                  variant={isFavorite ? 'filled' : 'light'}
                  color={isFavorite ? 'yellow' : 'gray'}
                  leftSection={
                    <Star
                      size={16}
                      fill={isFavorite ? '#fff' : 'none'}
                    />
                  }
                  onClick={() => toggleChemicalFavorite(substance.id)}
                >
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </Tooltip>
            </Group>
          </Group>

          <Paper
            withBorder
            radius="lg"
            p="xl"
            style={{
              background: settings.theme === 'light'
                ? `linear-gradient(135deg, ${substance.color || '#9CA3AF'}15 0%, #FFFFFF 100%)`
                : `linear-gradient(135deg, ${substance.color || '#9CA3AF'}25 0%, #111827 100%)`
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
              <Group gap="xl" wrap="wrap">
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '20px',
                    background: substance.color || '#9CA3AF',
                    border: ['#FFFFFF', '#F9FAFB', '#FAFAFA', '#F3F4F6', '#F5F5F4'].includes(substance.color || '')
                      ? '3px solid #E5E7EB'
                      : 'none',
                    boxShadow: `0 20px 40px ${substance.color || '#9CA3AF'}40, 0 0 0 6px ${substance.color || '#9CA3AF'}15`,
                    flexShrink: 0
                  }}
                />
                <Stack gap="sm" style={{ maxWidth: '600px' }}>
                  <Stack gap={4}>
                    <Group gap="sm" wrap="wrap">
                      <Title order={1} size="h1">
                        {substance.name}
                      </Title>
                      {substance.englishName && (
                        <Text size="lg" c="dimmed" fw={500} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {substance.englishName}
                        </Text>
                      )}
                    </Group>
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '42px',
                        fontWeight: 700,
                        lineHeight: 1.2
                      }}
                      dangerouslySetInnerHTML={{ __html: renderChemicalFormula(substance.formula) }}
                    />
                  </Stack>
                  <Group gap="sm" wrap="wrap">
                    <Badge
                      size="lg"
                      variant="filled"
                      color="labBlue"
                      leftSection={<BookOpen size={12} />}
                      radius="md"
                    >
                      {substance.category}
                    </Badge>
                    <Badge
                      size="lg"
                      variant="light"
                      color={stateColorMap[substance.state] || 'gray'}
                      leftSection={<StateIcon size={12} />}
                      radius="md"
                    >
                      {stateLabelMap[substance.state]}
                    </Badge>
                    {substance.hazard && (
                      <Badge
                        size="lg"
                        variant="filled"
                        color={hazardColorMap[substance.hazard] || 'red'}
                        radius="md"
                      >
                        {substance.hazard}
                      </Badge>
                    )}
                    {substance.safetyInfo?.hazardLevel && (() => {
                      const hl = hazardLevelMap[substance.safetyInfo.hazardLevel];
                      const HIcon = hl.icon;
                      return (
                        <Badge
                          size="lg"
                          variant="dot"
                          color={hl.color}
                          leftSection={<HIcon size={12} />}
                          radius="md"
                        >
                          {hl.label}
                        </Badge>
                      );
                    })()}
                  </Group>
                  <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {substance.description}
                  </Text>
                </Stack>
              </Group>

              {substance.safetyInfo?.hazardLevel === 'high' && (
                <Alert
                  icon={<AlertOctagon size={20} />}
                  title="安全警告"
                  color="red"
                  radius="lg"
                  style={{ maxWidth: '300px' }}
                >
                  <Text size="sm">
                    该物质具有较高危险性，请在专业指导下操作，严格遵守安全规范。
                  </Text>
                </Alert>
              )}
            </Group>
          </Paper>

          <Tabs defaultValue="basic">
            <Tabs.List>
              <Tabs.Tab value="basic" leftSection={<Atom size={16} />}>
                基础信息
              </Tabs.Tab>
              <Tabs.Tab value="safety" leftSection={<Shield size={16} />}>
                安全信息
                {substance.safetyInfo?.hazardLevel === 'high' && (
                  <Badge size="xs" color="red" variant="filled" ml="xs">!</Badge>
                )}
              </Tabs.Tab>
              <Tabs.Tab
                value="experiments"
                leftSection={<FlaskRound size={16} />}
                rightSection={relatedExperiments.length > 0 ? (
                  <Badge size="xs" color="labBlue" ml="xs">{relatedExperiments.length}</Badge>
                ) : null}
              >
                相关实验
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="basic" pt="lg">
              <Stack gap="lg">
                <Paper withBorder radius="lg" p="lg">
                  <Group gap="sm" mb="md">
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Gauge size={20} color="#1E6FBA" />
                    </div>
                    <Title order={3} size="h4">物理性质</Title>
                  </Group>
                  <PhysicalPropertiesTable properties={substance.physicalProperties} theme={settings.theme} />
                </Paper>

                {substance.chemicalProperties && (
                  <Paper withBorder radius="lg" p="lg">
                    <Group gap="sm" mb="md">
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#FEF3C7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Zap size={20} color="#F59E0B" />
                      </div>
                      <Title order={3} size="h4">化学性质</Title>
                    </Group>
                    <Stack gap="md">
                      {substance.chemicalProperties.reactionTypes && substance.chemicalProperties.reactionTypes.length > 0 && (
                        <Group gap="sm" wrap="wrap">
                          <Text fw={600} size="sm" c="dimmed">主要反应类型：</Text>
                          {substance.chemicalProperties.reactionTypes.map((type, i) => (
                            <Badge key={i} color="warningOrange" variant="light" size="md">
                              {type}
                            </Badge>
                          ))}
                        </Group>
                      )}

                      {substance.chemicalProperties.commonEquations && substance.chemicalProperties.commonEquations.length > 0 && (
                        <Stack gap="sm">
                          <Text fw={600} size="sm" c="dimmed">常见反应方程式：</Text>
                          {substance.chemicalProperties.commonEquations.map((eq, i) => (
                            <Paper
                              key={i}
                              radius="md"
                              p="md"
                              style={{
                                background: settings.theme === 'light' ? '#FAFAFA' : '#1A1A2E',
                                borderLeft: '4px solid #F59E0B'
                              }}
                            >
                              <Stack gap="xs">
                                <div
                                  style={{
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    padding: '8px 0'
                                  }}
                                  dangerouslySetInnerHTML={{ __html: renderChemicalFormula(eq.equation) }}
                                />
                                <Group gap="xs">
                                  <Lightbulb size={12} color="#F59E0B" />
                                  <Text size="sm" c="dimmed">{eq.description}</Text>
                                </Group>
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                )}

                {substance.uses && (
                  <Paper withBorder radius="lg" p="lg">
                    <Group gap="sm" mb="md">
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#ECFDF5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FactoryIcon size={20} color="#10B981" />
                      </div>
                      <Title order={3} size="h4">主要用途</Title>
                    </Group>
                    <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                      {substance.uses.laboratory && substance.uses.laboratory.length > 0 && (
                        <Paper radius="md" p="md" style={{ background: settings.theme === 'light' ? '#EFF6FF' : '#1E3A5F' }}>
                          <Group gap="xs" mb="sm">
                            <Microscope size={16} color="#1E6FBA" />
                            <Text fw={700} c="labBlue">实验室用途</Text>
                          </Group>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {substance.uses.laboratory.map((use, i) => (
                              <li key={i} style={{ marginBottom: '4px' }}>
                                <Text size="sm">{use}</Text>
                              </li>
                            ))}
                          </ul>
                        </Paper>
                      )}
                      {substance.uses.industrial && substance.uses.industrial.length > 0 && (
                        <Paper radius="md" p="md" style={{ background: settings.theme === 'light' ? '#FFF7ED' : '#451A03' }}>
                          <Group gap="xs" mb="sm">
                            <Factory size={16} color="#EA580C" />
                            <Text fw={700} c="orange">工业用途</Text>
                          </Group>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {substance.uses.industrial.map((use, i) => (
                              <li key={i} style={{ marginBottom: '4px' }}>
                                <Text size="sm">{use}</Text>
                              </li>
                            ))}
                          </ul>
                        </Paper>
                      )}
                      {substance.uses.daily && substance.uses.daily.length > 0 && (
                        <Paper radius="md" p="md" style={{ background: settings.theme === 'light' ? '#ECFDF5' : '#052E16' }}>
                          <Group gap="xs" mb="sm">
                            <Home size={16} color="#10B981" />
                            <Text fw={700} c="green">生活用途</Text>
                          </Group>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {substance.uses.daily.map((use, i) => (
                              <li key={i} style={{ marginBottom: '4px' }}>
                                <Text size="sm">{use}</Text>
                              </li>
                            ))}
                          </ul>
                        </Paper>
                      )}
                    </SimpleGrid>
                  </Paper>
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="safety" pt="lg">
              <Stack gap="lg">
                {substance.safetyInfo && (
                  <>
                    {substance.safetyInfo.hazardSymbols && substance.safetyInfo.hazardSymbols.length > 0 && (
                      <Paper withBorder radius="lg" p="lg">
                        <Group gap="sm" mb="md">
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#FEF2F2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <AlertOctagon size={20} color="#EF4444" />
                          </div>
                          <Title order={3} size="h4">危险性标识</Title>
                        </Group>
                        <Group gap="sm" wrap="wrap">
                          {substance.safetyInfo.hazardSymbols.map((symbol, i) => (
                            <Badge
                              key={i}
                              color={hazardColorMap[symbol] || 'red'}
                              variant="filled"
                              size="lg"
                              radius="md"
                            >
                              {symbol}
                            </Badge>
                          ))}
                        </Group>
                      </Paper>
                    )}

                    {substance.safetyInfo.safetyTips && substance.safetyInfo.safetyTips.length > 0 && (
                      <Paper withBorder radius="lg" p="lg">
                        <Group gap="sm" mb="md">
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#FEF3C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Shield size={20} color="#F59E0B" />
                          </div>
                          <Title order={3} size="h4">安全操作建议</Title>
                        </Group>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {substance.safetyInfo.safetyTips.map((tip, i) => (
                            <li key={i} style={{ marginBottom: '8px' }}>
                              <Text size="md" style={{ lineHeight: 1.6 }}>{tip}</Text>
                            </li>
                          ))}
                        </ul>
                      </Paper>
                    )}

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                      {substance.safetyInfo.spillTreatment && (
                        <Alert
                          icon={<PackageOpen size={18} />}
                          title="泄漏处理"
                          color="warningOrange"
                          radius="lg"
                          variant="light"
                        >
                          <Text size="sm" style={{ lineHeight: 1.6 }}>
                            {substance.safetyInfo.spillTreatment}
                          </Text>
                        </Alert>
                      )}

                      {substance.safetyInfo.ingestionTreatment && (
                        <Alert
                          icon={<HeartPulse size={18} />}
                          title="误食处理"
                          color="red"
                          radius="lg"
                          variant="light"
                        >
                          <Text size="sm" style={{ lineHeight: 1.6 }}>
                            {substance.safetyInfo.ingestionTreatment}
                          </Text>
                        </Alert>
                      )}

                      {substance.safetyInfo.skinContactTreatment && (
                        <Alert
                          icon={<Hand size={18} />}
                          title="皮肤接触处理"
                          color="blue"
                          radius="lg"
                          variant="light"
                        >
                          <Text size="sm" style={{ lineHeight: 1.6 }}>
                            {substance.safetyInfo.skinContactTreatment}
                          </Text>
                        </Alert>
                      )}

                      {substance.safetyInfo.eyeContactTreatment && (
                        <Alert
                          icon={<Eye size={18} />}
                          title="眼睛接触处理"
                          color="violet"
                          radius="lg"
                          variant="light"
                        >
                          <Text size="sm" style={{ lineHeight: 1.6 }}>
                            {substance.safetyInfo.eyeContactTreatment}
                          </Text>
                        </Alert>
                      )}
                    </SimpleGrid>

                    {substance.safetyInfo.storageRequirements && (
                      <Paper withBorder radius="lg" p="lg">
                        <Group gap="sm" mb="md">
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              background: '#EFF6FF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <PackageOpen size={20} color="#1E6FBA" />
                          </div>
                          <Title order={3} size="h4">储存要求</Title>
                        </Group>
                        <Text size="md" style={{ lineHeight: 1.6 }}>
                          {substance.safetyInfo.storageRequirements}
                        </Text>
                      </Paper>
                    )}
                  </>
                )}

                {!substance.safetyInfo && (
                  <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="sm">
                      <Shield size={32} color="#9CA3AF" />
                      <Text c="dimmed" size="md">暂无详细安全信息</Text>
                      <Text size="sm" c="dimmed">操作化学物质时请始终遵守基本安全规范：佩戴护目镜、手套，在通风处操作。</Text>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="experiments" pt="lg">
              <Stack gap="md">
                {relatedExperiments.length === 0 ? (
                  <Paper withBorder radius="lg" p="xl">
                    <Stack align="center" gap="md">
                      <FlaskConical size={48} color="#9CA3AF" />
                      <Text c="dimmed" size="lg">暂无相关实验</Text>
                      <Button variant="light" onClick={() => navigate('/')}>
                        浏览全部实验
                      </Button>
                    </Stack>
                  </Paper>
                ) : (
                  <>
                    <Group justify="space-between" wrap="wrap">
                      <Text size="sm" c="dimmed">
                        共找到 <Text span fw={600} c="labBlue">{relatedExperiments.length}</Text> 个相关实验
                      </Text>
                    </Group>
                    {relatedExperiments.map((rel, index) => (
                      <motion.div
                        key={rel.experimentId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Paper
                          withBorder
                          radius="lg"
                          p="lg"
                          onClick={() => navigate(`/experiment/${rel.experimentId}`)}
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                        >
                          <Group justify="space-between" align="flex-start" wrap="wrap">
                            <Stack gap="sm" style={{ flex: 1, minWidth: '300px' }}>
                              <Group gap="sm" wrap="wrap">
                                <div
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #1E6FBA 0%, #2A8AE0 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(30, 111, 186, 0.3)'
                                  }}
                                >
                                  <FlaskConical size={20} color="#fff" />
                                </div>
                                <Stack gap={2}>
                                  <Text fw={700} size="lg">{rel.experimentName}</Text>
                                  <Group gap="xs" wrap="wrap">
                                    {rel.roles.map((role, i) => (
                                      <Badge
                                        key={i}
                                        color={role === '反应物' ? 'warningOrange' : role === '生成物' ? 'green' : 'labBlue'}
                                        variant="light"
                                        size="sm"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                  </Group>
                                </Stack>
                              </Group>
                              {rel.substances.length > 0 && (
                                <Group gap="xs" wrap="wrap" ml={52}>
                                  {rel.substances.map((sub, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      size="sm"
                                      color="gray"
                                      style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                    >
                                      <span
                                        dangerouslySetInnerHTML={{ __html: renderChemicalFormula(sub.formula) }}
                                      />
                                      <span style={{ marginLeft: '4px' }}>· {sub.name}</span>
                                    </Badge>
                                  ))}
                                </Group>
                              )}
                            </Stack>
                            <ActionIcon variant="light" color="labBlue" size="lg" radius="md">
                              <ArrowRight size={20} />
                            </ActionIcon>
                          </Group>
                        </Paper>
                      </motion.div>
                    ))}
                  </>
                )}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </motion.div>
    </Container>
  );
}

function matchSubstance(sub: ChemicalSubstance, target: ChemicalItem): boolean {
  if (sub.name === target.name) return true;
  if (target.formula && sub.formula) {
    const targetFormula = stripNumbers(target.formula);
    const subFormula = stripNumbers(sub.formula);
    if (targetFormula && targetFormula === subFormula) return true;
  }
  return false;
}

function stripNumbers(formula: string): string {
  return formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, '').replace(/\d/g, '').replace(/·.*/, '');
}

interface PhysicalPropsTableProps {
  properties?: PhysicalProperties;
  theme: string;
}

const PhysicalPropertiesTable: React.FC<PhysicalPropsTableProps> = ({ properties, theme }) => {
  const rows = [
    { key: 'density', label: '密度', icon: Gauge, value: properties?.density },
    { key: 'meltingPoint', label: '熔点', icon: Thermometer, value: properties?.meltingPoint },
    { key: 'boilingPoint', label: '沸点', icon: Flame, value: properties?.boilingPoint },
    { key: 'solubility', label: '溶解性', icon: Droplet, value: properties?.solubility },
    { key: 'odor', label: '气味', icon: Droplets, value: properties?.odor }
  ].filter(r => r.value);

  if (rows.length === 0) {
    return (
      <Stack align="center" gap="sm" py="md">
        <Gauge size={32} color="#9CA3AF" />
        <Text c="dimmed" size="sm">暂无详细物理性质数据</Text>
      </Stack>
    );
  }

  return (
    <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
      <Table striped highlightOnHover>
        <Table.Thead style={{ background: theme === 'light' ? '#F8FAFC' : '#1E293B' }}>
          <Table.Tr>
            <Table.Th style={{ width: '60px' }}></Table.Th>
            <Table.Th style={{ width: '120px' }}>
              <Text fw={600} size="sm">性质</Text>
            </Table.Th>
            <Table.Th>
              <Text fw={600} size="sm">数值</Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map(row => {
            const Icon = row.icon;
            return (
              <Table.Tr key={row.key}>
                <Table.Td>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={16} color="#1E6FBA" />
                  </div>
                </Table.Td>
                <Table.Td>
                  <Text fw={500} size="sm">{row.label}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {row.value}
                  </Text>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};
