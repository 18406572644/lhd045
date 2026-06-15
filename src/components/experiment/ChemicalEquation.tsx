import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Paper, Text, Stack, Badge, Group, Tooltip } from '@mantine/core';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { ChemicalEquation as ChemicalEquationType } from '../../types';
import { renderChemicalFormula, findChemicalBySubstance } from '../../utils/helpers';
import { getChemicalStateLabel } from '../../styles/theme';
import { useExperimentStore } from '../../store/useExperimentStore';

interface ChemicalEquationProps {
  equation: ChemicalEquationType;
  delay?: number;
}

export const ChemicalEquation: React.FC<ChemicalEquationProps> = ({ equation, delay = 0 }) => {
  const { settings } = useExperimentStore();

  const renderSubstance = (substance: { name: string; formula: string; state: string; color?: string }, isReactant: boolean, index: number, total: number) => {
    const chemical = findChemicalBySubstance(substance);
    const baseColor = substance.color || (settings.theme === 'light' ? '#1F2937' : '#F3F4F6');
    const chemicalId = chemical?.id;
    const Content = (
      <motion.div
        key={`${isReactant ? 'reactant' : 'product'}-${index}`}
        initial={{ opacity: 0, x: isReactant ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: isReactant
            ? index * 0.2
            : equation.reactants.length * 0.2 + 0.3 + index * 0.2
        }}
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <Tooltip
          label={chemicalId ? `查看「${substance.name}」百科详情` : undefined}
          position="top"
          disabled={!chemicalId}
        >
          <span
            style={{
              color: baseColor,
              fontWeight: 600,
              cursor: chemicalId ? 'pointer' : 'default',
              textDecoration: chemicalId ? `underline dotted ${baseColor}66` : 'none',
              textUnderlineOffset: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}
            dangerouslySetInnerHTML={{ __html: renderChemicalFormula(substance.formula) }}
          />
        </Tooltip>
        <sub style={{
          color: '#64748B',
          fontSize: '11px',
          marginLeft: '2px'
        }}>
          ({getChemicalStateLabel(substance.state)})
        </sub>
        {index < total - 1 && (
          <span style={{ color: '#64748B', margin: '0 8px' }}>+</span>
        )}
      </motion.div>
    );

    if (chemicalId) {
      return (
        <Link
          key={`link-${isReactant ? 'r' : 'p'}-${index}`}
          to={`/encyclopedia/${chemicalId}`}
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          {Content}
        </Link>
      );
    }
    return Content;
  };

  const renderNameBadge = (substance: { name: string; formula: string; color?: string }, index: number) => {
    const chemical = findChemicalBySubstance(substance);
    const BadgeElement = (
      <Badge
        key={`badge-${substance.formula}-${index}`}
        variant="outline"
        size="sm"
        radius="sm"
        style={{
          borderColor: substance.color,
          color: substance.color,
          cursor: chemical?.id ? 'pointer' : 'default',
          transition: 'all 0.2s ease'
        }}
        leftSection={chemical?.id ? <ExternalLink size={10} /> : undefined}
      >
        {substance.name}
      </Badge>
    );

    if (chemical?.id) {
      return (
        <Link
          key={`badge-link-${index}`}
          to={`/encyclopedia/${chemical.id}`}
          style={{ textDecoration: 'none' }}
          onClick={(e) => e.stopPropagation()}
        >
          {BadgeElement}
        </Link>
      );
    }
    return BadgeElement;
  };

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
            {equation.reactants.map((reactant, index) =>
              renderSubstance(reactant, true, index, equation.reactants.length)
            )}

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

            {equation.products.map((product, index) =>
              renderSubstance(product, false, index, equation.products.length)
            )}
          </div>

          <Group gap="xs" style={{ flexWrap: 'wrap' }}>
            {[...equation.reactants, ...equation.products].map((substance, index) =>
              renderNameBadge(substance, index)
            )}
          </Group>
        </Stack>
      </Paper>
    </motion.div>
  );
};
