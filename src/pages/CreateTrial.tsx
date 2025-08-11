import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getVarieties } from '@/lib/varietiesStore';
import { createTrial } from '@/lib/trialsStore';
import { getAllRegions, getRegionName, getRegionsByOblast, getOblastByRegion } from '@/lib/locations';

const cultureOptions = [
  { id: 'wheat', label: 'Пшеница' },
  { id: 'barley', label: 'Ячмень' },
  { id: 'oats', label: 'Овес' },
  { id: 'corn', label: 'Кукуруза' },
  { id: 'potato', label: 'Картофель' },
  { id: 'sunflower', label: 'Подсолнечник' },
  { id: 'soybean', label: 'Соя' },
  { id: 'rapeseed', label: 'Рапс' },
  { id: 'forage_grasses', label: 'Кормовые травы' },
  { id: 'other', label: 'Другое' },
];

const trialTypeOptions = [
  { id: 'competitive', label: 'Конкурсное сортоиспытание' },
  { id: 'oos', label: 'Испытание на отличимость, однородность и стабильность (ООС)' },
  { id: 'entophytotrial', label: 'Энтофитоиспытание' },
  { id: 'production', label: 'Производственное сортоиспытание' },
  { id: 'technological', label: 'Технолого-экономическое испытание' },
];

const predecessorOptions = [
  { id: 'fallow', label: 'Пар' },
  { id: 'wheat', label: 'Пшеница' },
  { id: 'barley', label: 'Ячмень' },
  { id: 'oats', label: 'Овес' },
  { id: 'corn', label: 'Кукуруза' },
  { id: 'potato', label: 'Картофель' },
  { id: 'sunflower', label: 'Подсолнечник' },
  { id: 'soybean', label: 'Соя' },
  { id: 'forage_grasses', label: 'Кормовые травы' },
  { id: 'other', label: 'Другое' },
];

const agronomicBackgroundOptions = [
  { id: 'favorable', label: 'Благоприятный' },
  { id: 'moderately_favorable', label: 'Умеренно благоприятный' },
  { id: 'unfavorable', label: 'Неблагоприятный' },
];

const growingConditionsOptions = [
  { id: 'rainfed', label: 'На богаре' },
  { id: 'irrigated', label: 'На орошении' },
  { id: 'mixed', label: 'Смешанное' },
];

const cultivationTechnologyOptions = [
  { id: 'traditional', label: 'Традиционная' },
  { id: 'minimal', label: 'Минимальная' },
  { id: 'no_till', label: 'Нулевая (no-till)' },
  { id: 'organic', label: 'Органическая' },
];

const growingMethodOptions = [
  { id: 'soil_traditional', label: 'Традиционное выращивание в почве' },
  { id: 'hydroponics', label: 'Гидропоника' },
  { id: 'cuttings', label: 'Черенкование' },
  { id: 'layering', label: 'Отводки' },
  { id: 'division', label: 'Деление' },
  { id: 'grafting', label: 'Прививка' },
  { id: 'seeds', label: 'Выращивание из семян' },
  { id: 'protected_ground', label: 'Защищенный грунт' },
  { id: 'open_ground', label: 'Открытый грунт' },
];

const harvestTimingOptions = [
  { id: 'early_2', label: 'Очень ранняя уборка (-2)' },
  { id: 'early_1', label: 'Ранняя уборка (-1)' },
  { id: 'optimal', label: 'Оптимальный срок уборки (0)' },
  { id: 'late_1', label: 'Поздняя уборка (+1)' },
  { id: 'late_2', label: 'Очень поздняя уборка (+2)' },
];

