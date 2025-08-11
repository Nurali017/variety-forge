import { getTrials, getResultsForTrial } from "@/lib/trialsStore";
import type { Trial } from "@/lib/trialsStore";
import { getVarietyById } from "@/lib/varietiesStore";
import { ReportData, ReportGroup, ReportParams, ReportRegion, ReportRow, ReportSite } from "./types";
import { getRegionBySite } from "@/lib/locations";

function parseNum(s?: string): number | undefined {
  if (!s) return undefined;
  const n = Number(s.toString().replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

function mean(arr: number[]): number | undefined {
  const nums = arr.filter((v) => Number.isFinite(v));
  if (nums.length === 0) return undefined;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function getMatchingTrials(params: ReportParams): Trial[] {
  const yearsSet = new Set(params.years);
  return getTrials().filter((t) => {
    if (t.cultureId !== params.cultureId) return false;
    if (!yearsSet.has(t.year)) return false;
    if (params.region && getRegionBySite(t.locationId) !== params.region) return false;
    if (params.predecessor && (t.predecessor || "") !== params.predecessor) return false;
    return true;
  });
}

export function buildReportData(params: ReportParams): ReportData {
  const trials = getMatchingTrials(params);
  // Accumulator: region -> site -> varietyId -> { name, maturity, byYear }
  const regionsMap = new Map<string, Map<string, Map<string, ReportRow>>>();
  const standardCountByVariety = new Map<string, number>();

  for (const trial of trials) {
    const results = getResultsForTrial(trial);
    const byPid: Record<string, Record<string, string>> = {};
    for (const r of results) {
      if (!byPid[r.participantId]) byPid[r.participantId] = {};
      byPid[r.participantId][r.key] = r.value;
    }

    for (const p of trial.participants) {
      // Collect 4 plot yields and compute mean for the year if all present
      const v1 = parseNum(byPid[p.id]?.["yield_plot1"]);
      const v2 = parseNum(byPid[p.id]?.["yield_plot2"]);
      const v3 = parseNum(byPid[p.id]?.["yield_plot3"]);
      const v4 = parseNum(byPid[p.id]?.["yield_plot4"]);
      const arr = [v1, v2, v3, v4];
      if (arr.some((v) => v == null)) continue; // require full set for the year
      const yrMean = mean(arr as number[])!;

      const variety = getVarietyById(p.varietyId);
      const maturity = variety?.maturityGroup || "—";
      const vName = variety?.name || p.varietyId;

      const regionKey = getRegionBySite(trial.locationId) || trial.locationId; // область из справочника
      const siteKey = trial.locationId; // сортоучасток

      if (!regionsMap.has(regionKey)) regionsMap.set(regionKey, new Map());
      const sitesMap = regionsMap.get(regionKey)!;

      if (!sitesMap.has(siteKey)) sitesMap.set(siteKey, new Map());
      const varietiesMap = sitesMap.get(siteKey)!;

      if (!varietiesMap.has(p.varietyId)) {
        const byYear: Record<number, number | undefined> = {};
        params.years.forEach((y) => (byYear[y] = undefined));
        varietiesMap.set(p.varietyId, {
          varietyId: p.varietyId,
          varietyName: vName,
          maturityGroup: maturity,
          byYear,
          avg: undefined,
        });
      }
      const row = varietiesMap.get(p.varietyId)!;
      row.byYear[trial.year] = yrMean;

      if (p.isStandard) {
        standardCountByVariety.set(p.varietyId, (standardCountByVariety.get(p.varietyId) || 0) + 1);
      }
    }
  }

  // Build final structure with groups and compute averages
  const regions: ReportRegion[] = [];
  for (const [regionLabel, sitesMap] of regionsMap) {
    const sites: ReportSite[] = [];
    for (const [siteName, varietiesMap] of sitesMap) {
      // group by maturity group
      const groupsMap = new Map<string, ReportRow[]>();
      for (const row of varietiesMap.values()) {
        // compute avg across available years (skip undefined)
        const vals = params.years.map((y) => row.byYear[y]).filter((v): v is number => typeof v === "number");
        row.avg = mean(vals);
        const key = row.maturityGroup || "—";
        if (!groupsMap.has(key)) groupsMap.set(key, []);
        groupsMap.get(key)!.push(row);
      }

      const groups: ReportGroup[] = [];
      for (const [mg, rows] of groupsMap) {
        // default standard: most frequent standard among included trials, else first by name
        let defaultStd: string | undefined;
        let maxCount = -1;
        for (const r of rows) {
          const c = standardCountByVariety.get(r.varietyId) || 0;
          if (c > maxCount) {
            maxCount = c;
            defaultStd = r.varietyId;
          }
        }
        if (!defaultStd && rows.length > 0) defaultStd = rows[0].varietyId;
        groups.push({ maturityGroup: mg, rows: rows.sort((a,b) => (b.avg ?? -Infinity) - (a.avg ?? -Infinity)), defaultStandardVarietyId: defaultStd });
      }

      sites.push({ siteName, years: params.years, groups: groups.sort((a,b) => a.maturityGroup.localeCompare(b.maturityGroup)) });
    }

    regions.push({ region: regionLabel, years: params.years, sites: sites.sort((a,b) => a.siteName.localeCompare(b.siteName)) });
  }

  // If no data matched, still return scaffold for the requested region with empty groups
  if (regions.length === 0 && params.region) {
    regions.push({ region: params.region, years: params.years, sites: [] });
  }

  return { params, regions };
}
