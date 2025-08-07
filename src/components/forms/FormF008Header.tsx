import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormContext {
  year: string;
  region: string;
  testSite: string;
  culture: string;
  variety: string;
}

interface FormF008HeaderProps {
  context: FormContext;
  onContextChange: (field: keyof FormContext, value: string) => void;
}

export const FormF008Header = ({ context, onContextChange }: FormF008HeaderProps) => {
  const years = Array.from({ length: 10 }, (_, i) => (2024 - i).toString());
  
  const regions = [
    { value: "akmola", label: "Акмолинская область" },
    { value: "kostanay", label: "Костанайская область" },
    { value: "north_kazakhstan", label: "Северо-Казахстанская область" },
    { value: "almaty", label: "Алматинская область" },
  ];

  const testSites = [
    { value: "site1", label: "Акмолинский ГСУ" },
    { value: "site2", label: "Костанайский ГСУ" },
    { value: "site3", label: "Петропавловский ГСУ" },
    { value: "site4", label: "Алматинский ГСУ" },
  ];

  const cultures = [
    { value: "wheat", label: "Пшеница" },
    { value: "barley", label: "Ячмень" },
    { value: "potato", label: "Картофель" },
    { value: "sunflower", label: "Подсолнечник" },
    { value: "corn", label: "Кукуруза" },
  ];

  const varieties = [
    { value: "variety1", label: "Пшеница озимая 'Скипетр'" },
    { value: "variety2", label: "Ячмень яровой 'Астана'" },
    { value: "variety3", label: "Картофель 'Нур-Султан'" },
    { value: "variety4", label: "Подсолнечник 'Енбек'" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Ввод результатов испытания (Форма Ф008)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Год испытания *</Label>
            <Select
              value={context.year}
              onValueChange={(value) => onContextChange("year", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Регион/Область *</Label>
            <Select
              value={context.region}
              onValueChange={(value) => onContextChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testSite">Сортоучасток *</Label>
            <Select
              value={context.testSite}
              onValueChange={(value) => onContextChange("testSite", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите участок" />
              </SelectTrigger>
              <SelectContent>
                {testSites.map((site) => (
                  <SelectItem key={site.value} value={site.value}>
                    {site.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="culture">Культура *</Label>
            <Select
              value={context.culture}
              onValueChange={(value) => onContextChange("culture", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите культуру" />
              </SelectTrigger>
              <SelectContent>
                {cultures.map((culture) => (
                  <SelectItem key={culture.value} value={culture.value}>
                    {culture.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variety">Испытываемый сорт *</Label>
            <Select
              value={context.variety}
              onValueChange={(value) => onContextChange("variety", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сорт" />
              </SelectTrigger>
              <SelectContent>
                {varieties.map((variety) => (
                  <SelectItem key={variety.value} value={variety.value}>
                    {variety.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};