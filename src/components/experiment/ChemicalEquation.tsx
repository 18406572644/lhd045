import { motion } from 'framer-motion';
import { Paper, Text, Stack, Badge, Group } from '@mantine/core';
import { ArrowRight } from 'lucide-react';
import type { ChemicalEquation as ChemicalEquationType } from '../../types';
import { renderChemicalFormula } from '../../utils/helpers';
import { getChemicalStateLabel } from '../../styles/theme';
import { useExperimentStore } from '../../store/useExperimentStore';

interface ChemicalEquationProps {
  equation: ChemicalEquationType;
  delay?: number;
}

export const ChemicalEquation: React.FC<ChemicalEquationProps> = ({ equation, delay = 0 }) => {
  const { settings } = useExperimentStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Paper
        p="lg"
        radius="md"
        style={{
          background: settings.theme === 'light'
            ? 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'
            : 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          border: `1px solid ${settings.theme === 'light' ? '#E2E8F0' : '#475569'}`
        }}
      >
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="xs" fw={600} c="dimmed" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              化学反应方程式
            </Text>
            <Badge color="labBlue" size="sm" radius="sm">
              {equation.type}
            </Badge>
          </Group>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '20px 0',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '20px'
            }}
          >
            {equation.reactants.map((reactant, index) => (
              <motion.div
                key={`reactant-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span
                  style={{
                    color: reactant.color || (settings.theme === 'light' ? '#1F2937' : '#F3F4F6'),
                    fontWeight: 600
                  }}
                  dangerouslySetInnerHTML={{ __html: renderChemicalFormula(reactant.formula) }}
                />
                <sub style={{
                  color: '#64748B',
                  fontSize: '11px',
                  marginLeft: '2px'
                }}>
                  ({getChemicalStateLabel(reactant.state)})
                </sub>
                {index < equation.reactants.length - 1 && (
                  <span style={{ color: '#64748B', margin: '0 8px' }}>+</span>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: equation.reactants.length * 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 8px' }}
            >
              {equation.conditions && (
                <Text
                  size="sm"
                  c="labBlue"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {equation.conditions}
                </Text>
              )}
              <ArrowRight
                size={24}
                color="#1E6FBA"
                strokeWidth={2.5}
                style={{ flexShrink: 0 }}
              />
            </motion.div>

            {equation.products.map((product, index) => (
              <motion.div
                key={`product-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: equation.reactants.length * 0.2 + 0.3 + index * 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span
                  style={{
                    color: product.color || (settings.theme === 'light' ? '#1F2937' : '#F3F4F6'),
                    fontWeight: 600
                  }}
                  dangerouslySetInnerHTML={{ __html: renderChemicalFormula(product.formula) }}
                />
                <sub style={{
                  color: '#64748B',
                  fontSize: '11px',
                  marginLeft: '2px'
                }}>
                  ({getChemicalStateLabel(product.state)})
                </sub>
                {index < equation.products.length - 1 && (
                  <span style={{ color: '#64748B', margin: '0 8px' }}>+</span>
                )}
              </motion.div>
            ))}
          </div>

          <Group gap="xs" style={{ flexWrap: 'wrap' }}>
            {[...equation.reactants, ...equation.products].map((substance, index) => (
              <Badge
                key={`${substance.formula}-${index}`}
                variant="outline"
                size="sm"
                radius="sm"
                style={{ borderColor: substance.color, color: substance.color }}
              >
                {substance.name}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Paper>
    </motion.div>
  );
};
