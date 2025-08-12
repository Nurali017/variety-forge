import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { VarietyHeader } from "@/components/variety/VarietyHeader";
import { VarietyInfo } from "@/components/variety/VarietyInfo";
import { VarietyDocuments } from "@/components/variety/VarietyDocuments";
import { VarietyResults } from "@/components/variety/VarietyResults";
import { getVariety } from "@/lib/varietiesStore";

const VarietyCard = () => {
  const { id } = useParams();

  const variety = useMemo(() => (id ? getVariety(id) : undefined), [id]);

  useEffect(() => {
    if (variety) {
      document.title = `${variety.name} — Карточка сорта`;
    }
  }, [variety]);

  if (!variety) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Сорт не найден</h1>
          <p className="text-muted-foreground">Запись с указанным идентификатором отсутствует.</p>
          <Link className="underline" to="/">Вернуться к списку сортов</Link>
        </div>
      </div>
    );
  }

  const infoData = {
    applicant: variety.applicant,
    inn: variety.inn,
    contactPerson: variety.contactPerson,
    maturityGroup: variety.maturityGroup,
    submissionDate: variety.submissionDate,
    targetOblasts: variety.targetOblasts,
    gssCheck: variety.gssCheck,
  };

  type Doc = { id: string; name: string; type: 'pdf' | 'doc' | 'docx'; size?: string };
  const docs: Doc[] = (variety.documents || []).map((d) => ({
    id: d.id,
    name: d.name,
    size: d.size,
    type: d.type === "pdf" ? "pdf" : d.type === "docx" ? "docx" : "doc",
  }));

  return (
    <div className="min-h-screen bg-background">
      <VarietyHeader
        name={variety.name}
        culture={`${variety.cultureLabel} • ${variety.cultureGroup}`}
      />

      <div className="container mx-auto py-6 space-y-6">
        <VarietyInfo data={infoData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VarietyDocuments documents={docs} />
          </div>
          <div className="lg:col-span-2">
            <VarietyResults resultsData={variety.results || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarietyCard;