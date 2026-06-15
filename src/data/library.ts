export interface LibraryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon?: string;
}

export interface PhysicalProperties {
  density?: string;
  meltingPoint?: string;
  boilingPoint?: string;
  solubility?: string;
  odor?: string;
}

export interface ChemicalProperties {
  reactionTypes?: string[];
  commonEquations?: {
    equation: string;
    description: string;
  }[];
}

export interface SafetyInfo {
  hazardLevel?: 'low' | 'medium' | 'high';
  hazardSymbols?: string[];
  safetyTips?: string[];
  spillTreatment?: string;
  ingestionTreatment?: string;
  skinContactTreatment?: string;
  eyeContactTreatment?: string;
  storageRequirements?: string;
}

export interface ChemicalItem extends LibraryItem {
  formula: string;
  englishName?: string;
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  color?: string;
  hazard?: string;
  physicalProperties?: PhysicalProperties;
  chemicalProperties?: ChemicalProperties;
  safetyInfo?: SafetyInfo;
  uses?: {
    industrial?: string[];
    laboratory?: string[];
    daily?: string[];
    medical?: string[];
  };
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
  {
    id: 'ch-kmno4', name: '高锰酸钾', englishName: 'Potassium Permanganate', formula: 'KMnO₄', state: 'solid', color: '#7C3AED', category: '氧化剂', description: '强氧化剂，暗紫色晶体',
    physicalProperties: { density: '2.7 g/cm³', meltingPoint: '240°C (分解)', solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['分解反应', '氧化还原反应'],
      commonEquations: [
        { equation: '2KMnO₄ →(加热) K₂MnO₄ + MnO₂ + O₂↑', description: '加热分解制取氧气' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['氧化剂', '刺激性'],
      safetyTips: ['避免与还原剂接触', '避免皮肤直接接触', '使用时戴手套'],
      spillTreatment: '用大量水冲洗，收集残留物',
      skinContactTreatment: '立即用大量清水冲洗至少15分钟',
      eyeContactTreatment: '用大量清水冲洗，必要时就医',
      storageRequirements: '阴凉干燥处，与还原剂、易燃物分开存放'
    },
    uses: {
      laboratory: ['制取氧气', '氧化剂', '消毒剂'],
      industrial: ['水处理消毒剂', '漂白剂', '医药防腐剂'],
      daily: ['皮肤消毒', '口腔消毒（稀释后）']
    }
  },
  {
    id: 'ch-hcl', name: '盐酸', englishName: 'Hydrochloric Acid', formula: 'HCl', state: 'aqueous', color: '#EF4444', category: '酸', hazard: '腐蚀性', description: '无色透明液体，有刺激性气味',
    physicalProperties: { density: '1.18 g/cm³ (浓)', boilingPoint: '108.6°C (20.2%)', solubility: '与水任意比例互溶', odor: '刺激性气味' },
    chemicalProperties: {
      reactionTypes: ['中和反应', '复分解反应', '置换反应'],
      commonEquations: [
        { equation: 'HCl + NaOH → NaCl + H₂O', description: '与氢氧化钠中和反应' },
        { equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑', description: '与碳酸钙反应制取二氧化碳' },
        { equation: 'Zn + 2HCl → ZnCl₂ + H₂↑', description: '与锌反应制取氢气' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'high',
      hazardSymbols: ['腐蚀性', '刺激性'],
      safetyTips: ['佩戴护目镜和防护手套', '在通风橱中操作', '避免接触皮肤和眼睛'],
      spillTreatment: '用大量水冲洗，可用碳酸氢钠溶液中和',
      ingestionTreatment: '立即漱口，不要催吐，喝牛奶或水，就医',
      skinContactTreatment: '立即用大量清水冲洗至少15分钟，脱去污染衣物',
      eyeContactTreatment: '用大量清水冲洗至少15分钟，立即就医',
      storageRequirements: '阴凉通风处，与碱类、活泼金属分开存放'
    },
    uses: {
      laboratory: ['酸化剂', '制取气体', '调节pH值'],
      industrial: ['金属除锈', '制造氯化物', '食品添加剂（食用级）'],
      daily: ['洁厕剂（稀释）', '水垢清除']
    }
  },
  {
    id: 'ch-h2so4', name: '稀硫酸', englishName: 'Dilute Sulfuric Acid', formula: 'H₂SO₄', state: 'aqueous', color: '#F59E0B', category: '酸', hazard: '腐蚀性', description: '无色透明液体',
    physicalProperties: { density: '约1.1-1.2 g/cm³', solubility: '与水任意比例互溶' },
    chemicalProperties: {
      reactionTypes: ['中和反应', '复分解反应', '置换反应'],
      commonEquations: [
        { equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', description: '与氢氧化钠中和反应' },
        { equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑', description: '与锌反应制取氢气' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性'],
      safetyTips: ['佩戴护目镜和手套', '稀释时酸加入水中，不可反过来'],
      spillTreatment: '用大量水冲洗，可用碳酸钠中和',
      skinContactTreatment: '用大量清水冲洗',
      eyeContactTreatment: '用大量清水冲洗，就医',
      storageRequirements: '阴凉处，密封保存'
    },
    uses: {
      laboratory: ['酸化剂', '电解质（电解水）', '干燥剂（浓硫酸）'],
      industrial: ['制造化肥', '金属酸洗', '石油精炼']
    }
  },
  {
    id: 'ch-h2so4-conc', name: '浓硫酸', englishName: 'Concentrated Sulfuric Acid', formula: 'H₂SO₄', state: 'liquid', color: '#B45309', category: '酸', hazard: '强腐蚀性', description: '无色粘稠油状液体',
    physicalProperties: { density: '1.84 g/cm³ (98%)', boilingPoint: '337°C', solubility: '与水任意比例互溶，放出大量热', odor: '无味' },
    chemicalProperties: {
      reactionTypes: ['脱水反应', '氧化反应', '磺化反应'],
      commonEquations: [
        { equation: 'C₁₂H₂₂O₁₁ →(浓H₂SO₄) 12C + 11H₂O', description: '使蔗糖脱水碳化' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'high',
      hazardSymbols: ['强腐蚀性', '氧化剂'],
      safetyTips: ['穿戴全套防护装备', '稀释时将酸缓慢倒入水中并搅拌', '绝对不可将水倒入酸中'],
      spillTreatment: '用干燥沙土覆盖，再用大量水冲洗',
      ingestionTreatment: '立即喝大量牛奶或水，不要催吐，立即就医',
      skinContactTreatment: '先用干布擦去，再用大量清水冲洗至少15分钟',
      eyeContactTreatment: '用大量清水冲洗至少30分钟，立即就医',
      storageRequirements: '阴凉通风，密封，与有机物、还原剂、碱类分开存放'
    },
    uses: {
      laboratory: ['干燥剂', '脱水剂', '催化剂'],
      industrial: ['化工原料', '金属表面处理', '蓄电池电解液']
    }
  },
  {
    id: 'ch-naoh', name: '氢氧化钠', englishName: 'Sodium Hydroxide', formula: 'NaOH', state: 'aqueous', color: '#3B82F6', category: '碱', hazard: '腐蚀性', description: '无色透明溶液',
    physicalProperties: { density: '约1.1-1.5 g/cm³（视浓度）', solubility: '完全互溶' },
    chemicalProperties: {
      reactionTypes: ['中和反应', '复分解反应'],
      commonEquations: [
        { equation: 'NaOH + HCl → NaCl + H₂O', description: '与盐酸中和反应' },
        { equation: '2NaOH + CO₂ → Na₂CO₃ + H₂O', description: '吸收二氧化碳' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'high',
      hazardSymbols: ['腐蚀性'],
      safetyTips: ['佩戴护目镜和手套', '避免接触皮肤'],
      spillTreatment: '用大量水冲洗，可用稀醋酸中和',
      skinContactTreatment: '用大量清水冲洗至少15分钟',
      eyeContactTreatment: '用大量清水冲洗，立即就医',
      storageRequirements: '密封，避免接触空气和二氧化碳'
    },
    uses: {
      laboratory: ['中和剂', '制肥皂', '洗涤剂'],
      industrial: ['造纸', '制皂', '石油精炼', '水处理'],
      daily: ['下水道疏通剂', '清洁剂（苛性钠）']
    }
  },
  {
    id: 'ch-naoh-solid', name: '氢氧化钠固体', englishName: 'Sodium Hydroxide Solid', formula: 'NaOH', state: 'solid', color: '#60A5FA', category: '碱', hazard: '腐蚀性', description: '白色片状固体，俗称烧碱、火碱、苛性钠',
    physicalProperties: { density: '2.13 g/cm³', meltingPoint: '318°C', boilingPoint: '1388°C', solubility: '极易溶于水，放出大量热' },
    chemicalProperties: {
      reactionTypes: ['中和反应', '潮解', '与酸性氧化物反应'],
      commonEquations: [
        { equation: '2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O', description: '与硫酸中和反应' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'high',
      hazardSymbols: ['强腐蚀性', '刺激性'],
      safetyTips: ['操作时戴护目镜和橡胶手套', '避免皮肤直接接触', '注意防潮'],
      spillTreatment: '用干沙或惰性吸附剂收集，再用大量水冲洗',
      skinContactTreatment: '立即用大量清水冲洗至少15分钟',
      eyeContactTreatment: '用大量清水持续冲洗，立即就医',
      storageRequirements: '密封干燥，与酸类、铵盐分开存放'
    },
    uses: {
      laboratory: ['配制标准碱溶液', '干燥剂'],
      industrial: ['造纸漂白', '人造纤维', '生产洗涤剂'],
      daily: ['强力清洁剂']
    }
  },
  {
    id: 'ch-caco3', name: '碳酸钙', englishName: 'Calcium Carbonate', formula: 'CaCO₃', state: 'solid', color: '#F3F4F6', category: '盐', description: '白色粉末或块状（大理石、石灰石的主要成分）',
    physicalProperties: { density: '2.71 g/cm³', meltingPoint: '825°C（分解）', solubility: '几乎不溶于水' },
    chemicalProperties: {
      reactionTypes: ['分解反应', '与酸反应'],
      commonEquations: [
        { equation: 'CaCO₃ →(高温) CaO + CO₂↑', description: '高温分解生成氧化钙' },
        { equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑', description: '与盐酸反应制取二氧化碳' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: ['刺激性（粉尘）'],
      safetyTips: ['避免吸入粉尘', '操作时戴口罩'],
      spillTreatment: '清扫收集即可',
      skinContactTreatment: '用水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥处，与酸类分开存放'
    },
    uses: {
      laboratory: ['制取二氧化碳', '钙盐制备'],
      industrial: ['水泥原料', '炼铁熔剂', '造纸填料'],
      daily: ['牙膏磨擦剂', '钙片', '抗酸药']
    }
  },
  {
    id: 'ch-nacl', name: '氯化钠', englishName: 'Sodium Chloride', formula: 'NaCl', state: 'solid', color: '#FFFFFF', category: '盐', description: '白色晶体，俗称食盐',
    physicalProperties: { density: '2.165 g/cm³', meltingPoint: '801°C', boilingPoint: '1413°C', solubility: '36 g/100mL (20°C)' },
    chemicalProperties: {
      reactionTypes: ['电解反应', '与银盐沉淀反应'],
      commonEquations: [
        { equation: '2NaCl + 2H₂O →(电解) 2NaOH + H₂↑ + Cl₂↑', description: '电解饱和食盐水' },
        { equation: 'NaCl + AgNO₃ → AgCl↓ + NaNO₃', description: '与硝酸银生成白色沉淀' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['避免大量摄入'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封干燥保存'
    },
    uses: {
      laboratory: ['制备氯气', '配置生理盐水', '盐析剂'],
      industrial: ['氯碱工业原料', '食品调味', '融雪剂'],
      daily: ['食盐调味', '腌制食品']
    }
  },
  {
    id: 'ch-cuso4', name: '硫酸铜', englishName: 'Copper Sulfate', formula: 'CuSO₄', state: 'solid', color: '#F59E0B', category: '盐', description: '白色粉末（无水）',
    physicalProperties: { density: '3.6 g/cm³', meltingPoint: '650°C (分解)', solubility: '可溶于水' },
    chemicalProperties: {
      reactionTypes: ['水合反应', '置换反应'],
      commonEquations: [
        { equation: 'CuSO₄ + 5H₂O → CuSO₄·5H₂O', description: '与水结合生成蓝色晶体' },
        { equation: 'Fe + CuSO₄ → FeSO₄ + Cu', description: '铁置换铜' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['有害'],
      safetyTips: ['避免误食', '避免皮肤长期接触'],
      spillTreatment: '用水冲洗',
      ingestionTreatment: '喝牛奶或蛋清，就医',
      skinContactTreatment: '用水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥密封保存'
    },
    uses: {
      laboratory: ['检验水的存在', '制备铜化合物', '电镀液'],
      industrial: ['电镀', '农药（波尔多液）', '选矿'],
      daily: ['游泳池消毒', '除藻剂']
    }
  },
  {
    id: 'ch-cuso4-5h2o', name: '五水硫酸铜', englishName: 'Copper Sulfate Pentahydrate', formula: 'CuSO₄·5H₂O', state: 'solid', color: '#3B82F6', category: '盐', description: '蓝色晶体，俗称蓝矾、胆矾',
    physicalProperties: { density: '2.28 g/cm³', meltingPoint: '110°C (失去结晶水)', solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['分解反应', '脱水反应'],
      commonEquations: [
        { equation: 'CuSO₄·5H₂O →(加热) CuSO₄ + 5H₂O', description: '加热失去结晶水变为白色' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['有害'],
      safetyTips: ['避免误食', '避免儿童接触'],
      spillTreatment: '清扫并用水冲洗',
      ingestionTreatment: '喝牛奶或蛋清，就医',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封保存'
    },
    uses: {
      laboratory: ['晶体结晶实验', '铜的来源'],
      industrial: ['农业杀菌剂', '印染媒染剂'],
      daily: ['蓝色颜料', '水族除藻']
    }
  },
  {
    id: 'ch-agno3', name: '硝酸银', englishName: 'Silver Nitrate', formula: 'AgNO₃', state: 'aqueous', color: '#E5E7EB', category: '盐', description: '无色透明溶液',
    physicalProperties: { solubility: '极易溶于水' },
    chemicalProperties: {
      reactionTypes: ['沉淀反应', '分解反应（见光）'],
      commonEquations: [
        { equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃', description: '检验氯离子，生成白色沉淀' },
        { equation: '2AgNO₃ →(光照) 2Ag + 2NO₂↑ + O₂↑', description: '见光分解' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性', '氧化剂'],
      safetyTips: ['避免皮肤接触（会留下黑色银斑）', '用棕色瓶保存，避光'],
      spillTreatment: '用硫代硫酸钠溶液处理后再用水冲洗',
      skinContactTreatment: '用硫代硫酸钠溶液清洗',
      eyeContactTreatment: '用大量清水冲洗',
      storageRequirements: '棕色瓶，避光，阴凉处'
    },
    uses: {
      laboratory: ['检验卤素离子', '银镜反应'],
      industrial: ['镀银', '医药（烧伤）', '感光材料'],
      daily: ['消毒（稀溶液）']
    }
  },
  {
    id: 'ch-bacl2', name: '氯化钡', englishName: 'Barium Chloride', formula: 'BaCl₂', state: 'aqueous', color: '#D1D5DB', category: '盐', hazard: '有毒', description: '无色透明溶液',
    physicalProperties: { solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['沉淀反应'],
      commonEquations: [
        { equation: 'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl', description: '检验硫酸根离子，生成白色沉淀' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'high',
      hazardSymbols: ['有毒'],
      safetyTips: ['绝对不可误食', '操作时戴手套'],
      spillTreatment: '用硫酸钠溶液处理（生成无毒的硫酸钡），再用水冲洗',
      ingestionTreatment: '立即喝硫酸钠或硫酸镁溶液，催吐，就医',
      skinContactTreatment: '用大量清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封，单独存放，标识明显'
    },
    uses: {
      laboratory: ['检验硫酸根离子'],
      industrial: ['染料工业', '制造钡盐', '皮革鞣制']
    }
  },
  {
    id: 'ch-na2co3', name: '碳酸钠', englishName: 'Sodium Carbonate', formula: 'Na₂CO₃', state: 'solid', color: '#F9FAFB', category: '盐', description: '白色粉末，俗称纯碱、苏打',
    physicalProperties: { density: '2.53 g/cm³', meltingPoint: '851°C', solubility: '易溶于水，溶液呈碱性' },
    chemicalProperties: {
      reactionTypes: ['与酸反应', '水解反应', '复分解反应'],
      commonEquations: [
        { equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑', description: '与盐酸反应放出二氧化碳' },
        { equation: 'Na₂CO₃ + Ca(OH)₂ → CaCO₃↓ + 2NaOH', description: '与石灰水制取烧碱' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: ['刺激性'],
      safetyTips: ['避免吸入粉尘', '溶液有碱性，避免长期接触'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥通风，防潮'
    },
    uses: {
      laboratory: ['制备氢氧化钠', '中和酸', '洗涤剂'],
      industrial: ['玻璃制造', '造纸', '洗涤剂', '食品发酵'],
      daily: ['面食制作（食用碱）', '油污清洁剂']
    }
  },
  {
    id: 'ch-na2co3-sol', name: '碳酸钠溶液', englishName: 'Sodium Carbonate Solution', formula: 'Na₂CO₃', state: 'aqueous', color: '#F9FAFB', category: '盐', description: '无色透明溶液，呈碱性',
    physicalProperties: { solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['水解反应呈碱性', '与酸反应'],
      commonEquations: [
        { equation: 'CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻', description: '碳酸根水解使溶液呈碱性' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: ['刺激性'],
      safetyTips: ['避免接触眼睛'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封保存'
    },
    uses: {
      laboratory: ['碱性调节剂', '沉淀剂'],
      daily: ['洗涤油污']
    }
  },
  {
    id: 'ch-nahco3', name: '碳酸氢钠', englishName: 'Sodium Bicarbonate', formula: 'NaHCO₃', state: 'solid', color: '#FAFAFA', category: '盐', description: '白色晶体，俗称小苏打',
    physicalProperties: { density: '2.20 g/cm³', meltingPoint: '50°C (分解)', solubility: '可溶于水' },
    chemicalProperties: {
      reactionTypes: ['分解反应', '与酸反应'],
      commonEquations: [
        { equation: '2NaHCO₃ →(加热) Na₂CO₃ + H₂O + CO₂↑', description: '加热分解' },
        { equation: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑', description: '与酸快速反应' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['避免大量摄入（可能导致碱中毒）'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥密封保存'
    },
    uses: {
      laboratory: ['二氧化碳发生剂', '缓冲溶液'],
      industrial: ['食品发酵', '灭火器', '清洁剂'],
      daily: ['烘焙膨松剂', '胃酸中和剂', '清洁去污']
    }
  },
  {
    id: 'ch-fephenanthroline', name: '硫酸亚铁', englishName: 'Ferrous Sulfate', formula: 'FeSO₄', state: 'aqueous', color: '#84CC16', category: '盐', description: '浅绿色溶液',
    physicalProperties: { solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['氧化反应', '置换反应'],
      commonEquations: [
        { equation: 'Fe + CuSO₄ → FeSO₄ + Cu', description: '铁与硫酸铜置换反应' },
        { equation: '12FeSO₄ + 3O₂ + 6H₂O → 4Fe₂(SO₄)₃ + 4Fe(OH)₃↓', description: '被空气氧化变黄' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: ['刺激性'],
      safetyTips: ['避免皮肤接触'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封，避免氧化'
    },
    uses: {
      laboratory: ['还原剂', '铁化合物制备'],
      industrial: ['净水剂', '媒染剂', '饲料添加剂（补铁）'],
      daily: ['补铁剂（药用）']
    }
  },
  {
    id: 'ch-fecl3', name: '氯化铁', englishName: 'Ferric Chloride', formula: 'FeCl₃', state: 'aqueous', color: '#DC2626', category: '盐', description: '黄色（棕黄色）溶液',
    physicalProperties: { solubility: '易溶于水，溶液呈酸性' },
    chemicalProperties: {
      reactionTypes: ['水解反应', '氧化反应'],
      commonEquations: [
        { equation: 'Fe³⁺ + 3H₂O ⇌ Fe(OH)₃ + 3H⁺', description: '水解使溶液呈酸性' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性'],
      safetyTips: ['避免皮肤接触', '戴手套操作'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用大量清水冲洗',
      eyeContactTreatment: '用清水冲洗，就医',
      storageRequirements: '密封，防潮'
    },
    uses: {
      laboratory: ['检验苯酚（显色）', '氧化剂'],
      industrial: ['电路板蚀刻', '净水絮凝剂', '印刷电路板']
    }
  },
  {
    id: 'ch-cucl2', name: '氯化铜', englishName: 'Copper Chloride', formula: 'CuCl₂', state: 'aqueous', color: '#06B6D4', category: '盐', description: '蓝色（稀）或绿色（浓）溶液',
    physicalProperties: { solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['置换反应', '电解反应'],
      commonEquations: [
        { equation: 'Fe + CuCl₂ → FeCl₂ + Cu', description: '铁置换铜' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['有害'],
      safetyTips: ['避免误食', '避免皮肤长期接触'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封保存'
    },
    uses: {
      laboratory: ['铜源', '催化剂'],
      industrial: ['电镀铜', '颜料', '木材防腐']
    }
  },
  {
    id: 'ch-mg', name: '镁条', englishName: 'Magnesium', formula: 'Mg', state: 'solid', color: '#D1D5DB', category: '金属', description: '银白色金属',
    physicalProperties: { density: '1.74 g/cm³', meltingPoint: '650°C', boilingPoint: '1090°C', solubility: '不溶于水' },
    chemicalProperties: {
      reactionTypes: ['燃烧反应', '置换反应', '与酸反应'],
      commonEquations: [
        { equation: '2Mg + O₂ →(点燃) 2MgO', description: '在空气中燃烧，发出耀眼白光' },
        { equation: 'Mg + 2HCl → MgCl₂ + H₂↑', description: '与盐酸反应放出氢气' },
        { equation: '2Mg + CO₂ →(点燃) 2MgO + C', description: '在二氧化碳中燃烧' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['易燃'],
      safetyTips: ['远离火源', '燃烧时不能用水和CO₂灭火，用沙土覆盖'],
      spillTreatment: '用沙土覆盖灭火',
      skinContactTreatment: '一般无刺激，用清水冲洗即可',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '远离火源和氧化剂，干燥处存放'
    },
    uses: {
      laboratory: ['燃烧实验', '还原剂', '制取氢气'],
      industrial: ['镁合金（航空航天）', '烟火', '照明弹', '脱硫剂'],
      daily: ['合金制品']
    }
  },
  {
    id: 'ch-zn', name: '锌粒', englishName: 'Zinc', formula: 'Zn', state: 'solid', color: '#9CA3AF', category: '金属', description: '银白色金属，略带蓝色',
    physicalProperties: { density: '7.14 g/cm³', meltingPoint: '420°C', boilingPoint: '907°C', solubility: '不溶于水' },
    chemicalProperties: {
      reactionTypes: ['置换反应', '与酸反应'],
      commonEquations: [
        { equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑', description: '与稀硫酸反应制取氢气（实验室制法）' },
        { equation: 'Zn + CuSO₄ → ZnSO₄ + Cu', description: '置换铜' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['锌粉易燃，远离火源'],
      spillTreatment: '收集即可',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥，远离酸类'
    },
    uses: {
      laboratory: ['制取氢气', '原电池电极'],
      industrial: ['镀锌（防锈）', '黄铜合金', '干电池'],
      daily: ['镀锌铁皮（白铁皮）']
    }
  },
  {
    id: 'ch-fe', name: '铁钉', englishName: 'Iron', formula: 'Fe', state: 'solid', color: '#6B7280', category: '金属', description: '灰白色金属，有金属光泽',
    physicalProperties: { density: '7.86 g/cm³', meltingPoint: '1538°C', boilingPoint: '2862°C', solubility: '不溶于水' },
    chemicalProperties: {
      reactionTypes: ['氧化反应', '置换反应', '与酸反应'],
      commonEquations: [
        { equation: '3Fe + 2O₂ →(点燃) Fe₃O₄', description: '在氧气中燃烧，火星四射' },
        { equation: 'Fe + CuSO₄ → FeSO₄ + Cu', description: '湿法炼铜，置换铜' },
        { equation: 'Fe + 2HCl → FeCl₂ + H₂↑', description: '与盐酸反应' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['铁钉尖锐，小心刺伤'],
      spillTreatment: '收集即可',
      skinContactTreatment: '无特殊，用清水冲洗',
      eyeContactTreatment: '就医',
      storageRequirements: '干燥处，防止生锈'
    },
    uses: {
      laboratory: ['铁的性质实验', '置换反应实验'],
      industrial: ['钢铁工业', '建筑材料', '机械制造'],
      daily: ['铁钉、铁丝等日常用品']
    }
  },
  {
    id: 'ch-cu', name: '铜片', englishName: 'Copper', formula: 'Cu', state: 'solid', color: '#B45309', category: '金属', description: '紫红色金属，有良好的导电性',
    physicalProperties: { density: '8.96 g/cm³', meltingPoint: '1085°C', boilingPoint: '2562°C', solubility: '不溶于水' },
    chemicalProperties: {
      reactionTypes: ['氧化反应', '置换反应', '与强氧化性酸反应'],
      commonEquations: [
        { equation: '2Cu + O₂ →(加热) 2CuO', description: '在空气中加热变黑' },
        { equation: 'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag', description: '置换银' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['铜盐有毒，避免误食'],
      spillTreatment: '收集即可',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥处'
    },
    uses: {
      laboratory: ['铜的性质实验', '电极材料'],
      industrial: ['电线电缆', '铜合金', '电路板', '管道'],
      daily: ['铜线', '铜管', '装饰品']
    }
  },
  {
    id: 'ch-al', name: '铝片', englishName: 'Aluminum', formula: 'Al', state: 'solid', color: '#E5E7EB', category: '金属', description: '银白色金属，质轻，表面有氧化膜',
    physicalProperties: { density: '2.70 g/cm³', meltingPoint: '660°C', boilingPoint: '2519°C', solubility: '不溶于水' },
    chemicalProperties: {
      reactionTypes: ['与酸反应', '与碱反应', '铝热反应'],
      commonEquations: [
        { equation: '4Al + 3O₂ → 2Al₂O₃', description: '在空气中形成致密氧化膜' },
        { equation: '2Al + 6HCl → 2AlCl₃ + 3H₂↑', description: '与盐酸反应' },
        { equation: '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑', description: '与氢氧化钠溶液反应' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: ['铝粉易爆'],
      safetyTips: ['铝粉远离火源和氧化剂'],
      spillTreatment: '铝粉避免扬尘，收集密封',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥，远离酸碱'
    },
    uses: {
      laboratory: ['铝热反应实验'],
      industrial: ['铝合金（航空、汽车）', '电线电缆', '易拉罐', '建筑材料'],
      daily: ['铝箔', '炊具（需注意使用）']
    }
  },
  {
    id: 'ch-h2o', name: '蒸馏水', englishName: 'Distilled Water', formula: 'H₂O', state: 'liquid', color: '#60A5FA', category: '其他', description: '纯净的水，不含杂质',
    physicalProperties: { density: '1.0 g/cm³ (4°C)', meltingPoint: '0°C', boilingPoint: '100°C', solubility: '良好溶剂，可溶解多种物质' },
    chemicalProperties: {
      reactionTypes: ['电解反应', '水合反应'],
      commonEquations: [
        { equation: '2H₂O →(通电) 2H₂↑ + O₂↑', description: '电解生成氢气和氧气' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['不可饮用（长期饮用蒸馏水不利于健康）'],
      spillTreatment: '擦干即可',
      skinContactTreatment: '无',
      eyeContactTreatment: '无',
      storageRequirements: '密封，避免污染'
    },
    uses: {
      laboratory: ['配制溶液', '洗涤仪器', '反应溶剂'],
      industrial: ['锅炉用水', '电子工业清洗', '医药注射用水'],
      daily: ['电瓶补充液', '加湿']
    }
  },
  {
    id: 'ch-h2o2', name: '过氧化氢', englishName: 'Hydrogen Peroxide', formula: 'H₂O₂', state: 'aqueous', color: '#A78BFA', category: '氧化物', description: '无色透明溶液，俗称双氧水',
    physicalProperties: { density: '1.11 g/cm³ (30%溶液)', boilingPoint: '150.2°C', solubility: '与水任意比例互溶' },
    chemicalProperties: {
      reactionTypes: ['分解反应', '氧化还原反应'],
      commonEquations: [
        { equation: '2H₂O₂ →(MnO₂) 2H₂O + O₂↑', description: '二氧化锰催化分解制取氧气' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性（高浓度）', '氧化性'],
      safetyTips: ['高浓度避免皮肤接触', '避免与还原剂混合', '棕色瓶避光保存'],
      spillTreatment: '用大量水冲洗',
      skinContactTreatment: '用大量清水冲洗',
      eyeContactTreatment: '用大量清水冲洗，就医',
      storageRequirements: '棕色瓶，阴凉避光，密封'
    },
    uses: {
      laboratory: ['制取氧气', '氧化剂', '漂白剂'],
      industrial: ['漂白剂（纸张、纺织品）', '污水处理', '火箭燃料'],
      daily: ['伤口消毒（3%稀溶液）', '衣物漂白', '头发漂白']
    }
  },
  {
    id: 'ch-mno2', name: '二氧化锰', englishName: 'Manganese Dioxide', formula: 'MnO₂', state: 'solid', color: '#1F2937', category: '氧化物', description: '黑色粉末',
    physicalProperties: { density: '5.03 g/cm³', meltingPoint: '535°C (分解)', solubility: '不溶于水' },
    chemicalProperties: {
      reactionTypes: ['催化反应', '氧化还原反应'],
      commonEquations: [
        { equation: '2H₂O₂ →(MnO₂) 2H₂O + O₂↑', description: '催化过氧化氢分解' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: ['有害（粉尘）'],
      safetyTips: ['避免吸入粉尘'],
      spillTreatment: '清扫收集',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥处，远离还原剂'
    },
    uses: {
      laboratory: ['催化剂', '氧化剂'],
      industrial: ['干电池去极剂', '玻璃脱色', '油漆干燥剂']
    }
  },
  {
    id: 'ch-cao', name: '氧化钙', englishName: 'Calcium Oxide', formula: 'CaO', state: 'solid', color: '#F5F5F4', category: '氧化物', description: '白色固体，俗称生石灰',
    physicalProperties: { density: '3.35 g/cm³', meltingPoint: '2572°C', boilingPoint: '2850°C', solubility: '与水反应放出大量热' },
    chemicalProperties: {
      reactionTypes: ['水合反应', '与酸反应'],
      commonEquations: [
        { equation: 'CaO + H₂O → Ca(OH)₂', description: '与水反应生成熟石灰，放出大量热' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性', '刺激性'],
      safetyTips: ['避免皮肤接触', '避免与水直接接触（会发热）', '操作戴手套和护目镜'],
      spillTreatment: '干燥收集，不可用水直接冲（会放热）',
      skinContactTreatment: '先用植物油擦，再用大量清水冲洗',
      eyeContactTreatment: '用大量清水冲洗，就医',
      storageRequirements: '严格密封，防潮防水'
    },
    uses: {
      laboratory: ['干燥剂', '制备氢氧化钙'],
      industrial: ['建筑材料', '炼钢脱硫', '制备漂白粉'],
      daily: ['干燥剂（食品包装）', '土壤改良']
    }
  },
  {
    id: 'ch-ca-oh-2', name: '氢氧化钙', englishName: 'Calcium Hydroxide', formula: 'Ca(OH)₂', state: 'aqueous', color: '#D1D5DB', category: '碱', description: '澄清石灰水（稀溶液），饱和时微溶',
    physicalProperties: { solubility: '微溶于水，溶解度随温度升高而减小' },
    chemicalProperties: {
      reactionTypes: ['中和反应', '与CO₂反应'],
      commonEquations: [
        { equation: 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O', description: '检验二氧化碳，石灰水变浑浊' },
        { equation: 'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O', description: '中和反应' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性'],
      safetyTips: ['避免皮肤接触', '避免吸入粉末'],
      spillTreatment: '用大量水冲洗',
      skinContactTreatment: '用大量清水冲洗',
      eyeContactTreatment: '用大量清水冲洗，就医',
      storageRequirements: '密封，避免接触CO₂'
    },
    uses: {
      laboratory: ['检验CO₂', '中和酸'],
      industrial: ['建筑材料', '漂白粉制备', '水处理'],
      daily: ['石灰浆刷墙', '皮蛋制作']
    }
  },
  {
    id: 'ch-phenolphthalein', name: '酚酞试液', englishName: 'Phenolphthalein', formula: 'C₂₀H₁₄O₄', state: 'liquid', color: '#EC4899', category: '指示剂', description: '无色透明液体（酒精溶液），遇碱变红',
    physicalProperties: { solubility: '溶于酒精，微溶于水' },
    chemicalProperties: {
      reactionTypes: ['酸碱显色反应'],
      commonEquations: [
        { equation: '无色 →(碱性) 红色', description: 'pH<8.2无色，pH>10.0变红色' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['含酒精，远离火源'],
      spillTreatment: '用湿布擦去',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封，远离火源'
    },
    uses: {
      laboratory: ['酸碱指示剂', '滴定实验'],
      medical: ['缓泻剂（药用级）']
    }
  },
  {
    id: 'ch-litmus', name: '石蕊试液', englishName: 'Litmus Solution', formula: '', state: 'liquid', color: '#8B5CF6', category: '指示剂', description: '紫色溶液，从地衣中提取',
    physicalProperties: { solubility: '溶于水' },
    chemicalProperties: {
      reactionTypes: ['酸碱显色反应'],
      commonEquations: [
        { equation: '紫色 →(酸性) 红色 →(碱性) 蓝色', description: '酸红碱蓝，中性紫色' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['避免皮肤接触（染色）'],
      spillTreatment: '用湿布擦去',
      skinContactTreatment: '用肥皂和水清洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封保存'
    },
    uses: {
      laboratory: ['酸碱指示剂', '石蕊试纸制备']
    }
  },
  {
    id: 'ch-methyl-orange', name: '甲基橙', englishName: 'Methyl Orange', formula: '', state: 'liquid', color: '#F59E0B', category: '指示剂', description: '橙色溶液',
    physicalProperties: { solubility: '溶于水' },
    chemicalProperties: {
      reactionTypes: ['酸碱显色反应'],
      commonEquations: [
        { equation: '红色 →(pH>4.4) 黄色', description: 'pH<3.1红色，pH>4.4黄色，过渡色橙色' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['避免皮肤接触（染色）'],
      spillTreatment: '用湿布擦去',
      skinContactTreatment: '用肥皂和水清洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封保存'
    },
    uses: {
      laboratory: ['酸碱滴定指示剂（强酸-弱碱）']
    }
  },
  {
    id: 'ch-starch', name: '淀粉溶液', englishName: 'Starch Solution', formula: '', state: 'aqueous', color: '#FEF3C7', category: '其他', description: '白色浑浊液（胶体）',
    physicalProperties: { solubility: '加热糊化，溶于热水形成胶体' },
    chemicalProperties: {
      reactionTypes: ['显色反应（遇碘变蓝）', '水解反应'],
      commonEquations: [
        { equation: '淀粉 + I₂ → 蓝色络合物', description: '遇碘变蓝，加热蓝色消失' },
        { equation: '(C₆H₁₀O₅)n + nH₂O →(酶/酸) nC₆H₁₂O₆', description: '水解生成葡萄糖' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['可食用（食用级）'],
      spillTreatment: '用湿布擦去',
      skinContactTreatment: '用水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封，防止霉变，冷藏更佳'
    },
    uses: {
      laboratory: ['检验碘的存在', '指示剂'],
      industrial: ['食品添加剂', '造纸施胶剂', '纺织上浆剂'],
      daily: ['勾芡', '制作粉丝粉条']
    }
  },
  {
    id: 'ch-iodine', name: '碘水', englishName: 'Iodine Water', formula: 'I₂', state: 'aqueous', color: '#78350F', category: '单质', description: '棕黄色溶液，碘的水溶液',
    physicalProperties: { solubility: '微溶于水，易溶于KI溶液' },
    chemicalProperties: {
      reactionTypes: ['显色反应', '氧化反应'],
      commonEquations: [
        { equation: '淀粉 + I₂ → 蓝色', description: '遇淀粉变蓝色' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['刺激性'],
      safetyTips: ['避免皮肤接触（染色）', '避免误食（高浓度有毒）'],
      spillTreatment: '用硫代硫酸钠溶液处理后用水冲洗',
      skinContactTreatment: '用酒精或硫代硫酸钠溶液清洗',
      eyeContactTreatment: '用大量清水冲洗',
      storageRequirements: '棕色瓶，密封避光'
    },
    uses: {
      laboratory: ['检验淀粉', '氧化剂'],
      medical: ['碘酒消毒（酒精溶液）'],
      daily: ['外用消毒']
    }
  },
  {
    id: 'ch-ethanol', name: '乙醇', englishName: 'Ethanol', formula: 'C₂H₅OH', state: 'liquid', color: '#F9FAFB', category: '有机物', hazard: '易燃', description: '无色透明液体，有特殊气味，俗称酒精',
    physicalProperties: { density: '0.789 g/cm³', meltingPoint: '-114°C', boilingPoint: '78.4°C', solubility: '与水任意比例互溶', odor: '特殊酒味' },
    chemicalProperties: {
      reactionTypes: ['燃烧反应', '氧化反应', '酯化反应'],
      commonEquations: [
        { equation: 'C₂H₅OH + 3O₂ →(点燃) 2CO₂ + 3H₂O', description: '完全燃烧，发出淡蓝色火焰' },
        { equation: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑', description: '与钠反应（较温和）' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'high',
      hazardSymbols: ['易燃', '刺激性'],
      safetyTips: ['远离火源热源', '密封保存', '避免明火'],
      spillTreatment: '用沙土或泡沫灭火器灭火，不可用水（密度比水小会浮在水面继续燃烧）',
      ingestionTreatment: '不可饮用工业酒精（含甲醇），过量饮酒有害',
      skinContactTreatment: '一般无危害，用清水冲洗',
      eyeContactTreatment: '用大量清水冲洗',
      storageRequirements: '阴凉通风，远离火源和氧化剂，防爆'
    },
    uses: {
      laboratory: ['溶剂', '酒精灯燃料', '消毒（75%）', '降温剂'],
      industrial: ['燃料（乙醇汽油）', '酿酒', '溶剂', '合成橡胶'],
      daily: ['酒类饮料', '消毒酒精', '燃料']
    }
  },
  {
    id: 'ch-acetic-acid', name: '乙酸', englishName: 'Acetic Acid', formula: 'CH₃COOH', state: 'liquid', color: '#FDE68A', category: '有机物', description: '无色液体，有刺激性气味，俗称醋酸',
    physicalProperties: { density: '1.049 g/cm³', meltingPoint: '16.6°C（低于此温度结冰，叫冰醋酸）', boilingPoint: '117.9°C', solubility: '与水任意比例互溶', odor: '刺激性酸味' },
    chemicalProperties: {
      reactionTypes: ['中和反应', '酯化反应'],
      commonEquations: [
        { equation: 'CH₃COOH + NaOH → CH₃COONa + H₂O', description: '中和反应' },
        { equation: 'CH₃COOH + C₂H₅OH →(浓H₂SO₄,Δ) CH₃COOC₂H₅ + H₂O', description: '酯化反应生成乙酸乙酯（果香味）' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['腐蚀性（浓）', '刺激性'],
      safetyTips: ['冰醋酸避免皮肤接触', '佩戴手套和护目镜'],
      spillTreatment: '用大量水冲洗，可用碳酸钠中和',
      skinContactTreatment: '用大量清水冲洗',
      eyeContactTreatment: '用大量清水冲洗，就医',
      storageRequirements: '密封，阴凉通风处'
    },
    uses: {
      laboratory: ['弱酸', 'pH调节剂', '酯化反应实验'],
      industrial: ['食醋', '合成醋酸纤维', '溶剂', '印染'],
      daily: ['食醋（3-5%）', '除水垢']
    }
  },
  {
    id: 'ch-glucose', name: '葡萄糖', englishName: 'Glucose', formula: 'C₆H₁₂O₆', state: 'solid', color: '#FFFFFF', category: '有机物', description: '白色晶体，有甜味，是生命活动的主要能源',
    physicalProperties: { density: '1.54 g/cm³', meltingPoint: '146°C (分解)', solubility: '易溶于水，稍甜' },
    chemicalProperties: {
      reactionTypes: ['氧化反应（燃烧/呼吸）', '银镜反应', '斐林反应'],
      commonEquations: [
        { equation: 'C₆H₁₂O₆ + 6O₂ →(酶) 6CO₂ + 6H₂O + 能量', description: '生物体内的有氧呼吸' },
        { equation: 'C₆H₁₂O₆ →(酒化酶) 2C₂H₅OH + 2CO₂↑', description: '发酵制取乙醇' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'low',
      hazardSymbols: [],
      safetyTips: ['避免大量摄入（糖尿病患者慎用）'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '无危害',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '干燥密封保存'
    },
    uses: {
      laboratory: ['银镜反应', '斐林反应实验', '培养基碳源'],
      industrial: ['食品甜味剂', '酿酒', '医药', '糖果制造'],
      daily: ['营养补充', '糖果', '输液（医用葡萄糖）']
    }
  },
  {
    id: 'ch-copper-sulfate', name: '硫酸铜溶液', englishName: 'Copper Sulfate Solution', formula: 'CuSO₄', state: 'aqueous', color: '#0EA5E9', category: '盐', description: '蓝色透明溶液',
    physicalProperties: { solubility: '易溶于水' },
    chemicalProperties: {
      reactionTypes: ['置换反应', '复分解反应'],
      commonEquations: [
        { equation: 'Fe + CuSO₄ → FeSO₄ + Cu', description: '铁置换铜（湿法炼铜）' }
      ]
    },
    safetyInfo: {
      hazardLevel: 'medium',
      hazardSymbols: ['有害'],
      safetyTips: ['避免误食', '避免皮肤长期接触'],
      spillTreatment: '用水冲洗',
      skinContactTreatment: '用清水冲洗',
      eyeContactTreatment: '用清水冲洗',
      storageRequirements: '密封保存'
    },
    uses: {
      laboratory: ['铜源', '电镀液', '置换反应实验'],
      industrial: ['电镀', '选矿', '农药（波尔多液）']
    }
  }
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
