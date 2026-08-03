import { useState } from 'react';
import { pipelineService } from '../api/pipelineService';
import type { ModelPredictionResponse } from '../types/explainability';

export interface UseWhatIfSimulatorResult {
  loading: boolean;
  predictionData: ModelPredictionResponse | null;
  error: string | null;
  runSimulation: (modelId: string, record: Record<string, any>) => Promise<void>;
}

export function useWhatIfSimulator(): UseWhatIfSimulatorResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionData, setPredictionData] = useState<ModelPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async (modelId: string, record: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pipelineService.predictRecord(modelId, record);
      setPredictionData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error executing What-If prediction simulation.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    predictionData,
    error,
    runSimulation,
  };
}
