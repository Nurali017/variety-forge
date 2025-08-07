import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx';
  size?: string;
}

interface VarietyDocumentsProps {
  documents: Document[];
}

const getFileIcon = (type: string) => {
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

export const VarietyDocuments = ({ documents }: VarietyDocumentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Документы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                {getFileIcon(doc.type)}
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  {doc.size && (
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};