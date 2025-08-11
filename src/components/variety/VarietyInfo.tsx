import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOblasts } from "@/lib/locations";

interface VarietyInfoProps {
  data: {
    applicant: string;
    inn: string;
    contactPerson: {
      name: string;
      phone: string;
      email: string;
    };
    maturityGroup: string;
    submissionDate: string;
    targetOblasts: string[];
    gssCheck: boolean;
  };
}

export const VarietyInfo = ({ data }: VarietyInfoProps) => {
  const { applicant, inn, contactPerson, maturityGroup, submissionDate, targetOblasts, gssCheck } = data;
  
  // Получаем названия областей
  const oblasts = getOblasts();
  const oblastNames = targetOblasts.map(oblastId => {
    const oblast = oblasts.find(o => o.id === oblastId);
    return oblast?.name || oblastId;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Основная информация</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основные данные */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Заявитель</dt>
            <dd className="text-sm text-foreground">{applicant}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">ИНН/БИН</dt>
            <dd className="text-sm text-foreground">{inn}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Группа спелости</dt>
            <dd className="text-sm text-foreground">{maturityGroup}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Дата подачи</dt>
            <dd className="text-sm text-foreground">{submissionDate}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-muted-foreground">Целевые области</dt>
            <dd className="text-sm text-foreground">{oblastNames.join(', ')}</dd>
          </div>
        </div>

        {/* Контактное лицо */}
        <div className="border-t pt-4">
          <h3 className="text-md font-medium text-foreground mb-2">Контактное лицо</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ФИО</dt>
              <dd className="text-sm text-foreground">{contactPerson.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Телефон</dt>
              <dd className="text-sm text-foreground">{contactPerson.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm text-foreground">{contactPerson.email}</dd>
            </div>
          </div>
        </div>

        {/* Проверка на ООС */}
        <div className="border-t pt-4">
            <dt className="text-sm font-medium text-muted-foreground">Проверка на ООС</dt>
            <dd>
              <Badge variant={gssCheck ? "success" : "secondary"}>
                {gssCheck ? "Пройдена" : "Не пройдена"}
              </Badge>
            </dd>
        </div>
      </CardContent>
    </Card>
  );
};
