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

    // Карта отображения ключей показателей -> русские названия (в составе и порядке как в сводном отчёте)
    const DISPLAY_ORDER = [
      'yield_avg',
      'vegetation_period',
      'thousand_grain_weight',
      'shattering_resistance',
      'lodging_resistance',
      'drought_resistance',
      'smut',
      'stem_rust',
    ] as const;
    const LABELS: Record<string, string> = {
      yield_avg: 'Урожайность, ц/га',
      vegetation_period: 'Вегетационный период, дней',
      thousand_grain_weight: 'Масса 1000 зерен, г',
      shattering_resistance: 'Устойчивость к осыпанию, балл',
      lodging_resistance: 'Устойчивость к полеганию, балл',
      drought_resistance: 'Устойчивость к засухе, балл',
      smut: 'Пыльная головня, балл',
      stem_rust: 'Стеблевая ржавчина, балл',
    };

    // Группируем результаты по регионам и годам
    const regionMap = new Map<string, Map<number, { results: any[] }>>();

    for (const tr of rawResults) {
      const region = tr.locationId;
      const year = tr.trialYear;
      if (!regionMap.has(region)) regionMap.set(region, new Map());
      const yearEntry = regionMap.get(region)!;
      if (!yearEntry.has(year)) yearEntry.set(year, { results: [] });

      const bucket = yearEntry.get(year)!;

      // Кладём только нужные ключи и уже с русскими подписями; избегаем дублей по индикатору
      for (const r of tr.results) {
        if (!DISPLAY_ORDER.includes(r.key as any)) continue;
        const label = LABELS[r.key] || r.key;
        const exists = bucket.results.some((x) => x.indicator === label);
        if (exists) continue;
        bucket.results.push({
          indicator: label,
          varietyValue: r.value,
          standardValue: '—',
          deviation: '—',
          isPositive: undefined,
        });
      }
    }

    // Преобразуем в формат RegionData[] с сортировкой и порядком показателей
    const regionData: any[] = [];
    for (const [region, yearMap] of regionMap) {
      const years: any[] = [];
      for (const [year, { results }] of yearMap) {
        // Отсортировать результаты в соответствии с DISPLAY_ORDER
        const ordered = [...results].sort((a, b) => {
          const ai = DISPLAY_ORDER.indexOf(Object.keys(LABELS).find(k => LABELS[k] === a.indicator) as any);
          const bi = DISPLAY_ORDER.indexOf(Object.keys(LABELS).find(k => LABELS[k] === b.indicator) as any);
          return ai - bi;
        });
        years.push({
          year,
          summary: `Результаты испытаний за ${year} год`,
          results: ordered,
        });
      }
      // Сортировка лет по убыванию
      years.sort((a, b) => b.year - a.year);
      regionData.push({ region, years });
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
