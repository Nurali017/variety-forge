import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MainToolbar } from "@/components/varieties/MainToolbar";
import { FormActions } from "@/components/forms/FormActions";
import { createVariety, DocumentItem } from "@/lib/varietiesStore";
import { useToast } from "@/hooks/use-toast";

const cultureOptions = [
  { code: 'wheat' as const, label: 'Пшеница', group: 'Зерновые и крупяные' },
  { code: 'barley' as const, label: 'Ячмень', group: 'Зерновые и крупяные' },
  { code: 'corn' as const, label: 'Кукуруза', group: 'Зерновые и крупяные' },
  { code: 'potato' as const, label: 'Картофель', group: 'Овощные' },
  { code: 'sunflower' as const, label: 'Подсолнечник', group: 'Технические' },
];

const regionOptions = [
  'Акмолинская область',
  'Костанайская область',
  'Северо-Казахстанская область',
  'Алматинская область',
];

const maturityOptions = [
  'D3 - Раннеспелая группа',
  'D4 - Среднеранняя группа',
  'D5 - Среднеспелая группа',
  'D6 - Среднепоздняя группа',
  'D7 - Позднеспелая группа',
];

const formatDate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const CreateVariety = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [cultureCode, setCultureCode] = useState<typeof cultureOptions[number]['code'] | "">("");
  const [maturityGroup, setMaturityGroup] = useState("");
  const [applicant, setApplicant] = useState("");
  const [inn, setInn] = useState("");
  const [targetRegions, setTargetRegions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const submissionDate = formatDate(new Date());

  const isValid = !!name && !!cultureCode && !!maturityGroup && !!applicant && targetRegions.length > 0;

  const handleRegionToggle = (region: string, checked: boolean) => {
    setTargetRegions((prev) => (
      checked ? [...prev, region] : prev.filter((r) => r !== region)
    ));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: DocumentItem[] = Array.from(files).map((f, idx) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      const type: DocumentItem['type'] = ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : 'other';
      const sizeMb = (f.size / (1024 * 1024)).toFixed(1);
      return { id: `${Date.now()}_${idx}`, name: f.name, type, size: `${sizeMb} МБ` };
    });
    setDocuments((prev) => [...prev, ...next]);
  };

  const handleSave = async () => {
    if (!isValid) return;
    try {
      setIsSaving(true);
      const culture = cultureOptions.find((c) => c.code === cultureCode)!;
      const record = createVariety({
        name,
        cultureCode: culture.code,
        cultureLabel: culture.label,
        cultureGroup: culture.group,
        maturityGroup,
        applicant,
        inn,
        submissionDate,
        targetRegions,
        documents,
      });

      toast({ title: 'Сорт создан', description: 'Карточка сорта открыта' });
      navigate(`/variety/${record.id}`);
    } catch (e) {
      toast({ title: 'Ошибка сохранения', description: 'Не удалось создать сорт', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="min-h-screen bg-background">
      <MainToolbar />

      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Добавление нового сорта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Наименование сорта *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Пшеница озимая 'Скипетр'" />
              </div>

              <div className="space-y-2">
                <Label>Культура *</Label>
                <Select value={cultureCode} onValueChange={(v) => setCultureCode(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите культуру" />
                  </SelectTrigger>
                  <SelectContent>
                    {cultureOptions.map((opt) => (
                      <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Группа спелости *</Label>
                <Select value={maturityGroup} onValueChange={setMaturityGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите группу" />
                  </SelectTrigger>
                  <SelectContent>
                    {maturityOptions.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicant">Заявитель *</Label>
                <Input id="applicant" value={applicant} onChange={(e) => setApplicant(e.target.value)} placeholder="Название организации" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inn">ИНН/БИН</Label>
                <Input id="inn" value={inn} onChange={(e) => setInn(e.target.value)} placeholder="Номер" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Примечание</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Дополнительная информация (необязательно)" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Целевые регионы *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {regionOptions.map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={targetRegions.includes(r)} onCheckedChange={(c) => handleRegionToggle(r, Boolean(c))} />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docs">Документы (PDF/DOCX)</Label>
              <Input id="docs" type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleFiles(e.target.files)} />
              {documents.length > 0 && (
                <ul className="text-sm text-muted-foreground list-disc pl-5">
                  {documents.map((d) => (
                    <li key={d.id}>{d.name} • {d.size}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="text-sm text-muted-foreground">Дата подачи: {submissionDate}</div>
          </CardContent>
        </Card>
      </div>

      <FormActions onSave={handleSave} onCancel={handleCancel} isValid={isValid} isSaving={isSaving} />
    </div>
  );
};

export default CreateVariety;
