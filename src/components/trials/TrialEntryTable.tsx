import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { IndicatorGroup, getIndicatorGroups, round2 } from '@/lib/trialsConfig';
import { Trial, avg } from '@/lib/trialsStore';

export type ValuesMap = Record<string, Record<string, string>>; // participantId -> key -> value

interface TrialEntryTableProps {
  trial: Trial;
  values: ValuesMap;
  onChange: (participantId: string, key: string, value: string) => void;
  readOnly?: boolean;
}

export const TrialEntryTable = ({ trial, values, onChange, readOnly }: TrialEntryTableProps) => {
  const groups = useMemo<IndicatorGroup[]>(() => getIndicatorGroups(trial.cultureId), [trial.cultureId]);

  const getVal = (pid: string, key: string) => values[pid]?.[key] ?? '';
  const getNum = (pid: string, key: string) => {
    const s = getVal(pid, key);
    const n = Number((s || '').toString().replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  };

  const standard = trial.participants.find(p => p.isStandard);
  const avgCache: Record<string, number | undefined> = {};
  const getMean = (pid: string) => {
    if (avgCache[pid] !== undefined) return avgCache[pid];
    const arr = [getNum(pid, 'yield_plot1'), getNum(pid, 'yield_plot2'), getNum(pid, 'yield_plot3'), getNum(pid, 'yield_plot4')];
    const nums = arr.filter((v): v is number => typeof v === 'number');
    const m = nums.length === 4 ? avg(nums) : undefined;
    avgCache[pid] = m;
    return m;
  };

  const sAvg = standard ? getMean(standard.id) : undefined;

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.name} className="border rounded-md overflow-hidden">
          <div className="px-4 py-2 bg-muted text-sm font-medium">{group.name}</div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[260px] sticky left-0 bg-background z-10">Показатель</TableHead>
                  {trial.participants.map((p) => (
                    <TableHead key={p.id} className={`min-w-[220px] ${p.isStandard ? 'bg-accent/30' : ''}`}>
                      <div className="font-medium">{p.isStandard ? `Стандарт: ${p.varietyName}` : p.varietyName}</div>
                      <div className="text-xs text-muted-foreground">{trial.locationId}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.indicators.map((ind) => {
                  // Пропускаем статистику опыта из таблицы — убрано по требованию
                  if (ind.key === 'sx' || ind.key === 'p_accuracy' || ind.key === 'lsd') {
                    return null;
                  }

                  return (
                    <TableRow key={ind.key}>
                      <TableCell className="sticky left-0 bg-background z-10">
                        <div className="font-medium">{ind.label}{ind.unit ? `, ${ind.unit}` : ''}</div>
                      </TableCell>
                      {trial.participants.map((p) => {
                        if (ind.type === 'input') {
                          return (
                            <TableCell key={p.id}>
                              <Input
                                value={getVal(p.id, ind.key)}
                                onChange={(e) => onChange(p.id, ind.key, e.target.value)}
                                inputMode="decimal"
                                className="h-9"
                                disabled={readOnly}
                              />
                            </TableCell>
                          );
                        }
                        // computed per participant
                        let display = '';
                        if (ind.key === 'yield_avg') {
                          const m = getMean(p.id);
                          display = m != null ? round2(m) : '';
                        } else if (ind.key === 'over_std_abs') {
                          const m = getMean(p.id);
                          display = (m != null && sAvg != null) ? round2(m - sAvg) : '';
                        } else if (ind.key === 'over_std_pct') {
                          const m = getMean(p.id);
                          display = (m != null && sAvg && sAvg > 0) ? round2(((m - sAvg) / sAvg) * 100) : '';
                        }
                        return (
                          <TableCell key={p.id} className="text-sm text-muted-foreground">
                            {display || '—'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};
