import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getOblasts } from "@/lib/locations";

interface OblastSelectorProps {
  selectedOblasts: string[];
  onOblastsChange: (oblasts: string[]) => void;
}

export const OblastSelector = ({ selectedOblasts, onOblastsChange }: OblastSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const oblasts = getOblasts();
  
  const handleOblastToggle = (oblastId: string, checked: boolean) => {
    if (checked) {
      onOblastsChange([...selectedOblasts, oblastId]);
    } else {
      onOblastsChange(selectedOblasts.filter(id => id !== oblastId));
    }
  };
  
  const filteredOblasts = oblasts.filter(oblast => {
    if (!searchTerm) return true;
    return oblast.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Выбор целевых областей *</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск по областям..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOblasts.map((oblast) => (
            <div key={oblast.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                id={`oblast-${oblast.id}`}
                checked={selectedOblasts.includes(oblast.id)}
                onCheckedChange={(checked) => handleOblastToggle(oblast.id, checked as boolean)}
              />
              <Label 
                htmlFor={`oblast-${oblast.id}`}
                className="flex-1 cursor-pointer"
              >
                {oblast.name}
              </Label>
            </div>
          ))}
        </div>
        
        {selectedOblasts.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Выбранные области:</h4>
            <div className="space-y-1">
              {selectedOblasts.map((oblastId) => {
                const oblast = oblasts.find(o => o.id === oblastId);
                return (
                  <div key={oblastId} className="text-sm text-muted-foreground">
                    • {oblast?.name || oblastId}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
