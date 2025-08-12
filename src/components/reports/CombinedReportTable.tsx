import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReportRow } from "@/lib/reports/types";

interface CombinedReportTableProps {
  years: number[];
  rows: ReportRow[];
  defaultStandardId?: string;
}

export const CombinedReportTable = ({ years, rows, defaultStandardId }: CombinedReportTableProps) => {
  const [stdId, setStdId] = useState<string | undefined>(defaultStandardId);
  const reportYear = years[years.length - 1];

  const stdAvg = useMemo(() => rows.find(r => r.varietyId === stdId)?.avg, [rows, stdId]);
  const stdVegDays = useMemo(() => rows.find(r => r.varietyId === stdId)?.indicatorsByYear?.[reportYear]?.vegDays, [rows, stdId, reportYear]);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => (b.avg ?? -Infinity) - (a.avg ?? -Infinity));
  }, [rows]);

  const fmt = (n?: number) => (n != null ? n.toFixed(2) : "—");

  return (
    <div className="overflow-x-auto border border-border rounded-md">
      <RadioGroup value={stdId} onValueChange={setStdId}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">№</TableHead>
              <TableHead className="w-12">Стд</TableHead>
              <TableHead>Сорт</TableHead>
              <TableHead colSpan={years.length + 2} className="text-center">Урожайность, ц/га</TableHead>
              <TableHead colSpan={8} className="text-center">В отчётном году</TableHead>
            </TableRow>
            <TableRow>
              <TableHead />
              <TableHead />
              <TableHead />
              {years.map((y) => (
                <TableHead key={`y-${y}`} className="text-right">{y}</TableHead>
              ))}
              <TableHead className="text-right">средняя</TableHead>
              <TableHead className="text-right">откл. от ст-та</TableHead>
              <TableHead colSpan={2} className="text-center">вегетационный период, дней</TableHead>
              <TableHead className="text-right">масса 1000 зёрен, г</TableHead>
              <TableHead colSpan={3} className="text-center">устойчивость к: балл</TableHead>
              <TableHead className="text-right">пыльная головня</TableHead>
              <TableHead className="text-right">бурая ржавчина</TableHead>
            </TableRow>
            <TableRow>
              <TableHead />
              <TableHead />
              <TableHead />
              {years.map((y) => (
                <TableHead key={`y2-${y}`} />
              ))}
              <TableHead />
              <TableHead />
              <TableHead className="text-right">сорта</TableHead>
              <TableHead className="text-right">откл. от ст-та, +,-</TableHead>
              <TableHead />
              <TableHead className="text-right">осыпанию</TableHead>
              <TableHead className="text-right">полеганию</TableHead>
              <TableHead className="text-right">засухе</TableHead>
              <TableHead />
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row, idx) => {
              const deviationYield = stdAvg != null && row.avg != null ? row.avg - stdAvg : undefined;
              const ind = row.indicatorsByYear?.[reportYear] || {};
              const deviationVeg = ind.vegDays != null && stdVegDays != null ? ind.vegDays - stdVegDays : undefined;
              return (
                <TableRow key={row.varietyId}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`std-${reportYear}-${row.varietyId}`} value={row.varietyId} />
                      <Label htmlFor={`std-${reportYear}-${row.varietyId}`} className="sr-only">Сделать стандартом</Label>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{row.varietyName}</TableCell>
                  {years.map((y) => (
                    <TableCell key={y} className="text-right">{row.byYear[y] != null ? row.byYear[y]!.toFixed(2) : '—'}</TableCell>
                  ))}
                  <TableCell className="text-right">{row.avg != null ? row.avg.toFixed(2) : '—'}</TableCell>
                  <TableCell className={`text-right ${deviationYield != null ? (deviationYield >= 0 ? 'text-success' : 'text-destructive') : ''}`}>
                    {deviationYield != null ? `${deviationYield >= 0 ? '+' : ''}${deviationYield.toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell className="text-right">{fmt(ind.vegDays)}</TableCell>
                  <TableCell className={`text-right ${deviationVeg != null ? (deviationVeg >= 0 ? 'text-success' : 'text-destructive') : ''}`}>
                    {deviationVeg != null ? `${deviationVeg >= 0 ? '+' : ''}${deviationVeg.toFixed(2)}` : '—'}
                  </TableCell>
                  <TableCell className="text-right">{fmt(ind.thousandWeight)}</TableCell>
                  <TableCell className="text-right">{fmt(ind.resistShatter)}</TableCell>
                  <TableCell className="text-right">{fmt(ind.resistLodge)}</TableCell>
                  <TableCell className="text-right">{fmt(ind.resistDrought)}</TableCell>
                  <TableCell className="text-right">{fmt(ind.smut)}</TableCell>
                  <TableCell className="text-right">{fmt(ind.stemRust)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </RadioGroup>
    </div>
  );
};

export default CombinedReportTable;
