import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface FilterState {
  search: string;
  status: string;
  culture: string;
  region: string;
}

interface VarietiesFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export const VarietiesFilter = ({ onFilterChange }: VarietiesFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    culture: "",
    region: "",
  });

  const statusOptions = [
    { value: "testing", label: "На испытании" },
    { value: "approved", label: "Включён в реестр" },
    { value: "rejected", label: "Отклонён" },
  ];

  const cultureOptions = [
    { value: "grains", label: "Зерновые и крупяные" },
    { value: "vegetables", label: "Овощные" },
    { value: "fruits", label: "Плодовые" },
    { value: "technical", label: "Технические" },
  ];

  const regionOptions = [
    { value: "akmola", label: "Акмолинская область" },
    { value: "kostanay", label: "Костанайская область" },
    { value: "north_kazakhstan", label: "Северо-Казахстанская область" },
    { value: "almaty", label: "Алматинская область" },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = { search: "", status: "", culture: "", region: "" };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="search">Поиск</Label>
            <Input
              id="search"
              placeholder="Наименование сорта или заявитель..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Статус</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Культура</Label>
            <Select
              value={filters.culture}
              onValueChange={(value) => handleFilterChange("culture", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите культуру" />
              </SelectTrigger>
              <SelectContent>
                {cultureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Регион</Label>
            <Select
              value={filters.region}
              onValueChange={(value) => handleFilterChange("region", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleApplyFilters}>Применить</Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Сбросить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};