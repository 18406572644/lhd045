import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stack, Paper, Text, Group, Button, Badge, Radio, Progress, Divider, Switch, Box, Alert
} from '@mantine/core';
import {
  BookOpen, ChevronDown, ChevronUp, CheckCircle2, XCircle,
  Lightbulb, Beaker, Shield, GraduationCap, ArrowRight, RotateCcw
} from 'lucide-react';
import type { PreKnowledgeSection, Experiment } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';

interface PreStudyTabProps {
  experiment: Experiment;
  onEnterExperiment: () => void;
}

const typeIconMap: Record<PreKnowledgeSection['type'], typeof BookOpen> = {
  concept: Lightbulb,
  principle: Beaker,
  instrument: BookOpen,
  safety: Shield
};

const typeColorMap: Record<PreKnowledgeSection['type'], string> = {
  concept: '#8B5CF6',
  principle: '#1E6FBA',
  instrument: '#059669',
  safety: '#EF4444'
};

const typeLabelMap: Record<PreKnowledgeSection['type'], string> = {
  concept: '相关概念',
  principle: '反应原理',
  instrument: '仪器使用',
  safety: '安全须知'
};

export const PreStudyTab: React.FC<PreStudyTabProps> = ({ experiment, onEnterExperiment }) => {
  const {
    preStudyCompleted,
    quizPassed,
    markPreStudyCompleted,
    setQuizPassed,
    settings
  } = useExperimentStore();

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [quizEnabled, setQuizEnabled] = useState(experiment.quizRequired ?? false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState<Set<string>>(new Set());

  const isPreStudyCompleted = preStudyCompleted[experiment.id] ?? false;
  const isQuizPassed = quizPassed[experiment.id] ?? false;

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(experiment.preKnowledge.map(k => k.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleMarkPreStudy = () => {
    markPreStudyCompleted(experiment.id);
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    const allCorrect = experiment.quizQuestions.every(q => {
      const selected = answers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      return selected === correctOption?.label;
    });
    setQuizPassed(experiment.id, allCorrect);
    setShowExplanations(new Set(experiment.quizQuestions.map(q => q.id)));
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setShowExplanations(new Set());
    setQuizPassed(experiment.id, false);
  };

  const canEnterExperiment = () => {
    if (!isPreStudyCompleted) return false;
    if (quizEnabled && !isQuizPassed) return false;
    return true;
  };

  const allAnswered = experiment.quizQuestions.every(q => answers[q.id] !== undefined);

  const correctCount = experiment.quizQuestions.filter(q => {
    const selected = answers[q.id];
    const correctOption = q.options.find(o => o.isCorrect);
    return selected === correctOption?.label;
  }).length;

  const quizProgress = (Object.keys(answers).length / experiment.quizQuestions.length) * 100;

  return (
    <Stack gap="lg">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <GraduationCap size={22} color="#1E6FBA" />
            <Text fw={700} size="lg">实验前必看知识</Text>
          </Group>
          <Group gap="xs">
            <Button variant="subtle" size="xs" onClick={expandAll}>
              全部展开
            </Button>
            <Button variant="subtle" size="xs" onClick={collapseAll}>
              全部折叠
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          {experiment.preKnowledge.map((section, index) => {
            const Icon = typeIconMap[section.type];
            const color = typeColorMap[section.type];
            const isExpanded = expandedIds.has(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Paper
                  radius="md"
                  p="md"
                  style={{
                    borderLeft: `4px solid ${color}`,
                    background: settings.theme === 'light' ? '#FAFAFA' : '#1A1A2E',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleExpand(section.id)}
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group gap="sm" style={{ flex: 1 }}>
                      <Icon size={20} color={color} />
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Group gap="xs">
                          <Badge
                            size="sm"
                            variant="dot"
                            color={color}
                          >
                            {typeLabelMap[section.type]}
                          </Badge>
                          <Text fw={600} size="sm">{section.title}</Text>
                        </Group>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <Text size="sm" c="dimmed" mt="xs" style={{ lineHeight: 1.7 }}>
                                {section.content}
                              </Text>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Stack>
                    </Group>
                    <Button
                      variant="subtle"
                      size="xs"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(section.id);
                      }}
                      style={{ padding: '4px' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </Group>
                </Paper>
              </motion.div>
            );
          })}
        </Stack>
      </Paper>

      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" mb="md">
          <Group gap="sm">
            <CheckCircle2 size={22} color={isPreStudyCompleted ? '#10B981' : '#9CA3AF'} />
            <Text fw={700} size="lg">预习确认</Text>
          </Group>
          {isPreStudyCompleted && (
            <Badge color="green" size="lg" variant="filled">
              已预习
            </Badge>
          )}
        </Group>
        <Text size="sm" c="dimmed" mb="md">
          请确认您已仔细阅读以上知识要点，理解实验相关概念、反应原理、仪器使用方法和安全注意事项。
        </Text>
        <Button
          fullWidth
          color={isPreStudyCompleted ? 'green' : 'blue'}
          variant={isPreStudyCompleted ? 'light' : 'filled'}
          leftSection={<CheckCircle2 size={16} />}
          onClick={handleMarkPreStudy}
          disabled={isPreStudyCompleted}
        >
          {isPreStudyCompleted ? '已完成预习' : '标记为已预习'}
        </Button>
      </Paper>

      {experiment.quizQuestions.length > 0 && (
        <Paper withBorder radius="lg" p="lg">
          <Group justify="space-between" mb="md">
            <Group gap="sm">
              <GraduationCap size={22} color="#8B5CF6" />
              <Text fw={700} size="lg">预习小测验</Text>
            </Group>
            <Group gap="md">
              <Group gap="xs">
                <Text size="xs" c="dimmed">必须通过测验才能进入实验</Text>
                <Switch
                  size="sm"
                  checked={quizEnabled}
                  onChange={(e) => setQuizEnabled(e.currentTarget.checked)}
                />
              </Group>
            </Group>
          </Group>

          {quizEnabled && !isQuizPassed && (
            <>
              <Group justify="space-between" mb="sm">
                <Text size="sm" c="dimmed">
                  已答 {Object.keys(answers).length} / {experiment.quizQuestions.length} 题
                </Text>
                <Text size="sm" c="dimmed">
                  {quizProgress.toFixed(0)}%
                </Text>
              </Group>
              <Progress
                value={quizProgress}
                size="sm"
                mb="lg"
                color="violet"
              />
            </>
          )}

          {quizEnabled && isQuizPassed && (
            <Alert
              icon={<CheckCircle2 size={16} />}
              title="测验通过！"
              color="green"
              mb="md"
              variant="light"
            >
              您已正确回答所有题目，可以进入实验。
            </Alert>
          )}

          <Stack gap="lg">
            {experiment.quizQuestions.map((question, qIndex) => {
              const selectedAnswer = answers[question.id];
              const correctOption = question.options.find(o => o.isCorrect);
              const isCorrect = selectedAnswer === correctOption?.label;
              const showExplanation = showExplanations.has(question.id);

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIndex * 0.05 }}
                >
                  <Paper
                    radius="md"
                    p="md"
                    style={{
                      background: settings.theme === 'light' ? '#F9FAFB' : '#16162A',
                      border: submitted
                        ? isCorrect
                          ? '2px solid #10B981'
                          : '2px solid #EF4444'
                        : '1px solid var(--mantine-color-gray-3)'
                    }}
                  >
                    <Group gap="sm" mb="sm">
                      <Badge
                        size="sm"
                        color={submitted ? (isCorrect ? 'green' : 'red') : 'violet'}
                        variant="filled"
                      >
                        第 {qIndex + 1} 题
                      </Badge>
                      {submitted && (
                        isCorrect
                          ? <CheckCircle2 size={18} color="#10B981" />
                          : <XCircle size={18} color="#EF4444" />
                      )}
                      <Text fw={600} size="sm" style={{ flex: 1 }}>
                        {question.question}
                      </Text>
                    </Group>

                    <Radio.Group
                      value={selectedAnswer}
                      onChange={(val) => handleAnswerSelect(question.id, val)}
                    >
                      <Stack gap="xs" ml="sm">
                        {question.options.map((option, oIndex) => {
                          const isSelected = selectedAnswer === option.label;
                          const showCorrect = submitted && option.isCorrect;
                          const showWrong = submitted && isSelected && !option.isCorrect;

                          return (
                            <Radio
                              key={oIndex}
                              value={option.label}
                              label={option.label}
                              disabled={submitted}
                              styles={{
                                radio: {
                                  borderColor: showCorrect
                                    ? '#10B981'
                                    : showWrong
                                      ? '#EF4444'
                                      : undefined,
                                  backgroundColor: showCorrect
                                    ? '#ECFDF5'
                                    : showWrong
                                      ? '#FEF2F2'
                                      : undefined
                                },
                                label: {
                                  color: showCorrect
                                    ? '#059669'
                                    : showWrong
                                      ? '#DC2626'
                                      : undefined
                                }
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Radio.Group>

                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Box
                            mt="sm"
                            p="sm"
                            style={{
                              background: settings.theme === 'light' ? '#EFF6FF' : '#1E3A5F',
                              borderRadius: '8px'
                            }}
                          >
                            <Group gap="xs" mb={4}>
                              <Lightbulb size={14} color="#3B82F6" />
                              <Text size="xs" fw={600} c="blue">解析</Text>
                            </Group>
                            <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
                              {question.explanation}
                            </Text>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Paper>
                </motion.div>
              );
            })}
          </Stack>

          {quizEnabled && (
            <Group justify="space-between" mt="lg">
              <Button
                variant="light"
                leftSection={<RotateCcw size={16} />}
                onClick={handleResetQuiz}
                disabled={!submitted && Object.keys(answers).length === 0}
              >
                重新答题
              </Button>
              {!submitted ? (
                <Button
                  color="violet"
                  disabled={!allAnswered}
                  onClick={handleSubmitQuiz}
                >
                  提交答案
                </Button>
              ) : (
                <Group gap="sm">
                  <Text size="sm" fw={600} c={isQuizPassed ? 'green' : 'red'}>
                    {correctCount} / {experiment.quizQuestions.length} 正确
                  </Text>
                  {!isQuizPassed && (
                    <Button
                      color="violet"
                      variant="light"
                      onClick={handleResetQuiz}
                    >
                      重新作答
                    </Button>
                  )}
                </Group>
              )}
            </Group>
          )}
        </Paper>
      )}

      <Divider />

      <Paper
        radius="lg"
        p="lg"
        style={{
          background: canEnterExperiment()
            ? (settings.theme === 'light' ? '#ECFDF5' : '#052E16')
            : (settings.theme === 'light' ? '#F3F4F6' : '#1F2937'),
          border: canEnterExperiment()
            ? '2px solid #10B981'
            : '1px solid var(--mantine-color-gray-3)'
        }}
      >
        <Group justify="space-between">
          <Stack gap={4}>
            <Text fw={700} size="lg">
              {canEnterExperiment() ? '准备就绪！' : '请完成预习后进入实验'}
            </Text>
            <Text size="sm" c="dimmed">
              {!isPreStudyCompleted && '请先标记"已预习"'}
              {isPreStudyCompleted && quizEnabled && !isQuizPassed && ' · 请通过预习测验'}
              {canEnterExperiment() && '您已完成所有预习要求，可以开始实验了'}
            </Text>
          </Stack>
          <Button
            size="lg"
            color={canEnterExperiment() ? 'green' : 'gray'}
            disabled={!canEnterExperiment()}
            rightSection={<ArrowRight size={18} />}
            onClick={onEnterExperiment}
          >
            进入实验
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
};
