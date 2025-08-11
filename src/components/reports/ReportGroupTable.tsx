import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReportRow } from "@/lib/reports/types";

interface ReportGroupTableProps {
  years: number[];
  rows: ReportRow[];
  defaultStandardId?: string;
}

export const ReportGroupTable = ({ years, rows, defaultStandardId }: ReportGroupTableProps) => {
  const [stdId, setStdId] = useState<string | undefined>(defaultStandardId);

  const stdAvg = useMemo(() => {
    const r = rows.find((x) => x.varietyId === stdId);
    return r?.avg;
  }, [rows, stdId]);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => (b.avg ?? -Infinity) - (a.avg ?? -Infinity));
  }, [rows]);

  return (
    <div className="overflow-x-auto border border-border rounded-md">
      <RadioGroup value={stdId} onValueChange={setStdId}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Стд</TableHead>
              <TableHead>Сорт</TableHead>
              {years.map((y) => (
                <TableHead key={y} className="text-right">{y}</TableHead>
              ))}
              <TableHead className="text-right">Средняя</TableHead>
              <TableHead className="text-right">Отклонение от ст-та</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => {
              const deviation = stdAvg != null && row.avg != null ? row.avg - stdAvg : undefined;
              return (
                <TableRow key={row.varietyId}>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`std-${row.varietyId}`} value={row.varietyId} />
                      <Label htmlFor={`std-${row.varietyId}`} className="sr-only">Сделать стандартом</Label>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{row.varietyName}</TableCell>
                  {years.map((y) => (
                    <TableCell key={y} className="text-right">{row.byYear[y] != null ? row.byYear[y]!.toFixed(2) : '—'}</TableCell>
                  ))}
                  <TableCell className="text-right">{row.avg != null ? row.avg.toFixed(2) : '—'}</TableCell>
                  <TableCell className={`text-right ${deviation != null ? (deviation >= 0 ? 'text-success' : 'text-destructive') : ''}`}>
                    {deviation != null ? `${deviation >= 0 ? '+' : ''}${deviation.toFixed(2)}` : '—'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </RadioGroup>
    </div>
  );
};
