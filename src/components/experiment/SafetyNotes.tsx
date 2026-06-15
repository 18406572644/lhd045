import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stack, Paper, Text, Group, Button, Badge } from '@mantine/core';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type { SafetyNote } from '../../types';
import { useExperimentStore } from '../../store/useExperimentStore';

interface SafetyNotesProps {
  notes: SafetyNote[];
}

const iconMap = {
  warning: AlertTriangle,
  danger: AlertTriangle,
  info: Info
};

const colorMap = {
  warning: 'warningOrange',
  danger: 'dangerRed',
  info: 'labBlue'
};

const labelMap = {
  warning: '警告',
  danger: '危险',
  info: '提示'
};

export const SafetyNotes: React.FC<SafetyNotesProps> = ({ notes }) => {
  const { settings } = useExperimentStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (notes.length === 0) {
    return null;
  }

  const dangerNotes = notes.filter(n => n.type === 'danger');
  const warningNotes = notes.filter(n => n.type === 'warning');
  const infoNotes = notes.filter(n => n.type === 'info');
  const sortedNotes = [...dangerNotes, ...warningNotes, ...infoNotes];

  return (
    <Stack gap="sm">
      <Group>
        <Text fw={600} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          安全注意事项
        </Text>
        {dangerNotes.length > 0 && (
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Badge color="dangerRed" size="sm">
              {dangerNotes.length} 项危险提示
            </Badge>
          </motion.div>
        )}
      </Group>

      {sortedNotes.map((note, index) => {
        const Icon = iconMap[note.type];
        const color = colorMap[note.type];
        const isExpanded = expandedId === note.id || (index === 0 && expandedId === null);

        return (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Paper
              p="md"
              radius="md"
              style={{
                borderLeft: `4px solid`,
                borderLeftColor: `var(--mantine-color-${color}-5)`,
                background: settings.theme === 'light'
                  ? (note.type === 'danger' ? '#FEF2F2' : note.type === 'warning' ? '#FFFBEB' : '#EFF6FF')
                  : (note.type === 'danger' ? '#450A0A' : note.type === 'warning' ? '#422006' : '#1E3A5F'),
                cursor: 'pointer'
              }}
              onClick={() => toggleExpand(note.id)}
            >
              <Group justify="space-between" align="flex-start">
                <Group gap="sm" style={{ flex: 1 }}>
                  <motion.div
                    animate={note.type === 'danger' ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, -3, 3, -3, 0]
                    } : {}}
                    transition={note.type === 'danger' ? {
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    } : {}}
                  >
                    <Icon
                      size={20}
                      color={`var(--mantine-color-${color}-5)`}
                    />
                  </motion.div>
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="xs">
                      <Badge color={color} size="sm" variant="dot">
                        {labelMap[note.type]}
                      </Badge>
                      <Text fw={600} size="sm">
                        {note.title}
                      </Text>
                    </Group>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Text size="sm" c="dimmed" mt="xs">
                            {note.content}
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
                    toggleExpand(note.id);
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
  );
};
