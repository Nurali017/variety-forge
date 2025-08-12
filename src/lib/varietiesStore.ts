import { initialVarieties } from './seed';
import { getOblasts } from './locations';
export type Status = 'testing' | 'approved' | 'rejected' | 'recommended_to_remove' | 'recommended_to_extend' | 'removed' | 'submitted';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'other';
  size: string;
  categoryId?: string;
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

// Интерфейс для статуса по области
export interface OblastStatus {
  oblastId: string;
  oblastName: string;
  status: Status;
  submissionDate: string;
  lastUpdated: string;
}

export interface VarietyRecord {
  id: string;
  name: string;
  cultureCode: string;
  cultureLabel: string;
  cultureGroup: string;
  maturityGroup: string;
  applicant: string;
  inn: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  submissionDate: string;
  targetOblasts: string[]; // Изменено: теперь выбираем области
  gssCheck: boolean;
  documents: DocumentItem[];
  // Статусы по областям
  oblastStatuses: OblastStatus[];
  results: RegionData[];
}

const STORAGE_KEY = 'varieties';

// Initialize localStorage with seed data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVarieties));
  }
};

// Get all varieties from localStorage
export const getVarieties = (): VarietyRecord[] => {
  initializeStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading varieties from localStorage:', error);
    return [];
  }
};

// Save varieties to localStorage
export const saveVarieties = (varieties: VarietyRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(varieties));
  } catch (error) {
    console.error('Error saving varieties to localStorage:', error);
  }
};

// Add a new variety
export const addVariety = (variety: Omit<VarietyRecord, 'id'>) => {
  const varieties = getVarieties();
  
  // Create oblast statuses for each target oblast
  const oblastStatuses: OblastStatus[] = variety.targetOblasts.map(oblastId => {
    const oblast = getOblasts().find(o => o.id === oblastId);
    return {
      oblastId,
      oblastName: oblast?.name || oblastId,
      status: 'submitted' as Status,
      submissionDate: variety.submissionDate,
      lastUpdated: new Date().toISOString()
    };
  });
  
  const newVariety: VarietyRecord = {
    ...variety,
    id: Date.now().toString(),
    results: variety.results || [], // Ensure results array is initialized
    oblastStatuses, // Initialize oblast statuses
  };
  const updatedVarieties = [...varieties, newVariety];
  saveVarieties(updatedVarieties);
  return newVariety;
};

// Update an existing variety
export const updateVariety = (id: string, updates: Partial<VarietyRecord>) => {
  const varieties = getVarieties();
  const updatedVarieties = varieties.map(variety => 
    variety.id === id ? { ...variety, ...updates } : variety
  );
  saveVarieties(updatedVarieties);
};

// Delete a variety
export const deleteVariety = (id: string) => {
  const varieties = getVarieties();
  const updatedVarieties = varieties.filter(variety => variety.id !== id);
  saveVarieties(updatedVarieties);
};

// Get a single variety by ID
export const getVariety = (id: string): VarietyRecord | null => {
  const varieties = getVarieties();
  return varieties.find(variety => variety.id === id) || null;
};

// Update variety year results
export const upsertVarietyYearResults = (
  varietyId: string, 
  region: string, 
  year: number, 
  summary: string, 
  results: TestResult[], 
  newStatus?: Status
) => {
  const varieties = getVarieties();
  const varietyIndex = varieties.findIndex(v => v.id === varietyId);
  
  if (varietyIndex === -1) return;
  
  const variety = varieties[varietyIndex];
  // Initialize results array if it doesn't exist
  if (!variety.results) {
    variety.results = [];
  }
  const existingRegionIndex = variety.results.findIndex(r => r.region === region);
  
  const yearData: YearData = {
    year,
    summary,
    results
  };
  
  if (existingRegionIndex !== -1) {
    // Update existing region
    const existingYearIndex = variety.results[existingRegionIndex].years.findIndex(y => y.year === year);
    if (existingYearIndex !== -1) {
      variety.results[existingRegionIndex].years[existingYearIndex] = yearData;
    } else {
      variety.results[existingRegionIndex].years.push(yearData);
    }
  } else {
    // Add new region
    variety.results.push({
      region,
      years: [yearData]
    });
  }
  
  // Update oblast status if provided
  if (newStatus) {
    // Initialize oblastStatuses array if it doesn't exist
    if (!variety.oblastStatuses) {
      variety.oblastStatuses = [];
    }
    
    // Find oblast by region
    const oblast = getOblasts().find(o => o.children?.some(r => r.id === region));
    if (oblast) {
      const existingStatusIndex = variety.oblastStatuses.findIndex(os => os.oblastId === oblast.id);
      const now = new Date().toISOString();
      
      if (existingStatusIndex !== -1) {
        variety.oblastStatuses[existingStatusIndex].status = newStatus;
        variety.oblastStatuses[existingStatusIndex].lastUpdated = now;
      } else {
        variety.oblastStatuses.push({
          oblastId: oblast.id,
          oblastName: oblast.name,
          status: newStatus,
          submissionDate: variety.submissionDate,
          lastUpdated: now
        });
      }
    }
  }
  
  // Save updated varieties
  saveVarieties(varieties);
};
