import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isValid: boolean;
  isSaving?: boolean;
}

export const FormActions = ({ onSave, onCancel, isValid, isSaving = false }: FormActionsProps) => {
  return (
    <Card className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="flex justify-end gap-3 py-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Отмена
        </Button>
        <Button
          onClick={onSave}
          disabled={!isValid || isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </Button>
      </CardContent>
    </Card>
  );
};