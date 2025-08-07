import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText, ArrowLeft } from "lucide-react";

interface VarietyHeaderProps {
  name: string;
  culture: string;
  status: 'testing' | 'approved' | 'rejected';
}

const statusConfig = {
  testing: { label: 'На испытании', variant: 'secondary' as const, className: 'bg-processing text-processing-foreground hover:bg-processing/90' },
  approved: { label: 'Включён в реестр', variant: 'success' as const, className: '' },
  rejected: { label: 'Отклонён', variant: 'destructive' as const, className: '' }
};

export const VarietyHeader = ({ name, culture, status }: VarietyHeaderProps) => {
  const statusInfo = statusConfig[status];

  return (
    <div className="border-b border-border bg-card p-6">
      <div className="container mx-auto">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">{name}</h1>
            <p className="text-lg text-muted-foreground">{culture}</p>
            <Badge 
              variant={statusInfo.variant}
              className={statusInfo.className}
            >
              {statusInfo.label}
            </Badge>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Сформировать отчёт
            </Button>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};