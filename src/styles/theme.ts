import { createTheme, MantineColorsTuple } from '@mantine/core';

const labBlue: MantineColorsTuple = [
  '#E8F3FC',
  '#C7E2F7',
  '#A6D1F2',
  '#84BFF0',
  '#63AEEB',
  '#429CE6',
  '#2A8AE0',
  '#1E6FBA',
  '#175794',
  '#0F3F6E'
];

const successGreen: MantineColorsTuple = [
  '#E8F5E9',
  '#C8E6C9',
  '#A5D6A7',
  '#81C784',
  '#66BB6A',
  '#4CAF50',
  '#43A047',
  '#388E3C',
  '#2E7D32',
  '#1B5E20'
];

const warningOrange: MantineColorsTuple = [
  '#FFF3E0',
  '#FFE0B2',
  '#FFCC80',
  '#FFB74D',
  '#FFA726',
  '#FF9800',
  '#FB8C00',
  '#F57C00',
  '#EF6C00',
  '#E65100'
];

const dangerRed: MantineColorsTuple = [
  '#FFEBEE',
  '#FFCDD2',
  '#FFCdd2',
  '#EF9A9A',
  '#E57373',
  '#EF5350',
  '#E53935',
  '#D32F2F',
  '#C62828',
  '#B71C1C'
];

export const theme = createTheme({
  colors: {
    labBlue,
    successGreen,
    warningOrange,
    dangerRed
  },
  primaryColor: 'labBlue',
  primaryShade: 7,
  fontFamily: '"Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  headings: {
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2rem', lineHeight: '1.3' },
      h2: { fontSize: '1.5rem', lineHeight: '1.4' },
      h3: { fontSize: '1.25rem', lineHeight: '1.5' },
      h4: { fontSize: '1.125rem', lineHeight: '1.5' }
    }
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem'
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  other: {
    headerHeight: '64px',
    navWidth: '280px',
    labBgGradient: 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 100%)',
    cardBgLight: 'rgba(255, 255, 255, 0.9)',
    glassEffect: 'backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.75);'
  },
  components: {
    Button: {
      styles: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(30, 111, 186, 0.25)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        }
      }
    },
    Card: {
      styles: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    Paper: {
      styles: {
        root: {
          borderRadius: '8px'
        }
      }
    },
    Badge: {
      styles: {
        root: {
          borderRadius: '6px',
          fontWeight: 500
        }
      }
    }
  }
});

export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    easy: 'successGreen',
    medium: 'warningOrange',
    hard: 'dangerRed'
  };
  return colors[difficulty] || 'gray';
};

export const getSafetyLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    normal: 'successGreen',
    caution: 'warningOrange',
    danger: 'dangerRed'
  };
  return colors[level] || 'gray';
};

export const getDifficultyLabel = (difficulty: string): string => {
  const labels: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  };
  return labels[difficulty] || difficulty;
};

export const getSafetyLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    normal: '普通',
    caution: '注意',
    danger: '危险'
  };
  return labels[level] || level;
};

export const getChemicalStateLabel = (state: string): string => {
  const labels: Record<string, string> = {
    solid: 's',
    liquid: 'l',
    gas: 'g',
    aqueous: 'aq'
  };
  return labels[state] || state;
};
