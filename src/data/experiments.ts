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
    preKnowledge: [
      { id: 'pk-1', title: '高锰酸钾的基本性质', content: '高锰酸钾（KMnO₄）是一种暗紫色的晶体，易溶于水，水溶液呈紫红色。它是一种强氧化剂，受热易分解。高锰酸钾在医疗上可用于消毒，在实验室中常用作氧化剂和制取氧气的原料。', type: 'concept' },
      { id: 'pk-2', title: '分解反应原理', content: '高锰酸钾受热分解生成锰酸钾（K₂MnO₄）、二氧化锰（MnO₂）和氧气（O₂）。反应方程式：2KMnO₄ →(加热) K₂MnO₄ + MnO₂ + O₂↑。这是一个分解反应，一种物质生成多种物质。', type: 'principle' },
      { id: 'pk-3', title: '排水集气法的使用', content: '排水集气法适用于收集不溶于水（或难溶于水）的气体。操作时先将集气瓶装满水倒扣在水槽中，将导管伸入瓶内，气体将水排出。优点是收集的气体较纯，缺点是气体需要不溶于水。', type: 'instrument' },
      { id: 'pk-4', title: '试管加热注意事项', content: '加热试管时，试管口不能对着任何人；先预热（来回移动酒精灯），再集中加热；试管口略向下倾斜，防止冷凝水回流炸裂试管；加热固体时，药品平铺在试管底部。', type: 'safety' }
    ],
    quizQuestions: [
      { id: 'q1', question: '高锰酸钾制取氧气属于什么反应类型？', options: [{ label: '化合反应', isCorrect: false }, { label: '分解反应', isCorrect: true }, { label: '置换反应', isCorrect: false }, { label: '复分解反应', isCorrect: false }], explanation: '高锰酸钾受热分解，由一种物质生成三种物质，属于分解反应。' },
      { id: 'q2', question: '加热高锰酸钾时，试管口为什么要略向下倾斜？', options: [{ label: '方便观察实验现象', isCorrect: false }, { label: '防止冷凝水回流使试管炸裂', isCorrect: true }, { label: '便于收集气体', isCorrect: false }, { label: '防止药品溢出', isCorrect: false }], explanation: '试管口略向下倾斜是为了防止药品中含有的水分或反应生成的水冷凝后回流到灼热的试管底部，导致试管炸裂。' },
      { id: 'q3', question: '收集氧气时，为什么要等气泡连续均匀冒出后再收集？', options: [{ label: '等气泡均匀说明反应已稳定，收集的气体更纯', isCorrect: true }, { label: '防止氧气泄漏', isCorrect: false }, { label: '节省药品', isCorrect: false }, { label: '保护集气瓶', isCorrect: false }], explanation: '刚开始排出的气泡是装置内的空气，等气泡连续均匀冒出时，说明装置内空气已排尽，此时收集的氧气才比较纯净。' },
      { id: 'q4', question: '实验结束时，正确的操作顺序是？', options: [{ label: '先熄灭酒精灯，再撤出导管', isCorrect: false }, { label: '先撤出导管，再熄灭酒精灯', isCorrect: true }, { label: '同时熄灭酒精灯和撤出导管', isCorrect: false }, { label: '不需要特别注意顺序', isCorrect: false }], explanation: '先撤导管后熄灯是为了防止水槽中的水倒吸入热的试管，导致试管炸裂。' }
    ],
    quizRequired: true,
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
    preKnowledge: [
      { id: 'pk-1', title: '酸碱中和反应概念', content: '酸与碱作用生成盐和水的反应叫中和反应。中和反应的实质是酸电离出的H⁺与碱电离出的OH⁻结合生成水：H⁺ + OH⁻ → H₂O。中和反应是复分解反应的一种特殊情况。', type: 'concept' },
      { id: 'pk-2', title: '中和反应原理', content: '盐酸（HCl）与氢氧化钠（NaOH）反应：HCl + NaOH → NaCl + H₂O。反应过程中溶液的pH值从碱性（>7）逐渐降低到中性（=7），继续加酸则变为酸性（<7）。', type: 'principle' },
      { id: 'pk-3', title: '酸碱指示剂的使用', content: '酸碱指示剂能根据溶液酸碱性不同而显示不同颜色。酚酞试液：酸性/中性中无色，碱性中红色；石蕊试液：酸性中红色，中性中紫色，碱性中蓝色。', type: 'instrument' },
      { id: 'pk-4', title: '腐蚀性药品安全操作', content: '氢氧化钠有强腐蚀性，盐酸有腐蚀性，操作时需佩戴护目镜和手套，避免接触皮肤和衣物。如不慎接触皮肤，立即用大量清水冲洗。', type: 'safety' }
    ],
    quizQuestions: [
      { id: 'q1', question: '中和反应的实质是什么？', options: [{ label: '酸和碱混合', isCorrect: false }, { label: 'H⁺和OH⁻结合生成水', isCorrect: true }, { label: '生成盐和水', isCorrect: false }, { label: '溶液变色', isCorrect: false }], explanation: '中和反应的实质是酸电离出的H⁺与碱电离出的OH⁻结合生成H₂O，而非简单的混合或变色。' },
      { id: 'q2', question: '向NaOH溶液中滴加酚酞，溶液会变成什么颜色？', options: [{ label: '无色', isCorrect: false }, { label: '红色', isCorrect: true }, { label: '蓝色', isCorrect: false }, { label: '紫色', isCorrect: false }], explanation: 'NaOH溶液呈碱性，酚酞遇碱性溶液变红色。' },
      { id: 'q3', question: '滴加盐酸至溶液恰好由红色变为无色时，溶液的pH约为多少？', options: [{ label: 'pH = 1', isCorrect: false }, { label: 'pH = 7', isCorrect: true }, { label: 'pH = 14', isCorrect: false }, { label: 'pH = 0', isCorrect: false }], explanation: '溶液恰好由红色变为无色时，说明酸碱恰好完全反应，此时溶液呈中性，pH约为7。' }
    ],
    quizRequired: false,
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
    preKnowledge: [
      { id: 'pk-1', title: '碳酸盐与酸的反应', content: '碳酸盐（如CaCO₃）与酸反应可生成对应的盐、水和二氧化碳。这是实验室制取二氧化碳的常用方法。大理石的主要成分是碳酸钙，与稀盐酸反应产生CO₂气体。', type: 'concept' },
      { id: 'pk-2', title: '二氧化碳的检验原理', content: '二氧化碳能使澄清石灰水变浑浊：CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O。这是检验CO₂的特征反应。CaCO₃是不溶于水的白色沉淀，使石灰水变浑浊。', type: 'principle' },
      { id: 'pk-3', title: '向上排空气法收集气体', content: '向上排空气法适用于收集密度比空气大的气体。操作时将导管伸入集气瓶底部，密度大的气体从底部向上逐渐将空气排出。CO₂密度大于空气，适合用此法。', type: 'instrument' },
      { id: 'pk-4', title: '稀盐酸安全操作', content: '稀盐酸有腐蚀性，不可直接接触皮肤。如不慎溅到皮肤上，应立即用大量清水冲洗。实验中不可使用浓盐酸，因为浓盐酸有强挥发性，会使收集的CO₂不纯。', type: 'safety' }
    ],
    quizQuestions: [
      { id: 'q1', question: '实验室制取CO₂应选择什么药品？', options: [{ label: '大理石和稀硫酸', isCorrect: false }, { label: '大理石和稀盐酸', isCorrect: true }, { label: '碳酸钠和稀盐酸', isCorrect: false }, { label: '大理石和浓盐酸', isCorrect: false }], explanation: '稀硫酸与大理石反应生成的CaSO₄微溶，会覆盖在大理石表面阻止反应继续；碳酸钠与盐酸反应太快，不易控制；浓盐酸有强挥发性使气体不纯。' },
      { id: 'q2', question: '为什么不能用排水法收集CO₂？', options: [{ label: 'CO₂有毒', isCorrect: false }, { label: 'CO₂能溶于水', isCorrect: true }, { label: 'CO₂密度太大', isCorrect: false }, { label: 'CO₂不支持燃烧', isCorrect: false }], explanation: 'CO₂能溶于水（1体积水溶解1体积CO₂），所以不适合用排水法收集，应使用向上排空气法。' },
      { id: 'q3', question: '如何检验集气瓶中CO₂已收集满？', options: [{ label: '将燃着的木条伸入瓶内', isCorrect: false }, { label: '将燃着的木条放在瓶口', isCorrect: true }, { label: '倒入石灰水观察', isCorrect: false }, { label: '闻气味', isCorrect: false }], explanation: '验满时将燃着的木条放在集气瓶口，若木条熄灭则说明CO₂已满。伸入瓶内是检验CO₂的性质，不是验满。' },
      { id: 'q4', question: '检验CO₂气体应使用什么试剂？', options: [{ label: '紫色石蕊试液', isCorrect: false }, { label: '澄清石灰水', isCorrect: true }, { label: '酚酞试液', isCorrect: false }, { label: '蒸馏水', isCorrect: false }], explanation: 'CO₂能使澄清石灰水变浑浊，这是检验CO₂的特征方法。石蕊试液只能检验酸性，不能确定是CO₂。' }
    ],
    quizRequired: true,
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
    preKnowledge: [
      { id: 'pk-1', title: '结晶水合物概念', content: '含有结晶水的化合物叫结晶水合物，如CuSO₄·5H₂O（胆矾/蓝矾）。结晶水合物中的水分子以一定比例结合在晶体中，是化合物的一部分，不是简单的混合。结晶水合物是纯净物。', type: 'concept' },
      { id: 'pk-2', title: '硫酸铜晶体受热分解原理', content: '五水硫酸铜受热失去结晶水：CuSO₄·5H₂O →(加热) CuSO₄ + 5H₂O。蓝色晶体变为白色粉末，同时试管壁上有水珠生成。无水硫酸铜遇水变蓝，可用于检验水的存在。', type: 'principle' },
      { id: 'pk-3', title: '酒精灯的正确使用', content: '酒精灯用外焰加热（温度最高）；禁止用酒精灯引燃另一只酒精灯；禁止向燃着的酒精灯添加酒精；熄灭时用灯帽盖灭，不可用嘴吹；酒精量不超过灯体的2/3。', type: 'instrument' },
      { id: 'pk-4', title: '加热操作安全', content: '加热时试管口不能对着人；先预热后集中加热；加热固体时试管口略向下倾斜；加热后的试管很烫，不可用手直接触摸，需用试管夹。', type: 'safety' }
    ],
    quizQuestions: [
      { id: 'q1', question: '硫酸铜晶体（CuSO₄·5H₂O）是混合物还是纯净物？', options: [{ label: '混合物', isCorrect: false }, { label: '纯净物', isCorrect: true }, { label: '既是混合物也是纯净物', isCorrect: false }, { label: '无法判断', isCorrect: false }], explanation: '结晶水合物中结晶水是化合物的一部分，有固定组成，所以CuSO₄·5H₂O是纯净物（化合物）。' },
      { id: 'q2', question: '加热CuSO₄·5H₂O后，晶体颜色如何变化？', options: [{ label: '白色→蓝色', isCorrect: false }, { label: '蓝色→白色', isCorrect: true }, { label: '蓝色→绿色', isCorrect: false }, { label: '颜色不变', isCorrect: false }], explanation: '蓝色的五水硫酸铜受热失去结晶水后变为白色的无水硫酸铜。' },
      { id: 'q3', question: '无水硫酸铜有什么特殊用途？', options: [{ label: '作干燥剂和检验水的存在', isCorrect: true }, { label: '制取氧气', isCorrect: false }, { label: '中和酸碱', isCorrect: false }, { label: '作还原剂', isCorrect: false }], explanation: '无水硫酸铜（白色）遇水变蓝，可用来检验水的存在，也可用作干燥剂。' }
    ],
    quizRequired: false,
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
    preKnowledge: [
      { id: 'pk-1', title: '电解的基本概念', content: '电解是利用直流电使物质发生化学变化的过程。电解水时，水分子在电流作用下分解为氢气和氧气。为了增强水的导电性，需要加入少量电解质（如稀硫酸或氢氧化钠）。', type: 'concept' },
      { id: 'pk-2', title: '水电解的化学原理', content: '电解水方程式：2H₂O →(通电) 2H₂↑ + O₂↑。阴极（负极）产生氢气，阳极（正极）产生氧气。氢气与氧气的体积比为2:1，说明水由氢元素和氧元素组成，且分子中氢原子与氧原子个数比为2:1。', type: 'principle' },
      { id: 'pk-3', title: '电解器的使用', content: '电解器由两个相连的玻璃管和电极组成。使用时将电解液注满玻璃管，确保管内无气泡，然后接通直流电源。正极产生氧气，负极产生氢气，通过刻度可读出各管气体体积。', type: 'instrument' },
      { id: 'pk-4', title: '氢气安全与验纯', content: '氢气是可燃气体，与空气混合遇明火可能爆炸。点燃氢气前必须验纯：收集一小试管氢气，用拇指堵住，移近火焰，若发出尖锐爆鸣声则不纯，若发出轻微"噗"声则较纯。', type: 'safety' }
    ],
    quizQuestions: [
      { id: 'q1', question: '电解水时，正极和负极分别产生什么气体？', options: [{ label: '正极氢气，负极氧气', isCorrect: false }, { label: '正极氧气，负极氢气', isCorrect: true }, { label: '两极都产生氢气', isCorrect: false }, { label: '两极都产生氧气', isCorrect: false }], explanation: '电解水时，阳极（正极）产生O₂，阴极（负极）产生H₂。可记忆为"正氧负氢"。' },
      { id: 'q2', question: '电解水实验中，氢气和氧气的体积比约为？', options: [{ label: '1:1', isCorrect: false }, { label: '1:2', isCorrect: false }, { label: '2:1', isCorrect: true }, { label: '3:1', isCorrect: false }], explanation: '电解水产生的H₂与O₂体积比约为2:1，说明每个水分子含2个氢原子和1个氧原子。' },
      { id: 'q3', question: '为什么要在水中加入稀硫酸？', options: [{ label: '稀硫酸参与反应', isCorrect: false }, { label: '增强水的导电性', isCorrect: true }, { label: '防止氢气爆炸', isCorrect: false }, { label: '加快气体产生速度', isCorrect: false }], explanation: '纯水导电性很弱，加入稀硫酸（或NaOH）是为了增强导电性，使电解能顺利进行。稀硫酸本身不参与反应。' },
      { id: 'q4', question: '电解水实验说明了什么？', options: [{ label: '水是混合物', isCorrect: false }, { label: '水由氢元素和氧元素组成', isCorrect: true }, { label: '水是不可分解的', isCorrect: false }, { label: '水中含有氢气和氧气', isCorrect: false }], explanation: '电解水生成H₂和O₂，证明水是由氢元素和氧元素组成的化合物，在化学反应中分子可分而原子不可分。' },
      { id: 'q5', question: '点燃氢气前为什么要验纯？', options: [{ label: '检查氢气是否干燥', isCorrect: false }, { label: '防止氢气不纯引发爆炸', isCorrect: true }, { label: '测量氢气纯度', isCorrect: false }, { label: '检查装置气密性', isCorrect: false }], explanation: '氢气与空气混合在爆炸极限范围内遇明火会爆炸，所以点燃前必须验纯，确保氢气纯度较高才安全。' }
    ],
    quizRequired: true,
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
