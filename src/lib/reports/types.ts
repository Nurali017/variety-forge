export interface ReportParams {
  region: string; // e.g., "Акмолинская область"
  years: number[]; // e.g., [2022, 2023, 2024]
  cultureId: string; // e.g., 'wheat'
  predecessor?: string;
}

export interface YearIndicators {
  vegDays?: number;
  thousandWeight?: number;
  resistShatter?: number;
  resistLodge?: number;
  resistDrought?: number;
  smut?: number;
  stemRust?: number;
}

export interface ReportRow {
  varietyId: string;
  varietyName: string;
  maturityGroup: string; // from VarietyRecord
  byYear: Record<number, number | undefined>; // yield mean by year
  indicatorsByYear: Record<number, YearIndicators>; // per-year agronomic indicators
  avg?: number; // mean across available years
}

export interface ReportGroup {
  maturityGroup: string;
  rows: ReportRow[];
  defaultStandardVarietyId?: string;
}

export interface ReportSite {
  siteName: string; // temporarily using trial.locationId
  years: number[];
  groups: ReportGroup[];
}

export interface ReportRegion {
  region: string;
  years: number[];
  sites: ReportSite[];
}

export interface ReportData {
  params: ReportParams;
  regions: ReportRegion[];
}
