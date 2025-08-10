export type Status = 'testing' | 'approved' | 'rejected' | 'recommended' | 'extended' | 'removed';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'other';
  size: string;
}

export interface TestResult {
  indicator: string;
  varietyValue: string;
  standardValue: string;
  deviation: string;
  isPositive?: boolean;
}

export interface YearData {
  year: number;
  summary: string;
  results: TestResult[];
}

export interface RegionData {
  region: string;
  years: YearData[];
}

export interface VarietyRecord {
  id: string;
  name: string;
  cultureCode: 'wheat' | 'barley' | 'potato' | 'sunflower' | 'corn';
  cultureLabel: string; // e.g., "Пшеница"
  cultureGroup: string; // e.g., "Зерновые и крупяные"
  maturityGroup: string; // D-код + расшифровка
  applicant: string;
  inn?: string;
  submissionDate: string; // DD.MM.YYYY
  targetRegions: string[];
  documents: DocumentItem[];
  status: Status;
  results: RegionData[];
}

const LS_KEY = 'varieties';

function readAll(): VarietyRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as VarietyRecord[];
  } catch {
    return [];
  }
}

function writeAll(items: VarietyRecord[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function getVarieties(): VarietyRecord[] {
  return readAll();
}

export function getVarietyById(id: string): VarietyRecord | undefined {
  return readAll().find(v => v.id === id);
}

export interface CreateVarietyInput {
  name: string;
  cultureCode: VarietyRecord['cultureCode'];
  cultureLabel: string;
  cultureGroup: string;
  maturityGroup: string;
  applicant: string;
  inn?: string;
  submissionDate: string;
  targetRegions: string[];
  documents: DocumentItem[];
}

export function createVariety(input: CreateVarietyInput): VarietyRecord {
  const items = readAll();
  const id = Date.now().toString();
  const record: VarietyRecord = {
    id,
    name: input.name,
    cultureCode: input.cultureCode,
    cultureLabel: input.cultureLabel,
    cultureGroup: input.cultureGroup,
    maturityGroup: input.maturityGroup,
    applicant: input.applicant,
    inn: input.inn,
    submissionDate: input.submissionDate,
    targetRegions: input.targetRegions,
    documents: input.documents,
    status: 'testing',
    results: [],
  };
  items.push(record);
  writeAll(items);
  return record;
}

export interface SaveResultsContext {
  year: string; // YYYY
  region: string; // key or label
  testSite: string;
}

export interface SaveResultsPayload {
  // from form
  averageYield: string;
  thousandGrainWeight: string;
  vegetationPeriod: string;
  lodgingResistance: string;
  droughtResistance: string;
  diseaseResistance: string;
  pestResistance: string;
  proteinContent?: string;
  glutenContent?: string;
  glassiness?: string;
  breadVolume?: string;
  starchContent?: string;
  storageQuality?: string;
  tastingScore?: string;
  fatContent?: string;
}

function computeSummaryAndTable(
  variety: VarietyRecord,
  context: SaveResultsContext,
  data: SaveResultsPayload
): { summary: string; results: TestResult[]; yieldImprovementPct: number } {
  const avgYield = parseFloat(data.averageYield) || 0;
  // Mock a standard yield to compare: 8% lower than variety yield
  const standardYield = +(avgYield * 0.92).toFixed(2);
  const deviation = +(avgYield - standardYield).toFixed(2);
  const improvementPct = standardYield > 0 ? ((avgYield - standardYield) / standardYield) * 100 : 0;

  const rows: TestResult[] = [
    {
      indicator: 'Урожайность, ц/га',
      varietyValue: avgYield.toString(),
      standardValue: standardYield.toString(),
      deviation: (deviation >= 0 ? '+' : '') + deviation.toString(),
      isPositive: deviation >= 0,
    },
  ];

  if (data.thousandGrainWeight) {
    const std = +(parseFloat(data.thousandGrainWeight) * 0.97).toFixed(1);
    const dev = +(parseFloat(data.thousandGrainWeight) - std).toFixed(1);
    rows.push({
      indicator: 'Масса 1000 зёрен, г',
      varietyValue: data.thousandGrainWeight,
      standardValue: std.toString(),
      deviation: (dev >= 0 ? '+' : '') + dev.toString(),
      isPositive: dev >= 0,
    });
  }

  if (data.lodgingResistance) {
    const std = Math.max(1, Math.min(9, Math.round(parseFloat(data.lodgingResistance) - 0.5)));
    const dev = +(parseFloat(data.lodgingResistance) - std).toFixed(1);
    rows.push({
      indicator: 'Устойчивость к полеганию, балл',
      varietyValue: data.lodgingResistance,
      standardValue: std.toString(),
      deviation: (dev >= 0 ? '+' : '') + dev.toString(),
      isPositive: dev >= 0,
    });
  }

  if (data.vegetationPeriod) {
    const std = Math.round((parseFloat(data.vegetationPeriod) + 5));
    const dev = +(parseFloat(data.vegetationPeriod) - std).toFixed(0);
    rows.push({
      indicator: 'Вегетационный период, дни',
      varietyValue: data.vegetationPeriod,
      standardValue: std.toString(),
      deviation: dev.toString(),
      isPositive: dev <= 0,
    });
  }

  if (variety.cultureCode === 'wheat' || variety.cultureCode === 'barley') {
    if (data.proteinContent) {
      const std = +(parseFloat(data.proteinContent) * 0.97).toFixed(1);
      const dev = +(parseFloat(data.proteinContent) - std).toFixed(1);
      rows.push({
        indicator: 'Белок, %',
        varietyValue: data.proteinContent,
        standardValue: std.toString(),
        deviation: (dev >= 0 ? '+' : '') + dev.toString(),
        isPositive: dev >= 0,
      });
    }
    if (data.glutenContent) {
      const std = +(parseFloat(data.glutenContent) * 0.97).toFixed(1);
      const dev = +(parseFloat(data.glutenContent) - std).toFixed(1);
      rows.push({
        indicator: 'Клейковина, %',
        varietyValue: data.glutenContent,
        standardValue: std.toString(),
        deviation: (dev >= 0 ? '+' : '') + dev.toString(),
        isPositive: dev >= 0,
      });
    }
  }

  if (variety.cultureCode === 'potato') {
    if (data.starchContent) {
      const std = +(parseFloat(data.starchContent) * 0.97).toFixed(1);
      const dev = +(parseFloat(data.starchContent) - std).toFixed(1);
      rows.push({
        indicator: 'Содержание крахмала, %',
        varietyValue: data.starchContent,
        standardValue: std.toString(),
        deviation: (dev >= 0 ? '+' : '') + dev.toString(),
        isPositive: dev >= 0,
      });
    }
  }

  if (variety.cultureCode === 'sunflower' && data.fatContent) {
    const std = +(parseFloat(data.fatContent) * 0.97).toFixed(1);
    const dev = +(parseFloat(data.fatContent) - std).toFixed(1);
    rows.push({
      indicator: 'Содержание жира, %',
      varietyValue: data.fatContent,
      standardValue: std.toString(),
      deviation: (dev >= 0 ? '+' : '') + dev.toString(),
      isPositive: dev >= 0,
    });
  }

  const summary = `Превышение над стандартом: ${improvementPct >= 0 ? '+' : ''}${improvementPct.toFixed(1)}%`;
  return { summary, results: rows, yieldImprovementPct: improvementPct };
}

function recommendStatus(improvementPct: number): Status {
  if (improvementPct >= 8) return 'recommended';
  if (improvementPct <= -5) return 'removed';
  return 'extended';
}

export function addTestResults(
  varietyId: string,
  context: SaveResultsContext,
  data: SaveResultsPayload
): VarietyRecord | undefined {
  const items = readAll();
  const idx = items.findIndex(v => v.id === varietyId);
  if (idx === -1) return undefined;

  const v = items[idx];
  const { summary, results, yieldImprovementPct } = computeSummaryAndTable(v, context, data);
  const year = parseInt(context.year, 10);

  // find or create region bucket by label from context.region key
  const regionLabel = regionKeyToLabel(context.region);
  let region = v.results.find(r => r.region === regionLabel);
  if (!region) {
    region = { region: regionLabel, years: [] };
    v.results.push(region);
  }

  // update or insert year data
  const existingYear = region.years.find(y => y.year === year);
  if (existingYear) {
    existingYear.summary = summary;
    existingYear.results = results;
  } else {
    region.years.push({ year, summary, results });
  }

  // update status recommendation
  v.status = recommendStatus(yieldImprovementPct);

  items[idx] = v;
  writeAll(items);
  return v;
}

export function regionKeyToLabel(key: string): string {
  const map: Record<string, string> = {
    akmola: 'Акмолинская область',
    kostanay: 'Костанайская область',
    north_kazakhstan: 'Северо-Казахстанская область',
    almaty: 'Алматинская область',
  };
  return map[key] || key;
}

export function upsertVarietyYearResults(
  varietyId: string,
  regionLabel: string,
  year: number,
  summary: string,
  rows: TestResult[],
  newStatus?: Status
): VarietyRecord | undefined {
  const items = readAll();
  const idx = items.findIndex(v => v.id === varietyId);
  if (idx === -1) return undefined;

  const v = items[idx];
  let region = v.results.find(r => r.region === regionLabel);
  if (!region) {
    region = { region: regionLabel, years: [] };
    v.results.push(region);
  }
  const y = region.years.find(y => y.year === year);
  if (y) {
    y.summary = summary;
    y.results = rows;
  } else {
    region.years.push({ year, summary, results: rows });
  }

  if (newStatus) v.status = newStatus;

  items[idx] = v;
  writeAll(items);
  return v;
}
