export type IndicatorType = 'input' | 'computed';

export interface IndicatorDef {
  key: string;
  label: string;
  unit?: string;
  type: IndicatorType;
  group: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface IndicatorGroup {
  name: string;
  indicators: IndicatorDef[];
}

export const cultureLabels: Record<string, string> = {
  wheat: 'Пшеница',
  barley: 'Ячмень',
  potato: 'Картофель',
  sunflower: 'Подсолнечник',
};

export function getIndicatorGroups(cultureId: string): IndicatorGroup[] {
  const yieldGroup: IndicatorGroup = {
    name: '1. Урожайность',
    indicators: [
      { key: 'yield_plot1', label: 'Урожайность, делянка 1', unit: 'ц/га', type: 'input', group: 'yield', required: true, min: 0, max: 500, step: 0.01 },
      { key: 'yield_plot2', label: 'Урожайность, делянка 2', unit: 'ц/га', type: 'input', group: 'yield', required: true, min: 0, max: 500, step: 0.01 },
      { key: 'yield_plot3', label: 'Урожайность, делянка 3', unit: 'ц/га', type: 'input', group: 'yield', required: true, min: 0, max: 500, step: 0.01 },
      { key: 'yield_plot4', label: 'Урожайность, делянка 4', unit: 'ц/га', type: 'input', group: 'yield', required: true, min: 0, max: 500, step: 0.01 },
      { key: 'yield_avg', label: 'Средняя урожайность', unit: 'ц/га', type: 'computed', group: 'yield' },
      { key: 'yield_std', label: 'Стандартное отклонение (σ)', unit: '', type: 'computed', group: 'yield' },
      { key: 'yield_cv', label: 'Коэфф. вариации (Cv, %)', unit: '%', type: 'computed', group: 'yield' },
      { key: 'yield_delta', label: 'Превышение над стандартом (Δ, %)', unit: '%', type: 'computed', group: 'yield' },
      { key: 'yield_lsd', label: 'НСР', unit: '', type: 'computed', group: 'yield' },
    ],
  };

  const cerealsMain: IndicatorGroup = {
    name: '2. Основные показатели',
    indicators: [
      { key: 'thousand_grain_weight', label: 'Масса 1000 зерен', unit: 'г', type: 'input', group: 'main', required: true, min: 0, max: 200, step: 0.01 },
      { key: 'plant_height', label: 'Высота растений', unit: 'см', type: 'input', group: 'main', required: true, min: 0, max: 400, step: 1 },
      { key: 'vegetation_period', label: 'Вегетационный период', unit: 'дней', type: 'input', group: 'main', required: true, min: 1, max: 400, step: 1 },
    ],
  };

  const potatoMain: IndicatorGroup = {
    name: '2. Основные показатели',
    indicators: [
      { key: 'marketable_tuber_weight', label: 'Масса товарного клубня', unit: 'г', type: 'input', group: 'main', required: true, min: 0, max: 2000, step: 1 },
      { key: 'marketability', label: 'Товарность', unit: '%', type: 'input', group: 'main', required: true, min: 0, max: 100, step: 0.1 },
      { key: 'vegetation_period', label: 'Вегетационный период', unit: 'дней', type: 'input', group: 'main', required: true, min: 1, max: 400, step: 1 },
    ],
  };

  const resilience: IndicatorGroup = {
    name: '3. Устойчивость (1–9 баллов)',
    indicators: [
      { key: 'lodging_resistance', label: 'Устойчивость к полеганию', unit: 'балл', type: 'input', group: 'res', required: true, min: 1, max: 9, step: 1 },
      { key: 'drought_resistance', label: 'Устойчивость к засухе', unit: 'балл', type: 'input', group: 'res', required: true, min: 1, max: 9, step: 1 },
      { key: 'disease_resistance', label: 'Устойчивость к болезням', unit: 'балл', type: 'input', group: 'res', required: true, min: 1, max: 9, step: 1 },
    ],
  };

  const cerealsQuality: IndicatorGroup = {
    name: '4. Показатели качества',
    indicators: [
      { key: 'protein_content', label: 'Содержание белка', unit: '%', type: 'input', group: 'quality', required: true, min: 0, max: 100, step: 0.01 },
      { key: 'gluten_content', label: 'Содержание клейковины', unit: '%', type: 'input', group: 'quality', required: true, min: 0, max: 100, step: 0.01 },
      { key: 'glassiness', label: 'Стекловидность', unit: '%', type: 'input', group: 'quality', required: true, min: 0, max: 100, step: 0.1 },
    ],
  };

  const potatoQuality: IndicatorGroup = {
    name: '4. Показатели качества',
    indicators: [
      { key: 'starch_content', label: 'Содержание крахмала', unit: '%', type: 'input', group: 'quality', required: true, min: 0, max: 100, step: 0.1 },
      { key: 'tasting_score', label: 'Дегустационная оценка', unit: 'балл', type: 'input', group: 'quality', required: true, min: 1, max: 9, step: 1 },
    ],
  };

  const oilsQuality: IndicatorGroup = {
    name: '4. Показатели качества',
    indicators: [
      { key: 'fat_content', label: 'Содержание жира (масличность)', unit: '%', type: 'input', group: 'quality', required: true, min: 0, max: 100, step: 0.1 },
    ],
  };

  switch (cultureId) {
    case 'potato':
      return [yieldGroup, potatoMain, resilience, potatoQuality];
    case 'sunflower':
      return [yieldGroup, cerealsMain, resilience, oilsQuality];
    case 'barley':
    case 'wheat':
    default:
      return [yieldGroup, cerealsMain, resilience, cerealsQuality];
  }
}

export function parseNumber(value: string | undefined): number | undefined {
  if (value == null) return undefined;
  const normalized = value.replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : undefined;
}

export function round2(n: number | undefined): string {
  if (n == null || !Number.isFinite(n)) return '';
  return (Math.round(n * 100) / 100).toFixed(2);
}
