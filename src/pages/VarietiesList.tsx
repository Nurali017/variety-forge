import { useState } from "react";
import { MainToolbar } from "@/components/varieties/MainToolbar";
import { VarietiesFilter } from "@/components/varieties/VarietiesFilter";
import { VarietiesTable } from "@/components/varieties/VarietiesTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getVarieties } from "@/lib/varietiesStore";

interface FilterState {
  search: string;
  status: string;
  culture: string;
  region: string;
}

// Убраны статические образцы — показываем только данные из localStorage
const sampleVarieties: any[] = [];

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

  const localVarieties = getVarieties();
  const mappedLocal = localVarieties.map(v => ({
    id: v.id,
    name: v.name,
    culture: v.cultureGroup,
    applicant: v.applicant,
    submissionDate: v.submissionDate,
    status: v.status as any,
  }));
  const varieties = mappedLocal;

  return (
    <div className="min-h-screen bg-background">
      <MainToolbar />
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div />
          <Button asChild>
            <Link to="/varieties/new">+ Добавить новый сорт</Link>
          </Button>
        </div>
        <VarietiesFilter onFilterChange={handleFilterChange} />
        <VarietiesTable varieties={varieties} filters={filters} />
      </div>
    </div>
  );
};

export default VarietiesList;