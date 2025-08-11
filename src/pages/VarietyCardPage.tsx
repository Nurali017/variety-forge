import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VarietyHeader } from "@/components/variety/VarietyHeader";
import { VarietyInfo } from "@/components/variety/VarietyInfo";
import { VarietyDocuments } from "@/components/variety/VarietyDocuments";
import { VarietyResults } from "@/components/variety/VarietyResults";

// LocalStorage data shape based on the specification in the request
interface LSVarietyDocument {
  id: string;
  name: string;
  url?: string;
}

interface LSTestResultRow {
  indicator: string;
  value: string; // variety value
  standardValue: string;
  deviation: string; // e.g. "+1.7" or "-0.3"
}

interface LSYearData {
  year: number;
  trialId?: string;
  summary: string;
  results: LSTestResultRow[];
}

interface LSRegionData {
  region: string;
  years: LSYearData[];
}

interface LSVarietyData {
  id: string;
  name: string;
  culture?: string; // e.g. "Пшеница мягкая (среднеранняя группа)"
  status?: string; // human readable label
  applicant?: { name?: string; inn?: string };
  submissionDate?: string;
  targetRegions?: string[];
  documents?: LSVarietyDocument[];
  testResults?: LSRegionData[];
}

// Map human-readable status to internal union
function mapStatus(label?: string):
  | "testing"
  | "approved"
  | "rejected"
  | "recommended"
  | "extended"
  | "removed" {
  switch ((label || "").toLowerCase()) {
    case "на испытании":
      return "testing";
    case "включён в реестр":
    case "включен в реестр":
      return "approved";
    case "отклонён":
    case "отклонен":
      return "rejected";
    case "рекомендован":
      return "recommended";
    case "продлён":
    case "продлен":
      return "extended";
    case "снят":
      return "removed";
    default:
      return "testing";
  }
}

function inferDocType(name: string): "pdf" | "doc" | "docx" {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx") return "docx";
  return "doc";
}

function extractMaturityGroup(culture?: string): string {
  if (!culture) return "—";
  const match = culture.match(/\(([^)]+)\)/);
  return match?.[1] || "—";
}

const VarietyCardPage = () => {
  const { varietyId } = useParams();
  const [data, setData] = useState<LSVarietyData | null>(null);

  // Read from localStorage on mount and when id changes
  useEffect(() => {
    if (!varietyId) return;
    const storageKey = `variety-${varietyId}`;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed: LSVarietyData = JSON.parse(raw);
        setData(parsed);
        // SEO basics
        document.title = `${parsed.name || "Карточка сорта"} — Карточка сорта`;
        const desc = document.querySelector('meta[name="description"]') || document.createElement("meta");
        desc.setAttribute("name", "description");
        desc.setAttribute(
          "content",
          `${parsed.name || "Сорт"}: статус ${parsed.status || "—"}. Заявитель: ${parsed.applicant?.name || "—"}.`
        );
        if (!desc.parentNode) document.head.appendChild(desc);
        // Canonical tag
        const href = window.location.href;
        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
        if (!link) {
          link = document.createElement("link");
          link.setAttribute("rel", "canonical");
          document.head.appendChild(link);
        }
        link.setAttribute("href", href);
      } catch (e) {
        console.error("Ошибка парсинга данных сорта из localStorage:", e);
        setData(null);
      }
    } else {
      console.error(`Данные для сорта с ID ${varietyId} не найдены в localStorage.`);
      setData(null);
    }
  }, [varietyId]);

  const headerProps = useMemo(() => {
    if (!data) return null;
    return {
      name: data.name,
      culture: data.culture || "",
      status: mapStatus(data.status),
    } as const;
  }, [data]);

  const infoData = useMemo(() => {
    if (!data) return null;
    return {
      applicant: data.applicant?.name || "—",
      inn: data.applicant?.inn || "—",
      maturityGroup: extractMaturityGroup(data.culture),
      submissionDate: data.submissionDate || "—",
      targetRegions: data.targetRegions || [],
    };
  }, [data]);

  const documents = useMemo(() => {
    if (!data?.documents) return [] as { id: string; name: string; type: "pdf" | "doc" | "docx"; size?: string }[];
    return (data.documents || []).map((d) => ({
      id: d.id,
      name: d.name,
      type: inferDocType(d.name || d.url || ""),
    }));
  }, [data]);

  const resultsData = useMemo(() => {
    if (!data?.testResults) return [] as Array<{ region: string; years: Array<{ year: number; summary: string; results: Array<{ indicator: string; varietyValue: string; standardValue: string; deviation: string; isPositive?: boolean }>; }> }>;
    return (data.testResults || []).map((r) => ({
      region: r.region,
      years: (r.years || []).map((y) => ({
        year: y.year,
        summary: y.summary,
        results: (y.results || []).map((row) => ({
          indicator: row.indicator,
          varietyValue: row.value,
          standardValue: row.standardValue,
          deviation: row.deviation,
          isPositive: (() => {
            const num = Number((row.deviation || "").replace(",", "."));
            if (!Number.isFinite(num)) return row.deviation?.startsWith("+");
            return num >= 0;
          })(),
        })),
      })),
    }));
  }, [data]);

  if (!varietyId) {
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
          <p className="text-muted-foreground">Данные для ключа variety-{varietyId} отсутствуют в localStorage.</p>
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
