import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Group, Text, Badge, Stack, ActionIcon, Tooltip } from '@mantine/core';
import { Star, Clock, AlertTriangle, Flame, FlaskConical, Thermometer, Zap, Bubbles } from 'lucide-react';
import type { Experiment } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';
import { getDifficultyColor, getDifficultyLabel, getSafetyLevelColor, getSafetyLevelLabel } from '../../styles/theme';
import { formatDuration } from '../../utils/helpers';

interface ExperimentCardProps {
  experiment: Experiment;
}

const iconMap: Record<string, React.ComponentType<{ size?: number | string; color?: string }>> = {
  flame: Flame,
  'flask-conical': FlaskConical,
  thermometer: Thermometer,
  zap: Zap,
  bubble: Bubbles
};

export const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment }) => {
  const { favorites, toggleFavorite } = useExperimentStore();
  const isFavorite = favorites.includes(experiment.id);
  const Icon = iconMap[experiment.icon] || FlaskConical;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(experiment.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/experiment/${experiment.id}`} style={{ textDecoration: 'none' }}>
        <Card
          shadow="sm"
          padding="lg"
          radius="lg"
          style={{
            height: '100%',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            border: '1px solid rgba(30, 111, 186, 0.1)'
          }}
        >
          <Card.Section>
            <div
              style={{
                height: '140px',
                background: `linear-gradient(135deg, ${experiment.safetyLevel === 'danger' ? '#FEE2E2' : experiment.safetyLevel === 'caution' ? '#FEF3C7' : '#DBEAFE'} 0%, ${experiment.safetyLevel === 'danger' ? '#FECACA' : experiment.safetyLevel === 'caution' ? '#FDE68A' : '#BFDBFE'} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon size={56} color="#1E6FBA" />
              </motion.div>
              <Tooltip label={isFavorite ? '取消收藏' : '收藏实验'} position="top">
                <ActionIcon
                  variant="white"
                  size="lg"
                  radius="xl"
                  onClick={handleFavorite}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Star
                    size={18}
                    fill={isFavorite ? '#FBBF24' : 'none'}
                    color={isFavorite ? '#FBBF24' : '#9CA3AF'}
                  />
                </ActionIcon>
              </Tooltip>
            </div>
          </Card.Section>

          <Stack gap="sm" mt="md">
            <Group justify="space-between" align="flex-start">
              <Text fw={600} size="lg" lineClamp={1} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {experiment.name}
              </Text>
              <Group gap="xs">
                <Badge
                  color={getDifficultyColor(experiment.difficulty)}
                  size="sm"
                  radius="sm"
                >
                  {getDifficultyLabel(experiment.difficulty)}
                </Badge>
                <Badge
                  color={getSafetyLevelColor(experiment.safetyLevel)}
                  size="sm"
                  radius="sm"
                  variant={experiment.safetyLevel === 'danger' ? 'filled' : 'light'}
                >
                  {experiment.safetyLevel === 'danger' && <AlertTriangle size={10} style={{ marginRight: 2 }} />}
                  {getSafetyLevelLabel(experiment.safetyLevel)}
                </Badge>
              </Group>
            </Group>

            <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: '40px' }}>
              {experiment.description}
            </Text>

            <Group gap="md" mt="xs">
              <Group gap="xs">
                <Clock size={14} color="#6B7280" />
                <Text size="xs" c="dimmed">{formatDuration(experiment.duration)}</Text>
              </Group>
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  {experiment.steps.length} 个步骤
                </Text>
              </Group>
            </Group>
          </Stack>
        </Card>
      </Link>
    </motion.div>
  );
};
