import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { VarietyHeader } from "@/components/variety/VarietyHeader";
import { VarietyInfo } from "@/components/variety/VarietyInfo";
import { VarietyDocuments } from "@/components/variety/VarietyDocuments";
import { VarietyResults } from "@/components/variety/VarietyResults";
import { OblastStatusTable } from "@/components/variety/OblastStatusTable";
import { getVariety, VarietyRecord } from "@/lib/varietiesStore";
import { getVarietyResultsFromTrials } from "@/lib/varietyResults";
import { MainToolbar } from "@/components/varieties/MainToolbar";

const VarietyCardPage = () => {
  const { id } = useParams<{ id: string }>();
  const variety: VarietyRecord | null = useMemo(() => (id ? getVariety(id) : null), [id]);
  
  // Получаем результаты из сортоопытов и преобразуем в нужный формат
  const trialResults = useMemo(() => {
    if (!id) return [];
    const rawResults = getVarietyResultsFromTrials(id);
    
    // Группируем результаты по регионам и годам
    const regionMap = new Map<string, Map<number, any[]>>();
    
    for (const trialResult of rawResults) {
      const region = trialResult.locationId;
      const year = trialResult.trialYear;
      
      if (!regionMap.has(region)) {
        regionMap.set(region, new Map());
      }
      
      if (!regionMap.get(region)!.has(year)) {
        regionMap.get(region)!.set(year, []);
      }
      
      // Преобразуем TrialResult в TestResult
      for (const result of trialResult.results) {
        regionMap.get(region)!.get(year)!.push({
          indicator: result.key,
          varietyValue: result.value,
          standardValue: '—', // Пока нет данных о стандартном сорте
          deviation: '—',
          isPositive: undefined
        });
      }
    }
    
    // Преобразуем в формат RegionData[]
    const regionData: any[] = [];
    for (const [region, yearMap] of regionMap) {
      const years: any[] = [];
      for (const [year, results] of yearMap) {
        years.push({
          year,
          summary: `Результаты испытаний за ${year} год`,
          results
        });
      }
      regionData.push({
        region,
        years
      });
    }
    
    return regionData;
  }, [id]);

  useEffect(() => {
    if (variety) {
      document.title = `Детали сорта: ${variety.name}`;
    }
  }, [variety]);

  if (!variety) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Сорт не найден</h1>
          <p className="text-muted-foreground">
            Запись с идентификатором "{id}" отсутствует в базе данных. Возможно, стоит очистить localStorage и перезагрузить страницу.
          </p>
          <Link className="underline" to="/">Вернуться к списку сортов</Link>
        </div>
      </div>
    );
  }

  // Создаем безопасный объект с данными, подставляя значения по умолчанию
  const infoData = {
    applicant: variety.applicant || '—',
    inn: variety.inn || '—',
    contactPerson: variety.contactPerson || { name: 'Не указано', phone: '—', email: '—' },
    maturityGroup: variety.maturityGroup || '—',
    submissionDate: variety.submissionDate || '—',
    targetOblasts: variety.targetOblasts || [],
    gssCheck: variety.gssCheck ?? false,
  };

  type Doc = { id: string; name: string; type: 'pdf' | 'doc' | 'docx'; size?: string };
  const docs: Doc[] = (variety.documents || []).map((d) => ({
    id: d.id,
    name: d.name,
    type: d.type === 'pdf' ? 'pdf' : d.type === 'docx' ? 'docx' : 'doc',
    size: d.size,
  }));

  return (
    <>
      <MainToolbar />
      <main className="container mx-auto py-8">
        <div className="space-y-8">
          <VarietyHeader
            name={variety.name}
            culture={variety.cultureLabel}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <VarietyInfo data={infoData} />
              <OblastStatusTable oblastStatuses={variety.oblastStatuses || []} />
              <VarietyDocuments documents={docs} />
            </div>
            <div className="lg:col-span-1">
              <VarietyResults resultsData={trialResults} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default VarietyCardPage;
