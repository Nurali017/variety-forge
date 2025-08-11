import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VarietyHeader } from "@/components/variety/VarietyHeader";
import { VarietyInfo } from "@/components/variety/VarietyInfo";
import { VarietyDocuments } from "@/components/variety/VarietyDocuments";
import { VarietyResults } from "@/components/variety/VarietyResults";
import { getVarietyById, VarietyRecord } from "@/lib/varietiesStore";
function mapDocType(t: 'pdf' | 'docx' | 'other'): 'pdf' | 'doc' | 'docx' {
  return t === 'pdf' ? 'pdf' : t === 'docx' ? 'docx' : 'doc';
}

const VarietyCardPage = () => {
  const { varietyId, id } = useParams();
  const paramId = varietyId ?? id;
  const [data, setData] = useState<VarietyRecord | null>(null);

  useEffect(() => {
    if (!paramId) return;
    const v = getVarietyById(paramId);
    if (v) {
      setData(v);
      document.title = `${v.name} — Карточка сорта`;
      const desc = document.querySelector('meta[name="description"]') || document.createElement("meta");
      desc.setAttribute("name", "description");
      desc.setAttribute("content", `${v.name}: статус ${v.status}. Заявитель: ${v.applicant}.`);
      if (!desc.parentNode) document.head.appendChild(desc);
      const href = window.location.href;
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    } else {
      console.error(`Сорт с ID ${paramId} не найден в локальном хранилище (массив 'varieties').`);
      setData(null);
    }
  }, [paramId]);

const headerProps = useMemo(() => {
    if (!data) return null;
    return {
      name: data.name,
      culture: data.cultureLabel,
      status: data.status,
    } as const;
  }, [data]);

const infoData = useMemo(() => {
    if (!data) return null;
    return {
      applicant: data.applicant,
      inn: data.inn ?? "—",
      maturityGroup: data.maturityGroup,
      submissionDate: data.submissionDate,
      targetRegions: data.targetRegions,
    };
  }, [data]);

const documents = useMemo(() => {
    if (!data?.documents) return [] as { id: string; name: string; type: "pdf" | "doc" | "docx"; size?: string }[];
    return (data.documents || []).map((d) => ({
      id: d.id,
      name: d.name,
      type: mapDocType(d.type),
      size: d.size,
    }));
  }, [data]);

const resultsData = useMemo(() => {
    return data?.results ?? [];
  }, [data]);

  if (!paramId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Не указан идентификатор сорта</h1>
          <Link className="underline" to="/">Вернуться к списку сортов</Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Сорт не найден</h1>
          <p className="text-muted-foreground">Сорт с таким ID не найден.</p>
          <Link className="underline" to="/">Вернуться к списку сортов</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <VarietyHeader
        name={headerProps!.name}
        culture={headerProps!.culture}
        status={headerProps!.status}
      />

      <div className="container mx-auto py-6 space-y-6">
        {infoData && <VarietyInfo data={infoData} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VarietyDocuments documents={documents} />
          </div>
          <div className="lg:col-span-2">
            <VarietyResults resultsData={resultsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarietyCardPage;
