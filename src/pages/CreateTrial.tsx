import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getVarieties } from '@/lib/varietiesStore';
import { createTrial } from '@/lib/trialsStore';
import { regionsStructure, allSites } from '@/lib/locations';

const cultureOptions = [
  { id: 'wheat', label: 'Пшеница' },
  { id: 'barley', label: 'Ячмень' },
  { id: 'potato', label: 'Картофель' },
  { id: 'sunflower', label: 'Подсолнечник' },
];

const CreateTrial = () => {
  const navigate = useNavigate();
  const varieties = useMemo(() => getVarieties(), []);

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [cultureId, setCultureId] = useState<string>('wheat');
  const [locationId, setLocationId] = useState<string>(allSites[0] ?? '');
  const [predecessor, setPredecessor] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [technology, setTechnology] = useState<string>('');
  const [selectedVarieties, setSelectedVarieties] = useState<Record<string, boolean>>({});
  const [standardVarietyId, setStandardVarietyId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const selectedIds = Object.keys(selectedVarieties).filter(id => selectedVarieties[id]);
  const canSave = year && cultureId && locationId && selectedIds.length > 0 && !!standardVarietyId && selectedIds.includes(standardVarietyId) && !saving;

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
        cultureId,
        locationId,
        participantVarietyIds: selectedIds,
        standardVarietyId,
        predecessor,
        background,
        technology,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Год</Label>
                <Input id="year" type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value || '0'))} />
              </div>
              <div>
                <Label htmlFor="culture">Культура</Label>
                <select id="culture" className="w-full h-10 border border-input rounded-md bg-background px-3 text-sm" value={cultureId} onChange={(e) => setCultureId(e.target.value)}>
                  {cultureOptions.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="location">Сортоучасток</Label>
                <select
                  id="location"
                  className="w-full h-10 border border-input rounded-md bg-background px-3 text-sm"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  {regionsStructure.map((r) => (
                    r.zones.map((z) => (
                      <optgroup key={`${r.region}-${z.name}`} label={`${r.region} — ${z.name}`}>
                        {z.sites.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </optgroup>
                    ))
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="predecessor">Предшественник</Label>
                <Input id="predecessor" value={predecessor} onChange={(e) => setPredecessor(e.target.value)} placeholder="напр. Пар" />
              </div>
              <div>
                <Label htmlFor="background">Фон</Label>
                <Input id="background" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="напр. Минеральный" />
              </div>
              <div>
                <Label htmlFor="technology">Технология</Label>
                <Input id="technology" value={technology} onChange={(e) => setTechnology(e.target.value)} placeholder="напр. Интенсивная" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-medium">Выберите сорта-участники и отметьте стандарт</div>
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
