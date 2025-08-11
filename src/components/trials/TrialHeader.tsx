import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cultureLabels } from '@/lib/trialsConfig';
import { getRegionName, getOblastByRegion } from '@/lib/locations';

interface TrialHeaderProps {
  cultureId: string;
  year: number;
  trialType: string;
  locationId: string;
  predecessor?: string;
  agronomicBackground?: string;
  growingConditions?: string;
  cultivationTechnology?: string;
  growingMethod?: string;
  harvestTiming?: string;
  harvestDate?: string;
  additionalInfo?: string;
}

const trialTypeLabels: Record<string, string> = {
  competitive: 'Конкурсное сортоиспытание',
  oos: 'Испытание на отличимость, однородность и стабильность (ООС)',
  entophytotrial: 'Энтофитоиспытание',
  production: 'Производственное сортоиспытание',
  technological: 'Технолого-экономическое испытание',
};

const predecessorLabels: Record<string, string> = {
  fallow: 'Пар',
  wheat: 'Пшеница',
  barley: 'Ячмень',
  oats: 'Овес',
  corn: 'Кукуруза',
  potato: 'Картофель',
  sunflower: 'Подсолнечник',
  soybean: 'Соя',
  forage_grasses: 'Кормовые травы',
  other: 'Другое',
};

const agronomicBackgroundLabels: Record<string, string> = {
  favorable: 'Благоприятный',
  moderately_favorable: 'Умеренно благоприятный',
  unfavorable: 'Неблагоприятный',
};

const growingConditionsLabels: Record<string, string> = {
  rainfed: 'На богаре',
  irrigated: 'На орошении',
  mixed: 'Смешанное',
};

const cultivationTechnologyLabels: Record<string, string> = {
  traditional: 'Традиционная',
  minimal: 'Минимальная',
  no_till: 'Нулевая (no-till)',
  organic: 'Органическая',
};

const growingMethodLabels: Record<string, string> = {
  soil_traditional: 'Традиционное выращивание в почве',
  hydroponics: 'Гидропоника',
  cuttings: 'Черенкование',
  layering: 'Отводки',
  division: 'Деление',
  grafting: 'Прививка',
  seeds: 'Выращивание из семян',
  protected_ground: 'Защищенный грунт',
  open_ground: 'Открытый грунт',
};

const harvestTimingLabels: Record<string, string> = {
  early_2: 'Очень ранняя уборка (-2)',
  early_1: 'Ранняя уборка (-1)',
  optimal: 'Оптимальный срок уборки (0)',
  late_1: 'Поздняя уборка (+1)',
  late_2: 'Очень поздняя уборка (+2)',
};

export const TrialHeader = ({ 
  cultureId, 
  year, 
  trialType,
  locationId, 
  predecessor, 
  agronomicBackground, 
  growingConditions, 
  cultivationTechnology, 
  growingMethod, 
  harvestTiming, 
  harvestDate, 
  additionalInfo 
}: TrialHeaderProps) => {
  const culture = cultureLabels[cultureId] ?? cultureId;
  const regionName = getRegionName(locationId);
  const oblast = getOblastByRegion(locationId);
  
  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        {/* Основная информация */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Культура: {culture}</Badge>
          <Badge variant="secondary">Год: {year}</Badge>
          <Badge variant="secondary">Вид испытания: {trialTypeLabels[trialType] || trialType}</Badge>
          <Badge variant="secondary">Сортоучасток: {regionName}</Badge>
          <Badge variant="secondary">Область: {oblast?.name || '—'}</Badge>
        </div>

        {/* Агрономические параметры */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Предшественник: {predecessorLabels[predecessor || ''] || predecessor || '—'}</Badge>
          <Badge variant="outline">Агрономический фон: {agronomicBackgroundLabels[agronomicBackground || ''] || agronomicBackground || '—'}</Badge>
          <Badge variant="outline">Условия выращивания: {growingConditionsLabels[growingConditions || ''] || growingConditions || '—'}</Badge>
        </div>

        {/* Технологические параметры */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Технология возделывания: {cultivationTechnologyLabels[cultivationTechnology || ''] || cultivationTechnology || '—'}</Badge>
          <Badge variant="outline">Способ выращивания: {growingMethodLabels[growingMethod || ''] || growingMethod || '—'}</Badge>
          <Badge variant="outline">Сроки уборки: {harvestTimingLabels[harvestTiming || ''] || harvestTiming || '—'}</Badge>
          {harvestDate && <Badge variant="outline">Дата уборки: {harvestDate}</Badge>}
        </div>

        {/* Дополнительная информация */}
        {additionalInfo && (
          <div className="text-sm text-muted-foreground">
            <strong>Дополнительная информация:</strong> {additionalInfo}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
