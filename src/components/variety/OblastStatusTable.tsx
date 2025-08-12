import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OblastStatus } from "@/lib/varietiesStore";

interface OblastStatusTableProps {
  oblastStatuses: OblastStatus[];
}

const statusConfig: Record<string, { label: string; variant: 'secondary' | 'success' | 'destructive'; className?: string }> = {
  submitted: { label: 'Заявлен к испытанию', variant: 'secondary' },
  testing: { label: 'На испытании', variant: 'secondary', className: 'bg-processing text-processing-foreground hover:bg-processing/90' },
  approved: { label: 'Включён в реестр', variant: 'success' },
  rejected: { label: 'Отклонён', variant: 'destructive' },
  recommended_to_remove: { label: 'Рекомендован к снятию', variant: 'destructive' },
  recommended_to_extend: { label: 'Рекомендован к продлению', variant: 'success' },
  removed: { label: 'Снят', variant: 'destructive' },
};

export const OblastStatusTable = ({ oblastStatuses }: OblastStatusTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус по областям</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Область</TableHead>
              <TableHead>Текущий статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oblastStatuses.map((oblastStatus) => {
              const statusInfo = statusConfig[oblastStatus.status] || statusConfig.submitted;
              
              return (
                <TableRow key={oblastStatus.oblastId}>
                  <TableCell className="font-medium">
                    {oblastStatus.oblastName}
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
