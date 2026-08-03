export interface LeaderboardItem {
  model_id: string;
  algorithm: string;
  metrics: {
    R2?: number;
    AUC?: number;
    Accuracy?: number;
    RMSE?: number;
    [key: string]: any;
  };
}

export interface JobStatusResponse {
  status: 'running' | 'completed' | 'failed';
  error?: string;
  results?: string[];
  leaderboard?: LeaderboardItem[];
}

export interface TrainRequest {
  dataset_id: string;
  target_column: string;
  problem_type?: string;
  algorithms: string[];
}

export interface TrainResponse {
  job_id: string;
  problem_type: string;
}
