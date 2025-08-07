import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const MainToolbar = () => {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Государственное сортоиспытание
          </h2>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground">Иванов И.И.</span>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};