const CreateTrial = () => {
  const navigate = useNavigate();
  const varieties = useMemo(() => getVarieties(), []);
  const allRegions = useMemo(() => getAllRegions(), []);
  // Фильтруем только регионы (города и районы), исключаем области
  const trialSites = useMemo(() => allRegions.filter(region => region.type !== 'oblast'), [allRegions]);

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [trialType, setTrialType] = useState<string>('competitive');
  const [cultureId, setCultureId] = useState<string>('wheat');
  const [locationId, setLocationId] = useState<string>(trialSites[0]?.id ?? '');
  const [predecessor, setPredecessor] = useState<string>('fallow');
  const [agronomicBackground, setAgronomicBackground] = useState<string>('favorable');
  const [growingConditions, setGrowingConditions] = useState<string>('rainfed');
  const [cultivationTechnology, setCultivationTechnology] = useState<string>('traditional');
  const [growingMethod, setGrowingMethod] = useState<string>('soil_traditional');
  const [harvestTiming, setHarvestTiming] = useState<string>('optimal');
  const [harvestDate, setHarvestDate] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [selectedVarieties, setSelectedVarieties] = useState<Record<string, boolean>>({});
  const [standardVarietyId, setStandardVarietyId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const selectedIds = Object.keys(selectedVarieties).filter(id => selectedVarieties[id]);
  const canSave = year && trialType && cultureId && locationId && selectedIds.length > 0 && !!standardVarietyId && selectedIds.includes(standardVarietyId) && !saving;

  const toggleVariety = (id: string) => {
    setSelectedVarieties(prev => ({ ...prev, [id]: !prev[id] }));
    if (id === standardVarietyId && !!selectedVarieties[id]) {
      setStandardVarietyId('');
    }
  };

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const trial = createTrial({
        year,
        trialType,
        cultureId,
        locationId,
        participantVarietyIds: selectedIds,
        standardVarietyId,
        predecessor,
        agronomicBackground,
        growingConditions,
        cultivationTechnology,
        growingMethod,
        harvestTiming,
        harvestDate,
        additionalInfo,
      });
      navigate(`/trials/${trial.id}/entry`);
    } finally {
      setSaving(false);
    }
  };

  // SEO
  document.title = 'Создание сортоопыта';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Создать сортоопыт</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Основные параметры */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Год *</Label>
                <Input 
                  id="year" 
                  type="number" 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value || '0'))} 
                />
              </div>
              <div>
                <Label htmlFor="trialType">Вид испытания *</Label>
                <Select value={trialType} onValueChange={setTrialType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вид испытания" />
                  </SelectTrigger>
                  <SelectContent>
                    {trialTypeOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="culture">Культура *</Label>
                <Select value={cultureId} onValueChange={setCultureId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите культуру" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultureOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Сортоучасток и область */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Наименование сортоучастка и области *</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сортоучасток" />
                  </SelectTrigger>
                  <SelectContent>
                    {trialSites.map((region) => {
                      const oblast = getOblastByRegion(region.id);
                      return (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name} ({oblast?.name})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="harvestDate">Дата уборки</Label>
                <Input 
                  id="harvestDate" 
                  type="date" 
                  value={harvestDate} 
                  onChange={(e) => setHarvestDate(e.target.value)} 
                />
              </div>
            </div>

            {/* Агрономические параметры */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="predecessor">Предшественник</Label>
                <Select value={predecessor} onValueChange={setPredecessor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите предшественник" />
                  </SelectTrigger>
                  <SelectContent>
                    {predecessorOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agronomicBackground">Агрономический фон</Label>
                <Select value={agronomicBackground} onValueChange={setAgronomicBackground}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите агрономический фон" />
                  </SelectTrigger>
                  <SelectContent>
                    {agronomicBackgroundOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="growingConditions">Условия выращивания</Label>
                <Select value={growingConditions} onValueChange={setGrowingConditions}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите условия выращивания" />
                  </SelectTrigger>
                  <SelectContent>
                    {growingConditionsOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Технологические параметры */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cultivationTechnology">Технология возделывания</Label>
                <Select value={cultivationTechnology} onValueChange={setCultivationTechnology}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите технологию" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultivationTechnologyOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="growingMethod">Способ выращивания</Label>
                <Select value={growingMethod} onValueChange={setGrowingMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите способ выращивания" />
                  </SelectTrigger>
                  <SelectContent>
                    {growingMethodOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="harvestTiming">Сроки уборки</Label>
                <Select value={harvestTiming} onValueChange={setHarvestTiming}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сроки уборки" />
                  </SelectTrigger>
                  <SelectContent>
                    {harvestTimingOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div>
              <Label htmlFor="additionalInfo">Дополнительная информация</Label>
              <Textarea 
                id="additionalInfo" 
                value={additionalInfo} 
                onChange={(e) => setAdditionalInfo(e.target.value)} 
                placeholder="Дополнительные сведения об условиях проведения испытания..."
                rows={3}
              />
            </div>

            {/* Выбор сортов */}
            <div className="space-y-3">
              <div className="font-medium">Выберите сорта-участники и отметьте стандарт *</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {varieties.map(v => (
                  <label key={v.id} className="flex items-center gap-3 rounded-md border p-3">
                    <Checkbox checked={!!selectedVarieties[v.id]} onCheckedChange={() => toggleVariety(v.id)} />
                    <div className="flex-1">
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">{v.cultureGroup} • {v.applicant}</div>
                    </div>
                    <input
                      type="radio"
                      name="standard"
                      className="h-4 w-4"
                      checked={standardVarietyId === v.id}
                      onChange={() => setStandardVarietyId(v.id)}
                      disabled={!selectedVarieties[v.id]}
                      aria-label="Отметить как стандарт"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/trials')}>Отмена</Button>
              <Button onClick={onSave} disabled={!canSave}>{saving ? 'Сохранение...' : 'Создать и открыть'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTrial;
