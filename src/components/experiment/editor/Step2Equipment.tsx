import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper, Text, Stack, Group, Badge, Button, NumberInput, TextInput,
  Tabs, ScrollArea, Checkbox, SimpleGrid, Input, Chip, Box
} from '@mantine/core';
import { FlaskConical, Beaker, Plus, Minus, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useExperimentStore } from '../../../store/useExperimentStore';
import { equipmentLibrary, chemicalLibrary, getEquipmentCategories, getChemicalCategories } from '../../../data/library';
import type { SelectedEquipment, SelectedChemical } from './types';

interface Step2EquipmentProps {
  equipment: SelectedEquipment[];
  chemicals: SelectedChemical[];
  onEquipmentChange: (equipment: SelectedEquipment[]) => void;
  onChemicalsChange: (chemicals: SelectedChemical[]) => void;
}

export const Step2Equipment: React.FC<Step2EquipmentProps> = ({
  equipment,
  chemicals,
  onEquipmentChange,
  onChemicalsChange
}) => {
  const { settings } = useExperimentStore();
  const [activeTab, setActiveTab] = useState<'equipment' | 'chemicals'>('equipment');
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [chemicalSearch, setChemicalSearch] = useState('');
  const [equipmentCategory, setEquipmentCategory] = useState<string>('all');
  const [chemicalCategory, setChemicalCategory] = useState<string>('all');

  const isEquipmentSelected = (id: string) => equipment.some(e => e.item.id === id);
  const isChemicalSelected = (id: string) => chemicals.some(c => c.item.id === id);

  const toggleEquipment = (item: typeof equipmentLibrary[0]) => {
    if (isEquipmentSelected(item.id)) {
      onEquipmentChange(equipment.filter(e => e.item.id !== item.id));
    } else {
      onEquipmentChange([...equipment, { item, quantity: 1 }]);
    }
  };

  const toggleChemical = (item: typeof chemicalLibrary[0]) => {
    if (isChemicalSelected(item.id)) {
      onChemicalsChange(chemicals.filter(c => c.item.id !== item.id));
    } else {
      onChemicalsChange([...chemicals, { item, quantity: '' }]);
    }
  };

  const updateEquipmentQuantity = (id: string, quantity: number) => {
    onEquipmentChange(equipment.map(e =>
      e.item.id === id ? { ...e, quantity: Math.max(1, quantity) } : e
    ));
  };

  const updateChemicalQuantity = (id: string, quantity: string) => {
    onChemicalsChange(chemicals.map(c =>
      c.item.id === id ? { ...c, quantity } : c
    ));
  };

  const filteredEquipment = equipmentLibrary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      item.description?.toLowerCase().includes(equipmentSearch.toLowerCase());
    const matchesCategory = equipmentCategory === 'all' || item.category === equipmentCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredChemicals = chemicalLibrary.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(chemicalSearch.toLowerCase()) ||
      item.formula.toLowerCase().includes(chemicalSearch.toLowerCase());
    const matchesCategory = chemicalCategory === 'all' || item.category === chemicalCategory;
    return matchesSearch && matchesCategory;
  });

  const equipmentCategories = ['all', ...getEquipmentCategories()];
  const chemicalCategories = ['all', ...getChemicalCategories()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Stack gap="lg">
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            background: settings.theme === 'light'
              ? 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)'
              : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
          }}
        >
          <Stack gap="lg">
            <Group gap="sm">
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: '#10B98120',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Beaker size={22} color="#10B981" />
              </div>
              <Stack gap={2}>
                <Text fw={700} size="lg">选择实验器材和药品</Text>
                <Text size="sm" c="dimmed">从内置库中选择需要的器材和药品，可自定义数量</Text>
              </Stack>
            </Group>

            <Tabs value={activeTab} onChange={(v) => setActiveTab(v as 'equipment' | 'chemicals')}>
              <Tabs.List grow>
                <Tabs.Tab value="equipment" leftSection={<FlaskConical size={16} />}>
                  器材 ({equipment.length})
                </Tabs.Tab>
                <Tabs.Tab value="chemicals" leftSection={<Beaker size={16} />}>
                  药品 ({chemicals.length})
                </Tabs.Tab>
              </Tabs.List>

              <AnimatePresence mode="wait">
                {activeTab === 'equipment' ? (
                  <motion.div
                    key="equipment"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Stack gap="md" mt="md">
                      <Group grow>
                        <Input
                          placeholder="搜索器材..."
                          leftSection={<Search size={16} />}
                          value={equipmentSearch}
                          onChange={(e) => setEquipmentSearch(e.currentTarget.value)}
                        />
                      </Group>

                      <ScrollArea h={40} scrollbarSize={4} type="never">
                        <Group gap="xs" wrap="nowrap">
                          {equipmentCategories.map(cat => (
                            <Chip
                              key={cat}
                              value={cat}
                              checked={equipmentCategory === cat}
                              onChange={() => setEquipmentCategory(cat)}
                              size="sm"
                              variant={equipmentCategory === cat ? 'filled' : 'outline'}
                              color="labBlue"
                            >
                              {cat === 'all' ? '全部' : cat}
                            </Chip>
                          ))}
                        </Group>
                      </ScrollArea>

                      <ScrollArea h={320} scrollbarSize={6}>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
                          {filteredEquipment.map((item, index) => {
                            const selected = isEquipmentSelected(item.id);
                            const selectedItem = equipment.find(e => e.item.id === item.id);

                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <Paper
                                  p="sm"
                                  radius="md"
                                  withBorder
                                  style={{
                                    borderColor: selected ? '#10B981' : undefined,
                                    background: selected
                                      ? (settings.theme === 'light' ? '#ECFDF5' : '#064E3B')
                                      : undefined,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onClick={() => toggleEquipment(item)}
                                >
                                  <Group justify="space-between" wrap="nowrap" mb="xs">
                                    <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                                      <Checkbox
                                        checked={selected}
                                        onChange={() => {}}
                                        size="sm"
                                        color="green"
                                      />
                                      <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                        <Text size="sm" fw={500} lineClamp={1}>{item.name}</Text>
                                        <Text size="xs" c="dimmed" lineClamp={1}>
                                          {item.category} {item.capacity ? `· ${item.capacity}` : ''}
                                        </Text>
                                      </Stack>
                                    </Group>
                                    {selected && <CheckCircle2 size={18} color="#10B981" />}
                                  </Group>

                                  {item.description && (
                                    <Text size="xs" c="dimmed" lineClamp={2}>{item.description}</Text>
                                  )}

                                  <AnimatePresence>
                                    {selected && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Group justify="space-between" mt="sm">
                                          <Text size="xs" c="dimmed">数量</Text>
                                          <Group gap="xs" onClick={(e) => e.stopPropagation()}>
                                            <Button
                                              size="xs"
                                              variant="subtle"
                                              color="gray"
                                              p={4}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                updateEquipmentQuantity(item.id, (selectedItem?.quantity || 1) - 1);
                                              }}
                                            >
                                              <Minus size={12} />
                                            </Button>
                                            <NumberInput
                                              size="xs"
                                              w={60}
                                              min={1}
                                              max={99}
                                              value={selectedItem?.quantity || 1}
                                              onChange={(val) => updateEquipmentQuantity(item.id, typeof val === 'number' ? val : 1)}
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                            <Button
                                              size="xs"
                                              variant="subtle"
                                              color="gray"
                                              p={4}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                updateEquipmentQuantity(item.id, (selectedItem?.quantity || 1) + 1);
                                              }}
                                            >
                                              <Plus size={12} />
                                            </Button>
                                          </Group>
                                        </Group>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Paper>
                              </motion.div>
                            );
                          })}
                        </SimpleGrid>
                      </ScrollArea>
                    </Stack>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chemicals"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Stack gap="md" mt="md">
                      <Group grow>
                        <Input
                          placeholder="搜索药品..."
                          leftSection={<Search size={16} />}
                          value={chemicalSearch}
                          onChange={(e) => setChemicalSearch(e.currentTarget.value)}
                        />
                      </Group>

                      <ScrollArea h={40} scrollbarSize={4} type="never">
                        <Group gap="xs" wrap="nowrap">
                          {chemicalCategories.map(cat => (
                            <Chip
                              key={cat}
                              value={cat}
                              checked={chemicalCategory === cat}
                              onChange={() => setChemicalCategory(cat)}
                              size="sm"
                              variant={chemicalCategory === cat ? 'filled' : 'outline'}
                              color="labBlue"
                            >
                              {cat === 'all' ? '全部' : cat}
                            </Chip>
                          ))}
                        </Group>
                      </ScrollArea>

                      <ScrollArea h={320} scrollbarSize={6}>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="sm">
                          {filteredChemicals.map((item, index) => {
                            const selected = isChemicalSelected(item.id);
                            const selectedItem = chemicals.find(c => c.item.id === item.id);

                            return (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                              >
                                <Paper
                                  p="sm"
                                  radius="md"
                                  withBorder
                                  style={{
                                    borderColor: selected ? '#10B981' : undefined,
                                    background: selected
                                      ? (settings.theme === 'light' ? '#ECFDF5' : '#064E3B')
                                      : undefined,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onClick={() => toggleChemical(item)}
                                >
                                  <Group justify="space-between" wrap="nowrap" mb="xs">
                                    <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                                      <Checkbox
                                        checked={selected}
                                        onChange={() => {}}
                                        size="sm"
                                        color="green"
                                      />
                                      <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                        <Group gap="xs" wrap="nowrap">
                                          <Text size="sm" fw={500} lineClamp={1}>{item.name}</Text>
                                          {item.hazard && (
                                            <Badge size="xs" color="red" variant="light">
                                              <AlertTriangle size={10} />
                                            </Badge>
                                          )}
                                        </Group>
                                        <Group gap="xs" wrap="nowrap">
                                          <Text
                                            size="xs"
                                            c="dimmed"
                                            style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                          >
                                            {item.formula}
                                          </Text>
                                          <Box
                                            w={12}
                                            h={12}
                                            style={{
                                              borderRadius: '50%',
                                              background: item.color || '#9CA3AF',
                                              border: '1px solid #E5E7EB'
                                            }}
                                          />
                                        </Group>
                                      </Stack>
                                    </Group>
                                    {selected && <CheckCircle2 size={18} color="#10B981" />}
                                  </Group>

                                  {item.description && (
                                    <Text size="xs" c="dimmed" lineClamp={2}>{item.description}</Text>
                                  )}

                                  <AnimatePresence>
                                    {selected && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Group justify="space-between" mt="sm">
                                          <Text size="xs" c="dimmed">用量</Text>
                                          <TextInput
                                            size="xs"
                                            w={100}
                                            placeholder="如: 5g"
                                            value={selectedItem?.quantity || ''}
                                            onChange={(e) => updateChemicalQuantity(item.id, e.currentTarget.value)}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </Group>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Paper>
                              </motion.div>
                            );
                          })}
                        </SimpleGrid>
                      </ScrollArea>
                    </Stack>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </Stack>
        </Paper>

        {(equipment.length > 0 || chemicals.length > 0) && (
          <Paper p="md" radius="md" withBorder>
            <Stack gap="sm">
              <Text fw={600} size="sm">已选择</Text>
              <Group gap="xs" wrap="wrap">
                {equipment.map(e => (
                  <Badge key={e.item.id} color="labBlue" size="md" radius="sm">
                    {e.item.name} {e.quantity > 1 ? `× ${e.quantity}` : ''}
                  </Badge>
                ))}
                {chemicals.map(c => (
                  <Badge key={c.item.id} color="pink" size="md" radius="sm">
                    {c.item.name} {c.quantity ? `(${c.quantity})` : ''}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Paper>
        )}
      </Stack>
    </motion.div>
  );
};
