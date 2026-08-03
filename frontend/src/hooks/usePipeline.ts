import { useState, useEffect } from 'react';
import { pipelineService } from '../api/pipelineService';
import type { LeaderboardItem } from '../types/pipeline';

export interface UsePipelineResult {
  jobStatus: string;
  leaderboard: LeaderboardItem[];
  errorMessage: string | null;
  startPipeline: (datasetId: string, targetColumn: string, algorithms: string[]) => Promise<void>;
  resetPipeline: () => void;
}

export function usePipeline(): UsePipelineResult {
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string>('idle');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startPipeline = async (datasetId: string, targetColumn: string, algorithms: string[]) => {
    try {
      setErrorMessage(null);
      setLeaderboard([]);
      setJobStatus('initiating');

      const response = await pipelineService.startTraining({
        dataset_id: datasetId,
        target_column: targetColumn,
        algorithms,
      });

      setJobId(response.job_id);
      setJobStatus('running');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to initialize training job.';
      setErrorMessage(msg);
      setJobStatus('failed');
      alert(`Pipeline Initialization Error: ${msg}`);
    }
  };

  const resetPipeline = () => {
    setJobId(null);
    setJobStatus('idle');
    setLeaderboard([]);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!jobId || jobStatus !== 'running') return;

    const interval = setInterval(async () => {
      try {
        const data = await pipelineService.getJobStatus(jobId);
        if (data.status === 'completed') {
          setJobStatus('completed');
          if (data.leaderboard) {
            setLeaderboard(data.leaderboard);
          }
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setJobStatus('failed');
          const err = data.error || 'Pipeline execution failed unexpectedly on server.';
          setErrorMessage(err);
          clearInterval(interval);
          alert(`Pipeline Failed: ${err}`);
        }
      } catch (err) {
        console.error('Error checking job telemetry:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [jobId, jobStatus]);

  return {
    jobStatus,
    leaderboard,
    errorMessage,
    startPipeline,
    resetPipeline,
  };
}
