export interface LibraryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
}

export interface ChemicalItem extends LibraryItem {
  formula: string;
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  color?: string;
  hazard?: string;
}

export interface EquipmentItem extends LibraryItem {
  type: 'glassware' | 'heating' | 'measurement' | 'support' | 'other';
  capacity?: string;
}

export const equipmentLibrary: EquipmentItem[] = [
  { id: 'eq-beaker-100', name: '烧杯 (100mL)', category: '玻璃器皿', type: 'glassware', capacity: '100mL', icon: 'beaker' },
  { id: 'eq-beaker-250', name: '烧杯 (250mL)', category: '玻璃器皿', type: 'glassware', capacity: '250mL', icon: 'beaker' },
  { id: 'eq-beaker-500', name: '烧杯 (500mL)', category: '玻璃器皿', type: 'glassware', capacity: '500mL', icon: 'beaker' },
  { id: 'eq-flask-conical-100', name: '锥形瓶 (100mL)', category: '玻璃器皿', type: 'glassware', capacity: '100mL', icon: 'flask-conical' },
  { id: 'eq-flask-conical-250', name: '锥形瓶 (250mL)', category: '玻璃器皿', type: 'glassware', capacity: '250mL', icon: 'flask-conical' },
  { id: 'eq-test-tube', name: '试管', category: '玻璃器皿', type: 'glassware', icon: 'test-tube' },
  { id: 'eq-test-tube-rack', name: '试管架', category: '玻璃器皿', type: 'glassware', icon: 'test-tube' },
  { id: 'eq-glass-rod', name: '玻璃棒', category: '玻璃器皿', type: 'glassware', icon: 'minus' },
  { id: 'eq-dropper', name: '胶头滴管', category: '玻璃器皿', type: 'glassware', icon: 'pipette' },
  { id: 'eq-funnel', name: '漏斗', category: '玻璃器皿', type: 'glassware', icon: 'filter' },
  { id: 'eq-alcohol-lamp', name: '酒精灯', category: '加热设备', type: 'heating', icon: 'flame' },
  { id: 'eq-bunsen-burner', name: '本生灯', category: '加热设备', type: 'heating', icon: 'flame' },
  { id: 'eq-stand', name: '铁架台', category: '支撑设备', type: 'support', icon: 'align-vertical-space-around' },
  { id: 'eq-clamp', name: '铁夹', category: '支撑设备', type: 'support', icon: 'grip' },
  { id: 'eq-ring', name: '铁圈', category: '支撑设备', type: 'support', icon: 'circle' },
  { id: 'eq-tripod', name: '三脚架', category: '支撑设备', type: 'support', icon: 'triangle' },
  { id: 'eq-wire-gauze', name: '石棉网', category: '支撑设备', type: 'support', icon: 'grid-3x3' },
  { id: 'eq-thermometer', name: '温度计', category: '测量仪器', type: 'measurement', icon: 'thermometer' },
  { id: 'eq-ph-meter', name: 'pH计', category: '测量仪器', type: 'measurement', icon: 'gauge' },
  { id: 'eq-balance', name: '电子天平', category: '测量仪器', type: 'measurement', icon: 'scale' },
  { id: 'eq-graduated-cylinder-10', name: '量筒 (10mL)', category: '测量仪器', type: 'measurement', capacity: '10mL', icon: 'ruler' },
  { id: 'eq-graduated-cylinder-50', name: '量筒 (50mL)', category: '测量仪器', type: 'measurement', capacity: '50mL', icon: 'ruler' },
  { id: 'eq-graduated-cylinder-100', name: '量筒 (100mL)', category: '测量仪器', type: 'measurement', capacity: '100mL', icon: 'ruler' },
  { id: 'eq-pipette', name: '移液管', category: '测量仪器', type: 'measurement', icon: 'pipette' },
  { id: 'eq-burette', name: '滴定管', category: '测量仪器', type: 'measurement', icon: 'arrow-big-down' },
  { id: 'eq-water-trough', name: '水槽', category: '其他', type: 'other', icon: 'waves' },
  { id: 'eq-gas-collecting-bottle', name: '集气瓶', category: '其他', type: 'other', icon: 'bottle' },
  { id: 'eq-glass-plate', name: '玻璃片', category: '其他', type: 'other', icon: 'square' },
  { id: 'eq-spatula', name: '药匙', category: '其他', type: 'other', icon: 'spoon' },
  { id: 'eq-crucible-tongs', name: '坩埚钳', category: '其他', type: 'other', icon: 'grip-horizontal' },
  { id: 'eq-morter-pestle', name: '研钵和研杵', category: '其他', type: 'other', icon: 'bowl' },
  { id: 'eq-wash-bottle', name: '洗瓶', category: '其他', type: 'other', icon: 'droplet' },
  { id: 'eq-watch-glass', name: '表面皿', category: '其他', type: 'other', icon: 'circle-dot' },
  { id: 'evaporating-dish', name: '蒸发皿', category: '其他', type: 'other', icon: 'disc' },
  { id: 'cotton', name: '棉花', category: '其他', type: 'other', icon: 'cloud' },
];

