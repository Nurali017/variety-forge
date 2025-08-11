import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RegionStatus } from "@/lib/varietiesStore";
import { getRegionName, getOblastByRegion } from "@/lib/locations";

interface RegionStatusTableProps {
  regionStatuses: RegionStatus[];
}

const statusConfig = {
  submitted: { label: 'Заявлен к испытанию', variant: 'secondary' as const },
  testing: { label: 'На испытании', variant: 'secondary' as const, className: 'bg-processing text-processing-foreground hover:bg-processing/90' },
  approved: { label: 'Включён в реестр', variant: 'success' as const },
  rejected: { label: 'Отклонён', variant: 'destructive' as const },
  recommended: { label: 'Рекомендован', variant: 'success' as const },
  extended: { label: 'Продлён', variant: 'secondary' as const },
  removed: { label: 'Снят', variant: 'destructive' as const },
};

export const RegionStatusTable = ({ regionStatuses }: RegionStatusTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус по регионам</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Регион (Область)</TableHead>
              <TableHead>Текущий статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regionStatuses.map((regionStatus) => {
              const statusInfo = statusConfig[regionStatus.status] || statusConfig.submitted;
              const regionName = getRegionName(regionStatus.region);
              const oblast = getOblastByRegion(regionStatus.region);
              
              return (
                <TableRow key={regionStatus.region}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{oblast?.name}</div>
                      <div className="text-sm text-muted-foreground">{regionName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={statusInfo.variant}
                      className={statusInfo.className}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
