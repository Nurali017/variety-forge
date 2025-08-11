import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, FileText, ArrowLeft } from "lucide-react";

interface VarietyHeaderProps {
  name: string;
  culture: string;
}

export const VarietyHeader = ({ name, culture }: VarietyHeaderProps) => {
  return (
    <div className="border-b border-border bg-card p-6">
      <div className="container mx-auto">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">{name}</h1>
            <p className="text-lg text-muted-foreground">{culture}</p>
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
            <Button asChild variant="outline" size="sm">
              <Link to="/">Вернуться к списку сортов</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};