export const chemicalLibrary: ChemicalItem[] = [
  { id: 'ch-kmno4', name: '高锰酸钾', formula: 'KMnO₄', state: 'solid', color: '#7C3AED', category: '氧化剂', description: '强氧化剂，暗紫色晶体' },
  { id: 'ch-hcl', name: '盐酸', formula: 'HCl', state: 'aqueous', color: '#EF4444', category: '酸', hazard: '腐蚀性', description: '无色透明液体，有刺激性气味' },
  { id: 'ch-h2so4', name: '稀硫酸', formula: 'H₂SO₄', state: 'aqueous', color: '#F59E0B', category: '酸', hazard: '腐蚀性', description: '无色透明液体' },
  { id: 'ch-h2so4-conc', name: '浓硫酸', formula: 'H₂SO₄', state: 'liquid', color: '#B45309', category: '酸', hazard: '强腐蚀性', description: '无色粘稠油状液体' },
  { id: 'ch-naoh', name: '氢氧化钠', formula: 'NaOH', state: 'aqueous', color: '#3B82F6', category: '碱', hazard: '腐蚀性', description: '无色透明溶液' },
  { id: 'ch-naoh-solid', name: '氢氧化钠固体', formula: 'NaOH', state: 'solid', color: '#60A5FA', category: '碱', hazard: '腐蚀性', description: '白色片状固体' },
  { id: 'ch-caco3', name: '碳酸钙', formula: 'CaCO₃', state: 'solid', color: '#F3F4F6', category: '盐', description: '白色粉末或块状（大理石）' },
  { id: 'ch-nacl', name: '氯化钠', formula: 'NaCl', state: 'solid', color: '#FFFFFF', category: '盐', description: '白色晶体' },
  { id: 'ch-cuso4', name: '硫酸铜', formula: 'CuSO₄', state: 'solid', color: '#F59E0B', category: '盐', description: '白色粉末（无水）' },
  { id: 'ch-cuso4-5h2o', name: '五水硫酸铜', formula: 'CuSO₄·5H₂O', state: 'solid', color: '#3B82F6', category: '盐', description: '蓝色晶体，俗称蓝矾' },
  { id: 'ch-agno3', name: '硝酸银', formula: 'AgNO₃', state: 'aqueous', color: '#E5E7EB', category: '盐', description: '无色透明溶液' },
  { id: 'ch-bacl2', name: '氯化钡', formula: 'BaCl₂', state: 'aqueous', color: '#D1D5DB', category: '盐', hazard: '有毒', description: '无色透明溶液' },
  { id: 'ch-na2co3', name: '碳酸钠', formula: 'Na₂CO₃', state: 'solid', color: '#F9FAFB', category: '盐', description: '白色粉末，俗称纯碱' },
  { id: 'ch-na2co3-sol', name: '碳酸钠溶液', formula: 'Na₂CO₃', state: 'aqueous', color: '#F9FAFB', category: '盐', description: '无色透明溶液' },
  { id: 'ch-nahco3', name: '碳酸氢钠', formula: 'NaHCO₃', state: 'solid', color: '#FAFAFA', category: '盐', description: '白色晶体，俗称小苏打' },
  { id: 'ch-fephenanthroline', name: '硫酸亚铁', formula: 'FeSO₄', state: 'aqueous', color: '#84CC16', category: '盐', description: '浅绿色溶液' },
  { id: 'ch-fecl3', name: '氯化铁', formula: 'FeCl₃', state: 'aqueous', color: '#DC2626', category: '盐', description: '黄色溶液' },
  { id: 'ch-cucl2', name: '氯化铜', formula: 'CuCl₂', state: 'aqueous', color: '#06B6D4', category: '盐', description: '蓝色溶液' },
  { id: 'ch-mg', name: '镁条', formula: 'Mg', state: 'solid', color: '#D1D5DB', category: '金属', description: '银白色金属' },
  { id: 'ch-zn', name: '锌粒', formula: 'Zn', state: 'solid', color: '#9CA3AF', category: '金属', description: '银白色金属' },
  { id: 'ch-fe', name: '铁钉', formula: 'Fe', state: 'solid', color: '#6B7280', category: '金属', description: '灰白色金属' },
  { id: 'ch-cu', name: '铜片', formula: 'Cu', state: 'solid', color: '#B45309', category: '金属', description: '紫红色金属' },
  { id: 'ch-al', name: '铝片', formula: 'Al', state: 'solid', color: '#E5E7EB', category: '金属', description: '银白色金属' },
  { id: 'ch-h2o', name: '蒸馏水', formula: 'H₂O', state: 'liquid', color: '#60A5FA', category: '其他', description: '纯净的水' },
  { id: 'ch-h2o2', name: '过氧化氢', formula: 'H₂O₂', state: 'aqueous', color: '#A78BFA', category: '氧化物', description: '无色透明溶液' },
  { id: 'ch-mno2', name: '二氧化锰', formula: 'MnO₂', state: 'solid', color: '#1F2937', category: '氧化物', description: '黑色粉末' },
  { id: 'ch-cao', name: '氧化钙', formula: 'CaO', state: 'solid', color: '#F5F5F4', category: '氧化物', description: '白色固体，俗称生石灰' },
  { id: 'ch-ca-oh-2', name: '氢氧化钙', formula: 'Ca(OH)₂', state: 'aqueous', color: '#D1D5DB', category: '碱', description: '澄清石灰水' },
  { id: 'ch-phenolphthalein', name: '酚酞试液', formula: 'C₂₀H₁₄O₄', state: 'liquid', color: '#EC4899', category: '指示剂', description: '无色透明液体，遇碱变红' },
  { id: 'ch-litmus', name: '石蕊试液', formula: '', state: 'liquid', color: '#8B5CF6', category: '指示剂', description: '紫色溶液' },
  { id: 'ch-methyl-orange', name: '甲基橙', formula: '', state: 'liquid', color: '#F59E0B', category: '指示剂', description: '橙色溶液' },
  { id: 'ch-starch', name: '淀粉溶液', formula: '', state: 'aqueous', color: '#FEF3C7', category: '其他', description: '白色浑浊液' },
  { id: 'ch-iodine', name: '碘水', formula: 'I₂', state: 'aqueous', color: '#78350F', category: '单质', description: '棕黄色溶液' },
  { id: 'ch-ethanol', name: '乙醇', formula: 'C₂H₅OH', state: 'liquid', color: '#F9FAFB', category: '有机物', hazard: '易燃', description: '无色透明液体，有特殊气味' },
  { id: 'ch-acetic-acid', name: '乙酸', formula: 'CH₃COOH', state: 'liquid', color: '#FDE68A', category: '有机物', description: '无色液体，有刺激性气味' },
  { id: 'ch-glucose', name: '葡萄糖', formula: 'C₆H₁₂O₆', state: 'solid', color: '#FFFFFF', category: '有机物', description: '白色晶体' },
  { id: 'ch-copper-sulfate', name: '硫酸铜溶液', formula: 'CuSO₄', state: 'aqueous', color: '#0EA5E9', category: '盐', description: '蓝色透明溶液' },
];

export const animationTypes = [
  { value: 'idle', label: '静止', description: '无动画效果' },
  { value: 'heating', label: '加热', description: '显示加热效果' },
  { value: 'mixing', label: '搅拌', description: '显示搅拌混合效果' },
  { value: 'pouring', label: '倾倒', description: '显示倾倒液体效果' },
  { value: 'bubbling', label: '气泡', description: '显示气泡产生效果' },
  { value: 'reaction', label: '反应', description: '显示化学反应效果' },
] as const;

export const getEquipmentById = (id: string): EquipmentItem | undefined => {
  return equipmentLibrary.find(item => item.id === id);
};

export const getChemicalById = (id: string): ChemicalItem | undefined => {
  return chemicalLibrary.find(item => item.id === id);
};

export const getEquipmentCategories = (): string[] => {
  return Array.from(new Set(equipmentLibrary.map(item => item.category)));
};

export const getChemicalCategories = (): string[] => {
  return Array.from(new Set(chemicalLibrary.map(item => item.category)));
};
