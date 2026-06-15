import type { Experiment } from '../types';

export const experiments: Experiment[] = [
  {
    id: 'kmno4-oxygen',
    name: '高锰酸钾制取氧气',
    description: '通过加热高锰酸钾分解制取氧气，学习实验室制取气体的方法和氧气的性质。',
    category: '无机化学',
    difficulty: 'medium',
    duration: 15,
    icon: 'flame',
    safetyLevel: 'caution',
    materials: ['高锰酸钾 (KMnO₄)', '水 (H₂O)'],
    equipment: ['试管', '酒精灯', '铁架台', '导管', '水槽', '集气瓶', '棉花'],
    parameters: [
      { id: 'kmno4-mass', name: '高锰酸钾质量', unit: 'g', min: 2, max: 10, default: 5, step: 0.5 },
      { id: 'heat-temp', name: '加热温度', unit: '°C', min: 200, max: 400, default: 300, step: 25 }
    ],
    equations: [
      {
        id: 'eq-1',
        reactants: [
          { formula: '2KMnO₄', name: '高锰酸钾', state: 'solid', color: '#7C3AED' }
        ],
        products: [
          { formula: 'K₂MnO₄', name: '锰酸钾', state: 'solid', color: '#059669' },
          { formula: 'MnO₂', name: '二氧化锰', state: 'solid', color: '#1F2937' },
          { formula: 'O₂', name: '氧气', state: 'gas', color: '#60A5FA' }
        ],
        conditions: '加热',
        type: '分解反应'
      }
    ],
    notes: [
      { id: 'n1', type: 'danger', title: '防止爆炸', content: '试管口必须略向下倾斜，防止冷凝水回流使试管炸裂。' },
      { id: 'n2', type: 'warning', title: '安全操作', content: '先预热试管，再集中加热药品部位。' },
      { id: 'n3', type: 'info', title: '收集时机', content: '待气泡连续均匀冒出时再开始收集，否则收集的氧气不纯。' }
    ],
    steps: [
      {
        id: 1,
        title: '检查装置气密性',
        description: '将导管一端放入水中，用手紧握试管外壁，观察水中导管口是否有气泡冒出。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['若有气泡冒出，松开手后导管内形成一段水柱，说明气密性良好。']
      },
      {
        id: 2,
        title: '装入药品',
        description: '将高锰酸钾装入干燥的试管底部，在试管口塞一团棉花，防止加热时高锰酸钾粉末进入导管。',
        duration: 2,
        animationType: 'pouring',
        animationData: { type: 'pouring', liquidColor: '#7C3AED', duration: 2 },
        tips: ['药品要平铺在试管底部，便于均匀受热。', '棉花不要塞得太紧，以免影响气体导出。']
      },
      {
        id: 3,
        title: '固定装置',
        description: '将试管固定在铁架台上，试管口略向下倾斜，铁夹夹在距试管口约1/3处。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['试管口略向下倾斜是为了防止冷凝水回流使试管炸裂。']
      },
      {
        id: 4,
        title: '点燃酒精灯加热',
        description: '先使酒精灯火焰在试管下方来回移动，让试管均匀受热，然后对高锰酸钾所在部位集中加热。',
        duration: 3,
        animationType: 'heating',
        animationData: { type: 'heating', flameIntensity: 0.8, duration: 3 },
        dataPoints: [{ id: 'temp1', label: '试管温度', unit: '°C', expectedValue: 300 }],
        tips: ['先预热可以防止试管因受热不均而炸裂。', '加热时要用酒精灯的外焰。']
      },
      {
        id: 5,
        title: '收集氧气',
        description: '当气泡连续均匀地冒出时，将导管口伸入盛满水的集气瓶中，用排水法收集氧气。',
        duration: 3,
        animationType: 'bubbling',
        animationData: { type: 'bubbling', bubbleColor: '#60A5FA', duration: 3 },
        dataPoints: [{ id: 'volume', label: '收集气体体积', unit: 'mL', expectedValue: 250 }],
        tips: ['刚开始冒出的气泡是空气，不要收集。', '集气瓶要预先装满水，倒扣在水槽中。']
      },
      {
        id: 6,
        title: '实验结束',
        description: '先将导管从水槽中取出，再熄灭酒精灯，防止水倒吸入试管使试管炸裂。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['切记：先撤导管，后熄灯！']
      }
    ]
  },
  {
    id: 'acid-base-neutralization',
    name: '酸碱中和反应',
    description: '通过盐酸与氢氧化钠溶液的反应，理解中和反应的实质和pH变化规律。',
    category: '无机化学',
    difficulty: 'easy',
    duration: 10,
    icon: 'flask-conical',
    safetyLevel: 'normal',
    materials: ['稀盐酸 (HCl)', '氢氧化钠溶液 (NaOH)', '酚酞试液'],
    equipment: ['烧杯', '玻璃棒', '胶头滴管', 'pH试纸'],
    parameters: [
      { id: 'hcl-concentration', name: '盐酸浓度', unit: 'mol/L', min: 0.1, max: 2, default: 1, step: 0.1 },
      { id: 'naoh-volume', name: 'NaOH溶液体积', unit: 'mL', min: 10, max: 50, default: 25, step: 5 }
    ],
    equations: [
      {
        id: 'eq-1',
        reactants: [
          { formula: 'HCl', name: '盐酸', state: 'aqueous', color: '#EF4444' },
          { formula: 'NaOH', name: '氢氧化钠', state: 'aqueous', color: '#3B82F6' }
        ],
        products: [
          { formula: 'NaCl', name: '氯化钠', state: 'aqueous', color: '#F59E0B' },
          { formula: 'H₂O', name: '水', state: 'liquid', color: '#60A5FA' }
        ],
        conditions: '',
        type: '中和反应'
      }
    ],
    notes: [
      { id: 'n1', type: 'warning', title: '药品安全', content: '氢氧化钠有腐蚀性，避免接触皮肤和衣物。' },
      { id: 'n2', type: 'info', title: '指示剂使用', content: '酚酞遇碱性溶液变红，遇酸性和中性溶液不变色。' }
    ],
    steps: [
      {
        id: 1,
        title: '量取氢氧化钠溶液',
        description: '用量筒量取适量氢氧化钠溶液，倒入洁净的烧杯中。',
        duration: 2,
        animationType: 'pouring',
        animationData: { type: 'pouring', liquidColor: '#3B82F6', duration: 2 },
        tips: ['量取液体时，视线要与凹液面最低处保持水平。']
      },
      {
        id: 2,
        title: '滴加酚酞试液',
        description: '向烧杯中滴加2-3滴酚酞试液，观察溶液颜色变化。',
        duration: 2,
        animationType: 'mixing',
        animationData: { type: 'mixing', liquidColor: '#EC4899', duration: 2 },
        dataPoints: [{ id: 'ph1', label: '溶液pH值', unit: '', expectedValue: 14 }],
        tips: ['酚酞试液遇碱性溶液变成红色。']
      },
      {
        id: 3,
        title: '逐滴加入稀盐酸',
        description: '用胶头滴管逐滴加入稀盐酸，边加边用玻璃棒搅拌，直到溶液颜色恰好变为无色。',
        duration: 4,
        animationType: 'reaction',
        animationData: { type: 'reaction', liquidColor: '#10B981', duration: 4 },
        dataPoints: [{ id: 'ph2', label: '滴定后pH值', unit: '', expectedValue: 7 }],
        tips: ['滴加时要慢，边滴边搅拌，使反应充分进行。', '当溶液由红色恰好变为无色时，停止滴加。']
      },
      {
        id: 4,
        title: '检验反应产物',
        description: '取少量反应后的溶液于蒸发皿中，加热蒸发，观察是否有白色晶体析出。',
        duration: 2,
        animationType: 'heating',
        animationData: { type: 'heating', flameIntensity: 0.6, duration: 2 },
        tips: ['蒸发时要用玻璃棒不断搅拌，防止液体局部过热而飞溅。']
      }
    ]
  },
  {
    id: 'caco3-co2',
    name: '碳酸钙与盐酸反应',
    description: '通过大理石与稀盐酸反应制取二氧化碳，学习二氧化碳的性质和检验方法。',
    category: '无机化学',
    difficulty: 'easy',
    duration: 12,
    icon: 'bubble',
    safetyLevel: 'normal',
    materials: ['大理石 (CaCO₃)', '稀盐酸 (HCl)', '澄清石灰水'],
    equipment: ['锥形瓶', '长颈漏斗', '导管', '集气瓶', '试管'],
    parameters: [
      { id: 'caco3-mass', name: '大理石质量', unit: 'g', min: 5, max: 20, default: 10, step: 1 },
      { id: 'hcl-volume', name: '盐酸体积', unit: 'mL', min: 20, max: 100, default: 50, step: 10 }
    ],
    equations: [
      {
        id: 'eq-1',
        reactants: [
          { formula: 'CaCO₃', name: '碳酸钙', state: 'solid', color: '#F3F4F6' },
          { formula: '2HCl', name: '盐酸', state: 'aqueous', color: '#EF4444' }
        ],
        products: [
          { formula: 'CaCl₂', name: '氯化钙', state: 'aqueous', color: '#60A5FA' },
          { formula: 'H₂O', name: '水', state: 'liquid', color: '#3B82F6' },
          { formula: 'CO₂', name: '二氧化碳', state: 'gas', color: '#9CA3AF' }
        ],
        conditions: '',
        type: '复分解反应'
      },
      {
        id: 'eq-2',
        reactants: [
          { formula: 'CO₂', name: '二氧化碳', state: 'gas', color: '#9CA3AF' },
          { formula: 'Ca(OH)₂', name: '氢氧化钙', state: 'aqueous', color: '#D1D5DB' }
        ],
        products: [
          { formula: 'CaCO₃', name: '碳酸钙', state: 'solid', color: '#F3F4F6' },
          { formula: 'H₂O', name: '水', state: 'liquid', color: '#3B82F6' }
        ],
        conditions: '',
        type: '检验反应'
      }
    ],
    notes: [
      { id: 'n1', type: 'warning', title: '酸液安全', content: '稀盐酸有腐蚀性，操作时要小心。' },
      { id: 'n2', type: 'info', title: '收集方法', content: '二氧化碳密度比空气大，能溶于水，应用向上排空气法收集。' }
    ],
    steps: [
      {
        id: 1,
        title: '检查装置气密性',
        description: '连接好实验装置，检查长颈漏斗和导管的气密性。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['可以通过注水法检查气密性：夹住弹簧夹，向长颈漏斗加水，若水柱不下降则气密性良好。']
      },
      {
        id: 2,
        title: '加入药品',
        description: '先向锥形瓶中加入大理石，再通过长颈漏斗加入稀盐酸。',
        duration: 2,
        animationType: 'pouring',
        animationData: { type: 'pouring', liquidColor: '#EF4444', duration: 2 },
        tips: ['先加固体药品，后加液体药品。', '长颈漏斗末端要浸入液面以下，防止气体从漏斗逸出。']
      },
      {
        id: 3,
        title: '收集二氧化碳',
        description: '将导管伸入集气瓶底部，用向上排空气法收集二氧化碳。',
        duration: 3,
        animationType: 'bubbling',
        animationData: { type: 'bubbling', bubbleColor: '#9CA3AF', duration: 3 },
        tips: ['导管要伸到集气瓶底部，便于排尽瓶内空气。']
      },
      {
        id: 4,
        title: '验满',
        description: '将燃着的木条放在集气瓶口，若木条熄灭，证明二氧化碳已收集满。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['二氧化碳不支持燃烧，也不能燃烧。']
      },
      {
        id: 5,
        title: '检验二氧化碳',
        description: '将气体通入澄清石灰水中，观察石灰水是否变浑浊。',
        duration: 3,
        animationType: 'reaction',
        animationData: { type: 'reaction', liquidColor: '#F3F4F6', duration: 3 },
        tips: ['二氧化碳能使澄清石灰水变浑浊，这是检验二氧化碳的特征反应。']
      }
    ]
  },
  {
    id: 'cuso4-h2o',
    name: '硫酸铜晶体加热失水',
    description: '观察硫酸铜晶体受热分解的现象，理解结晶水合物的性质。',
    category: '无机化学',
    difficulty: 'medium',
    duration: 10,
    icon: 'thermometer',
    safetyLevel: 'caution',
    materials: ['硫酸铜晶体 (CuSO₄·5H₂O)'],
    equipment: ['试管', '酒精灯', '铁架台', '玻璃棒'],
    parameters: [
      { id: 'cuso4-mass', name: '硫酸铜质量', unit: 'g', min: 2, max: 10, default: 5, step: 1 },
      { id: 'heat-time', name: '加热时间', unit: 'min', min: 2, max: 10, default: 5, step: 1 }
    ],
    equations: [
      {
        id: 'eq-1',
        reactants: [
          { formula: 'CuSO₄·5H₂O', name: '五水硫酸铜', state: 'solid', color: '#3B82F6' }
        ],
        products: [
          { formula: 'CuSO₄', name: '无水硫酸铜', state: 'solid', color: '#F59E0B' },
          { formula: '5H₂O', name: '水', state: 'liquid', color: '#60A5FA' }
        ],
        conditions: '加热',
        type: '分解反应'
      }
    ],
    notes: [
      { id: 'n1', type: 'danger', title: '防止烫伤', content: '加热后的试管很热，不要用手直接接触。' },
      { id: 'n2', type: 'warning', title: '均匀加热', content: '先预热试管，防止局部过热导致试管炸裂。' }
    ],
    steps: [
      {
        id: 1,
        title: '观察硫酸铜晶体',
        description: '取少量硫酸铜晶体放入干燥的试管中，观察其颜色和状态。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['硫酸铜晶体是蓝色的，俗称蓝矾或胆矾。']
      },
      {
        id: 2,
        title: '固定试管',
        description: '将试管固定在铁架台上，试管口略向下倾斜。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['试管口略向下倾斜，防止生成的水倒流使试管炸裂。']
      },
      {
        id: 3,
        title: '加热晶体',
        description: '用酒精灯加热试管，先均匀预热，再集中加热药品部位。',
        duration: 4,
        animationType: 'heating',
        animationData: { type: 'heating', flameIntensity: 0.7, duration: 4 },
        dataPoints: [{ id: 'temp', label: '加热温度', unit: '°C', expectedValue: 250 }],
        tips: ['注意观察试管壁上的水珠和晶体颜色的变化。', '蓝色晶体逐渐变成白色粉末。']
      },
      {
        id: 4,
        title: '冷却观察',
        description: '熄灭酒精灯，待试管冷却后，观察无水硫酸铜的颜色。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['无水硫酸铜是白色粉末，遇水会重新变成蓝色，可用于检验水的存在。']
      }
    ]
  },
  {
    id: 'electrolysis-water',
    name: '电解水实验',
    description: '通过电解水实验研究水的组成，验证质量守恒定律。',
    category: '无机化学',
    difficulty: 'hard',
    duration: 20,
    icon: 'zap',
    safetyLevel: 'danger',
    materials: ['水 (H₂O)', '稀硫酸 (H₂SO₄)'],
    equipment: ['电解器', '直流电源', '导线', '试管', '酒精灯'],
    parameters: [
      { id: 'voltage', name: '电压', unit: 'V', min: 6, max: 24, default: 12, step: 2 },
      { id: 'electrolyte', name: '电解质浓度', unit: '%', min: 1, max: 10, default: 5, step: 1 }
    ],
    equations: [
      {
        id: 'eq-1',
        reactants: [
          { formula: '2H₂O', name: '水', state: 'liquid', color: '#3B82F6' }
        ],
        products: [
          { formula: '2H₂', name: '氢气', state: 'gas', color: '#10B981' },
          { formula: 'O₂', name: '氧气', state: 'gas', color: '#60A5FA' }
        ],
        conditions: '通电',
        type: '分解反应'
      }
    ],
    notes: [
      { id: 'n1', type: 'danger', title: '用电安全', content: '使用直流电源，注意用电安全，防止触电。' },
      { id: 'n2', type: 'danger', title: '氢气安全', content: '氢气易燃易爆，点燃前必须验纯！' },
      { id: 'n3', type: 'warning', title: '电解质使用', content: '稀硫酸有腐蚀性，避免接触皮肤。' }
    ],
    steps: [
      {
        id: 1,
        title: '配制电解液',
        description: '在水中加入适量稀硫酸，增加水的导电性。',
        duration: 3,
        animationType: 'mixing',
        animationData: { type: 'mixing', liquidColor: '#6366F1', duration: 3 },
        tips: ['纯水导电性很弱，需要加入少量稀硫酸或氢氧化钠溶液增强导电性。']
      },
      {
        id: 2,
        title: '安装电解器',
        description: '将电解液倒入电解器中，注意液面要高于电极。',
        duration: 2,
        animationType: 'pouring',
        animationData: { type: 'pouring', liquidColor: '#6366F1', duration: 2 },
        tips: ['确保两个玻璃管内没有气泡。']
      },
      {
        id: 3,
        title: '接通电源',
        description: '接通直流电源，观察两个电极上的现象。',
        duration: 6,
        animationType: 'bubbling',
        animationData: { type: 'bubbling', bubbleColor: '#10B981', duration: 6 },
        dataPoints: [
          { id: 'h2-volume', label: '氢气体积', unit: 'mL', expectedValue: 40 },
          { id: 'o2-volume', label: '氧气体积', unit: 'mL', expectedValue: 20 }
        ],
        tips: ['正极（阳极）产生氧气，负极（阴极）产生氢气。', '氢气和氧气的体积比约为 2:1。']
      },
      {
        id: 4,
        title: '检验氢气',
        description: '用燃着的木条点燃负极产生的气体，观察现象。',
        duration: 3,
        animationType: 'reaction',
        animationData: { type: 'reaction', liquidColor: '#EF4444', duration: 3 },
        tips: ['氢气燃烧产生淡蓝色火焰，发出"噗"的声音。', '注意：点燃氢气前一定要验纯！']
      },
      {
        id: 5,
        title: '检验氧气',
        description: '用带火星的木条伸入正极产生的气体中，观察现象。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['氧气能使带火星的木条复燃。']
      },
      {
        id: 6,
        title: '实验结论',
        description: '根据实验现象和数据分析水的元素组成。',
        duration: 2,
        animationType: 'idle',
        animationData: { type: 'idle', duration: 2 },
        tips: ['水是由氢元素和氧元素组成的化合物。', '在化学反应中，分子可以再分，原子不能再分。']
      }
    ]
  }
];

export const getExperimentById = (id: string): Experiment | undefined => {
  return experiments.find(exp => exp.id === id);
};

export const getExperimentsByCategory = (category: string): Experiment[] => {
  return experiments.filter(exp => exp.category === category);
};

export const getCategories = (): string[] => {
  return Array.from(new Set(experiments.map(exp => exp.category)));
};
