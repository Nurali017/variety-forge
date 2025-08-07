import { useState } from "react";
import { MainToolbar } from "@/components/varieties/MainToolbar";
import { VarietiesFilter } from "@/components/varieties/VarietiesFilter";
import { VarietiesTable } from "@/components/varieties/VarietiesTable";

interface FilterState {
  search: string;
  status: string;
  culture: string;
  region: string;
}

// Sample data - in real app would come from API
const sampleVarieties = [
  {
    id: "1",
    name: "Пшеница озимая 'Скипетр'",
    culture: "Зерновые и крупяные",
    applicant: "ТОО 'Казахский научно-исследовательский институт земледелия'",
    submissionDate: "15.03.2023",
    status: 'testing' as const
  },
  {
    id: "2",
    name: "Ячмень яровой 'Астана'",
    culture: "Зерновые и крупяные",
    applicant: "НПЦ зернового хозяйства им. А.И. Бараева",
    submissionDate: "22.04.2023",
    status: 'approved' as const
  },
  {
    id: "3",
    name: "Овёс посевной 'Казахстанский'",
    culture: "Зерновые и крупяные",
    applicant: "ТОО 'КазНИИЗиР'",
    submissionDate: "10.05.2023",
    status: 'testing' as const
  },
  {
    id: "4",
    name: "Подсолнечник 'Енбек'",
    culture: "Технические",
    applicant: "Казахский НИИ масличных культур",
    submissionDate: "28.02.2023",
    status: 'rejected' as const
  },
  {
    id: "5",
    name: "Кукуруза 'Алматы'",
    culture: "Зерновые и крупяные",
    applicant: "Алматинский НИИ картофелеводства и овощеводства",
    submissionDate: "18.06.2023",
    status: 'testing' as const
  },
  {
    id: "6",
    name: "Соя 'Жетысу'",
    culture: "Зерновые и крупяные",
    applicant: "ТОО 'Агроцентр Алматы'",
    submissionDate: "05.07.2023",
    status: 'approved' as const
  },
  {
    id: "7",
    name: "Рапс озимый 'Степной'",
    culture: "Технические",
    applicant: "НПЦ зернового хозяйства им. А.И. Бараева",
    submissionDate: "12.08.2023",
    status: 'testing' as const
  },
  {
    id: "8",
    name: "Томат 'Алматинский ранний'",
    culture: "Овощные",
    applicant: "Алматинский НИИ картофелеводства и овощеводства",
    submissionDate: "25.09.2023",
    status: 'approved' as const
  },
  {
    id: "9",
    name: "Картофель 'Нур-Султан'",
    culture: "Овощные",
    applicant: "Казахский НИИ картофелеводства",
    submissionDate: "14.10.2023",
    status: 'testing' as const
  },
  {
    id: "10",
    name: "Морковь 'Казахстанская сладкая'",
    culture: "Овощные",
    applicant: "ТОО 'Семена Казахстана'",
    submissionDate: "03.11.2023",
    status: 'rejected' as const
  },
  {
    id: "11",
    name: "Пшеница яровая 'Целинная'",
    culture: "Зерновые и крупяные",
    applicant: "НПЦ зернового хозяйства им. А.И. Бараева",
    submissionDate: "20.01.2024",
    status: 'testing' as const
  },
  {
    id: "12",
    name: "Гречиха 'Костанайская'",
    culture: "Зерновые и крупяные",
    applicant: "Костанайский НИИ сельского хозяйства",
    submissionDate: "15.02.2024",
    status: 'approved' as const
  }
];

const VarietiesList = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    culture: "",
    region: "",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainToolbar />
      
      <div className="container mx-auto py-6 space-y-6">
        <VarietiesFilter onFilterChange={handleFilterChange} />
        <VarietiesTable varieties={sampleVarieties} filters={filters} />
      </div>
    </div>
  );
};

export default VarietiesList;