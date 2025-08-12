import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buildReportData, getMatchingTrials } from "@/lib/reports/aggregation";
import { ReportParams } from "@/lib/reports/types";
import { CombinedReportTable } from "@/components/reports/CombinedReportTable";

import { getRegionName, getOblastByRegion } from "@/lib/locations";
import { getTrials, getResultsForTrial } from "@/lib/trialsStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cultureLabels } from "@/lib/trialsConfig";
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
  const trials = useMemo(() => getTrials(), []);
  const cultures = useMemo(() => Array.from(new Set(trials.map(t => t.cultureId))), [trials]);
  const [cultureId, setCultureId] = useState<string>(cultures[0] || "wheat");
  const yearsAll = useMemo(() => {
    const ys = Array.from(new Set(trials.filter(t => t.cultureId === cultureId).map(t => t.year)));
    return ys.sort((a,b) => a - b);
  }, [trials, cultureId]);
  const [years, setYears] = useState<number[]>(yearsAll);

  useEffect(() => { setYears(yearsAll); }, [yearsAll]);

  const params: ReportParams = useMemo(() => ({
    region: "",
    years: years.length ? years : [new Date().getFullYear()],
    cultureId,
  }), [cultureId, years]);

  const data = useMemo(() => buildReportData(params), [params]);
  const hasAnyRows = useMemo(() => data.regions.some(r => r.sites.some(s => s.groups.some(g => g.rows.length > 0))), [data]);
  const cultureLabel = cultureLabels[cultureId] || cultureId;

  type DiagEntry = { trialId: string; year: number; site: string; participant: string; isStandard: boolean; missing: number[] };
  const diagnostics = useMemo<DiagEntry[]>(() => {
    if (hasAnyRows) return [];
    const list: DiagEntry[] = [];
    const mts = getMatchingTrials(params);
    for (const tr of mts) {
      const res = getResultsForTrial(tr);
      const byPid: Record<string, Record<string, string>> = {};
      for (const r of res) {
        if (!byPid[r.participantId]) byPid[r.participantId] = {};
        byPid[r.participantId][r.key] = r.value;
      }
      for (const p of tr.participants) {
        const miss: number[] = [];
        for (let i = 1; i <= 4; i++) {
          const v = byPid[p.id]?.[`yield_plot${i}`];
          const n = Number((v || '').toString().replace(',', '.'));
          if (!Number.isFinite(n)) miss.push(i);
        }
        if (miss.length > 0) {
          list.push({ trialId: tr.id, year: tr.year, site: tr.locationId, participant: p.varietyName, isStandard: p.isStandard, missing: miss });
        }
      }
    }
    return list;
  }, [params, hasAnyRows]);

useEffect(() => {
  const regionLabel = params.region || "Все регионы";
  const yrs = params.years;
  const yearsRange = yrs.length > 1 ? `${yrs[0]}–${yrs[yrs.length - 1]}` : `${yrs[0]}`;
  const title = `Итоговый отчет — ${cultureLabel}, ${regionLabel}, ${yearsRange}`;
  document.title = title;

  setMeta("meta", { name: "description", content: `Сводный многолетний отчет по культуре ${cultureLabel} для ${regionLabel}.` });
  setMeta("link", { rel: "canonical", href: `${window.location.origin}/reports/preview` });
}, [params, cultureLabel]);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold">Итоговый отчет — {cultureLabel}</h2>
        <p className="text-sm text-muted-foreground">{params.region || 'Все регионы'} • {years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0]}</p>
        <nav className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/">Назад</Link>
          </Button>
        </nav>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label htmlFor="culture">Культура</Label>
          <Select value={cultureId} onValueChange={setCultureId}>
            <SelectTrigger id="culture">
              <SelectValue placeholder="Выберите культуру" />
            </SelectTrigger>
            <SelectContent>
              {cultures.map((c) => (
                <SelectItem key={c} value={c}>{cultureLabels[c] || c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label>Годы</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {yearsAll.map((y) => (
              <div key={y} className="flex items-center gap-2">
                <Checkbox
                  id={`year-${y}`}
                  checked={years.includes(y)}
                  onCheckedChange={(chk) => {
                    const checked = Boolean(chk);
                    setYears((prev) => {
                      if (checked) return Array.from(new Set([...prev, y])).sort((a,b)=>a-b);
                      if (prev.length <= 1) return prev; // не допускаем пустой список
                      return prev.filter((v) => v !== y);
                    });
                  }}
                />
                <Label htmlFor={`year-${y}`}>{y}</Label>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!hasAnyRows && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="diag">
            <AccordionTrigger>Диагностика: почему нет данных</AccordionTrigger>
            <AccordionContent>
              {diagnostics.length === 0 ? (
                <div className="text-sm text-muted-foreground">Нет подходящих опытов для выбранных параметров.</div>
              ) : (
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  {diagnostics.map((d, idx) => (
                    <li key={idx}>
                      {d.year} • {d.site} — {d.participant}{d.isStandard ? " (стандарт)" : ""}: отсутствуют делянки {d.missing.join(", ")}
                    </li>
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

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
                        <p className="text-xs text-muted-foreground">Регион: {getRegionName(site.siteName)} • Область: {getOblastByRegion(site.siteName)?.name || '—'}</p>
                      </div>
                    </div>
                    <Separator />
                    {site.groups.map((g) => (
                      <div key={g.maturityGroup} className="space-y-2">
                        <div className="text-sm font-medium">Группа спелости: {g.maturityGroup}</div>
                        <CombinedReportTable years={site.years} rows={g.rows} defaultStandardId={g.defaultStandardVarietyId} />
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
