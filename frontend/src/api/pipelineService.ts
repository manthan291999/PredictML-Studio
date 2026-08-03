import { apiClient } from './client';
import type { TrainRequest, TrainResponse, JobStatusResponse } from '../types/pipeline';
import type { ModelPredictionResponse } from '../types/explainability';

export const pipelineService = {
  async startTraining(request: TrainRequest): Promise<TrainResponse> {
    return apiClient<TrainResponse>('/train', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    return apiClient<JobStatusResponse>(`/train/${jobId}/status`);
  },

  async getModelDetails(modelId: string): Promise<any> {
    return apiClient<any>(`/models/${modelId}`);
  },

  async predictRecord(modelId: string, record: Record<string, any>): Promise<ModelPredictionResponse> {
    return apiClient<ModelPredictionResponse>(`/models/${modelId}/predict`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  },
};
