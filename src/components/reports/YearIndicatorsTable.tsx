import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReportRow } from "@/lib/reports/types";

interface YearIndicatorsTableProps {
  year: number;
  rows: ReportRow[];
  defaultStandardId?: string;
}

export const YearIndicatorsTable = ({ year, rows, defaultStandardId }: YearIndicatorsTableProps) => {
  const [stdId, setStdId] = useState<string | undefined>(defaultStandardId);

  const stdVegDays = useMemo(() => {
    const r = rows.find((x) => x.varietyId === stdId);
    return r?.indicatorsByYear?.[year]?.vegDays;
  }, [rows, stdId, year]);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => a.varietyName.localeCompare(b.varietyName));
  }, [rows]);

  const fmt = (n?: number) => (n != null ? n.toFixed(2) : "—");

  return (
    <div className="overflow-x-auto border border-border rounded-md">
      <RadioGroup value={stdId} onValueChange={setStdId}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Стд</TableHead>
              <TableHead>Сорт</TableHead>
              <TableHead colSpan={2} className="text-center">Вегетационный период</TableHead>
              <TableHead className="text-right">Масса 1000 зёрен</TableHead>
              <TableHead colSpan={3} className="text-center">Устойчивость к:</TableHead>
              <TableHead className="text-right">Пыльная головня</TableHead>
              <TableHead className="text-right">Бурая ржавчина</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead />
              <TableHead className="text-right">сорта</TableHead>
              <TableHead className="text-right">отклон. от ст-та, +,-</TableHead>
              <TableHead className="text-right">г</TableHead>
              <TableHead className="text-right">осыпанию</TableHead>
              <TableHead className="text-right">полеганию</TableHead>
              <TableHead className="text-right">засухе</TableHead>
              <TableHead className="text-right">балл</TableHead>
              <TableHead className="text-right">балл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => {
              const ind = row.indicatorsByYear?.[year] || {};
              const dev = ind.vegDays != null && stdVegDays != null ? ind.vegDays - stdVegDays : undefined;
              return (
                <TableRow key={row.varietyId}>
                  <TableCell className="align-middle">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`std-ind-${year}-${row.varietyId}`} value={row.varietyId} />
                      <Label htmlFor={`std-ind-${year}-${row.varietyId}`} className="sr-only">Сделать стандартом</Label>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{row.varietyName}</TableCell>
                  <TableCell className="text-right">{fmt(ind.vegDays)}</TableCell>
                  <TableCell className={`text-right ${dev != null ? (dev >= 0 ? 'text-success' : 'text-destructive') : ''}`}>
                    {dev != null ? `${dev >= 0 ? '+' : ''}${dev.toFixed(2)}` : '—'}
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

export default YearIndicatorsTable;
