import type { LineChartDataPoint } from '../components/charts/LineChart';
import type { BarChartDataPoint } from '../components/charts/BarChart';

export interface SimulationContext {
  parameters: Record<string, number>;
  currentStep: number;
  elapsedTime: number;
  experimentId: string;
}

export interface ChartSeries {
  key: string;
  color: string;
  name: string;
}

export interface GaugeValue {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color: string;
}

export interface SimulationResult {
  lineChartData: LineChartDataPoint[];
  lineChartSeries: ChartSeries[];
  barChartData: BarChartDataPoint[];
  barChartSeries: ChartSeries[];
  gaugeValues: GaugeValue[];
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const kmno4Model = (ctx: SimulationContext): SimulationResult => {
  const { parameters, elapsedTime, currentStep } = ctx;
  const heatTemp = parameters['heat-temp'] ?? 300;
  const kmno4Mass = parameters['kmno4-mass'] ?? 5;

  const tempFactor = heatTemp / 300;
  const massFactor = kmno4Mass / 5;

  const timePoints = 30;
  const lineChartData: LineChartDataPoint[] = [];
  for (let i = 0; i <= timePoints; i++) {
    const t = (i / timePoints) * 180;
    const isHeating = currentStep >= 3;
    const temp = isHeating
      ? clamp(25 + (heatTemp - 25) * (1 - Math.exp(-t / (40 / tempFactor))), 25, heatTemp)
      : 25;

    let volume = 0;
    if (currentStep >= 4 && t > 20) {
      const effectiveT = t - 20;
      const maxVolume = 50 * massFactor;
      volume = maxVolume * (1 - Math.exp(-effectiveT / (50 / tempFactor)));
    }

    lineChartData.push({
      name: `${Math.round(t)}s`,
      温度: Number(temp.toFixed(1)),
      产气量: Number(volume.toFixed(1)),
    });
  }

  const currentTemp = clamp(
    25 + (heatTemp - 25) * (1 - Math.exp(-elapsedTime / (40 / tempFactor))),
    25,
    heatTemp
  );
  const effectiveElapsed = Math.max(0, elapsedTime - 20);
  const currentVolume =
    currentStep >= 4
      ? (50 * massFactor) * (1 - Math.exp(-effectiveElapsed / (50 / tempFactor)))
      : 0;

  const barChartData: BarChartDataPoint[] = [
    { name: '0s', 温度: 25, 产气量: 0 },
    { name: '30s', 温度: Number(Number(lineChartData[5]?.温度).toFixed(0)) || 25, 产气量: Number(Number(lineChartData[5]?.产气量).toFixed(0)) || 0 },
    { name: '60s', 温度: Number(Number(lineChartData[10]?.温度).toFixed(0)) || 25, 产气量: Number(Number(lineChartData[10]?.产气量).toFixed(0)) || 0 },
    { name: '90s', 温度: Number(Number(lineChartData[15]?.温度).toFixed(0)) || 25, 产气量: Number(Number(lineChartData[15]?.产气量).toFixed(0)) || 0 },
    { name: '120s', 温度: Number(Number(lineChartData[20]?.温度).toFixed(0)) || 25, 产气量: Number(Number(lineChartData[20]?.产气量).toFixed(0)) || 0 },
  ];

  return {
    lineChartData,
    lineChartSeries: [
      { key: '温度', color: '#EF4444', name: '温度 (°C)' },
      { key: '产气量', color: '#1E6FBA', name: '产气量 (mL)' },
    ],
    barChartData,
    barChartSeries: [
      { key: '温度', color: '#F59E0B', name: '温度 (°C)' },
      { key: '产气量', color: '#10B981', name: '产气量 (mL)' },
    ],
    gaugeValues: [
      { key: 'temp', label: '当前温度', value: currentTemp, min: 0, max: 500, unit: '°C', color: '#EF4444' },
      { key: 'volume', label: '累积产气量', value: currentVolume, min: 0, max: 100, unit: 'mL', color: '#1E6FBA' },
    ],
  };
};

const acidBaseModel = (ctx: SimulationContext): SimulationResult => {
  const { parameters, elapsedTime, currentStep } = ctx;
  const hclConc = parameters['hcl-concentration'] ?? 1;
  const naohVolume = parameters['naoh-volume'] ?? 25;

  const timePoints = 20;
  const lineChartData: LineChartDataPoint[] = [];
  const hclAddedStep = currentStep >= 2;
  const totalHClForNeutral = (naohVolume * 0.1) / hclConc;

  for (let i = 0; i <= timePoints; i++) {
    const hclAdded = hclAddedStep ? (i / timePoints) * totalHClForNeutral * 1.5 : 0;
    const molesNaOH = naohVolume * 0.1 / 1000;
    const molesHCl = hclAdded * hclConc / 1000;
    const totalVolume = (naohVolume + hclAdded) / 1000;

    let ph: number;
    if (molesNaOH > molesHCl) {
      const excessOH = (molesNaOH - molesHCl) / totalVolume;
      ph = 14 + Math.log10(Math.max(excessOH, 1e-14));
    } else if (molesHCl > molesNaOH) {
      const excessH = (molesHCl - molesNaOH) / totalVolume;
      ph = -Math.log10(Math.max(excessH, 1e-14));
    } else {
      ph = 7;
    }

    lineChartData.push({
      name: `${Math.round((i / timePoints) * 100)}%`,
      pH: Number(ph.toFixed(2)),
      '加入盐酸': Number(hclAdded.toFixed(1)),
    });
  }

  const currentProgress = clamp((elapsedTime / 10) * 100, 0, 100);
  const currentHCl = hclAddedStep ? (currentProgress / 100) * totalHClForNeutral * 1.5 : 0;
  const molesNaOH = naohVolume * 0.1 / 1000;
  const molesHCl = currentHCl * hclConc / 1000;
  const totalVolume = (naohVolume + currentHCl) / 1000;

  let currentPh: number;
  if (molesNaOH > molesHCl) {
    const excessOH = (molesNaOH - molesHCl) / totalVolume;
    currentPh = 14 + Math.log10(Math.max(excessOH, 1e-14));
  } else if (molesHCl > molesNaOH) {
    const excessH = (molesHCl - molesNaOH) / totalVolume;
    currentPh = -Math.log10(Math.max(excessH, 1e-14));
  } else {
    currentPh = 7;
  }

  const barChartData: BarChartDataPoint[] = [
    { name: '开始', pH: 13.5 },
    { name: '25%', pH: Number(Number(lineChartData[5]?.pH).toFixed(2)) || 12 },
    { name: '50%', pH: Number(Number(lineChartData[10]?.pH).toFixed(2)) || 10 },
    { name: '75%', pH: Number(Number(lineChartData[15]?.pH).toFixed(2)) || 4 },
    { name: '结束', pH: Number(Number(lineChartData[20]?.pH).toFixed(2)) || 2 },
  ];

  return {
    lineChartData,
    lineChartSeries: [{ key: 'pH', color: '#8B5CF6', name: 'pH 值' }],
    barChartData,
    barChartSeries: [{ key: 'pH', color: '#EC4899', name: 'pH 值' }],
    gaugeValues: [
      { key: 'ph', label: '当前 pH', value: clamp(currentPh, 0, 14), min: 0, max: 14, unit: '', color: '#8B5CF6' },
      { key: 'hcl', label: '已加盐酸', value: currentHCl, min: 0, max: totalHClForNeutral * 1.5, unit: 'mL', color: '#EF4444' },
    ],
  };
};

const electrolysisModel = (ctx: SimulationContext): SimulationResult => {
  const { parameters, elapsedTime, currentStep } = ctx;
  const voltage = parameters['voltage'] ?? 12;
  const electrolyte = parameters['electrolyte'] ?? 5;

  const voltFactor = voltage / 12;
  const electroFactor = electrolyte / 5;
  const rateFactor = voltFactor * (0.5 + electroFactor * 0.5);

  const timePoints = 24;
  const lineChartData: LineChartDataPoint[] = [];

  for (let i = 0; i <= timePoints; i++) {
    const t = (i / timePoints) * 120;
    const isElectrolyzing = currentStep >= 2;
    const h2Volume = isElectrolyzing ? 0.4 * rateFactor * t : 0;
    const o2Volume = isElectrolyzing ? 0.2 * rateFactor * t : 0;

    lineChartData.push({
      name: `${Math.round(t)}s`,
      氢气: Number(h2Volume.toFixed(1)),
      氧气: Number(o2Volume.toFixed(1)),
    });
  }

  const isElectrolyzingNow = currentStep >= 2;
  const currentH2 = isElectrolyzingNow ? 0.4 * rateFactor * elapsedTime : 0;
  const currentO2 = isElectrolyzingNow ? 0.2 * rateFactor * elapsedTime : 0;

  const barChartData: BarChartDataPoint[] = [
    { name: '20s', 氢气: Number(Number(lineChartData[4]?.氢气).toFixed(0)) || 0, 氧气: Number(Number(lineChartData[4]?.氧气).toFixed(0)) || 0 },
    { name: '40s', 氢气: Number(Number(lineChartData[8]?.氢气).toFixed(0)) || 0, 氧气: Number(Number(lineChartData[8]?.氧气).toFixed(0)) || 0 },
    { name: '60s', 氢气: Number(Number(lineChartData[12]?.氢气).toFixed(0)) || 0, 氧气: Number(Number(lineChartData[12]?.氧气).toFixed(0)) || 0 },
    { name: '80s', 氢气: Number(Number(lineChartData[16]?.氢气).toFixed(0)) || 0, 氧气: Number(Number(lineChartData[16]?.氧气).toFixed(0)) || 0 },
    { name: '100s', 氢气: Number(Number(lineChartData[20]?.氢气).toFixed(0)) || 0, 氧气: Number(Number(lineChartData[20]?.氧气).toFixed(0)) || 0 },
  ];

  return {
    lineChartData,
    lineChartSeries: [
      { key: '氢气', color: '#10B981', name: 'H₂ 体积 (mL)' },
      { key: '氧气', color: '#EF4444', name: 'O₂ 体积 (mL)' },
    ],
    barChartData,
    barChartSeries: [
      { key: '氢气', color: '#10B981', name: 'H₂ (mL)' },
      { key: '氧气', color: '#EF4444', name: 'O₂ (mL)' },
    ],
    gaugeValues: [
      { key: 'voltage', label: '电解电压', value: voltage, min: 0, max: 30, unit: 'V', color: '#F59E0B' },
      { key: 'h2', label: '氢气产量', value: currentH2, min: 0, max: 100, unit: 'mL', color: '#10B981' },
      { key: 'o2', label: '氧气产量', value: currentO2, min: 0, max: 50, unit: 'mL', color: '#EF4444' },
    ],
  };
};

const caco3Model = (ctx: SimulationContext): SimulationResult => {
  const { parameters, elapsedTime, currentStep } = ctx;
  const caco3Mass = parameters['caco3-mass'] ?? 10;
  const hclVolume = parameters['hcl-volume'] ?? 50;

  const massFactor = caco3Mass / 10;
  const volumeFactor = hclVolume / 50;
  const rateFactor = Math.min(massFactor, volumeFactor);

  const timePoints = 20;
  const lineChartData: LineChartDataPoint[] = [];

  for (let i = 0; i <= timePoints; i++) {
    const t = (i / timePoints) * 60;
    const isReacting = currentStep >= 2;
    const maxVolume = 100 * rateFactor;
    const co2Volume = isReacting ? maxVolume * (1 - Math.exp(-t / 15)) : 0;

    lineChartData.push({
      name: `${Math.round(t)}s`,
      CO2: Number(co2Volume.toFixed(1)),
    });
  }

  const isReactingNow = currentStep >= 2;
  const currentCO2 = isReactingNow
    ? (100 * rateFactor) * (1 - Math.exp(-elapsedTime / 15))
    : 0;

  const barChartData: BarChartDataPoint[] = [
    { name: '10s', CO2: Number(Number(lineChartData[3]?.CO2).toFixed(0)) || 0 },
    { name: '20s', CO2: Number(Number(lineChartData[7]?.CO2).toFixed(0)) || 0 },
    { name: '30s', CO2: Number(Number(lineChartData[10]?.CO2).toFixed(0)) || 0 },
    { name: '40s', CO2: Number(Number(lineChartData[13]?.CO2).toFixed(0)) || 0 },
    { name: '50s', CO2: Number(Number(lineChartData[17]?.CO2).toFixed(0)) || 0 },
  ];

  return {
    lineChartData,
    lineChartSeries: [{ key: 'CO2', color: '#6B7280', name: 'CO₂ 体积 (mL)' }],
    barChartData,
    barChartSeries: [{ key: 'CO2', color: '#9CA3AF', name: 'CO₂ (mL)' }],
    gaugeValues: [
      { key: 'co2', label: 'CO₂ 产量', value: currentCO2, min: 0, max: 200, unit: 'mL', color: '#6B7280' },
      { key: 'rate', label: '反应速率', value: clamp(rateFactor * 50, 0, 100), min: 0, max: 100, unit: '%', color: '#10B981' },
    ],
  };
};

const cuso4Model = (ctx: SimulationContext): SimulationResult => {
  const { parameters, elapsedTime, currentStep } = ctx;
  const heatTime = parameters['heat-time'] ?? 5;
  const cuso4Mass = parameters['cuso4-mass'] ?? 5;

  const timeFactor = heatTime / 5;
  const massFactor = cuso4Mass / 5;

  const timePoints = 20;
  const lineChartData: LineChartDataPoint[] = [];

  for (let i = 0; i <= timePoints; i++) {
    const t = (i / timePoints) * heatTime * 60;
    const isHeating = currentStep >= 2;
    const temp = isHeating
      ? clamp(25 + 225 * (1 - Math.exp(-t / (30 / timeFactor))), 25, 250)
      : 25;

    const waterLost = isHeating
      ? (massFactor * 1.8) * (1 - Math.exp(-t / (25 / timeFactor)))
      : 0;

    lineChartData.push({
      name: `${Math.round(t)}s`,
      温度: Number(temp.toFixed(1)),
      失水: Number(waterLost.toFixed(2)),
    });
  }

  const isHeatingNow = currentStep >= 2;
  const currentTemp = isHeatingNow
    ? clamp(25 + 225 * (1 - Math.exp(-elapsedTime / (30 / timeFactor))), 25, 250)
    : 25;
  const currentWaterLost = isHeatingNow
    ? (massFactor * 1.8) * (1 - Math.exp(-elapsedTime / (25 / timeFactor)))
    : 0;

  const barChartData: BarChartDataPoint[] = [
    { name: '0s', 温度: 25, 失水: 0 },
    { name: '30s', 温度: Number(Number(lineChartData[5]?.温度).toFixed(0)) || 25, 失水: Number(Number(lineChartData[5]?.失水).toFixed(2)) || 0 },
    { name: '60s', 温度: Number(Number(lineChartData[10]?.温度).toFixed(0)) || 25, 失水: Number(Number(lineChartData[10]?.失水).toFixed(2)) || 0 },
    { name: '90s', 温度: Number(Number(lineChartData[15]?.温度).toFixed(0)) || 25, 失水: Number(Number(lineChartData[15]?.失水).toFixed(2)) || 0 },
    { name: '120s', 温度: Number(Number(lineChartData[20]?.温度).toFixed(0)) || 25, 失水: Number(Number(lineChartData[20]?.失水).toFixed(2)) || 0 },
  ];

  return {
    lineChartData,
    lineChartSeries: [
      { key: '温度', color: '#EF4444', name: '温度 (°C)' },
      { key: '失水', color: '#3B82F6', name: '失水量 (g)' },
    ],
    barChartData,
    barChartSeries: [
      { key: '温度', color: '#F59E0B', name: '温度 (°C)' },
      { key: '失水', color: '#3B82F6', name: '失水量 (g)' },
    ],
    gaugeValues: [
      { key: 'temp', label: '加热温度', value: currentTemp, min: 0, max: 300, unit: '°C', color: '#EF4444' },
      { key: 'water', label: '失去结晶水', value: currentWaterLost, min: 0, max: 5, unit: 'g', color: '#3B82F6' },
    ],
  };
};

const defaultModel = (ctx: SimulationContext): SimulationResult => {
  const { elapsedTime, currentStep } = ctx;

  const lineChartData: LineChartDataPoint[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i * 10;
    lineChartData.push({
      name: `${t}s`,
      数值: Number((Math.sin(t / 20) * 50 + 50 + (currentStep * 5)).toFixed(1)),
    });
  }

  const barChartData: BarChartDataPoint[] = lineChartData.slice(0, 5);

  return {
    lineChartData,
    lineChartSeries: [{ key: '数值', color: '#1E6FBA', name: '数值' }],
    barChartData,
    barChartSeries: [{ key: '数值', color: '#10B981', name: '数值' }],
    gaugeValues: [
      { key: 'progress', label: '实验进度', value: clamp(elapsedTime / 60 * 100, 0, 100), min: 0, max: 100, unit: '%', color: '#1E6FBA' },
    ],
  };
};

const modelRegistry: Record<string, (ctx: SimulationContext) => SimulationResult> = {
  'kmno4-oxygen': kmno4Model,
  'acid-base-neutralization': acidBaseModel,
  'electrolysis-water': electrolysisModel,
  'caco3-co2': caco3Model,
  'cuso4-h2o': cuso4Model,
};

export const runSimulation = (ctx: SimulationContext): SimulationResult => {
  const model = modelRegistry[ctx.experimentId] || defaultModel;
  return model(ctx);
};

export const hasSimulationModel = (experimentId: string): boolean => {
  return experimentId in modelRegistry;
};
