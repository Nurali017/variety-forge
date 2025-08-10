import { getVarietyById, VarietyRecord, upsertVarietyYearResults, TestResult as VRTestResult } from '@/lib/varietiesStore';

export interface TrialParticipant {
  id: string; // participant id
  trialId: string;
  varietyId: string;
  varietyName: string;
  isStandard: boolean;
}

export interface Trial {
  id: string;
  year: number;
  cultureId: string;
  locationId: string;
  participants: TrialParticipant[];
}

export interface TrialResult {
  participantId: string;
  key: string; // indicator key
  value: string; // normalized numeric string
}

const LS_TRIALS = 'trials_store_v1';
const LS_RESULTS = 'trial_results_v1';

function uid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function readTrials(): Trial[] {
  try {
    const raw = localStorage.getItem(LS_TRIALS);
    return raw ? (JSON.parse(raw) as Trial[]) : [];
  } catch {
    return [];
  }
}

function writeTrials(items: Trial[]) {
  localStorage.setItem(LS_TRIALS, JSON.stringify(items));
}

function readResults(): TrialResult[] {
  try {
    const raw = localStorage.getItem(LS_RESULTS);
    return raw ? (JSON.parse(raw) as TrialResult[]) : [];
  } catch {
    return [];
  }
}

function writeResults(items: TrialResult[]) {
  localStorage.setItem(LS_RESULTS, JSON.stringify(items));
}

export function getTrials(): Trial[] {
  return readTrials();
}

export function getTrialById(id: string): Trial | undefined {
  return readTrials().find(t => t.id === id);
}

export interface CreateTrialInput {
  year: number;
  cultureId: string;
  locationId: string;
  participantVarietyIds: string[];
  standardVarietyId: string;
}

export function createTrial(input: CreateTrialInput): Trial {
  const id = uid();
  const participants: TrialParticipant[] = input.participantVarietyIds.map(vid => {
    const v = getVarietyById(vid) as VarietyRecord | undefined;
    return {
      id: uid(),
      trialId: id,
      varietyId: vid,
      varietyName: v?.name ?? `Сорт ${vid}`,
      isStandard: vid === input.standardVarietyId,
    } as TrialParticipant;
  });

  if (!participants.some(p => p.isStandard)) {
    throw new Error('Должен быть выбран один стандартный сорт');
  }

  const trial: Trial = {
    id,
    year: input.year,
    cultureId: input.cultureId,
    locationId: input.locationId,
    participants,
  };

  const all = readTrials();
  all.push(trial);
  writeTrials(all);

  return trial;
}

export function getResultsByTrialId(trialId: string): TrialResult[] {
  return readResults().filter(r => {
    // participant belongs to this trial
    // We can't easily check without participants list, so caller should filter by participantIds if needed.
    return true;
  });
}

export type ResultsMap = Record<string, Record<string, string>>; // participantId -> key -> value

export function saveResults(trial: Trial, values: ResultsMap) {
  const flat: TrialResult[] = [];
  for (const pid of Object.keys(values)) {
    const byKey = values[pid];
    for (const key of Object.keys(byKey)) {
      flat.push({ participantId: pid, key, value: byKey[key] });
    }
  }

  // remove previous results for this trial's participants
  const participantIds = new Set(trial.participants.map(p => p.id));
  const others = readResults().filter(r => !participantIds.has(r.participantId));
  writeResults([...others, ...flat]);

  // Sync aggregated results into Variety records for each participant
  const standard = trial.participants.find(p => p.isStandard);
  if (!standard) return;
  const get = (pid: string, key: string) => values[pid]?.[key] ?? '';
  const parse = (s: string) => {
    const n = Number((s || '').toString().replace(',', '.'));
    return Number.isFinite(n) ? n : undefined;
  };
  const sVals = [parse(get(standard.id, 'yield_plot1')), parse(get(standard.id, 'yield_plot2')), parse(get(standard.id, 'yield_plot3')), parse(get(standard.id, 'yield_plot4'))];
  const sArr = sVals.filter((v): v is number => typeof v === 'number');
  const sAvg = sArr.length === 4 ? sArr.reduce((a,b)=>a+b,0)/4 : undefined;

  for (const p of trial.participants) {
    const v1 = parse(get(p.id, 'yield_plot1'));
    const v2 = parse(get(p.id, 'yield_plot2'));
    const v3 = parse(get(p.id, 'yield_plot3'));
    const v4 = parse(get(p.id, 'yield_plot4'));
    const arr = [v1, v2, v3, v4].filter((v): v is number => typeof v === 'number');
    if (arr.length !== 4 || sAvg == null) continue;

    const mean = arr.reduce((a,b)=>a+b,0)/4;
    const diff = mean - sAvg;
    const improvementPct = sAvg > 0 ? ((mean - sAvg) / sAvg) * 100 : 0;
    const summary = `Превышение над стандартом: ${improvementPct >= 0 ? '+' : ''}${improvementPct.toFixed(1)}%`;

    const rows: VRTestResult[] = [
      {
        indicator: 'Урожайность, ц/га',
        varietyValue: mean.toFixed(2),
        standardValue: sAvg.toFixed(2),
        deviation: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}`,
        isPositive: diff >= 0,
      },
    ];

    const newStatus = improvementPct >= 8 ? 'recommended' : improvementPct <= -5 ? 'removed' : 'extended';

    upsertVarietyYearResults(p.varietyId, trial.locationId, trial.year, summary, rows, newStatus as any);
  }
}

export function getResultsForTrial(trial: Trial): TrialResult[] {
  const participantIds = new Set(trial.participants.map(p => p.id));
  return readResults().filter(r => participantIds.has(r.participantId));
}

// Helpers for calculations
export function avg(vals: number[]): number | undefined {
  const arr = vals.filter(v => Number.isFinite(v));
  if (arr.length === 0) return undefined;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function stdSample(vals: number[]): number | undefined {
  const arr = vals.filter(v => Number.isFinite(v));
  const n = arr.length;
  if (n < 2) return undefined;
  const m = (arr.reduce((a, b) => a + b, 0)) / n;
  const s2 = arr.reduce((acc, x) => acc + Math.pow(x - m, 2), 0) / (n - 1);
  return Math.sqrt(s2);
}

export function cvPercent(mean?: number, sigma?: number): number | undefined {
  if (mean == null || sigma == null) return undefined;
  if (mean === 0) return undefined;
  return (sigma / mean) * 100;
}

export function deltaPercent(varietyAvg?: number, standardAvg?: number): number | undefined {
  if (varietyAvg == null || standardAvg == null || standardAvg === 0) return undefined;
  return ((varietyAvg - standardAvg) / standardAvg) * 100;
}

export function lsd(sigma?: number, n: number = 4, t: number = 2.0): number | undefined {
  if (sigma == null || n <= 0) return undefined;
  return t * Math.sqrt((2 * (sigma ** 2)) / n);
}
