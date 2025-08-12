import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch"; // Импортируем Switch
import { MainToolbar } from "@/components/varieties/MainToolbar";
import { FormActions } from "@/components/forms/FormActions";
import { OblastSelector } from "@/components/forms/OblastSelector";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { addVariety, DocumentItem } from "@/lib/varietiesStore";
import { useToast } from "@/hooks/use-toast";

const cultureOptions = [
  { code: 'wheat' as const, label: 'Пшеница', group: 'Зерновые и крупяные' },
  { code: 'barley' as const, label: 'Ячмень', group: 'Зерновые и крупяные' },
  { code: 'corn' as const, label: 'Кукуруза', group: 'Зерновые и крупяные' },
  { code: 'potato' as const, label: 'Картофель', group: 'Овощные' },
  { code: 'sunflower' as const, label: 'Подсолнечник', group: 'Технические' },
];



const maturityOptions = [
  'D01 - Очень ранний',
  'D02 - Ранний',
  'D03 - Среднеранний',
  'D04 - Средний',
  'D05 - Среднепоздний',
  'D06 - Поздний',
  'D07 - Очень поздний',
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

  // Состояния для всех полей формы
  const [name, setName] = useState("");
  const [cultureCode, setCultureCode] = useState("");
  const [maturityGroup, setMaturityGroup] = useState("");
  const [applicant, setApplicant] = useState("");
  const [inn, setInn] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [targetOblasts, setTargetOblasts] = useState<string[]>([]);
  const [gssCheck, setGssCheck] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const submissionDate = formatDate(new Date());

  const isValid =
    !!name &&
    !!cultureCode &&
    !!maturityGroup &&
    !!applicant &&
    !!inn &&
    !!contactName &&
    !!contactPhone &&
    !!contactEmail &&
    targetOblasts.length > 0;





  const handleSave = async () => {
    if (!isValid) {
      toast({ title: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    try {
      setIsSaving(true);
      const culture = cultureOptions.find((c) => c.code === cultureCode)!;
      const record = addVariety({
        name,
        cultureCode: culture.code,
        cultureLabel: culture.label,
        cultureGroup: culture.group,
        maturityGroup,
        applicant,
        inn,
        contactPerson: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
        },
        submissionDate,
        targetOblasts,
        gssCheck,
        documents,
        results: [],
        oblastStatuses: [],
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
            <CardDescription>Заполните все обязательные поля, отмеченные *</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Наименование сорта *</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Культура *</Label>
                <Select value={cultureCode} onValueChange={setCultureCode}>
                  <SelectTrigger><SelectValue placeholder="Выберите культуру" /></SelectTrigger>
                  <SelectContent>{cultureOptions.map((o) => (<SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Группа спелости (D-коды) *</Label>
                <Select value={maturityGroup} onValueChange={setMaturityGroup}>
                  <SelectTrigger><SelectValue placeholder="Выберите группу" /></SelectTrigger>
                  <SelectContent>{maturityOptions.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicant">Заявитель (организация) *</Label>
                <Input id="applicant" value={applicant} onChange={(e) => setApplicant(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inn">ИНН/БИН *</Label>
                <Input id="inn" value={inn} onChange={(e) => setInn(e.target.value)} />
              </div>
              </div>

            {/* Контактное лицо */}
            <div className="space-y-4 border-t pt-6">
               <Label className="text-lg font-medium">Контактное лицо *</Label>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                    <Label htmlFor="contactName">ФИО</Label>
                    <Input id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Телефон</Label>
                    <Input id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
      </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
    </div>
               </div>
            </div>

            {/* Регионы и проверка ООС */}
            <div className="space-y-6 border-t pt-6">
              <OblastSelector 
                selectedOblasts={targetOblasts}
                onOblastsChange={setTargetOblasts}
              />
              <div className="space-y-4">
                 <Label>Проверка на ООС *</Label>
                 <div className="flex items-center space-x-2">
                    <Switch id="gssCheck" checked={gssCheck} onCheckedChange={setGssCheck} />
                    <Label htmlFor="gssCheck">{gssCheck ? "Да" : "Нет"}</Label>
                 </div>
              </div>
            </div>

            {/* Документы */}
            <div className="border-t pt-6">
              <DocumentUpload 
                documents={documents}
                onDocumentsChange={setDocuments}
              />
            </div>

            <div className="text-sm text-muted-foreground pt-6">Дата подачи: {submissionDate}</div>
          </CardContent>
        </Card>
      </div>

      <FormActions onSave={handleSave} onCancel={handleCancel} isValid={isValid} isSaving={isSaving} />
    </div>
  );
};

export default CreateVariety;
