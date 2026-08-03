import { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { MOCK_DATASETS, MOCK_SHAP, MOCK_NARRATIVE } from '../../mocks/api';
import { usePipeline } from '../../hooks/usePipeline';
import { DatasetSelector } from '../../components/dashboard/DatasetSelector';
import { PipelineTelemetry } from '../../components/dashboard/PipelineTelemetry';
import { ModelLeaderboard } from '../../components/dashboard/ModelLeaderboard';
import { ShapExplainability } from '../../components/dashboard/ShapExplainability';
import { WhatIfSimulator } from '../../components/dashboard/WhatIfSimulator';

export default function Dashboard() {
  const [selectedDataset, setSelectedDataset] = useState<string>('demo-house');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const { jobStatus, leaderboard, errorMessage, startPipeline, resetPipeline } = usePipeline();

  const handleDatasetChange = (id: string) => {
    setSelectedDataset(id);
    setSelectedModelId(null);
    resetPipeline();
  };

  const handleTrain = async () => {
    const targetMap: Record<string, string> = {
      'demo-house': 'SalePrice',
      'demo-churn': 'Target',
      'demo-attrition': 'Target',
    };
    const targetCol = targetMap[selectedDataset] || 'Target';
    setSelectedModelId(null);
    await startPipeline(selectedDataset, targetCol, ['linear', 'random_forest', 'xgboost', 'lightgbm', 'catboost']);
  };

  const activeDatasetObj = MOCK_DATASETS.find((d) => d.id === selectedDataset) || MOCK_DATASETS[0];
  const isTraining = jobStatus === 'running' || jobStatus === 'initiating';
  const isCompleted = jobStatus === 'completed';

  // Automatically select the winning top model when training finishes
  if (isCompleted && leaderboard.length > 0 && !selectedModelId) {
    setSelectedModelId(leaderboard[0].model_id);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-2 px-1">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 border-indigo-100/80 bg-gradient-to-r from-white via-indigo-50/25 to-purple-50/30">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100/80 text-indigo-900 border border-indigo-200 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Autonomous ML Engine & Explainability Studio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800">
            AutoML Pipeline Workbench
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl">
            Engineer hyperparameter optimization folds, benchmark state-of-the-art algorithms, and decode feature attributions with TreeSHAP tensors.
          </p>
        </div>

        <button
          onClick={handleTrain}
          disabled={isTraining}
          className="self-start md:self-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
        >
          {isTraining ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5" />
              <span>Optimizing Folds...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2 fill-current" />
              <span>Initialize Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Data Selection & Live Telemetry */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <DatasetSelector
            datasets={MOCK_DATASETS}
            selectedId={selectedDataset}
            onSelect={handleDatasetChange}
            disabled={isTraining}
          />
          <PipelineTelemetry status={jobStatus as any} error={errorMessage} />
        </div>

        {/* Right Column: Model Benchmarks & Explanations */}
        <div className="lg:col-span-8 space-y-7">
          <ModelLeaderboard
            leaderboard={leaderboard}
            selectedModelId={selectedModelId}
            onSelectModel={(id) => setSelectedModelId(id)}
            isTraining={isTraining}
          />

          {/* Explainability Suite & What-If Simulation (Rendered after convergence) */}
          {isCompleted && (
            <div className="space-y-7 animate-in slide-in-from-bottom-5 duration-500">
              <ShapExplainability
                shapFeatures={MOCK_SHAP.features}
                shapImportance={MOCK_SHAP.importance}
                narrative={MOCK_NARRATIVE}
              />
              
              <WhatIfSimulator
                selectedModelId={selectedModelId}
                datasetType={activeDatasetObj.type}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
