import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Variety {
  id: string;
  name: string;
  culture: string;
  applicant: string;
  submissionDate: string;
  status: 'testing' | 'approved' | 'rejected';
}

interface FilterState {
  search: string;
  status: string;
  culture: string;
  region: string;
}

interface VarietiesTableProps {
  varieties: Variety[];
  filters: FilterState;
}

type SortField = keyof Variety;
type SortDirection = 'asc' | 'desc';

const statusConfig = {
  testing: { label: 'На испытании', variant: 'secondary' as const, className: 'bg-processing text-processing-foreground hover:bg-processing/90' },
  approved: { label: 'Включён в реестр', variant: 'success' as const, className: '' },
  rejected: { label: 'Отклонён', variant: 'destructive' as const, className: '' }
};

export const VarietiesTable = ({ varieties, filters }: VarietiesTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('submissionDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const itemsPerPage = 10;

  // Filter varieties based on filters
  const filteredVarieties = useMemo(() => {
    return varieties.filter((variety) => {
      const matchesSearch = !filters.search || 
        variety.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        variety.applicant.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || variety.status === filters.status;
      
      // Note: culture and region filtering would need mapping from filter values to actual data
      const matchesCulture = !filters.culture || variety.culture.toLowerCase().includes(filters.culture);
      
      return matchesSearch && matchesStatus && matchesCulture;
    });
  }, [varieties, filters]);

  // Sort varieties
  const sortedVarieties = useMemo(() => {
    return [...filteredVarieties].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredVarieties, sortField, sortDirection]);

  // Paginate varieties
  const paginatedVarieties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedVarieties.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedVarieties, currentPage]);

  const totalPages = Math.ceil(sortedVarieties.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (varietyId: string) => {
    navigate(`/variety/${varietyId}`);
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-semibold hover:bg-transparent"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="border border-border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">№ п/п</TableHead>
                <SortableHeader field="name">Наименование сорта</SortableHeader>
                <SortableHeader field="culture">Культура</SortableHeader>
                <SortableHeader field="applicant">Заявитель</SortableHeader>
                <SortableHeader field="submissionDate">Дата подачи</SortableHeader>
                <SortableHeader field="status">Статус</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVarieties.map((variety, index) => {
                const statusInfo = statusConfig[variety.status];
                const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                
                return (
                  <TableRow
                    key={variety.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleRowClick(variety.id)}
                  >
                    <TableCell className="font-medium">{rowNumber}</TableCell>
                    <TableCell className="font-medium">{variety.name}</TableCell>
                    <TableCell>{variety.culture}</TableCell>
                    <TableCell>{variety.applicant}</TableCell>
                    <TableCell>{variety.submissionDate}</TableCell>
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
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Показано {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedVarieties.length)} из {sortedVarieties.length} записей
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-foreground">
                Страница {currentPage} из {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};