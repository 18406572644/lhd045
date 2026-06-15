import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Title, Text, Group, Stack, Button, Paper, Divider, Badge, Alert, SimpleGrid, Tabs, Tooltip } from '@mantine/core';
import { ArrowLeft, Play, Pause, RotateCcw, Save, AlertTriangle, BookOpen, GraduationCap, FlaskConical, ExternalLink } from 'lucide-react';
import { ExperimentScene, StepNavigation, ChemicalEquation, SafetyNotes, ParameterSettings, StepDetail, PreStudyTab, RealTimeDataPanel } from '../components/experiment';
import { Loading } from '../components/common/Loading';
import { useMockApi } from '../utils/api';
import { mockApi } from '../utils/api';
import { useExperimentStore } from '../store/useExperimentStore';
import type { Experiment } from '../types';
import { calculateProgress, formatDuration, highlightChemicalsInText } from '../utils/helpers';
import { getDifficultyColor, getDifficultyLabel, getSafetyLevelColor, getSafetyLevelLabel } from '../styles/theme';

export default function Experiment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    currentExperiment,
    currentStep,
    isPlaying,
    parameters,
    observations,
    data,
    chartSnapshots,
    preStudyCompleted,
    quizPassed,
    customExperiments,
    setCurrentExperiment,
    setCurrentStep,
    nextStep,
    prevStep,
    setIsPlaying,
    setParameter,
    resetParameters,
    addObservation,
    addDataPoint,
    addRecord,
    resetCurrentExperiment,
    setLoading,
    setError,
    error
  } = useExperimentStore();

  const [activeTab, setActiveTab] = useState<string | null>('prestudy');
  const [customExperiment, setCustomExperiment] = useState<Experiment | null>(null);
  const [isCustomExperiment, setIsCustomExperiment] = useState(false);

  useEffect(() => {
    if (id) {
      const custom = customExperiments.find(exp => exp.id === id);
      if (custom) {
        setCustomExperiment(custom);
        setIsCustomExperiment(true);
        setCurrentExperiment(custom);
      } else {
        setCustomExperiment(null);
        setIsCustomExperiment(false);
      }
    }
  }, [id, customExperiments, setCurrentExperiment]);

  const { loading, data: experimentData, refetch } = useMockApi(
    () => {
      if (!id) return Promise.reject('No ID');
      if (isCustomExperiment) {
        return Promise.resolve({ success: true, data: customExperiment! });
      }
      return mockApi.getExperiment(id);
    },
    [id, isCustomExperiment, customExperiment]
  );

  useEffect(() => {
    if (experimentData && !isCustomExperiment) {
      setCurrentExperiment(experimentData);
    }
  }, [experimentData, isCustomExperiment, setCurrentExperiment, setError]);

  useEffect(() => {
    if (isPlaying && currentExperiment) {
      const speed = useExperimentStore.getState().settings.autoPlaySpeed;
      const step = currentExperiment.steps[currentStep];
      autoPlayRef.current = setInterval(() => {
        if (currentStep < currentExperiment.steps.length - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, (step?.duration || 3000) / speed);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, currentStep, currentExperiment, nextStep, setIsPlaying]);

  const renderTextWithChemicalLinks = useCallback((text: string) => {
    const matches = highlightChemicalsInText(text);
    return matches.map((match, index) => {
      if (match.isLink && match.chemicalId) {
        return (
          <Tooltip key={index} label={`查看「${match.text}」百科详情`} position="top">
            <Link
              to={`/encyclopedia/${match.chemicalId}`}
              style={{
                color: '#10B981',
                textDecoration: 'none',
                borderBottom: '1px dashed #10B98180',
                cursor: 'pointer',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                transition: 'color 0.2s ease'
              }}
            >
              {match.text}
              <ExternalLink size={10} style={{ opacity: 0.6 }} />
            </Link>
          </Tooltip>
        );
      }
      return <span key={index}>{match.text}</span>;
    });
  }, []);

  const handleSaveRecord = async () => {
    if (!currentExperiment) return;

    setLoading(true);
    try {
      const record = {
        experimentId: currentExperiment.id,
        experimentName: currentExperiment.name,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        parameters,
        observations,
        data,
        chartSnapshots,
        conclusion: ''
      };

      const response = await mockApi.saveRecord(record);
      if (response.success && response.data) {
        addRecord(response.data);
        navigate('/record');
      } else {
        setError(response.error || '保存失败');
      }
    } catch {
      setError('保存失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isCustomExperiment) {
    return (
      <Container size="xl" py="xl">
        <Loading type="detail" />
      </Container>
    );
  }

  if ((error && !isCustomExperiment) || !currentExperiment) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <AlertTriangle size={48} color="#EF4444" />
          <Text c="red" size="lg">{error || '实验不存在'}</Text>
          <Group>
            {!isCustomExperiment && <Button onClick={refetch}>重新加载</Button>}
            <Button variant="light" onClick={() => navigate('/')}>返回首页</Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  const progress = calculateProgress(currentStep, currentExperiment.steps.length);
  const currentStepData = currentExperiment.steps[currentStep];

  const canEnterExperiment = () => {
    const isPreStudyDone = preStudyCompleted[currentExperiment.id] ?? false;
    if (!isPreStudyDone) return false;
    if (currentExperiment.quizRequired && !(quizPassed[currentExperiment.id] ?? false)) return false;
    return true;
  };

  const handleEnterExperiment = () => {
    setActiveTab('experiment');
  };

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
                onClick={() => navigate('/')}
              >
                返回
              </Button>
              <Stack gap={0}>
                <Title order={2} size="h3">
                  {currentExperiment.name}
                </Title>
                <Group gap="sm">
                  <Badge color={getDifficultyColor(currentExperiment.difficulty)}>
                    {getDifficultyLabel(currentExperiment.difficulty)}
                  </Badge>
                  <Badge color={getSafetyLevelColor(currentExperiment.safetyLevel)}>
                    {currentExperiment.safetyLevel === 'danger' && <AlertTriangle size={10} style={{ marginRight: 2 }} />}
                    {getSafetyLevelLabel(currentExperiment.safetyLevel)}
                  </Badge>
                  <Badge variant="light">{currentExperiment.category}</Badge>
                  <Text size="sm" c="dimmed">{formatDuration(currentExperiment.duration)}</Text>
                </Group>
              </Stack>
            </Group>
            <Group>
              <Button
                variant="light"
                leftSection={<RotateCcw size={16} />}
                onClick={resetCurrentExperiment}
              >
                重置
              </Button>
              <Button
                variant={isPlaying ? 'filled' : 'light'}
                color={isPlaying ? 'red' : 'blue'}
                leftSection={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '暂停' : '播放'}
              </Button>
              <Button
                leftSection={<Save size={16} />}
                onClick={handleSaveRecord}
              >
                保存记录
              </Button>
            </Group>
          </Group>

          {currentExperiment.safetyLevel === 'danger' && (
            <Alert
              icon={<AlertTriangle size={16} />}
              title="安全警告"
              color="red"
              variant="filled"
            >
              本实验存在一定危险性，请在专业人员指导下进行实际操作。模拟器仅供学习参考。
            </Alert>
          )}

          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="prestudy" leftSection={<GraduationCap size={16} />}>
                预习
              </Tabs.Tab>
              <Tabs.Tab
                value="experiment"
                leftSection={<FlaskConical size={16} />}
                disabled={!canEnterExperiment()}
              >
                实验
                {!canEnterExperiment() && (
                  <Badge size="xs" color="orange" ml="xs" variant="filled">
                    需预习
                  </Badge>
                )}
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="prestudy" pt="lg">
              <PreStudyTab
                experiment={currentExperiment}
                onEnterExperiment={handleEnterExperiment}
              />
            </Tabs.Panel>

            <Tabs.Panel value="experiment" pt="lg">
              <Stack gap="lg">
                <Group align="flex-start" gap="lg" style={{ alignItems: 'stretch' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Paper withBorder radius="lg" p="lg">
                      <ExperimentScene
                        experiment={currentExperiment}
                        currentStep={currentStep}
                        animationType={currentStepData.animationType}
                        animationData={currentStepData.animationData}
                        parameters={parameters}
                      />
                    </Paper>
                  </div>
                  <RealTimeDataPanel
                    experimentId={currentExperiment.id}
                    currentStep={currentStep}
                    currentStepTitle={currentStepData.title}
                    parameters={parameters}
                    isPlaying={isPlaying}
                  />
                </Group>

                <Stack gap="md">
                  <Group justify="space-between" align="flex-end" wrap="wrap">
                    <Stack gap={0}>
                      <Group gap="sm">
                        <Text size="sm" c="dimmed">步骤</Text>
                        <Text fw={600} size="lg" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {currentStep + 1} / {currentExperiment.steps.length}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed">进度 {progress}%</Text>
                    </Stack>
                    <Group>
                      <Button
                        variant="light"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        上一步
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={currentStep === currentExperiment.steps.length - 1}
                      >
                        下一步
                      </Button>
                    </Group>
                  </Group>

                  <StepNavigation
                    steps={currentExperiment.steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                    progress={progress}
                  />
                </Stack>

                <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
                  <Stack gap="md" style={{ gridColumn: 'span 2' }}>
                    <StepDetail
                      step={currentStepData}
                      parameters={parameters}
                      onAddObservation={(content) => addObservation({ stepId: currentStep + 1, content })}
                      onAddDataPoint={addDataPoint}
                    />

                    {currentExperiment.equations.length > 0 && (
                      <Paper withBorder radius="lg" p="lg">
                        <Group gap="sm" mb="md">
                          <BookOpen size={20} color="#1E6FBA" />
                          <Title order={3} size="h4">化学反应方程式</Title>
                        </Group>
                        <Stack gap="md">
                          {currentExperiment.equations.map((eq, idx) => (
                            <ChemicalEquation key={eq.id} equation={eq} delay={idx * 0.2} />
                          ))}
                        </Stack>
                      </Paper>
                    )}
                  </Stack>

                  <Stack gap="md">
                    <ParameterSettings
                      parameters={currentExperiment.parameters}
                      values={parameters}
                      onChange={setParameter}
                      onReset={resetParameters}
                    />

                    <SafetyNotes notes={currentExperiment.notes} />
                  </Stack>
                </SimpleGrid>

                <Divider />

                <Paper withBorder radius="lg" p="lg">
                  <Title order={3} size="h4" mb="md">实验材料清单</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <div>
                      <Text fw={600} mb="sm" c="#1E6FBA">实验器材</Text>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {currentExperiment.equipment.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Text fw={600} mb="sm" c="#10B981">实验药品</Text>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {currentExperiment.materials.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            {renderTextWithChemicalLinks(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SimpleGrid>
                </Paper>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </motion.div>
    </Container>
  );
}
