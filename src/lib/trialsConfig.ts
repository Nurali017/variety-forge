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
  wheat: 'Пшеница мягкая',
  barley: 'Ячмень',
  potato: 'Картофель',
  sunflower: 'Подсолнечник',
  sugar_beet: 'Свекла сахарная',
  apricot: 'Абрикос',
  quince: 'Айва',
  cherry_plum: 'Алыча',
};

export function getIndicatorGroups(cultureId: string): IndicatorGroup[] {
  // Унифицированная модель: только вводимые пользователем поля (без вычислений)
  if (cultureId === 'wheat') {
    const groups: IndicatorGroup[] = [
      {
        name: '1. Урожайность и структура',
        indicators: [
          { key: 'yield_avg', label: 'Урожайность', unit: 'ц/га', type: 'input', group: 'yield' },
          { key: 'over_std_abs', label: 'Превышение над стандартом', unit: 'ц/га', type: 'input', group: 'yield' },
          { key: 'over_std_pct', label: 'Превышение над стандартом', unit: '%', type: 'input', group: 'yield' },
          { key: 'thousand_grain_weight', label: 'Масса 1000 зерен', unit: 'г', type: 'input', group: 'yield' },
          { key: 'grain_nature', label: 'Натура зерна', unit: 'г/л', type: 'input', group: 'yield' },
        ],
      },
      {
        name: '2. Вегетационные показатели',
        indicators: [
          { key: 'vegetation_period', label: 'Вегетационный период', unit: 'дней', type: 'input', group: 'veg' },
          { key: 'plant_height', label: 'Высота растений', unit: 'см', type: 'input', group: 'veg' },
          { key: 'preharvest_moisture', label: 'Предуборочная влажность', unit: '%', type: 'input', group: 'veg' },
        ],
      },
      {
        name: '3. Устойчивость (баллы)',
        indicators: [
          { key: 'lodging_resistance', label: 'Устойчивость к полеганию', unit: 'балл', type: 'input', group: 'res' },
          { key: 'shattering_resistance', label: 'Устойчивость к осыпанию', unit: 'балл', type: 'input', group: 'res' },
          { key: 'drought_resistance', label: 'Устойчивость к засухе', unit: 'балл', type: 'input', group: 'res' },
        ],
      },
      {
        name: '4. Показатели качества зерна',
        indicators: [
          { key: 'protein_content', label: 'Содержание белка', unit: '%', type: 'input', group: 'quality' },
          { key: 'raw_gluten', label: 'Содержание сырой клейковины', unit: '%', type: 'input', group: 'quality' },
          { key: 'glassiness', label: 'Стекловидность', unit: '%', type: 'input', group: 'quality' },
          { key: 'bread_volume', label: 'Объем хлеба', unit: 'см³', type: 'input', group: 'quality' },
          { key: 'baking_score', label: 'Общая хлебопекарная оценка', unit: 'балл', type: 'input', group: 'quality' },
        ],
      },
      {
        name: '5. Устойчивость к болезням',
        indicators: [
          { key: 'smut', label: 'Пыльная головня', unit: 'балл', type: 'input', group: 'disease' },
          { key: 'stem_rust', label: 'Стеблевая ржавчина', unit: 'балл', type: 'input', group: 'disease' },
          { key: 'ear_septoria', label: 'Септориоз колоса', unit: 'балл', type: 'input', group: 'disease' },
        ],
      },
      {
        name: '6. Итоговая оценка',
        indicators: [
          { key: 'final_score', label: 'Общая оценка сорта', unit: 'балл', type: 'input', group: 'final' },
        ],
      },
    ];
    return groups;
  }

  // Прочие культуры: базовый набор вводимых показателей без вычислений
  const base: IndicatorGroup[] = [
    {
      name: '1. Урожайность',
      indicators: [
        { key: 'yield_avg', label: 'Урожайность', unit: 'ц/га', type: 'input', group: 'yield' },
      ],
    },
    {
      name: '2. Основные показатели',
      indicators: [
        { key: 'vegetation_period', label: 'Вегетационный период', unit: 'дней', type: 'input', group: 'main' },
        { key: 'plant_height', label: 'Высота растений', unit: 'см', type: 'input', group: 'main' },
      ],
    },
  ];

  return base;
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
