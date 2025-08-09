import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { IndicatorGroup, getIndicatorGroups, parseNumber, round2 } from '@/lib/trialsConfig';
import { Trial } from '@/lib/trialsStore';
import { avg, stdSample, cvPercent, deltaPercent, lsd } from '@/lib/trialsStore';

export type ValuesMap = Record<string, Record<string, string>>; // participantId -> key -> value

interface TrialEntryTableProps {
  trial: Trial;
  values: ValuesMap;
  onChange: (participantId: string, key: string, value: string) => void;
}

export const TrialEntryTable = ({ trial, values, onChange }: TrialEntryTableProps) => {
  const groups = useMemo<IndicatorGroup[]>(() => getIndicatorGroups(trial.cultureId), [trial.cultureId]);

  const standardParticipant = trial.participants.find(p => p.isStandard);

  const getVal = (pid: string, key: string) => values[pid]?.[key] ?? '';

  const renderCell = (pid: string, key: string, type: 'input' | 'computed') => {
    if (type === 'input') {
      return (
        <Input
          value={getVal(pid, key)}
          onChange={(e) => onChange(pid, key, e.target.value.replace(',', '.'))}
          inputMode="decimal"
          className="h-9"
        />
      );
    }

    // computed
    // For computed fields, derive based on yield values and standard
    const y1 = parseNumber(getVal(pid, 'yield_plot1'));
    const y2 = parseNumber(getVal(pid, 'yield_plot2'));
    const y3 = parseNumber(getVal(pid, 'yield_plot3'));
    const y4 = parseNumber(getVal(pid, 'yield_plot4'));
    const arr = [y1, y2, y3, y4].filter((v): v is number => typeof v === 'number');
    const mean = arr.length === 4 ? avg(arr as number[]) : undefined;
    const sigma = arr.length === 4 ? stdSample(arr as number[]) : undefined;
    const cv = cvPercent(mean, sigma);

    const stdAvg = standardParticipant ? (() => {
      const s1 = parseNumber(getVal(standardParticipant.id, 'yield_plot1'));
      const s2 = parseNumber(getVal(standardParticipant.id, 'yield_plot2'));
      const s3 = parseNumber(getVal(standardParticipant.id, 'yield_plot3'));
      const s4 = parseNumber(getVal(standardParticipant.id, 'yield_plot4'));
      const sArr = [s1, s2, s3, s4].filter((v): v is number => typeof v === 'number');
      return sArr.length === 4 ? avg(sArr) : undefined;
    })() : undefined;

    switch (key) {
      case 'yield_avg':
        return <span>{round2(mean)}</span>;
      case 'yield_std':
        return <span>{round2(sigma)}</span>;
      case 'yield_cv':
        return <span>{round2(cv)}</span>;
      case 'yield_delta':
        return <span>{round2(deltaPercent(mean, stdAvg))}</span>;
      case 'yield_lsd':
        return <span>{round2(lsd(sigma))}</span>;
      default:
        return <span />;
    }
  };

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
                      {p.isStandard ? `Стандарт: ${p.varietyName}` : p.varietyName}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.indicators.map((ind) => (
                  <TableRow key={ind.key}>
                    <TableCell className="sticky left-0 bg-background z-10">
                      <div className="font-medium">{ind.label}{ind.unit ? `, ${ind.unit}` : ''}</div>
                      {ind.type === 'input' && ind.required && (
                        <div className="text-xs text-muted-foreground">Обязательное поле</div>
                      )}
                    </TableCell>
                    {trial.participants.map((p) => (
                      <TableCell key={p.id}>
                        {renderCell(p.id, ind.key, ind.type)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};
