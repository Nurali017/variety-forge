import { getTrials, getResultsByTrialId, Trial, TrialResult } from './trialsStore';
import { getVariety, VarietyRecord } from './varietiesStore';

export interface VarietyTrialResult {
  trialId: string;
  trialYear: number;
  trialType: string;
  locationId: string;
  results: TrialResult[];
}

/**
 * Retrieves all trial results for a specific variety
 * @param varietyId - The ID of the variety
 * @returns Array of trial results for the variety
 */
export function getVarietyResultsFromTrials(varietyId: string): VarietyTrialResult[] {
  const trials = getTrials();
  const varietyResults: VarietyTrialResult[] = [];

  // Find all trials where this variety participates
  for (const trial of trials) {
    const participant = trial.participants.find(p => p.varietyId === varietyId);
    
    if (participant) {
      // Get results for this trial
      const trialResults = getResultsByTrialId(trial.id);
      
      // Filter results for this specific participant
      const participantResults = trialResults.filter(result => result.participantId === participant.id);
      
      if (participantResults.length > 0) {
        varietyResults.push({
          trialId: trial.id,
          trialYear: trial.year,
          trialType: trial.trialType,
          locationId: trial.locationId,
          results: participantResults
        });
      }
    }
  }

  return varietyResults;
}

/**
 * Gets aggregated results for a variety across all trials
 * @param varietyId - The ID of the variety
 * @returns Aggregated results data
 */
export function getAggregatedVarietyResults(varietyId: string) {
  const trialResults = getVarietyResultsFromTrials(varietyId);
  const variety = getVariety(varietyId);
  
  if (!variety) {
    return null;
  }

  // Group results by indicator
  const resultsByIndicator: Record<string, any[]> = {};
  
  for (const trialResult of trialResults) {
    for (const result of trialResult.results) {
      if (!resultsByIndicator[result.key]) {
        resultsByIndicator[result.key] = [];
      }
      
      resultsByIndicator[result.key].push({
        value: parseFloat(result.value) || 0,
        trialId: trialResult.trialId,
        trialYear: trialResult.trialYear,
        locationId: trialResult.locationId
      });
    }
  }

  return {
    varietyId,
    varietyName: variety.name,
    trialResults,
    aggregatedResults: resultsByIndicator
  };
}
