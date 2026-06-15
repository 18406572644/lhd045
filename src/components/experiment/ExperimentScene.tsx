import { motion, AnimatePresence } from 'framer-motion';
import { Box, Group } from '@mantine/core';
import { Beaker, TestTube, AlcoholLamp, ConicalFlask } from '../equipment';
import type { AnimationConfig } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';

import type { Experiment } from '../../types';

interface ExperimentSceneProps {
  animationData: AnimationConfig;
  experimentId?: string;
  experiment?: Experiment;
  currentStep?: number;
  animationType?: string;
  parameters?: Record<string, number>;
}

export const ExperimentScene: React.FC<ExperimentSceneProps> = ({ animationData, experimentId, experiment, currentStep, animationType, parameters }) => {
  const id = experiment?.id || experimentId || 'default';
  const { settings } = useExperimentStore();
  const { type, liquidColor, bubbleColor, flameIntensity } = animationData;

  const renderEquipment = () => {
    switch (id) {
      case 'kmno4-oxygen':
        return (
          <Group gap="xl" align="flex-end">
            <TestTube
              size={220}
              liquidColor={liquidColor || '#7C3AED'}
              liquidLevel={type === 'pouring' ? 40 : 60}
              showBubbles={type === 'bubbling'}
              bubbleColor={bubbleColor || '#60A5FA'}
              tilted={type === 'heating'}
            />
            {type === 'heating' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AlcoholLamp
                  isHeating={true}
                  flameIntensity={flameIntensity || 0.8}
                  size={130}
                />
              </motion.div>
            )}
            {type === 'bubbling' && (
              <Beaker
                size={180}
                liquidColor="#3B82F6"
                liquidLevel={70}
                showBubbles={true}
                bubbleColor="#FFFFFF"
              />
            )}
          </Group>
        );

      case 'acid-base-neutralization':
        return (
          <Group gap="xl" align="flex-end">
            <Beaker
              size={200}
              liquidColor={type === 'reaction' ? '#10B981' : liquidColor || '#EC4899'}
              liquidLevel={type === 'pouring' ? 40 : 65}
              showBubbles={type === 'bubbling' || type === 'reaction'}
              bubbleColor={bubbleColor || '#FFFFFF'}
            />
            {type === 'heating' && (
              <AlcoholLamp
                isHeating={true}
                flameIntensity={flameIntensity || 0.6}
                size={120}
              />
            )}
          </Group>
        );

      case 'caco3-co2':
        return (
          <Group gap="xl" align="flex-end">
            <ConicalFlask
              size={200}
              liquidColor={liquidColor || '#60A5FA'}
              liquidLevel={55}
              showBubbles={type === 'bubbling' || type === 'reaction'}
              bubbleColor={bubbleColor || '#9CA3AF'}
            />
            {type === 'reaction' && (
              <TestTube
                size={180}
                liquidColor={liquidColor || '#D1D5DB'}
                liquidLevel={50}
                showBubbles={true}
                bubbleColor="#F3F4F6"
              />
            )}
          </Group>
        );

      case 'cuso4-h2o':
        return (
          <Group gap="xl" align="flex-end">
            <TestTube
              size={220}
              liquidColor={type === 'heating' ? '#F59E0B' : liquidColor || '#3B82F6'}
              liquidLevel={45}
              showBubbles={type === 'bubbling'}
              bubbleColor={bubbleColor || '#60A5FA'}
              tilted={type === 'heating'}
            />
            {type === 'heating' && (
              <AlcoholLamp
                isHeating={true}
                flameIntensity={flameIntensity || 0.7}
                size={130}
              />
            )}
          </Group>
        );

      case 'electrolysis-water':
        return (
          <Group gap="lg" align="flex-end">
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <TestTube
                size={200}
                liquidColor={liquidColor || '#6366F1'}
                liquidLevel={type === 'bubbling' ? 60 : 75}
                showBubbles={type === 'bubbling'}
                bubbleColor="#10B981"
              />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >
              <TestTube
                size={200}
                liquidColor={liquidColor || '#6366F1'}
                liquidLevel={type === 'bubbling' ? 70 : 75}
                showBubbles={type === 'bubbling'}
                bubbleColor="#60A5FA"
              />
            </motion.div>
          </Group>
        );

      default:
        return (
          <Beaker
            size={200}
            liquidColor={liquidColor || '#60A5FA'}
            liquidLevel={60}
            showBubbles={type === 'bubbling' || type === 'reaction'}
            bubbleColor={bubbleColor || '#FFFFFF'}
          />
        );
    }
  };

  return (
    <Box
      style={{
        padding: '40px',
        background: settings.theme === 'light'
          ? 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 50%, #CBD5E1 100%)'
          : 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)',
        borderRadius: '16px',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.05)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: settings.theme === 'light'
            ? 'linear-gradient(to top, rgba(148, 163, 184, 0.3), transparent)'
            : 'linear-gradient(to top, rgba(71, 85, 105, 0.4), transparent)'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          height: '2px',
          background: settings.theme === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.5), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.5), transparent)'
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${id}-${type}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '32px',
            zIndex: 1
          }}
        >
          {settings.showAnimations && renderEquipment()}
        </motion.div>
      </AnimatePresence>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: settings.theme === 'light' ? '#64748B' : '#94A3B8',
          fontFamily: '"JetBrains Mono", monospace'
        }}
      >
        实验台 · 模拟环境
      </div>
    </Box>
  );
};
