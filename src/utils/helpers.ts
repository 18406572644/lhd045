import type { ChemicalSubstance, ExperimentStep } from '../types';
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
}): string => {
  const { experimentName, date, purpose, materials, equipment, procedures, observations, data: dataPoints, conclusion } = reportData;

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

  <div class="section">
    <h2>六、实验结论</h2>
    <div class="conclusion">${conclusion || '<span style="color: #9ca3af;">暂未填写结论</span>'}</div>
  </div>
</body>
</html>
  `;
};
