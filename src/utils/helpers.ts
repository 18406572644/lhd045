import type { ChemicalSubstance, ExperimentStep, Experiment, ExperimentRecord, ExperimentAnalysis, DataAnalysisResult, OperationNormalityCheck, DataPoint } from '../types';
import { getChemicalStateLabel } from '../styles/theme';

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const renderChemicalFormula = (formula: string): string => {
  return formula.replace(/(\d+)/g, '<sub>$1</sub>');
};

export const renderChemicalEquation = (
  reactants: ChemicalSubstance[],
  products: ChemicalSubstance[],
  conditions: string
): string => {
  const reactantStr = reactants.map(r => {
    const state = getChemicalStateLabel(r.state);
    return `<span style="color: ${r.color || 'inherit'}">${renderChemicalFormula(r.formula)}</span><sub style="color: #6B7280">(${state})</sub>`;
  }).join(' + ');

  const productStr = products.map(p => {
    const state = getChemicalStateLabel(p.state);
    return `<span style="color: ${p.color || 'inherit'}">${renderChemicalFormula(p.formula)}</span><sub style="color: #6B7280">(${state})</sub>`;
  }).join(' + ');

  const arrow = conditions
    ? `&nbsp;${renderChemicalFormula(conditions)}&nbsp;&xrarr;&nbsp;`
    : '&nbsp;&xrarr;&nbsp;';

  return `${reactantStr}${arrow}${productStr}`;
};

export const calculateProgress = (currentStep: number, totalSteps: number): number => {
  if (totalSteps === 0) return 0;
  return Math.round(((currentStep + 1) / totalSteps) * 100);
};

export const getStepById = (steps: ExperimentStep[], id: number): ExperimentStep | undefined => {
  return steps.find(s => s.id === id);
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'application/json') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
};

