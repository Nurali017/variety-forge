import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export const MainToolbar = () => {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-semibold text-foreground">
              Государственное сортоиспытание
            </h2>
            <nav className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/">Сорта</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/trials">Сортоопыты</Link>
              </Button>
            </nav>
          </div>

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