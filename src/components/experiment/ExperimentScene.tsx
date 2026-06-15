import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Group, ActionIcon, Tooltip, Badge } from '@mantine/core';
import { Box as BoxIcon, Layers, RotateCcw } from 'lucide-react';
import { Beaker, TestTube, AlcoholLamp, ConicalFlask } from '../equipment';
import { ExperimentScene3D } from './ExperimentScene3D';
import type { AnimationConfig, Experiment } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';
import { shouldUse3D, detectDeviceCapability } from '../../utils/deviceDetection';
import { VIEW_PRESETS } from '../../utils/viewAngles';
import type { ViewPreset } from '../../types';

interface ExperimentSceneProps {
  animationData: AnimationConfig;
  experimentId?: string;
  experiment?: Experiment;
  currentStep?: number;
  animationType?: string;
  parameters?: Record<string, number>;
}

export const ExperimentScene: React.FC<ExperimentSceneProps> = ({
  animationData,
  experimentId,
  experiment,
  currentStep,
  animationType,
  parameters
}) => {
  void parameters;
  const id = experiment?.id || experimentId || 'default';
  const { settings, updateSettings } = useExperimentStore();
  const { type, liquidColor, bubbleColor, flameIntensity } = animationData;

  const [effectiveMode, setEffectiveMode] = useState<'2d' | '3d'>(() => {
    if (typeof window === 'undefined') return '2d';
    if (settings.autoDetectRenderMode) {
      return shouldUse3D(true) ? '3d' : '2d';
    }
    return settings.renderMode;
  });

  const [deviceInfo, setDeviceInfo] = useState<{ isLowEnd: boolean; supportsWebGL: boolean; supportsWebGL2: boolean }>(() => {
    if (typeof window === 'undefined') {
      return { isLowEnd: true, supportsWebGL: false, supportsWebGL2: false };
    }
    const capability = detectDeviceCapability();
    return {
      isLowEnd: capability.isLowEndDevice,
      supportsWebGL: capability.supportsWebGL,
      supportsWebGL2: capability.supportsWebGL2
    };
  });

  const [viewPreset, setViewPreset] = useState<ViewPreset>('default');

  useEffect(() => {
    if (settings.autoDetectRenderMode) {
      const use3D = shouldUse3D(true);
      setEffectiveMode(use3D ? '3d' : '2d');
    } else {
      setEffectiveMode(settings.renderMode);
    }
  }, [settings.renderMode, settings.autoDetectRenderMode]);

  const handleToggleMode = () => {
    if (deviceInfo.isLowEnd && settings.renderMode === '2d') {
      updateSettings({ renderMode: '3d', autoDetectRenderMode: false });
      setEffectiveMode('3d');
    } else {
      const newMode: '2d' | '3d' = effectiveMode === '2d' ? '3d' : '2d';
      updateSettings({ renderMode: newMode, autoDetectRenderMode: false });
      setEffectiveMode(newMode);
    }
  };

  const handleResetView = () => {
    setViewPreset('default');
  };

  const renderEquipment2D = () => {
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
        padding: '16px',
        background: settings.theme === 'light'
          ? 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 50%, #CBD5E1 100%)'
          : 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)',
        borderRadius: '16px',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.05)'
      }}
    >
      <Group
        justify="space-between"
        style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          right: '16px',
          zIndex: 20
        }}
      >
        <Group gap="xs">
          <Badge
            variant="filled"
            color={effectiveMode === '3d' ? 'labBlue' : 'gray'}
            radius="sm"
          >
            {effectiveMode === '3d' ? '3D 模式' : '2D 模式'}
          </Badge>
          {deviceInfo.isLowEnd && effectiveMode === '2d' && (
            <Badge variant="outline" color="warningOrange" radius="sm">
              已自动降级
            </Badge>
          )}
        </Group>

        <Group gap="xs">
          {effectiveMode === '3d' && (
            <>
              <Tooltip label="重置视角" position="bottom">
                <ActionIcon
                  variant="light"
                  onClick={handleResetView}
                  style={{
                    background: settings.theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <RotateCcw size={16} />
                </ActionIcon>
              </Tooltip>
              {Object.entries(VIEW_PRESETS).map(([key]) => (
                <Tooltip key={key} label={`${key}视角`} position="bottom">
                  <ActionIcon
                    variant={viewPreset === key ? 'filled' : 'light'}
                    onClick={() => setViewPreset(key as ViewPreset)}
                    style={{
                      background: viewPreset === key
                        ? undefined
                        : settings.theme === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    {key === 'front' && <BoxIcon size={16} />}
                    {key !== 'front' && <Layers size={16} />}
                  </ActionIcon>
                </Tooltip>
              ))}
            </>
          )}

          <Tooltip
            label={effectiveMode === '3d' ? '切换到 2D 模式' : '切换到 3D 模式'}
            position="bottom"
          >
            <ActionIcon
              variant="filled"
              color={effectiveMode === '3d' ? 'labBlue' : 'successGreen'}
              onClick={handleToggleMode}
            >
              {effectiveMode === '3d' ? <BoxIcon size={16} /> : <Layers size={16} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: settings.theme === 'light'
            ? 'linear-gradient(to top, rgba(148, 163, 184, 0.3), transparent)'
            : 'linear-gradient(to top, rgba(71, 85, 105, 0.4), transparent)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '56px',
          left: '20px',
          right: '20px',
          height: '2px',
          background: settings.theme === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.5), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.5), transparent)',
          pointerEvents: 'none'
        }}
      />

      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '40px',
          minHeight: '320px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${id}-${type}-${effectiveMode}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            {settings.showAnimations && effectiveMode === '3d' && deviceInfo.supportsWebGL ? (
              <ExperimentScene3D
                experiment={experiment}
                experimentId={experimentId}
                currentStep={currentStep}
                animationData={animationData}
                animationType={animationType}
                viewPreset={viewPreset}
              />
            ) : (
              settings.showAnimations && renderEquipment2D()
            )}
          </motion.div>
        </AnimatePresence>
      </Box>

      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: settings.theme === 'light' ? '#64748B' : '#94A3B8',
          fontFamily: '"JetBrains Mono", monospace',
          pointerEvents: 'none',
          zIndex: effectiveMode === '2d' ? 10 : 5
        }}
      >
        {effectiveMode === '2d' ? '实验台 · 模拟环境 (2D)' : ''}
      </div>
    </Box>
  );
};
