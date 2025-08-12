import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, X, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { DocumentItem } from "@/lib/varietiesStore";

interface DocumentUploadProps {
  documents: DocumentItem[];
  onDocumentsChange: (documents: DocumentItem[]) => void;
}

// Официальный список требуемых документов
const requiredDocuments = [
  {
    id: 'application',
    name: 'Заявление на испытание',
    required: true,
    description: 'Заявление на испытание (обязательно)'
  },
  {
    id: 'questionnaire',
    name: 'Анкета селекционного достижения',
    required: true,
    description: 'Анкета селекционного достижения (обязательно)'
  },
  {
    id: 'description',
    name: 'Описание сорта',
    required: true,
    description: 'Описание сорта (обязательно)'
  },
  {
    id: 'photo',
    name: 'Фото растения с линейкой',
    required: true,
    description: 'Фото растения с линейкой (обязательно)'
  },
  {
    id: 'right_to_submit',
    name: 'Документ о праве подачи',
    required: false,
    description: 'Документ о праве подачи (обязательно, если заявитель — посредник/правопреемник)'
  },
  {
    id: 'gmo_free',
    name: 'Документ об отсутствии ГМО',
    required: false,
    description: 'Документ об отсутствии ГМО (обязательно, если сорт иностранной селекции)'
  }
];

const getStatusIcon = (isUploaded: boolean, isRequired: boolean) => {
  if (isUploaded) {
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  } else if (isRequired) {
    return <XCircle className="h-5 w-5 text-red-600" />;
  } else {
    return <AlertCircle className="h-5 w-5 text-yellow-600" />;
  }
};

const getStatusBadge = (isUploaded: boolean, isRequired: boolean) => {
  if (isUploaded) {
    return <Badge variant="success" className="text-xs">Загружен</Badge>;
  } else if (isRequired) {
    return <Badge variant="destructive" className="text-xs">Обязательно</Badge>;
  } else {
    return <Badge variant="secondary" className="text-xs">Опционально</Badge>;
  }
};

export const DocumentUpload = ({ documents, onDocumentsChange }: DocumentUploadProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocuments: DocumentItem[] = Array.from(files).map((file, idx) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const type: DocumentItem['type'] = ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : 'other';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `${Date.now()}_${idx}`,
        name: file.name,
        type,
        size: `${sizeMb} МБ`,
      };
    });
    onDocumentsChange([...documents, ...newDocuments]);
  };

  const handleFilesFor = (categoryId: string, files: FileList | null) => {
    if (!files || !files[0]) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type: DocumentItem['type'] = ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : 'other';
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const newDoc: DocumentItem = {
      id: `${Date.now()}`,
      name: file.name,
      type,
      size: `${sizeMb} МБ`,
      categoryId,
    };
    const others = documents.filter(d => d.categoryId !== categoryId);
    onDocumentsChange([...others, newDoc]);
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  };

  const removeByCategory = (categoryId: string) => {
    onDocumentsChange(documents.filter(doc => doc.categoryId !== categoryId));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

// Карта загруженных файлов по категориям (для обязательных документов)
const uploadedByCategory = new Map(
  documents.filter(doc => !!doc.categoryId).map(doc => [doc.categoryId as string, doc])
);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">5.2 Документы (загрузка файлов)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Для подачи заявки на сортоиспытание требуется загрузка следующих документов:
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Список требуемых документов */}
        <div className="space-y-4">
          {requiredDocuments.map((doc) => {
            const uploadedDoc = uploadedDocsMap.get(doc.name.toLowerCase());
            const isUploaded = !!uploadedDoc;
            
            return (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(isUploaded, doc.required)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      {getStatusBadge(isUploaded, doc.required)}
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                    {uploadedDoc && (
                      <div className="flex items-center gap-2 mt-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {uploadedDoc.name} {uploadedDoc.size && `(${uploadedDoc.size})`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {uploadedDoc && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeDocument(uploadedDoc.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Область загрузки файлов */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Перетащите файлы сюда или нажмите для выбора
            </p>
            <p className="text-xs text-muted-foreground">
              Поддерживаются форматы: PDF, DOCX, изображения
            </p>
            <Input
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Выбрать файлы
            </Button>
          </div>
        </div>

        {/* Список загруженных файлов */}
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Загруженные файлы ({documents.length})</h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc.name}</span>
                    {doc.size && (
                      <span className="text-xs text-muted-foreground">({doc.size})</span>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeDocument(doc.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
