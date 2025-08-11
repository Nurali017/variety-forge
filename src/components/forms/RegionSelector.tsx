import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getOblasts, getRegionsByOblast, getRegionName } from "@/lib/locations";

interface RegionSelectorProps {
  selectedRegions: string[];
  onRegionsChange: (regions: string[]) => void;
}

export const RegionSelector = ({ selectedRegions, onRegionsChange }: RegionSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOblasts, setExpandedOblasts] = useState<string[]>([]);
  
  const oblasts = getOblasts();
  
  const handleOblastToggle = (oblastId: string) => {
    setExpandedOblasts(prev => 
      prev.includes(oblastId) 
        ? prev.filter(id => id !== oblastId)
        : [...prev, oblastId]
    );
  };
  
  const handleRegionToggle = (regionId: string, checked: boolean) => {
    if (checked) {
      onRegionsChange([...selectedRegions, regionId]);
    } else {
      onRegionsChange(selectedRegions.filter(id => id !== regionId));
    }
  };
  
  const handleOblastSelectAll = (oblastId: string, checked: boolean) => {
    const oblastRegions = getRegionsByOblast(oblastId);
    const regionIds = oblastRegions.map(r => r.id);
    
    if (checked) {
      // Добавляем все регионы области, которые еще не выбраны
      const newRegions = [...selectedRegions];
      regionIds.forEach(id => {
        if (!newRegions.includes(id)) {
          newRegions.push(id);
        }
      });
      onRegionsChange(newRegions);
    } else {
      // Убираем все регионы области
      onRegionsChange(selectedRegions.filter(id => !regionIds.includes(id)));
    }
  };
  
  const filteredOblasts = oblasts.filter(oblast => {
    if (!searchTerm) return true;
    
    // Проверяем название области
    if (oblast.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
    
    // Проверяем названия регионов в области
    const oblastRegions = getRegionsByOblast(oblast.id);
    return oblastRegions.some(region => 
      region.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const getSelectedCountInOblast = (oblastId: string) => {
    const oblastRegions = getRegionsByOblast(oblastId);
    return oblastRegions.filter(region => selectedRegions.includes(region.id)).length;
  };
  
  const isOblastFullySelected = (oblastId: string) => {
    const oblastRegions = getRegionsByOblast(oblastId);
    return oblastRegions.every(region => selectedRegions.includes(region.id));
  };
  
  const isOblastPartiallySelected = (oblastId: string) => {
    const selectedCount = getSelectedCountInOblast(oblastId);
    const totalCount = getRegionsByOblast(oblastId).length;
    return selectedCount > 0 && selectedCount < totalCount;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Выбор целевых регионов *</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск по областям и регионам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredOblasts.map((oblast) => {
          const oblastRegions = getRegionsByOblast(oblast.id);
          const isExpanded = expandedOblasts.includes(oblast.id);
          const selectedCount = getSelectedCountInOblast(oblast.id);
          const totalCount = oblastRegions.length;
          
          return (
            <div key={oblast.id} className="border rounded-lg">
              <div className="flex items-center space-x-2 p-3 bg-muted/50">
                <Checkbox
                  id={`oblast-${oblast.id}`}
                  checked={isOblastFullySelected(oblast.id)}
                  ref={(ref) => {
                    if (ref) {
                      ref.indeterminate = isOblastPartiallySelected(oblast.id);
                    }
                  }}
                  onCheckedChange={(checked) => handleOblastSelectAll(oblast.id, checked as boolean)}
                />
                <Label 
                  htmlFor={`oblast-${oblast.id}`}
                  className="flex-1 cursor-pointer font-medium"
                  onClick={() => handleOblastToggle(oblast.id)}
                >
                  {oblast.name}
                  {selectedCount > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({selectedCount}/{totalCount})
                    </span>
                  )}
                </Label>
                <button
                  onClick={() => handleOblastToggle(oblast.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isExpanded ? '−' : '+'}
                </button>
              </div>
              
              {isExpanded && (
                <div className="p-3 space-y-2">
                  {oblastRegions.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2 ml-4">
                      <Checkbox
                        id={`region-${region.id}`}
                        checked={selectedRegions.includes(region.id)}
                        onCheckedChange={(checked) => handleRegionToggle(region.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`region-${region.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {region.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {selectedRegions.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Выбранные регионы:</h4>
            <div className="space-y-1">
              {selectedRegions.map((regionId) => (
                <div key={regionId} className="text-sm text-muted-foreground">
                  • {getRegionName(regionId)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
