import { useState, useEffect } from "react";
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
  console.log('Loaded varieties:', localVarieties);
  
  const mappedLocal = localVarieties.map(v => {
    // Определяем отображаемый статус
    let displayStatus = 'submitted';
    if (v.oblastStatuses && v.oblastStatuses.length > 0) {
      const firstStatus = v.oblastStatuses[0].status;
      const allSameStatus = v.oblastStatuses.every(os => os.status === firstStatus);
      displayStatus = allSameStatus ? firstStatus : 'mixed';
    }
    
    return {
      id: v.id,
      name: v.name,
      culture: v.cultureGroup,
      applicant: v.applicant,
      submissionDate: v.submissionDate,
      status: displayStatus as any,
    };
  });
  const varieties = mappedLocal;

  console.log('Mapped varieties:', varieties);
  console.log('Variety statuses:', varieties.map(v => ({ name: v.name, status: v.status })));

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
        
        {varieties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Сорта не найдены
            </h3>
            <p className="text-sm text-muted-foreground">
              Добавьте первый сорт, чтобы начать работу
            </p>
          </div>
        ) : (
          <VarietiesTable varieties={varieties} filters={filters} />
        )}
      </div>
    </div>
  );
};

export default VarietiesList;