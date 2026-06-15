import type { ViewAngle, ViewPreset, AnimationType } from '../types';

export const VIEW_PRESETS: Record<ViewPreset, ViewAngle> = {
  default: {
    position: { x: 0, y: 3, z: 8 },
    target: { x: 0, y: 0.5, z: 0 }
  },
  front: {
    position: { x: 0, y: 2, z: 7 },
    target: { x: 0, y: 0.5, z: 0 }
  },
  top: {
    position: { x: 0, y: 10, z: 0.1 },
    target: { x: 0, y: 0, z: 0 }
  },
  side: {
    position: { x: 7, y: 2, z: 0 },
    target: { x: 0, y: 0.5, z: 0 }
  },
  closeup: {
    position: { x: 0, y: 1.5, z: 4 },
    target: { x: 0, y: 0.5, z: 0 }
  }
};

export const getViewAngleForAnimation = (animationType: AnimationType): ViewAngle => {
  switch (animationType) {
    case 'heating':
      return {
        position: { x: -2, y: 3, z: 6 },
        target: { x: -1, y: 0.5, z: 0 }
      };
    case 'bubbling':
      return {
        position: { x: 0, y: 2.5, z: 5 },
        target: { x: 0, y: 0.8, z: 0 }
      };
    case 'reaction':
      return {
        position: { x: 0, y: 2, z: 4.5 },
        target: { x: 0, y: 0.6, z: 0 }
      };
    case 'pouring':
      return {
        position: { x: 2, y: 3, z: 5 },
        target: { x: 0.5, y: 1, z: 0 }
      };
    case 'mixing':
      return {
        position: { x: 0, y: 4, z: 5 },
        target: { x: 0, y: 0.5, z: 0 }
      };
    case 'idle':
    default:
      return VIEW_PRESETS.default;
  }
};

export const getExperimentViewAngle = (
  experimentId: string,
  stepIndex: number,
  animationType: AnimationType
): ViewAngle => {
  const baseAngle = getViewAngleForAnimation(animationType);

  switch (experimentId) {
    case 'kmno4-oxygen':
      if (stepIndex >= 3 && stepIndex <= 4) {
        return {
          position: { x: -2.5, y: 3, z: 6 },
          target: { x: -1.5, y: 0.5, z: 0 }
        };
      }
      return baseAngle;

    case 'electrolysis-water':
      if (stepIndex === 2) {
        return {
          position: { x: 0, y: 3, z: 6 },
          target: { x: 0, y: 0.8, z: 0 }
        };
      }
      return baseAngle;

    default:
      return baseAngle;
  }
};
