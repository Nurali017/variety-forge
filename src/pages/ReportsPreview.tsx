import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buildReportData } from "@/lib/reports/aggregation";
import { ReportParams } from "@/lib/reports/types";
import { ReportGroupTable } from "@/components/reports/ReportGroupTable";
import { getZoneBySite } from "@/lib/locations";

function setMeta(tag: string, attrs: Record<string, string>) {
  let el = document.querySelector(`${tag}${attrs.name ? `[name=\"${attrs.name}\"]` : ""}${attrs.rel ? `[rel=\"${attrs.rel}\"]` : ""}`) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = document.createElement(tag) as any;
    if (attrs.name) el.setAttribute("name", attrs.name);
    if (attrs.rel) el.setAttribute("rel", attrs.rel);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => {
    if (k !== "name" && k !== "rel") el!.setAttribute(k, v);
  });
}

const ReportsPreview = () => {
  // Temporary params for testing
  const params: ReportParams = {
    region: "",
    years: [2022, 2023, 2024],
    cultureId: "wheat",
  };

  const data = useMemo(() => buildReportData(params), [params]);

  useEffect(() => {
    const regionLabel = params.region || "Все регионы";
    const title = `Итоговый отчет — Пшеница, ${regionLabel}, ${params.years[0]}–${params.years[params.years.length - 1]}`;
    document.title = title;
    setMeta("meta", { name: "description", content: `Сводный многолетний отчет по культуре Пшеница для ${regionLabel}.` });
    setMeta("link", { rel: "canonical", href: `${window.location.origin}/reports/preview` });
  }, [params]);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Итоговый отчет — Пшеница</h1>
        <p className="text-sm text-muted-foreground">{params.region || 'Все регионы'} • {params.years[0]}–{params.years[params.years.length - 1]}</p>
      </header>

      {data.regions.map((region) => (
        <section key={region.region} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{region.region}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {region.sites.length === 0 ? (
                <div className="text-sm text-muted-foreground">Нет данных по выбранным параметрам.</div>
              ) : (
                region.sites.map((site) => (
                  <article key={site.siteName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium">Сортоучасток: {site.siteName}</h2>
                        <p className="text-xs text-muted-foreground">Зона: {getZoneBySite(site.siteName) || '—'}</p>
                      </div>
                    </div>
                    <Separator />
                    {site.groups.map((g) => (
                      <div key={g.maturityGroup} className="space-y-2">
                        <div className="text-sm font-medium">Группа спелости: {g.maturityGroup}</div>
                        <ReportGroupTable years={site.years} rows={g.rows} defaultStandardId={g.defaultStandardVarietyId} />
                      </div>
                    ))}
                  </article>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      ))}
    </main>
  );
};

export default ReportsPreview;
