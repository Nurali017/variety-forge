import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { IndicatorGroup, getIndicatorGroups } from '@/lib/trialsConfig';
import { Trial } from '@/lib/trialsStore';

export type ValuesMap = Record<string, Record<string, string>>; // participantId -> key -> value

interface TrialEntryTableProps {
  trial: Trial;
  values: ValuesMap;
  onChange: (participantId: string, key: string, value: string) => void;
}

export const TrialEntryTable = ({ trial, values, onChange }: TrialEntryTableProps) => {
  const groups = useMemo<IndicatorGroup[]>(() => getIndicatorGroups(trial.cultureId), [trial.cultureId]);

  const getVal = (pid: string, key: string) => values[pid]?.[key] ?? '';

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
                    </TableCell>
                    {trial.participants.map((p) => (
                      <TableCell key={p.id}>
                        <Input
                          value={getVal(p.id, ind.key)}
                          onChange={(e) => onChange(p.id, ind.key, e.target.value)}
                          inputMode="decimal"
                          className="h-9"
                        />
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
