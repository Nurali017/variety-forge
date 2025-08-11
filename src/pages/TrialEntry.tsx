import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrialHeader } from '@/components/trials/TrialHeader';
import { TrialEntryTable, ValuesMap } from '@/components/trials/TrialEntryTable';
import { getTrialById, saveResults, Trial, getResultsForTrial } from '@/lib/trialsStore';
import { getIndicatorGroups } from '@/lib/trialsConfig';

const TrialEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const trial = useMemo<Trial | undefined>(() => id ? getTrialById(id) : undefined, [id]);

  const [values, setValues] = useState<ValuesMap>({});
  const [saving, setSaving] = useState(false);
  const readOnly = new URLSearchParams(location.search).get('readonly') === '1';

  useEffect(() => {
    document.title = 'Рабочий стол сортоопыта';
  }, []);

  useEffect(() => {
    if (!trial) return;
    const initial: ValuesMap = {};
    for (const p of trial.participants) {
      initial[p.id] = {};
    }
    const existing = getResultsForTrial(trial);
    for (const r of existing) {
      if (!initial[r.participantId]) initial[r.participantId] = {};
      initial[r.participantId][r.key] = r.value;
    }
    setValues(initial);
  }, [trial]);

  if (!trial) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Сортоопыт не найден</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate('/trials')}>К списку сортоопытов</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onChange = (pid: string, key: string, value: string) => {
    setValues(prev => ({ ...prev, [pid]: { ...(prev[pid] || {}), [key]: value } }));
  };

  // validation: all input indicators must be filled for all participants
  const groups = getIndicatorGroups(trial.cultureId);
  const inputKeys = groups.flatMap(g => g.indicators).filter(i => i.type === 'input').map(i => i.key);
  const allFilled = trial.participants.every(p => inputKeys.every(k => values[p.id]?.[k]?.toString().length));

  const onSave = () => {
    setSaving(true);
    try {
      saveResults(trial, values);
      navigate('/trials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <TrialHeader cultureId={trial.cultureId} year={trial.year} locationId={trial.locationId} predecessor={trial.predecessor} background={trial.background} technology={trial.technology} />
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ввод данных сортоопыта</CardTitle>
          </CardHeader>
          <CardContent>
            <TrialEntryTable trial={trial} values={values} onChange={onChange} readOnly={readOnly} />
            <div className="mt-6 flex justify-end gap-3">
              {readOnly ? (
                <Button variant="outline" onClick={() => navigate('/trials')}>К списку сортоопытов</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/trials')}>Отмена</Button>
                  <Button onClick={onSave} disabled={!allFilled || saving}>{saving ? 'Сохранение...' : 'Сохранить данные по опыту'}</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrialEntry;
