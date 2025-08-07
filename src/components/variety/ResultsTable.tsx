import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TestResult {
  indicator: string;
  varietyValue: string;
  standardValue: string;
  deviation: string;
  isPositive?: boolean;
}

interface ResultsTableProps {
  results: TestResult[];
  year: number;
  region: string;
}

export const ResultsTable = ({ results, year, region }: ResultsTableProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {region} • {year} год
      </div>
      <div className="border border-border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Показатель</TableHead>
              <TableHead className="font-semibold">Испытываемый сорт</TableHead>
              <TableHead className="font-semibold">Стандартный сорт</TableHead>
              <TableHead className="font-semibold">Отклонение (+/-)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{result.indicator}</TableCell>
                <TableCell>{result.varietyValue}</TableCell>
                <TableCell>{result.standardValue}</TableCell>
                <TableCell>
                  <span className={
                    result.isPositive 
                      ? 'text-success font-medium' 
                      : result.isPositive === false 
                      ? 'text-destructive font-medium'
                      : 'text-foreground'
                  }>
                    {result.deviation}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};