export const generateExperimentReportHtml = (reportData: {
  experimentName: string;
  date: string;
  purpose: string;
  materials: string[];
  equipment: string[];
  procedures: { step: number; title: string; description: string }[];
  observations: { stepId: number; content: string; timestamp: string }[];
  data: Record<string, number | string>[];
  conclusion: string;
  analysis?: {
    overallScore: number;
    dataAnalysis: {
      dataPointId: string;
      dataPointLabel: string;
      measuredValue: number;
      expectedValue: number;
      unit: string;
      errorPercentage: number;
      isWithinRange: boolean;
      acceptableRange: { min: number; max: number };
      errorSources: string[];
    }[];
    operationChecks: {
      id: string;
      title: string;
      description: string;
      isNormal: boolean;
      suggestion?: string;
    }[];
    summary: string;
    improvements: string[];
  };
}): string => {
  const { experimentName, date, purpose, materials, equipment, procedures, observations, data: dataPoints, conclusion, analysis } = reportData;

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${experimentName} - 实验报告</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans SC', -apple-system, sans-serif;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      color: #1f2937;
      line-height: 1.8;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #1E6FBA;
    }
    .header h1 {
      color: #1E6FBA;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header .date {
      color: #6b7280;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #1E6FBA;
      font-size: 18px;
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 4px solid #1E6FBA;
    }
    ul, ol {
      padding-left: 24px;
    }
    li {
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px 15px;
      text-align: left;
    }
    th {
      background: #f0f7ff;
      color: #1E6FBA;
      font-weight: 600;
    }
    .observation-item {
      background: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      border-left: 3px solid #1E6FBA;
    }
    .observation-meta {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .conclusion {
      background: #f0f7ff;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #1E6FBA;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${experimentName}</h1>
    <div class="date">实验日期：${date}</div>
  </div>

  <div class="section">
    <h2>一、实验目的</h2>
    <p>${purpose}</p>
  </div>

  <div class="section">
    <h2>二、实验器材与药品</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <h3 style="font-size: 16px; margin-bottom: 8px; color: #374151;">实验器材</h3>
        <ul>
          ${equipment.map(e => `<li>${e}</li>`).join('')}
        </ul>
      </div>
      <div>
        <h3 style="font-size: 16px; margin-bottom: 8px; color: #374151;">实验药品</h3>
        <ul>
          ${materials.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>三、实验步骤</h2>
    <ol>
      ${procedures.map(p => `
        <li>
          <strong>${p.title}</strong><br>
          ${p.description}
        </li>
      `).join('')}
    </ol>
  </div>

  <div class="section">
    <h2>四、实验现象记录</h2>
    ${observations.map(o => `
      <div class="observation-item">
        <div class="observation-meta">步骤 ${o.stepId} · ${new Date(o.timestamp).toLocaleString('zh-CN')}</div>
        <div>${o.content}</div>
      </div>
    `).join('') || '<p style="color: #9ca3af;">暂无记录</p>'}
  </div>

  ${dataPoints.length > 0 ? `
  <div class="section">
    <h2>五、实验数据记录</h2>
    <table>
      <thead>
        <tr>
          ${Object.keys(dataPoints[0]).map(key => `<th>${key}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${dataPoints.map(row => `
          <tr>
            ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${analysis ? `
  <div class="section">
    <h2>六、实验数据分析</h2>
    
    <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="color: #1E6FBA; margin-bottom: 8px;">综合评分</h3>
          <p style="color: #6b7280; font-size: 14px;">基于实验数据和操作规范的综合评估</p>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 36px; font-weight: bold; color: ${analysis.overallScore >= 70 ? '#10B981' : analysis.overallScore >= 50 ? '#F59E0B' : '#EF4444'};">
            ${analysis.overallScore}
          </div>
          <div style="font-size: 12px; color: #6b7280;">分</div>
        </div>
      </div>
    </div>

    <div style="background: ${analysis.overallScore >= 70 ? '#ECFDF5' : analysis.overallScore >= 50 ? '#FEF3C7' : '#FEF2F2'}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${analysis.overallScore >= 70 ? '#10B981' : analysis.overallScore >= 50 ? '#F59E0B' : '#EF4444'};">
      <strong>分析总结：</strong>${analysis.summary}
    </div>

    <h3 style="color: #1E6FBA; margin-bottom: 12px; font-size: 16px;">6.1 数据误差分析</h3>
    <table>
      <thead>
        <tr>
          <th>测量项目</th>
          <th>测量值</th>
          <th>理论值</th>
          <th>误差百分比</th>
          <th>允许范围</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        ${analysis.dataAnalysis.map(item => `
          <tr>
            <td><strong>${item.dataPointLabel}</strong></td>
            <td>${item.measuredValue} ${item.unit}</td>
            <td>${item.expectedValue} ${item.unit}</td>
            <td style="color: ${item.isWithinRange ? '#10B981' : '#EF4444'}; font-weight: 600;">
              ${item.errorPercentage}%
            </td>
            <td>${item.acceptableRange.min.toFixed(2)} ~ ${item.acceptableRange.max.toFixed(2)} ${item.unit}</td>
            <td>
              <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${item.isWithinRange ? '#ECFDF5' : '#FEF2F2'}; color: ${item.isWithinRange ? '#10B981' : '#EF4444'};">
                ${item.isWithinRange ? '正常' : '异常'}
              </span>
            </td>
          </tr>
          ${item.errorSources.length > 0 ? `
          <tr>
            <td colspan="6" style="background: #FFFBEB;">
              <strong style="color: #92400e;">可能的误差来源：</strong>
              <ul style="margin: 8px 0 0 20px; padding: 0;">
                ${item.errorSources.map(source => `<li style="color: #92400e; font-size: 14px;">${source}</li>`).join('')}
              </ul>
            </td>
          </tr>
          ` : ''}
        `).join('')}
      </tbody>
    </table>

    <h3 style="color: #1E6FBA; margin-bottom: 12px; font-size: 16px; margin-top: 24px;">6.2 操作规范性检查</h3>
    <table>
      <thead>
        <tr>
          <th>检查项目</th>
          <th>描述</th>
          <th>状态</th>
          <th>建议</th>
        </tr>
      </thead>
      <tbody>
        ${analysis.operationChecks.map(check => `
          <tr>
            <td><strong>${check.title}</strong></td>
            <td>${check.description}</td>
            <td>
              <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; background: ${check.isNormal ? '#ECFDF5' : '#FEF2F2'}; color: ${check.isNormal ? '#10B981' : '#EF4444'};">
                ${check.isNormal ? '规范' : '不规范'}
              </span>
            </td>
            <td style="color: #92400e;">${check.suggestion || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3 style="color: #1E6FBA; margin-bottom: 12px; font-size: 16px; margin-top: 24px;">6.3 改进建议</h3>
    <div style="background: #FFFBEB; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B;">
      <ol style="margin: 0; padding-left: 24px;">
        ${analysis.improvements.map(imp => `<li style="margin-bottom: 6px;">${imp}</li>`).join('')}
      </ol>
    </div>
  </div>
  ` : ''}

  <div class="section">
    <h2>${analysis ? '七' : '六'}、实验结论</h2>
    <div class="conclusion">${conclusion || '<span style="color: #9ca3af;">暂未填写结论</span>'}</div>
  </div>
</body>
</html>
  `;
};

const DEFAULT_ERROR_TOLERANCE = 10;

const errorSourceMap: Record<string, { tooHigh: string[]; tooLow: string[] }> = {
  'temp': {
    tooHigh: ['加热温度过高，可能原因：酒精灯火焰过旺、加热时间过长'],
    tooLow: ['加热温度偏低，可能原因：酒精灯火焰不足、未充分预热、加热时间不够']
  },
  'volume': {
    tooHigh: ['测量体积偏大，可能原因：读数时仰视、装置漏气导致额外气体进入、导管内气体未完全排出'],
    tooLow: ['测量体积偏小，可能原因：读数时俯视、导管内残留气体、装置气密性不佳、未等气泡连续均匀就开始收集']
  },
  'ph': {
    tooHigh: ['pH值偏高，可能原因：碱液浓度偏大、滴加酸量不足、溶液混合不均匀'],
    tooLow: ['pH值偏低，可能原因：酸液浓度偏大、滴加酸量过多、指示剂选用不当']
  },
  'h2-volume': {
    tooHigh: ['氢气体积偏大，可能原因：读数时仰视、电解质浓度过高、电压偏大导致副反应'],
    tooLow: ['氢气体积偏小，可能原因：读数时俯视、装置漏气、电解时间不足、电极表面被氧化']
  },
  'o2-volume': {
    tooHigh: ['氧气体积偏大，可能原因：读数时仰视、电解过度、空气中氧气混入'],
    tooLow: ['氧气体积偏小，可能原因：读数时俯视、氧气部分溶于水、电极氧化消耗氧气、装置漏气']
  }
};

const getErrorSources = (dataPointId: string, measuredValue: number, expectedValue: number): string[] => {
  const isTooHigh = measuredValue > expectedValue;
  const diff = Math.abs(measuredValue - expectedValue);
  const sources: string[] = [];

  for (const key of Object.keys(errorSourceMap)) {
    if (dataPointId.toLowerCase().includes(key.toLowerCase()) || dataPointId.includes(key)) {
      if (isTooHigh) {
        sources.push(...errorSourceMap[key].tooHigh);
      } else {
        sources.push(...errorSourceMap[key].tooLow);
      }
      break;
    }
  }

  if (sources.length === 0) {
    if (isTooHigh) {
      sources.push('测量值偏高，可能存在系统误差或操作不当');
    } else {
      sources.push('测量值偏低，可能存在系统误差或操作不当');
    }
  }

  if (diff > expectedValue * 0.2) {
    sources.push('误差较大，建议检查实验装置和操作步骤');
  }

  return sources;
};

const calculateErrorPercentage = (measured: number, expected: number): number => {
  if (expected === 0) return 0;
  return Math.abs((measured - expected) / expected) * 100;
};

const isWithinAcceptableRange = (measured: number, expected: number, tolerance: number = DEFAULT_ERROR_TOLERANCE): boolean => {
  const errorPercentage = calculateErrorPercentage(measured, expected);
  return errorPercentage <= tolerance;
};

const getAcceptableRange = (expected: number, tolerance: number = DEFAULT_ERROR_TOLERANCE) => {
  const delta = expected * (tolerance / 100);
  return {
    min: expected - delta,
    max: expected + delta
  };
};

const analyzeDataPoint = (
  dataPoint: DataPoint,
  measuredValue: number,
  tolerance: number = DEFAULT_ERROR_TOLERANCE
): DataAnalysisResult => {
  const expectedValue = dataPoint.expectedValue ?? 0;
  const errorPercentage = calculateErrorPercentage(measuredValue, expectedValue);
  const isWithinRange = isWithinAcceptableRange(measuredValue, expectedValue, tolerance);
  const acceptableRange = getAcceptableRange(expectedValue, tolerance);
  const errorSources = getErrorSources(dataPoint.id, measuredValue, expectedValue);

  return {
    dataPointId: dataPoint.id,
    dataPointLabel: dataPoint.label,
    measuredValue,
    expectedValue,
    unit: dataPoint.unit,
    errorPercentage: Math.round(errorPercentage * 100) / 100,
    isWithinRange,
    acceptableRange,
    errorSources
  };
};

const operationCheckTemplates: Record<string, OperationNormalityCheck[]> = {
  'kmno4-oxygen': [
    {
      id: 'check-1',
      title: '装置气密性检查',
      description: '检查实验装置是否进行了气密性检查',
      isNormal: true,
      suggestion: '实验前应将导管一端放入水中，用手紧握试管外壁，观察是否有气泡冒出'
    },
    {
      id: 'check-2',
      title: '试管口方向',
      description: '检查试管口是否略向下倾斜',
      isNormal: true,
      suggestion: '试管口应略向下倾斜，防止冷凝水回流使试管炸裂'
    },
    {
      id: 'check-3',
      title: '棉花放置',
      description: '检查试管口是否放置了棉花',
      isNormal: true,
      suggestion: '试管口应塞一团棉花，防止加热时高锰酸钾粉末进入导管'
    },
    {
      id: 'check-4',
      title: '收集时机',
      description: '检查是否在气泡连续均匀时开始收集',
      isNormal: true,
      suggestion: '应待气泡连续均匀冒出时再开始收集，否则收集的氧气不纯'
    },
    {
      id: 'check-5',
      title: '实验结束顺序',
      description: '检查是否先撤导管后熄灯',
      isNormal: true,
      suggestion: '实验结束时应先撤出导管，再熄灭酒精灯，防止水倒吸使试管炸裂'
    }
  ],
  'acid-base-neutralization': [
    {
      id: 'check-1',
      title: '指示剂使用',
      description: '检查是否正确使用了酚酞指示剂',
      isNormal: true,
      suggestion: '酚酞遇碱性溶液变红，遇酸性和中性溶液不变色'
    },
    {
      id: 'check-2',
      title: '滴定操作',
      description: '检查是否逐滴加入并不断搅拌',
      isNormal: true,
      suggestion: '滴加时要慢，边滴边搅拌，使反应充分进行'
    },
    {
      id: 'check-3',
      title: '读数方法',
      description: '检查液体读数是否正确',
      isNormal: true,
      suggestion: '量取液体时，视线要与凹液面最低处保持水平'
    }
  ],
  'caco3-co2': [
    {
      id: 'check-1',
      title: '药品选择',
      description: '检查是否使用了正确的药品',
      isNormal: true,
      suggestion: '实验室制取CO₂应使用大理石和稀盐酸，不能用稀硫酸或浓盐酸'
    },
    {
      id: 'check-2',
      title: '收集方法',
      description: '检查是否使用向上排空气法收集',
      isNormal: true,
      suggestion: '二氧化碳密度比空气大，能溶于水，应用向上排空气法收集'
    },
    {
      id: 'check-3',
      title: '验满方法',
      description: '检查验满操作是否正确',
      isNormal: true,
      suggestion: '验满时将燃着的木条放在集气瓶口，若木条熄灭则证明已满'
    },
    {
      id: 'check-4',
      title: '长颈漏斗使用',
      description: '检查长颈漏斗末端是否浸入液面以下',
      isNormal: true,
      suggestion: '长颈漏斗末端要浸入液面以下，防止气体从漏斗逸出'
    }
  ],
  'cuso4-h2o': [
    {
      id: 'check-1',
      title: '试管干燥',
      description: '检查试管是否干燥',
      isNormal: true,
      suggestion: '试管应保持干燥，避免水分影响实验结果'
    },
    {
      id: 'check-2',
      title: '均匀加热',
      description: '检查是否先预热后集中加热',
      isNormal: true,
      suggestion: '先预热试管，防止局部过热导致试管炸裂'
    },
    {
      id: 'check-3',
      title: '试管口方向',
      description: '检查试管口是否略向下倾斜',
      isNormal: true,
      suggestion: '试管口应略向下倾斜，防止生成的水倒流使试管炸裂'
    }
  ],
  'electrolysis-water': [
    {
      id: 'check-1',
      title: '电解质添加',
      description: '检查是否添加了电解质增强导电性',
      isNormal: true,
      suggestion: '纯水导电性很弱，需要加入少量稀硫酸或氢氧化钠溶液增强导电性'
    },
    {
      id: 'check-2',
      title: '电源类型',
      description: '检查是否使用直流电源',
      isNormal: true,
      suggestion: '电解水应使用直流电源，正极产生氧气，负极产生氢气'
    },
    {
      id: 'check-3',
      title: '气体体积比',
      description: '检查氢气与氧气体积比是否约为2:1',
      isNormal: true,
      suggestion: '理论上氢气与氧气的体积比应为2:1'
    },
    {
      id: 'check-4',
      title: '氢气验纯',
      description: '检查点燃氢气前是否验纯',
      isNormal: true,
      suggestion: '氢气易燃易爆，点燃前必须验纯！'
    }
  ]
};

const getDefaultOperationChecks = (): OperationNormalityCheck[] => [
  {
    id: 'check-1',
    title: '实验准备',
    description: '检查实验器材和药品是否齐全',
    isNormal: true,
    suggestion: '实验前应检查所有器材和药品是否准备齐全'
  },
  {
    id: 'check-2',
    title: '操作规范',
    description: '检查实验操作是否按步骤进行',
    isNormal: true,
    suggestion: '应严格按照实验步骤进行操作'
  },
  {
    id: 'check-3',
    title: '安全注意',
    description: '检查是否遵守安全操作规程',
    isNormal: true,
    suggestion: '实验过程中应注意安全，遵守操作规程'
  }
];

export const analyzeExperiment = (
  experiment: Experiment,
  record: ExperimentRecord
): ExperimentAnalysis => {
  const dataAnalysis: DataAnalysisResult[] = [];

  const allDataPoints: DataPoint[] = [];
  experiment.steps.forEach(step => {
    if (step.dataPoints) {
      allDataPoints.push(...step.dataPoints);
    }
  });

  record.data.forEach((dataRow) => {
    allDataPoints.forEach(dataPoint => {
      const value = dataRow[dataPoint.label];
      if (value !== undefined && typeof value === 'number' && dataPoint.expectedValue !== undefined) {
        const analysis = analyzeDataPoint(dataPoint, value);
        dataAnalysis.push(analysis);
      } else if (value !== undefined && typeof value === 'string') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && dataPoint.expectedValue !== undefined) {
          const analysis = analyzeDataPoint(dataPoint, numValue);
          dataAnalysis.push(analysis);
        }
      }
    });
  });

  if (dataAnalysis.length === 0) {
    allDataPoints.forEach(dataPoint => {
      if (dataPoint.expectedValue !== undefined) {
        const analysis = analyzeDataPoint(dataPoint, dataPoint.expectedValue);
        dataAnalysis.push(analysis);
      }
    });
  }

  const baseChecks = operationCheckTemplates[experiment.id] || getDefaultOperationChecks();
  const operationChecks = baseChecks.map(check => {
    let isNormal = check.isNormal;

    if (dataAnalysis.length > 0) {
      const hasLargeError = dataAnalysis.some(d => d.errorPercentage > 15);
      if (hasLargeError) {
        isNormal = false;
      }
    }

    return {
      ...check,
      isNormal
    };
  });

  const totalDataPoints = dataAnalysis.length;
  const pointsWithinRange = dataAnalysis.filter(d => d.isWithinRange).length;
  const normalOperations = operationChecks.filter(o => o.isNormal).length;
  const totalOperations = operationChecks.length;

  const dataScore = totalDataPoints > 0 ? (pointsWithinRange / totalDataPoints) * 60 : 60;
  const operationScore = totalOperations > 0 ? (normalOperations / totalOperations) * 40 : 40;
  const overallScore = Math.round(dataScore + operationScore);

  const improvements: string[] = [];

  dataAnalysis.forEach(d => {
    if (!d.isWithinRange) {
      improvements.push(`"${d.dataPointLabel}"误差较大（${d.errorPercentage}%），建议：${d.errorSources[0]}`);
    }
  });

  operationChecks.forEach(o => {
    if (!o.isNormal && o.suggestion) {
      improvements.push(`"${o.title}"操作不规范，建议：${o.suggestion}`);
    }
  });

  if (improvements.length === 0) {
    improvements.push('实验操作规范，数据准确，继续保持！');
  }

  let summary = '';
  if (overallScore >= 90) {
    summary = '本次实验操作规范，数据准确，误差在合理范围内，实验结果良好。';
  } else if (overallScore >= 70) {
    summary = '本次实验基本完成，部分数据存在一定误差，建议分析误差来源并改进实验操作。';
  } else if (overallScore >= 50) {
    summary = '本次实验存在较大误差，建议检查实验装置和操作步骤，重新进行实验。';
  } else {
    summary = '本次实验结果不理想，建议认真复习实验原理和操作方法后重新实验。';
  }

  return {
    overallScore,
    dataAnalysis,
    operationChecks,
    summary,
    improvements
  };
};
