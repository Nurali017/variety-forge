import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VarietyInfoProps {
  data: {
    applicant: string;
    inn: string;
    maturityGroup: string;
    submissionDate: string;
    targetRegions: string[];
  };
}

export const VarietyInfo = ({ data }: VarietyInfoProps) => {
  const infoItems = [
    { label: 'Заявитель', value: data.applicant },
    { label: 'ИНН/БИН', value: data.inn },
    { label: 'Группа спелости', value: data.maturityGroup },
    { label: 'Дата подачи', value: data.submissionDate },
    { label: 'Целевые регионы', value: data.targetRegions.join(', ') }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Основная информация</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-sm text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};